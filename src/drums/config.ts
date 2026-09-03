/**
 * Drummer application landing page config.
 *
 * Applications are delivered by FormSubmit (https://formsubmit.co), the same
 * service the EPK contact form uses. There's no backend and nothing to deploy.
 *
 * APPLY_EMAIL is where applications land. booking@desirex.co.uk is already
 * activated with FormSubmit. To use a different alias (e.g. drums@desirex.co.uk)
 * just change it here — FormSubmit will email that address once asking you to
 * confirm it, and the first submission is held until you click the link.
 */
export const APPLY_EMAIL = 'booking@desirex.co.uk'

export const FORMSUBMIT_ENDPOINT = `https://formsubmit.co/ajax/${APPLY_EMAIL}`

/** Address shown to applicants if the form is down or they want to add something. */
export const CONTACT_EMAIL = APPLY_EMAIL
