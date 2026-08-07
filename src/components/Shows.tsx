import { MapPin, Calendar, ExternalLink } from 'lucide-react'

/*
  TODO: Replace the dates array with real tour/show dates.
  Set ticketUrl to the actual ticket link, or leave '' to show "TBA".
*/
const dates: {
  date: string
  city: string
  venue: string
  country: string
  ticketUrl: string
  status: 'upcoming' | 'sold-out' | 'tba'
}[] = [
  {
    date: '16 AUG',
    city: 'Bristol',
    venue: 'The Fleece',
    country: 'UK',
    ticketUrl: 'https://www.eventbrite.co.uk/e/local-showcase-tickets-1991558302494?discount=Desire',
    status: 'upcoming',
  },
]

export default function Shows() {
  return (
    <section id="shows" className="py-16 md:py-28 px-6 bg-zinc-950">
      <div className="max-w-7xl mx-auto">
        {/* Section header */}
        <div className="text-center mb-10 md:mb-16">
          <p className="text-xs tracking-ultra uppercase text-red-500 mb-4">Tour</p>
          <h2 className="font-display text-5xl md:text-7xl text-white mb-4 leading-none">SHOWS</h2>
          <div className="section-divider" />
        </div>

        {dates.length > 0 ? (
          <div className="max-w-4xl mx-auto space-y-3">
            {dates.map((show, i) => (
              <div
                key={i}
                className="group flex flex-col sm:flex-row sm:items-center gap-4 p-5 border border-white/5 hover:border-red-900/40 bg-black/30 hover:bg-zinc-900/30 transition-all"
              >
                {/* Date */}
                <div className="flex items-center gap-3 sm:w-32 shrink-0">
                  <Calendar size={14} className="text-red-600 shrink-0" />
                  <span className="font-display text-xl text-white tracking-widest">
                    {show.date}
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
                  {show.status === 'sold-out' ? (
                    <span className="px-4 py-2 text-xs tracking-widest uppercase text-zinc-500 border border-zinc-700 line-through">
                      Sold Out
                    </span>
                  ) : show.status === 'tba' || !show.ticketUrl ? (
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
            ))}
          </div>
        ) : (
          <p className="text-center text-zinc-600 tracking-widest uppercase text-sm">
            No shows listed yet — check back soon.
          </p>
        )}

      </div>
    </section>
  )
}
