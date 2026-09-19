import { MapPin, Calendar, ExternalLink } from 'lucide-react'

/*
  Show dates.

  `date` is ISO (YYYY-MM-DD) rather than a display string so the section sorts
  itself: a date that has passed drops out of SHOWS into PREVIOUSLY on its own
  and loses its ticket link. A gig that's been and gone can never sit at the
  top of the page still looking like it's on sale.

  To add a show: append to the array below — order doesn't matter.
  Leave `ticketUrl` off until tickets are live and it shows TBA.
*/
type Show = {
  date: string
  venue: string
  city: string
  country: string
  ticketUrl?: string
  soldOut?: boolean
  /** Optional note shown next to past shows, e.g. 'Supporting X' or 'Sold out'. */
  note?: string
}

const shows: Show[] = [
  {
    date: '2026-08-16',
    venue: 'The Fleece',
    city: 'Bristol',
    country: 'UK',
    ticketUrl: 'https://www.eventbrite.co.uk/e/local-showcase-tickets-1991558302494?discount=Desire',
  },
]

/** Today as YYYY-MM-DD in local time, so ISO date strings compare directly. */
function today(): string {
  const now = new Date()
  const local = new Date(now.getTime() - now.getTimezoneOffset() * 60000)
  return local.toISOString().slice(0, 10)
}

function formatDate(iso: string) {
  const d = new Date(`${iso}T00:00:00`)
  return {
    day: String(d.getDate()).padStart(2, '0'),
    month: d.toLocaleString('en-GB', { month: 'short' }).toUpperCase(),
    year: String(d.getFullYear()),
  }
}

export default function Shows() {
  const now = today()
  const upcoming = shows
    .filter((s) => s.date >= now)
    .sort((a, b) => a.date.localeCompare(b.date))
  const past = shows
    .filter((s) => s.date < now)
    .sort((a, b) => b.date.localeCompare(a.date))

  return (
    <section id="shows" className="py-16 md:py-28 px-6 bg-zinc-950">
      <div className="max-w-7xl mx-auto">
        {/* Section header */}
        <div className="text-center mb-10 md:mb-16">
          <p className="text-xs tracking-ultra uppercase text-red-500 mb-4">Tour</p>
          <h2 className="font-display text-5xl md:text-7xl text-white mb-4 leading-none">SHOWS</h2>
          <div className="section-divider" />
        </div>

        {upcoming.length > 0 ? (
          <div className="max-w-4xl mx-auto space-y-3">
            {upcoming.map((show) => {
              const { day, month } = formatDate(show.date)

              return (
                <div
                  key={show.date + show.venue}
                  className="group flex flex-col sm:flex-row sm:items-center gap-4 p-5 border border-white/5 hover:border-red-900/40 bg-black/30 hover:bg-zinc-900/30 transition-all"
                >
                  {/* Date */}
                  <div className="flex items-center gap-3 sm:w-32 shrink-0">
                    <Calendar size={14} className="text-red-600 shrink-0" />
                    <span className="font-display text-xl text-white tracking-widest">
                      {day} {month}
                    </span>
                  </div>

                  {/* Venue */}
                  <div className="flex-1">
                    <p className="text-white font-medium">{show.venue}</p>
                    <div className="flex items-center gap-1 mt-1">
                      <MapPin size={11} className="text-zinc-500 shrink-0" />
                      <p className="text-xs text-zinc-500">
                        {show.city}, {show.country}
                      </p>
                    </div>
                  </div>

                  {/* Status / Ticket */}
                  <div className="shrink-0">
                    {show.soldOut ? (
                      <span className="px-4 py-2 text-xs tracking-widest uppercase text-zinc-500 border border-zinc-700 line-through">
                        Sold Out
                      </span>
                    ) : !show.ticketUrl ? (
                      <span className="px-4 py-2 text-xs tracking-widest uppercase text-zinc-600 border border-zinc-800">
                        TBA
                      </span>
                    ) : (
                      <a
                        href={show.ticketUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-2 px-4 py-2 bg-red-700 hover:bg-red-600 text-white text-xs tracking-widest uppercase transition-colors"
                      >
                        Tickets <ExternalLink size={11} />
                      </a>
                    )}
                  </div>
                </div>
              )
            })}
          </div>
        ) : (
          <div className="max-w-4xl mx-auto text-center border border-white/5 bg-black/30 p-8">
            <p className="text-zinc-400 text-sm leading-relaxed">
              Announcing soon.
            </p>
            <a
              href="#contact"
              className="inline-flex mt-5 px-6 py-3 bg-red-700 hover:bg-red-600 text-white text-xs tracking-widest uppercase transition-colors"
            >
              Enquire About Booking
            </a>
          </div>
        )}

        {/* Past shows — track record for promoters and agents */}
        {past.length > 0 && (
          <div className="max-w-4xl mx-auto mt-12 md:mt-16">
            <p className="text-xs tracking-ultra uppercase text-zinc-500 mb-5 text-center">
              Previously
            </p>
            <div className="grid sm:grid-cols-2 gap-3">
              {past.map((show) => {
                const { day, month, year } = formatDate(show.date)

                return (
                  <div
                    key={show.date + show.venue}
                    className="flex items-center gap-4 p-4 border border-white/5 bg-black/20"
                  >
                    <span className="font-display text-sm text-zinc-600 tracking-widest w-24 shrink-0">
                      {day} {month} {year}
                    </span>
                    <div className="min-w-0">
                      <p className="text-zinc-300 text-sm font-medium truncate">{show.venue}</p>
                      <p className="text-xs text-zinc-600 truncate">
                        {show.city}, {show.country}
                        {show.note ? ` · ${show.note}` : ''}
                      </p>
                    </div>
                  </div>
                )
              })}
            </div>
          </div>
        )}
      </div>
    </section>
  )
}
