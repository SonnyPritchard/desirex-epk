import { APPLY_API_URL } from './config'

export interface ApplicationFields {
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
  /** honeypot — must be empty */
  website: string
}

export interface CreatedApplication {
  id: string
  uploadToken: string
}

export interface UploadedFile {
  key: string
  name: string
  size: number
  type: string
}

export class ApiError extends Error {
  status: number
  constructor(message: string, status: number) {
    super(message)
    this.status = status
  }
}

function requireApi(): string {
  if (!APPLY_API_URL) {
    throw new ApiError('The application form is not connected yet.', 0)
  }
  return APPLY_API_URL
}

async function readError(res: Response, fallback: string): Promise<string> {
  try {
    const body = (await res.json()) as { error?: string }
    return body.error || fallback
  } catch {
    return fallback
  }
}

export async function createApplication(fields: ApplicationFields): Promise<CreatedApplication> {
  const base = requireApi()
  const res = await fetch(`${base}/api/applications`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(fields),
  })
  if (!res.ok) {
    throw new ApiError(await readError(res, 'Could not start your application.'), res.status)
  }
  return (await res.json()) as CreatedApplication
}

/**
 * Uploads a single file with progress reporting. Uses XHR because fetch()
 * has no upload progress events.
 */
export function uploadFile(
  app: CreatedApplication,
  file: File,
  onProgress: (fraction: number) => void,
): Promise<UploadedFile> {
  const base = requireApi()
  return new Promise((resolve, reject) => {
    const xhr = new XMLHttpRequest()
    xhr.open('PUT', `${base}/api/applications/${encodeURIComponent(app.id)}/files`)
    xhr.setRequestHeader('X-Upload-Token', app.uploadToken)
    xhr.setRequestHeader('X-File-Name', encodeURIComponent(file.name))
    xhr.setRequestHeader('Content-Type', file.type || 'application/octet-stream')
    xhr.upload.onprogress = (e) => {
      if (e.lengthComputable) onProgress(e.loaded / e.total)
    }
    xhr.onerror = () => reject(new ApiError('Network error while uploading.', 0))
    xhr.onabort = () => reject(new ApiError('Upload cancelled.', 0))
    xhr.onload = () => {
      if (xhr.status >= 200 && xhr.status < 300) {
        try {
          resolve(JSON.parse(xhr.responseText) as UploadedFile)
        } catch {
          reject(new ApiError('Unexpected response from upload.', xhr.status))
        }
      } else {
        let message = `Upload failed (${xhr.status}).`
        try {
          message = (JSON.parse(xhr.responseText) as { error?: string }).error || message
        } catch {
          /* keep default */
        }
        reject(new ApiError(message, xhr.status))
      }
    }
    xhr.send(file)
  })
}

export async function submitApplication(
  app: CreatedApplication,
  uploadErrors: string[],
): Promise<void> {
  const base = requireApi()
  const res = await fetch(`${base}/api/applications/${encodeURIComponent(app.id)}/submit`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'X-Upload-Token': app.uploadToken,
    },
    body: JSON.stringify({ uploadErrors }),
  })
  if (!res.ok) {
    throw new ApiError(await readError(res, 'Could not submit your application.'), res.status)
  }
}
