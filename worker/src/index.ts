/**
 * Desire X — drummer application API
 *
 * Cloudflare Worker. Receives applications from the /drums landing page,
 * stores each one (plus any uploaded clips) in R2, and emails the band via
 * Resend. The applicant gets a short confirmation email too.
 *
 * Flow (see src/drums/api.ts in the site):
 *   1. POST /api/applications                  → { id, uploadToken }
 *   2. PUT  /api/applications/:id/files        → { key, name, size, type }   (one call per file)
 *   3. POST /api/applications/:id/submit       → { ok: true }                 (sends the emails)
 *   GET  /files/:id/:filename                  → streams an uploaded file (links in the email)
 */

export interface Env {
  APPLICATIONS: R2Bucket
  RESEND_API_KEY: string
  FROM_EMAIL: string
  NOTIFY_EMAIL: string
  ALLOWED_ORIGINS: string
  /** Override for local testing only; defaults to the real Resend endpoint. */
  RESEND_API_URL?: string
}

// ---- Limits (keep in sync with src/drums/config.ts) -------------------------

const MAX_FILES = 3
const MAX_FILE_BYTES = 100 * 1024 * 1024 // Workers request body limit on the free plan
const MAX_FIELD = 3000
const ALLOWED_EXTENSIONS = new Set([
  'mp4', 'mov', 'm4v', 'webm', 'mkv', 'avi', 'mpg', 'mpeg', '3gp',
  'mp3', 'wav', 'm4a', 'aac', 'flac', 'ogg',
  'jpg', 'jpeg', 'png', 'heic', 'heif', 'webp', 'gif',
  'pdf',
])
const ALLOWED_MIME_PREFIXES = ['video/', 'audio/', 'image/']
const ALLOWED_MIME_EXACT = new Set(['application/pdf', 'application/octet-stream'])

// ---- Types -----------------------------------------------------------------

interface ApplicationFields {
  name: string
  email: string
  phone: string
  location: string
  experience: string
  about: string
  links: string
  ownKit: boolean
  canTravel: boolean
  rehearsals: boolean
  gigs: boolean
  consent: boolean
}

interface StoredFile {
  key: string
  name: string
  size: number
  type: string
}

interface ApplicationRecord {
  id: string
  status: 'pending' | 'submitted'
  createdAt: string
  submittedAt?: string
  uploadToken: string
  fields: ApplicationFields
  files: StoredFile[]
  uploadErrors?: string[]
  meta: {
    country?: string
    userAgent?: string
    referer?: string
  }
  notify?: { sent: boolean; id?: string; error?: string }
  confirm?: { sent: boolean; id?: string; error?: string }
}

class HttpError extends Error {
  status: number
  constructor(status: number, message: string) {
    super(message)
    this.status = status
  }
}

// ---- Helpers ---------------------------------------------------------------

function json(data: unknown, status = 200, extra: HeadersInit = {}): Response {
  return new Response(JSON.stringify(data), {
    status,
    headers: { 'Content-Type': 'application/json; charset=utf-8', ...extra },
  })
}

function corsHeaders(request: Request, env: Env): Record<string, string> {
  const origin = request.headers.get('Origin')
  if (!origin) return {}
  const allowed = (env.ALLOWED_ORIGINS || '')
    .split(',')
    .map((s) => s.trim())
    .filter(Boolean)
  if (!allowed.includes(origin)) return {}
  return {
    'Access-Control-Allow-Origin': origin,
    'Access-Control-Allow-Methods': 'GET, POST, PUT, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type, X-Upload-Token, X-File-Name',
    'Access-Control-Max-Age': '86400',
    Vary: 'Origin',
  }
}

function recordKey(id: string): string {
  return `applications/${id}.json`
}

function randomToken(bytes = 32): string {
  const buf = new Uint8Array(bytes)
  crypto.getRandomValues(buf)
  let s = ''
  for (const b of buf) s += String.fromCharCode(b)
  return btoa(s).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '')
}

function safeEqual(a: string, b: string): boolean {
  const enc = new TextEncoder()
  const ab = enc.encode(a)
  const bb = enc.encode(b)
  if (ab.byteLength !== bb.byteLength) return false
  return crypto.subtle.timingSafeEqual(ab, bb)
}

function esc(s: string): string {
  return s
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;')
}

function str(v: unknown, max = MAX_FIELD): string {
  if (typeof v !== 'string') return ''
  return v.trim().slice(0, max)
}

function bool(v: unknown): boolean {
  return v === true || v === 'true' || v === 'on'
}

