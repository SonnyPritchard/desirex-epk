/**
 * Drummer application landing page config.
 *
 * APPLY_API_URL is the public URL of the Cloudflare Worker in /worker
 * (e.g. https://desirex-apply.<your-subdomain>.workers.dev or https://apply.desirex.co.uk).
 *
 * Set it either by editing DEFAULT_APPLY_API_URL below, or by providing the
 * VITE_APPLY_API_URL environment variable at build time (the GitHub Pages
 * workflow passes the repository variable APPLY_API_URL through as that).
 */
const DEFAULT_APPLY_API_URL = ''

export const APPLY_API_URL = (import.meta.env.VITE_APPLY_API_URL || DEFAULT_APPLY_API_URL).replace(/\/+$/, '')

/** Where applicants are told to email if the form is down. */
export const FALLBACK_EMAIL = 'drums@desirex.co.uk'

/** Upload limits — keep in sync with worker/src/index.ts */
export const MAX_FILES = 3
export const MAX_FILE_BYTES = 100 * 1024 * 1024 // 100 MB (Cloudflare Workers request body limit)
export const ACCEPTED_FILE_TYPES = 'video/*,audio/*,image/*,.pdf'
