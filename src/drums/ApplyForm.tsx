import { type FormEvent, useState } from 'react'
import { CheckCircle2, Loader2 } from 'lucide-react'
import { CONTACT_EMAIL, FORMSUBMIT_ENDPOINT } from './config'

type Stage = 'idle' | 'submitting' | 'done' | 'error'

const inputClass =
  'w-full bg-zinc-900 border border-white/10 focus:border-red-700 text-white text-sm px-4 py-3 outline-none transition-colors placeholder:text-zinc-600'
const labelClass = 'block text-xs tracking-widest uppercase text-zinc-500 mb-2'

const practicals = [
  { name: 'Own kit', label: 'I have my own kit' },
  { name: 'Can travel with gear', label: 'I can get myself and my gear to rehearsals and gigs' },
  { name: 'Regular rehearsals in Bristol', label: 'I can commit to regular rehearsals in Bristol' },
  { name: 'Available for gigs', label: "I'm available for gigs (mostly weekends, some travel)" },
]

export default function ApplyForm() {
  const [stage, setStage] = useState<Stage>('idle')
  const [feedback, setFeedback] = useState('')

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    if (stage === 'submitting') return

    const form = e.currentTarget
    const data = new FormData(form)

    const name = String(data.get('name') || '').trim()
    const location = String(data.get('location') || '').trim()

    // Checkboxes only appear in FormData when ticked — make every one explicit
    // so the email always shows Yes/No for each.
    for (const p of practicals) {
      data.set(p.name, data.get(p.name) === 'on' ? 'Yes' : 'No')
    }
    data.set('Consent to contact', data.get('Consent to contact') === 'on' ? 'Yes' : 'No')

    // FormSubmit options (see https://formsubmit.co/documentation)
    data.set('_subject', `Drummer application: ${name}${location ? ` (${location})` : ''}`)
    data.set('_template', 'table')
    data.set('_captcha', 'false')

    setStage('submitting')
    setFeedback('')

    try {
      const response = await fetch(FORMSUBMIT_ENDPOINT, {
        method: 'POST',
        headers: { Accept: 'application/json' },
        body: data,
      })
      if (!response.ok) throw new Error(`FormSubmit responded ${response.status}`)
      const result = (await response.json().catch(() => ({}))) as { success?: string | boolean }
      if (result.success === false || result.success === 'false') throw new Error('FormSubmit rejected the submission')

      setStage('done')
      form.reset()
    } catch {
      setStage('error')
      setFeedback(`Something went wrong sending that. Please email ${CONTACT_EMAIL} with your details and a link to a clip.`)
    }
  }

  if (stage === 'done') {
    return (
      <div className="border border-red-800/40 bg-zinc-950/60 p-8 md:p-12 text-center">
        <CheckCircle2 size={40} className="mx-auto text-red-500 mb-5" />
        <h3 className="font-display text-4xl md:text-5xl text-white leading-none mb-4">YOU'RE IN THE QUEUE</h3>
        <p className="text-zinc-400 leading-relaxed max-w-lg mx-auto">
          Application received. We read every one and we'll be in touch if we'd like to hear more.
        </p>
        <p className="text-xs text-zinc-600 mt-6">
          Forgot to add a clip? Email{' '}
          <a href={`mailto:${CONTACT_EMAIL}`} className="text-zinc-400 hover:text-white underline underline-offset-4">
            {CONTACT_EMAIL}
          </a>
          {' '}with a link.
        </p>
      </div>
    )
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-8">
      {/* Honeypot — FormSubmit silently drops submissions where this has a value */}
      <input type="text" name="_honey" tabIndex={-1} autoComplete="off" className="hidden" aria-hidden="true" />

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
            <input id="phone" name="phone" type="tel" maxLength={40} autoComplete="tel" placeholder="Optional, but it's the quickest way to reach you" className={inputClass} />
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
          A phone clip is fine. Ideally 60 to 90 seconds of you playing something heavy, one of our
          tracks if you're feeling it, but anything that shows your feel and power works.
        </p>
        <div>
          <label htmlFor="links" className={labelClass}>Links to you playing *</label>
          <textarea
            id="links"
            name="links"
            required
            rows={3}
            maxLength={2000}
            placeholder={'One per line\nhttps://youtube.com/…\nhttps://instagram.com/…'}
            className={`${inputClass} resize-y`}
          />
          <p className="text-xs text-zinc-600 mt-2 leading-relaxed">
            Got a video on your phone? Upload it to YouTube (set it to Unlisted), Google Drive, Dropbox or
            WeTransfer and paste the link. Instagram or TikTok posts work too, just make sure they're public.
          </p>
        </div>
      </fieldset>

      {/* Practicals */}
      <fieldset className="space-y-3">
        <legend className="text-xs tracking-ultra uppercase text-red-500 mb-4">3 · The Practical Stuff</legend>
        {practicals.map((item) => (
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
          <input name="Consent to contact" type="checkbox" required className="mt-0.5 h-4 w-4 rounded border-white/20 bg-zinc-900 text-red-700 focus:ring-red-700" />
          <span>
            I'm happy for Desire X to contact me about this. We'll only use your details for the drummer
            search and delete them once it's filled. *
          </span>
        </label>

        {feedback && stage === 'error' ? <p className="text-sm text-red-400">{feedback}</p> : null}

        <button
          type="submit"
          disabled={stage === 'submitting'}
          className="btn-primary w-full py-4 bg-red-700 hover:bg-red-600 disabled:opacity-60 disabled:cursor-not-allowed disabled:animate-none text-white text-xs tracking-widest uppercase font-medium transition-colors flex items-center justify-center gap-2"
        >
          {stage === 'submitting' ? (
            <>
              <Loader2 size={14} className="animate-spin" /> Sending…
            </>
          ) : (
            'Send Application'
          )}
        </button>
      </div>
    </form>
  )
}