function isValidEmail(s: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(s) && s.length <= 254
}

function isUuid(s: string): boolean {
  return /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(s)
}

function sanitizeFileName(raw: string): string {
  const base = raw.split(/[\\/]/).pop() || 'upload'
  const dot = base.lastIndexOf('.')
  const stemRaw = dot > 0 ? base.slice(0, dot) : base
  const extRaw = dot > 0 ? base.slice(dot + 1) : ''
  const clean = (s: string) => s.replace(/[^A-Za-z0-9_-]+/g, '-').replace(/^-+|-+$/g, '')
  const stem = clean(stemRaw).slice(0, 60) || 'upload'
  const ext = clean(extRaw).toLowerCase().slice(0, 10)
  return ext ? `${stem}.${ext}` : stem
}

function extensionOf(name: string): string {
  const i = name.lastIndexOf('.')
  return i >= 0 ? name.slice(i + 1).toLowerCase() : ''
}

function isAllowedFile(name: string, type: string): boolean {
  const ext = extensionOf(name)
  const mimeOk = ALLOWED_MIME_PREFIXES.some((p) => type.startsWith(p)) || ALLOWED_MIME_EXACT.has(type)
  const extOk = ALLOWED_EXTENSIONS.has(ext)
  // Accept if the extension is known, or the browser reported a media type and the
  // extension is at least not something executable-looking.
  return extOk || (mimeOk && type !== 'application/octet-stream')
}

