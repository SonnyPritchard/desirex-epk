import { Mail } from 'lucide-react'

/*
  Booking and technical details — the practical questions a promoter, agent or
  venue asks before they reply.

  Every field below is optional and a row with an empty string is NOT rendered.
  That way this section can never state something about the band that isn't
  true: fill a value in and the row appears, leave it blank and it stays off
  the page. Nothing here is a placeholder waiting to be spotted.

  The blank ones below need real answers before they mean anything — a venue
  that reads "45 minutes" will book a 45 minute slot.
*/

const BOOKING_EMAIL = 'booking@desirex.co.uk'

const details: { label: string; value: string }[] = [
  { label: 'Line-up', value: 'Four-piece — vocals, guitar, guitar/bass, drums' },
  { label: 'Based', value: 'Bristol, UK' },
  { label: 'Genre', value: 'Alternative rock — original material' },

  // ---- Fill these in and they appear on the page ----
  { label: 'Set length', value: '' }, // e.g. '30–45 minutes, flexible'
  { label: 'Travel', value: '' }, // e.g. 'South West and UK-wide, self-driving'
  { label: 'Backline', value: '' }, // e.g. 'Own guitars, amps and cabs; share drums on multi-band bills'
  { label: 'Technical', value: '' }, // e.g. 'PA and 4 monitor mixes, 3 vocal mics, DI for bass'
  { label: 'Insurance', value: '' }, // e.g. 'Public liability insurance held — certificate on request'
]

/** Venues played — track record, worth listing for promoters who don't know the band. */
const venuesPlayed: string[] = ['The Fleece, Bristol', 'The Exchange, Bristol']

export default function Booking() {
  const filled = details.filter((d) => d.value.trim() !== '')

  return (
    <section id="booking" className="py-16 md:py-28 px-6 bg-black">
      <div className="max-w-7xl mx-auto">
        {/* Section header */}
        <div className="text-center mb-10 md:mb-16">
          <p className="text-xs tracking-ultra uppercase text-red-500 mb-4">For Promoters</p>
          <h2 className="font-display text-5xl md:text-7xl text-white mb-4 leading-none">BOOKING</h2>
          <div className="section-divider" />
        </div>

        <div className="max-w-5xl mx-auto grid lg:grid-cols-[1.15fr_0.85fr] gap-8 lg:gap-12 items-start">
          {/* Spec table */}
          <div className="border border-white/5 bg-zinc-950/60">
            {filled.map((d, i) => (
              <div
                key={d.label}
                className={`flex flex-col sm:flex-row sm:items-baseline gap-1 sm:gap-6 px-5 sm:px-6 py-4 ${
                  i > 0 ? 'border-t border-white/5' : ''
                }`}
              >
                <p className="text-xs tracking-widest uppercase text-red-500 sm:w-36 shrink-0">
                  {d.label}
                </p>
                <p className="text-sm text-zinc-300 leading-relaxed">{d.value}</p>
              </div>
            ))}
          </div>

          {/* Track record + contact */}
          <div className="space-y-8">
            {venuesPlayed.length > 0 && (
              <div>
                <p className="text-xs tracking-ultra uppercase text-red-500 mb-4">Played</p>
                <ul className="space-y-2">
                  {venuesPlayed.map((v) => (
                    <li key={v} className="flex items-start gap-3 text-sm text-zinc-300">
                      <span className="text-red-700 leading-none mt-1.5 shrink-0">—</span>
                      <span>{v}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            <div>
              <p className="text-xs tracking-ultra uppercase text-red-500 mb-4">Enquiries</p>
              <a
                href={`mailto:${BOOKING_EMAIL}`}
                className="flex items-center gap-3 text-zinc-300 hover:text-white transition-colors group"
              >
                <Mail size={16} className="text-red-600 shrink-0" />
                <span className="text-sm group-hover:underline underline-offset-4">
                  {BOOKING_EMAIL}
                </span>
              </a>
              <a
                href="#contact"
                className="inline-flex mt-5 px-6 py-3 bg-red-700 hover:bg-red-600 text-white text-xs tracking-widest uppercase transition-colors"
              >
                Send an Enquiry
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
