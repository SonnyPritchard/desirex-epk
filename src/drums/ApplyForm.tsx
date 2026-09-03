import { type ChangeEvent, type FormEvent, useRef, useState } from 'react'
import { CheckCircle2, FileVideo, Loader2, Upload, X } from 'lucide-react'
import {
  ApiError,
  createApplication,
  submitApplication,
  uploadFile,
  type ApplicationFields,
} from './api'
import { ACCEPTED_FILE_TYPES, APPLY_API_URL, FALLBACK_EMAIL, MAX_FILES, MAX_FILE_BYTES } from './config'

type Stage = 'idle' | 'creating' | 'uploading' | 'submitting' | 'done' | 'error'

interface PendingFile {
  id: string
  file: File
  progress: number
  status: 'queued' | 'uploading' | 'done' | 'failed'
  error?: string
}

const inputClass =
  'w-full bg-zinc-900 border border-white/10 focus:border-red-700 text-white text-sm px-4 py-3 outline-none transition-colors placeholder:text-zinc-600'
const labelClass = 'block text-xs tracking-widest uppercase text-zinc-500 mb-2'

function formatBytes(bytes: number): string {
  if (bytes < 1024 * 1024) return `${Math.round(bytes / 1024)} KB`
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`
}

export default function ApplyForm() {
  const [stage, setStage] = useState<Stage>('idle')
  const [feedback, setFeedback] = useState('')
  const [files, setFiles] = useState<PendingFile[]>([])
  const [fileError, setFileError] = useState('')
  const fileInputRef = useRef<HTMLInputElement>(null)

  const busy = stage === 'creating' || stage === 'uploading' || stage === 'submitting'

  const addFiles = (incoming: FileList | null) => {
    if (!incoming) return
    setFileError('')
    const next = [...files]
    const problems: string[] = []
    for (const file of Array.from(incoming)) {
      if (next.length >= MAX_FILES) {
        problems.push(`You can attach up to ${MAX_FILES} files.`)
        break
      }
      if (file.size > MAX_FILE_BYTES) {
        problems.push(
          `${file.name} is ${formatBytes(file.size)} — the limit is ${formatBytes(MAX_FILE_BYTES)}. Trim it down or paste a link instead.`,
        )
        continue
      }
      if (next.some((f) => f.file.name === file.name && f.file.size === file.size)) continue
      next.push({
        id: `${file.name}-${file.size}-${file.lastModified}`,
        file,
        progress: 0,
        status: 'queued',
      })
    }
    setFiles(next)
    if (problems.length) setFileError(problems.join(' '))
    if (fileInputRef.current) fileInputRef.current.value = ''
  }

  const removeFile = (id: string) => {
    if (busy) return
    setFiles((prev) => prev.filter((f) => f.id !== id))
  }

  const updateFile = (id: string, patch: Partial<PendingFile>) => {
    setFiles((prev) => prev.map((f) => (f.id === id ? { ...f, ...patch } : f)))
  }

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    if (busy) return

    const form = e.currentTarget
    const data = new FormData(form)
    const text = (key: string) => String(data.get(key) ?? '').trim()
    const bool = (key: string) => data.get(key) === 'on'

    const fields: ApplicationFields = {
      name: text('name'),
      email: text('email'),
      phone: text('phone'),
      location: text('location'),
      experience: text('experience'),
      about: text('about'),
      links: text('links'),
      ownKit: bool('ownKit'),
      canTravel: bool('canTravel'),
      rehearsals: bool('rehearsals'),
      gigs: bool('gigs'),
      consent: bool('consent'),
      website: text('website'),
    }

    if (!fields.consent) {
      setStage('error')
      setFeedback('Please tick the box so we know we can get in touch.')
      return
    }

    setFeedback('')

    try {
      setStage('creating')
      const app = await createApplication(fields)

      const uploadErrors: string[] = []
      if (files.length) {
        setStage('uploading')
        for (const pending of files) {
          updateFile(pending.id, { status: 'uploading', progress: 0 })
          try {
            await uploadFile(app, pending.file, (fraction) =>
              updateFile(pending.id, { progress: fraction }),
            )
            updateFile(pending.id, { status: 'done', progress: 1 })
          } catch (err) {
            const message = err instanceof Error ? err.message : 'Upload failed.'
            updateFile(pending.id, { status: 'failed', error: message })
            uploadErrors.push(`${pending.file.name}: ${message}`)
          }
        }
      }

      setStage('submitting')
      await submitApplication(app, uploadErrors)

      setStage('done')
      setFeedback(
        uploadErrors.length
          ? `We've got your application, but ${uploadErrors.length === 1 ? 'one file' : `${uploadErrors.length} files`} didn't upload. Reply to the confirmation email with a link and we'll sort it.`
          : 'Application received. Check your inbox for a confirmation — we read every one and will be in touch.',
      )
      form.reset()
    } catch (err) {
      setStage('error')
      if (err instanceof ApiError && err.status === 0 && !APPLY_API_URL) {
        setFeedback(`The form isn't connected yet. Email ${FALLBACK_EMAIL} with your details and a clip.`)
      } else if (err instanceof Error && err.message) {
        setFeedback(`${err.message} If it keeps happening, email ${FALLBACK_EMAIL}.`)
      } else {
        setFeedback(`Something went wrong. Please email ${FALLBACK_EMAIL} directly.`)
      }
    }
  }

  if (stage === 'done') {
    return (
      <div className="border border-red-800/40 bg-zinc-950/60 p-8 md:p-12 text-center">
        <CheckCircle2 size={40} className="mx-auto text-red-500 mb-5" />
        <h3 className="font-display text-4xl md:text-5xl text-white leading-none mb-4">YOU'RE IN THE QUEUE</h3>
        <p className="text-zinc-400 leading-relaxed max-w-lg mx-auto">{feedback}</p>
        <p className="text-xs text-zinc-600 mt-6">
          Need to add something? Email{' '}
          <a href={`mailto:${FALLBACK_EMAIL}`} className="text-zinc-400 hover:text-white underline underline-offset-4">
            {FALLBACK_EMAIL}
          </a>
        </p>
      </div>
    )
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-8" noValidate={false}>
      {/* Honeypot — hidden from humans, bots tend to fill it */}
      <div className="absolute -left-[9999px] top-auto w-px h-px overflow-hidden" aria-hidden="true">
        <label>
          Website
          <input name="website" type="text" tabIndex={-1} autoComplete="off" />
        </label>
      </div>

      {/* About you */}
      <fieldset className="space-y-4">
        <legend className="text-xs tracking-ultra uppercase text-red-500 mb-4">1 · About You</legend>
        <div className="grid sm:grid-cols-2 gap-4">
          <div>
            <label htmlFor="name" className={labelClass}>Name *</label>
            <input id="name" name="name" type="text" required maxLength={120} autoComplete="name" placeholder="Your name" className={inputClass} />
          </div>
          <div>
            <label htmlFor="email" className={labelClass}>Email *</label>
            <input id="email" name="email" type="email" required maxLength={200} autoComplete="email" placeholder="your@email.com" className={inputClass} />
          </div>
          <div>
            <label htmlFor="phone" className={labelClass}>Phone</label>
            <input id="phone" name="phone" type="tel" maxLength={40} autoComplete="tel" placeholder="Optional — quickest way to reach you" className={inputClass} />
          </div>
          <div>
            <label htmlFor="location" className={labelClass}>Where are you based? *</label>
            <input id="location" name="location" type="text" required maxLength={120} autoComplete="address-level2" placeholder="e.g. Bristol, Bath, Cardiff" className={inputClass} />
          </div>
        </div>
        <div>
          <label htmlFor="experience" className={labelClass}>How long have you been playing?</label>
          <select id="experience" name="experience" className={`${inputClass} text-zinc-300`} defaultValue="">
            <option value="" className="bg-zinc-900">Select…</option>
            <option value="Under 2 years" className="bg-zinc-900">Under 2 years</option>
            <option value="2–5 years" className="bg-zinc-900">2–5 years</option>
            <option value="5–10 years" className="bg-zinc-900">5–10 years</option>
            <option value="10+ years" className="bg-zinc-900">10+ years</option>
          </select>
        </div>
        <div>
          <label htmlFor="about" className={labelClass}>Tell us about you *</label>
          <textarea
            id="about"
            name="about"
            required
            rows={5}
            maxLength={3000}
            placeholder="Bands you've played in, gigs you've done, the drummers and records that shaped your playing, your setup…"
            className={`${inputClass} resize-y`}
          />
        </div>
      </fieldset>

      {/* Show us */}
      <fieldset className="space-y-4">
        <legend className="text-xs tracking-ultra uppercase text-red-500 mb-4">2 · Show Us You Play</legend>
        <p className="text-sm text-zinc-500 leading-relaxed -mt-1">
          A phone clip is fine. Ideally 60–90 seconds of you playing something heavy — one of our tracks
          if you're feeling it, but anything that shows your feel and power works.
        </p>

        <div>
          <label htmlFor="links" className={labelClass}>Links (YouTube, Instagram, TikTok, Drive…)</label>
          <textarea
            id="links"
            name="links"
            rows={3}
            maxLength={2000}
            placeholder={'One per line\nhttps://youtube.com/…\nhttps://instagram.com/…'}
            className={`${inputClass} resize-y`}
          />
        </div>

        <div>
          <span className={labelClass}>Or upload a video</span>
          <input
            ref={fileInputRef}
            id="files"
            type="file"
            accept={ACCEPTED_FILE_TYPES}
            multiple
            disabled={busy || files.length >= MAX_FILES}
            onChange={(e: ChangeEvent<HTMLInputElement>) => addFiles(e.target.files)}
            className="sr-only"
          />
          <label
            htmlFor="files"
            className={`flex flex-col items-center justify-center gap-2 border border-dashed px-6 py-8 text-center transition-colors ${
              busy || files.length >= MAX_FILES
                ? 'border-white/5 text-zinc-700 cursor-not-allowed'
                : 'border-white/20 hover:border-red-700 text-zinc-400 hover:text-white cursor-pointer'
            }`}
          >
            <Upload size={20} />
            <span className="text-sm">
              {files.length >= MAX_FILES ? `Maximum ${MAX_FILES} files attached` : 'Tap to choose video, audio or photos'}
            </span>
            <span className="text-xs text-zinc-600">
              Up to {MAX_FILES} files · {formatBytes(MAX_FILE_BYTES)} each · MP4 / MOV / WebM recommended
            </span>
          </label>
          {fileError ? <p className="text-xs text-red-400 mt-2">{fileError}</p> : null}

          {files.length ? (
            <ul className="mt-3 space-y-2">
              {files.map((f) => (
                <li key={f.id} className="border border-white/10 bg-zinc-950/60 px-4 py-3">
                  <div className="flex items-center gap-3">
                    <FileVideo size={16} className="text-red-600 shrink-0" />
                    <div className="min-w-0 flex-1">
                      <p className="text-sm text-zinc-200 truncate">{f.file.name}</p>
                      <p className="text-xs text-zinc-600">
                        {formatBytes(f.file.size)}
                        {f.status === 'uploading' ? ` · ${Math.round(f.progress * 100)}%` : ''}
                        {f.status === 'done' ? ' · uploaded' : ''}
                        {f.status === 'failed' ? ` · ${f.error ?? 'failed'}` : ''}
                      </p>
                    </div>
                    {f.status === 'uploading' ? (
                      <Loader2 size={16} className="text-zinc-500 animate-spin shrink-0" />
                    ) : f.status === 'done' ? (
                      <CheckCircle2 size={16} className="text-green-500 shrink-0" />
                    ) : (
                      <button
                        type="button"
                        onClick={() => removeFile(f.id)}
                        disabled={busy}
                        aria-label={`Remove ${f.file.name}`}
                        className="text-zinc-600 hover:text-white disabled:opacity-40 shrink-0"
                      >
                        <X size={16} />
                      </button>
                    )}
                  </div>
                  {f.status === 'uploading' || f.status === 'done' ? (
                    <div className="mt-2 h-1 bg-zinc-800 overflow-hidden">
                      <div
                        className={`h-full transition-[width] duration-200 ${f.status === 'done' ? 'bg-green-600' : 'bg-red-700'}`}
                        style={{ width: `${Math.max(2, Math.round(f.progress * 100))}%` }}
                      />
                    </div>
                  ) : null}
                </li>
              ))}
            </ul>
          ) : null}
        </div>
      </fieldset>

      {/* Practicals */}
      <fieldset className="space-y-3">
        <legend className="text-xs tracking-ultra uppercase text-red-500 mb-4">3 · The Practical Stuff</legend>
        {[
          { name: 'ownKit', label: 'I have my own kit' },
          { name: 'canTravel', label: 'I can get myself and my gear to rehearsals and gigs' },
          { name: 'rehearsals', label: 'I can commit to regular rehearsals in Bristol' },
          { name: 'gigs', label: "I'm available for gigs (mostly weekends, some travel)" },
        ].map((item) => (
          <label
            key={item.name}
            className="flex items-start gap-3 p-4 border border-white/10 bg-zinc-950/50 text-sm text-zinc-300 cursor-pointer hover:border-white/20 transition-colors"
          >
            <input name={item.name} type="checkbox" className="mt-0.5 h-4 w-4 rounded border-white/20 bg-zinc-900 text-red-700 focus:ring-red-700" />
            <span>{item.label}</span>
          </label>
        ))}
      </fieldset>

      {/* Consent + submit */}
      <div className="space-y-4">
        <label className="flex items-start gap-3 p-4 border border-red-900/40 bg-zinc-950/50 text-sm text-zinc-300 cursor-pointer">
          <input name="consent" type="checkbox" required className="mt-0.5 h-4 w-4 rounded border-white/20 bg-zinc-900 text-red-700 focus:ring-red-700" />
          <span>
            I'm happy for Desire X to contact me about this. We'll only use your details for the drummer
            search and delete them once it's filled. *
          </span>
        </label>

        {feedback && stage === 'error' ? <p className="text-sm text-red-400">{feedback}</p> : null}

        <button
          type="submit"
          disabled={busy}
          className="btn-primary w-full py-4 bg-red-700 hover:bg-red-600 disabled:opacity-60 disabled:cursor-not-allowed disabled:animate-none text-white text-xs tracking-widest uppercase font-medium transition-colors flex items-center justify-center gap-2"
        >
          {busy ? <Loader2 size={14} className="animate-spin" /> : null}
          {stage === 'creating' && 'Sending…'}
          {stage === 'uploading' && 'Uploading your clip…'}
          {stage === 'submitting' && 'Almost there…'}
          {!busy && 'Send Application'}
        </button>
        <p className="text-xs text-zinc-600 text-center">
          Don't close this tab while your video uploads.
        </p>
      </div>
    </form>
  )
}