function formatBytes(bytes: number): string {
  if (bytes < 1024 * 1024) return `${Math.round(bytes / 1024)} KB`
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`
}

async function loadRecord(env: Env, id: string): Promise<ApplicationRecord> {
  if (!isUuid(id)) throw new HttpError(404, 'Application not found.')
  const obj = await env.APPLICATIONS.get(recordKey(id))
  if (!obj) throw new HttpError(404, 'Application not found.')
  return (await obj.json()) as ApplicationRecord
}

async function saveRecord(env: Env, record: ApplicationRecord): Promise<void> {
  await env.APPLICATIONS.put(recordKey(record.id), JSON.stringify(record, null, 2), {
    httpMetadata: { contentType: 'application/json' },
  })
}

function authorize(request: Request, record: ApplicationRecord): void {
  const token = request.headers.get('X-Upload-Token') || ''
  if (!token || !safeEqual(token, record.uploadToken)) {
    throw new HttpError(403, 'Not allowed.')
  }
  if (record.status === 'submitted') {
    throw new HttpError(409, 'This application has already been submitted.')
  }
}

// ---- Handlers --------------------------------------------------------------

async function createApplication(request: Request, env: Env): Promise<Response> {
  let body: Record<string, unknown>
  try {
    body = (await request.json()) as Record<string, unknown>
  } catch {
    throw new HttpError(400, 'Invalid request.')
  }

  // Honeypot: real users never see this field.
  if (str(body.website)) {
    // Pretend it worked so bots don't adapt; nothing is stored or sent.
    return json({ id: crypto.randomUUID(), uploadToken: randomToken() }, 201)
  }

  const fields: ApplicationFields = {
    name: str(body.name, 120),
    email: str(body.email, 254).toLowerCase(),
    phone: str(body.phone, 40),
    location: str(body.location, 120),
    experience: str(body.experience, 40),
    about: str(body.about),
    links: str(body.links, 2000),
    ownKit: bool(body.ownKit),
    canTravel: bool(body.canTravel),
    rehearsals: bool(body.rehearsals),
    gigs: bool(body.gigs),
    consent: bool(body.consent),
  }

  if (!fields.name) throw new HttpError(400, 'Please tell us your name.')
  if (!isValidEmail(fields.email)) throw new HttpError(400, 'That email address doesn’t look right.')
  if (!fields.location) throw new HttpError(400, 'Please tell us where you’re based.')
  if (!fields.about) throw new HttpError(400, 'Please tell us a bit about yourself.')
  if (!fields.consent) throw new HttpError(400, 'Please confirm we can contact you.')

  const record: ApplicationRecord = {
    id: crypto.randomUUID(),
    status: 'pending',
    createdAt: new Date().toISOString(),
    uploadToken: randomToken(),
    fields,
    files: [],
    meta: {
      country: (request.cf as { country?: string } | undefined)?.country,
      userAgent: request.headers.get('User-Agent') || undefined,
      referer: request.headers.get('Referer') || undefined,
    },
  }

  await saveRecord(env, record)
  return json({ id: record.id, uploadToken: record.uploadToken }, 201)
}

async function uploadFile(request: Request, env: Env, id: string): Promise<Response> {
  const record = await loadRecord(env, id)
  authorize(request, record)

  if (record.files.length >= MAX_FILES) {
    throw new HttpError(400, `You can attach up to ${MAX_FILES} files.`)
  }

  const rawName = decodeURIComponent(request.headers.get('X-File-Name') || '')
  const name = sanitizeFileName(rawName)
  const type = (request.headers.get('Content-Type') || 'application/octet-stream').split(';')[0].trim()
  const length = Number(request.headers.get('Content-Length') || '0')

  if (!request.body) throw new HttpError(400, 'No file received.')
  if (!length || Number.isNaN(length)) throw new HttpError(411, 'Missing file size.')
  if (length > MAX_FILE_BYTES) {
    throw new HttpError(413, `Files must be under ${formatBytes(MAX_FILE_BYTES)}. Trim the clip or paste a link instead.`)
  }
  if (!isAllowedFile(name, type)) {
    throw new HttpError(415, 'Please upload a video, audio file, image or PDF.')
  }

  const index = record.files.length + 1
  const key = `uploads/${record.id}/${index}-${name}`

  await env.APPLICATIONS.put(key, request.body, {
    httpMetadata: {
      contentType: type,
      contentDisposition: `inline; filename="${name}"`,
    },
    customMetadata: { applicationId: record.id, originalName: rawName.slice(0, 200) },
  })

  const stored: StoredFile = { key, name: `${index}-${name}`, size: length, type }
  record.files.push(stored)
  await saveRecord(env, record)

  return json(stored, 201)
}

async function submitApplication(request: Request, env: Env, id: string, publicBase: string): Promise<Response> {
  const record = await loadRecord(env, id)
  authorize(request, record)

  let uploadErrors: string[] = []
  try {
    const body = (await request.json()) as { uploadErrors?: unknown }
    if (Array.isArray(body.uploadErrors)) {
      uploadErrors = body.uploadErrors.filter((e): e is string => typeof e === 'string').map((e) => e.slice(0, 300)).slice(0, MAX_FILES)
    }
  } catch {
    /* body is optional */
  }

  record.status = 'submitted'
  record.submittedAt = new Date().toISOString()
  if (uploadErrors.length) record.uploadErrors = uploadErrors
  // Don't invalidate the token yet — we need the record saved even if email fails.
  await saveRecord(env, record)

  const notify = await sendResend(env, buildBandEmail(record, env, publicBase))
  record.notify = notify
  if (!notify.sent) console.error('Band notification failed', record.id, notify.error)

  const confirm = await sendResend(env, buildApplicantEmail(record, env))
  record.confirm = confirm
  if (!confirm.sent) console.error('Applicant confirmation failed', record.id, confirm.error)

  await saveRecord(env, record)

  // The application is safely stored either way; only fail loudly if the band
  // never got it AND we couldn't tell the applicant either.
  if (!notify.sent && !confirm.sent) {
    throw new HttpError(502, 'We saved your application but couldn’t send the confirmation email. We’ll still see it — no need to resubmit.')
  }

  return json({ ok: true, id: record.id })
}

async function serveFile(env: Env, id: string, filename: string): Promise<Response> {
  if (!isUuid(id)) return new Response('Not found', { status: 404 })
  const name = sanitizeFileName(decodeURIComponent(filename))
  const obj = await env.APPLICATIONS.get(`uploads/${id}/${name}`)
  if (!obj) return new Response('Not found', { status: 404 })

  const headers = new Headers()
  obj.writeHttpMetadata(headers)
  headers.set('ETag', obj.httpEtag)
  headers.set('Cache-Control', 'private, max-age=3600')
  headers.set('X-Content-Type-Options', 'nosniff')
  headers.set('X-Robots-Tag', 'noindex')
  return new Response(obj.body, { headers })
}

// ---- Email -----------------------------------------------------------------

interface EmailPayload {
  from: string
  to: string[]
  reply_to?: string
  subject: string
  html: string
  text: string
}

async function sendResend(env: Env, payload: EmailPayload): Promise<{ sent: boolean; id?: string; error?: string }> {
  if (!env.RESEND_API_KEY) return { sent: false, error: 'RESEND_API_KEY is not set' }
  try {
    const res = await fetch(env.RESEND_API_URL || 'https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${env.RESEND_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
    })
    const data = (await res.json().catch(() => ({}))) as { id?: string; message?: string; name?: string }
    if (!res.ok) return { sent: false, error: `${res.status} ${data.message || data.name || ''}`.trim() }
    return { sent: true, id: data.id }
  } catch (err) {
    return { sent: false, error: err instanceof Error ? err.message : String(err) }
  }
}

function fileUrl(publicBase: string, record: ApplicationRecord, file: StoredFile): string {
  return `${publicBase}/files/${record.id}/${encodeURIComponent(file.name)}`
}

function yesNo(v: boolean): string {
  return v ? 'Yes' : 'No'
}

function buildBandEmail(record: ApplicationRecord, env: Env, publicBase: string): EmailPayload {
  const f = record.fields
  const links = f.links
    .split(/\r?\n|,\s+/)
    .map((l) => l.trim())
    .filter(Boolean)

  const rows: Array<[string, string]> = [
    ['Name', f.name],
    ['Email', f.email],
    ['Phone', f.phone || '—'],
    ['Based in', f.location],
    ['Playing for', f.experience || '—'],
    ['Own kit', yesNo(f.ownKit)],
    ['Can travel with gear', yesNo(f.canTravel)],
    ['Regular rehearsals in Bristol', yesNo(f.rehearsals)],
    ['Available for gigs', yesNo(f.gigs)],
    ['Country (from IP)', record.meta.country || '—'],
    ['Submitted', new Date(record.submittedAt || record.createdAt).toUTCString()],
  ]

  const htmlRows = rows
    .map(
      ([k, v]) =>
        `<tr><td style="padding:6px 12px 6px 0;color:#888;white-space:nowrap;vertical-align:top">${esc(k)}</td><td style="padding:6px 0;color:#111">${esc(v)}</td></tr>`,
    )
    .join('')

  const htmlLinks = links.length
    ? `<ul style="padding-left:18px;margin:6px 0">${links
        .map((l) => {
          const href = /^https?:\/\//i.test(l) ? l : `https://${l}`
          return `<li><a href="${esc(href)}">${esc(l)}</a></li>`
        })
        .join('')}</ul>`
    : '<p style="color:#888;margin:6px 0">None</p>'

  const htmlFiles = record.files.length
    ? `<ul style="padding-left:18px;margin:6px 0">${record.files
        .map((file) => `<li><a href="${esc(fileUrl(publicBase, record, file))}">${esc(file.name)}</a> <span style="color:#888">(${formatBytes(file.size)})</span></li>`)
        .join('')}</ul>`
    : '<p style="color:#888;margin:6px 0">None uploaded</p>'

  const htmlUploadErrors = record.uploadErrors?.length
    ? `<p style="color:#b91c1c;margin:6px 0"><strong>Upload problems:</strong><br>${record.uploadErrors.map(esc).join('<br>')}</p>`
    : ''

  const html = `<!doctype html><html><body style="font-family:-apple-system,Segoe UI,Helvetica,Arial,sans-serif;font-size:15px;line-height:1.5;color:#111;max-width:640px;margin:0 auto;padding:24px">
  <p style="font-size:12px;letter-spacing:.2em;text-transform:uppercase;color:#b91c1c;margin:0 0 4px">Drummer application</p>
  <h1 style="font-size:24px;margin:0 0 16px">${esc(f.name)} <span style="color:#888;font-weight:normal">· ${esc(f.location)}</span></h1>
  <table cellpadding="0" cellspacing="0" style="border-collapse:collapse;margin-bottom:20px">${htmlRows}</table>
  <h2 style="font-size:14px;letter-spacing:.1em;text-transform:uppercase;color:#888;margin:20px 0 4px">About them</h2>
  <p style="white-space:pre-wrap;margin:6px 0">${esc(f.about)}</p>
  <h2 style="font-size:14px;letter-spacing:.1em;text-transform:uppercase;color:#888;margin:20px 0 4px">Links</h2>
  ${htmlLinks}
  <h2 style="font-size:14px;letter-spacing:.1em;text-transform:uppercase;color:#888;margin:20px 0 4px">Uploaded files</h2>
  ${htmlFiles}
  ${htmlUploadErrors}
  <hr style="border:0;border-top:1px solid #eee;margin:24px 0">
  <p style="font-size:12px;color:#888">Reply to this email to respond to ${esc(f.name)} directly. Application ID ${esc(record.id)}.</p>
</body></html>`

  const text = [
    `DRUMMER APPLICATION — ${f.name} (${f.location})`,
    '',
    ...rows.map(([k, v]) => `${k}: ${v}`),
    '',
    'ABOUT',
    f.about,
    '',
    'LINKS',
    links.length ? links.join('\n') : 'None',
    '',
    'UPLOADED FILES',
    record.files.length ? record.files.map((file) => `${file.name} (${formatBytes(file.size)}) — ${fileUrl(publicBase, record, file)}`).join('\n') : 'None uploaded',
    ...(record.uploadErrors?.length ? ['', 'UPLOAD PROBLEMS', ...record.uploadErrors] : []),
    '',
    `Application ID ${record.id}`,
  ].join('\n')

  return {
    from: env.FROM_EMAIL,
    to: env.NOTIFY_EMAIL.split(',').map((s) => s.trim()).filter(Boolean),
    subject: `Drummer application: ${f.name} (${f.location})`,
    html,
    text,
    reply_to: f.email,
  }
}

function buildApplicantEmail(record: ApplicationRecord, env: Env): EmailPayload {
  const first = record.fields.name.split(/\s+/)[0] || 'there'
  const fileNote = record.files.length
    ? `We’ve got your ${record.files.length === 1 ? 'clip' : `${record.files.length} files`} too.`
    : record.uploadErrors?.length
      ? 'Your video didn’t make it through — just reply to this email with a link (YouTube, Drive, anything) and we’ll add it.'
      : 'If you’ve got a clip of you playing, reply to this email with a link — it really helps.'

  const text = `Hi ${first},

Thanks for applying to play drums with Desire X. Your application is in and we read every one.

${fileNote}

We’ll be in touch by email${record.fields.phone ? ' or phone' : ''} if we’d like to hear more. In the meantime, the music’s here:
https://open.spotify.com/artist/45K51OH61Q78kAmZQVqwO4

Cheers,
Desire X
https://desirex.co.uk`

  const html = `<!doctype html><html><body style="font-family:-apple-system,Segoe UI,Helvetica,Arial,sans-serif;font-size:15px;line-height:1.6;color:#111;max-width:600px;margin:0 auto;padding:24px">
  <p>Hi ${esc(first)},</p>
  <p>Thanks for applying to play drums with <strong>Desire X</strong>. Your application is in and we read every one.</p>
  <p>${esc(fileNote)}</p>
  <p>We’ll be in touch by email${record.fields.phone ? ' or phone' : ''} if we’d like to hear more. In the meantime, the music’s here:<br>
  <a href="https://open.spotify.com/artist/45K51OH61Q78kAmZQVqwO4">Desire X on Spotify</a></p>
  <p>Cheers,<br>Desire X<br><a href="https://desirex.co.uk" style="color:#888">desirex.co.uk</a></p>
</body></html>`

  return {
    from: env.FROM_EMAIL,
    to: [record.fields.email],
    reply_to: env.NOTIFY_EMAIL,
    subject: 'We’ve got your Desire X drummer application',
    html,
    text,
  }
}

// ---- Router ----------------------------------------------------------------

async function route(request: Request, env: Env): Promise<Response> {
  const url = new URL(request.url)
  const publicBase = `${url.protocol}//${url.host}`
  const parts = url.pathname.split('/').filter(Boolean)

  if (request.method === 'GET' && parts.length === 0) {
    return json({ ok: true, service: 'desirex-apply' })
  }

  if (parts[0] === 'files' && parts.length === 3 && request.method === 'GET') {
    return serveFile(env, parts[1], parts[2])
  }

  if (parts[0] === 'api' && parts[1] === 'applications') {
    if (parts.length === 2 && request.method === 'POST') {
      return createApplication(request, env)
    }
    if (parts.length === 4 && parts[3] === 'files' && request.method === 'PUT') {
      return uploadFile(request, env, parts[2])
    }
    if (parts.length === 4 && parts[3] === 'submit' && request.method === 'POST') {
      return submitApplication(request, env, parts[2], publicBase)
    }
  }

  throw new HttpError(404, 'Not found.')
}

export default {
  async fetch(request, env): Promise<Response> {
    const cors = corsHeaders(request, env)

    if (request.method === 'OPTIONS') {
      return new Response(null, { status: 204, headers: cors })
    }

    try {
      const res = await route(request, env)
      for (const [k, v] of Object.entries(cors)) res.headers.set(k, v)
      return res
    } catch (err) {
      if (err instanceof HttpError) {
        return json({ error: err.message }, err.status, cors)
      }
      console.error('Unhandled error', err)
      return json({ error: 'Something went wrong on our end. Please try again.' }, 500, cors)
    }
  },
} satisfies ExportedHandler<Env>
