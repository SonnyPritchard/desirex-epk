import { ExternalLink } from 'lucide-react'

const tracks = [
  { title: 'Break the Chain', subtitle: 'Single', spotifyId: '1IBM8JHX8JQG0LDVkCzQoV' },
  { title: 'Repair',          subtitle: 'Single', spotifyId: '59UHKsTe5mLPbHijgsJSJb' },
  { title: 'Remade',          subtitle: 'Single', spotifyId: '0QYeWQRnuxtBjenh7c2sa3' },
  { title: 'No Miracle',      subtitle: 'Single', spotifyId: '7oU99XtvxsJly7FQ5Er0XI' },
  { title: 'Warrior',         subtitle: 'Single', spotifyId: '0TzSE5laQfxrol4z3tyhVI' },
]

export default function Music() {
  return (
    <section id="music" className="py-28 px-6 bg-black">
      <div className="max-w-7xl mx-auto">
        {/* Section header */}
        <div className="text-center mb-16">
          <p className="text-xs tracking-ultra uppercase text-red-500 mb-4">Discography</p>
          <h2 className="font-display text-5xl md:text-7xl text-white mb-4 leading-none">MUSIC</h2>
          <div className="section-divider" />
        </div>

        <div className="grid lg:grid-cols-2 gap-12 items-start">
          {/* Spotify embed — artist page */}
          <div>
            <p className="text-xs tracking-widest uppercase text-zinc-500 mb-4">Stream Now</p>
            {/* Full artist embed */}
            <iframe
              className="spotify-frame w-full"
              src="https://open.spotify.com/embed/artist/45K51OH61Q78kAmZQVqwO4?utm_source=generator&theme=0"
              width="100%"
              height="380"
              allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"
              loading="lazy"
              title="Desire X on Spotify"
            />
            <a
              href="https://open.spotify.com/artist/45K51OH61Q78kAmZQVqwO4"
              target="_blank"
              rel="noopener noreferrer"
              className="mt-4 inline-flex items-center gap-2 text-xs tracking-widest uppercase text-zinc-400 hover:text-white transition-colors"
            >
              Open in Spotify <ExternalLink size={12} />
            </a>
          </div>

          {/* Track list */}
          <div>
            <p className="text-xs tracking-widest uppercase text-zinc-500 mb-4">Featured Tracks</p>
            <div className="space-y-3">
              {tracks.map((track, i) => (
                <div
                  key={i}
                  className="group flex items-center gap-5 p-4 border border-white/5 hover:border-red-900/40 bg-zinc-950/50 hover:bg-zinc-900/50 transition-all"
                >
                  {/* Track number */}
                  <span className="font-display text-3xl text-zinc-700 group-hover:text-red-700 transition-colors w-8 text-center shrink-0">
                    {String(i + 1).padStart(2, '0')}
                  </span>
                  {/* Track info */}
                  <div className="flex-1 min-w-0">
                    <p className="text-white font-medium truncate">{track.title}</p>
                    <p className="text-xs text-zinc-500 mt-0.5">{track.subtitle}</p>
                  </div>
                  {/* Play link — swap spotifyId when available */}
                  {track.spotifyId ? (
                    <a
                      href={`https://open.spotify.com/track/${track.spotifyId}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="shrink-0 opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      <ExternalLink size={14} className="text-red-500" />
                    </a>
                  ) : (
                    <ExternalLink size={14} className="text-zinc-700 shrink-0 opacity-0 group-hover:opacity-40 transition-opacity" />
                  )}
                </div>
              ))}
            </div>

            {/* Platforms */}
            <div className="mt-8 pt-6 border-t border-white/5">
              <p className="text-xs tracking-widest uppercase text-zinc-600 mb-4">Available On</p>
              <div className="flex flex-wrap gap-3">
                {['Spotify', 'Apple Music', 'YouTube Music', 'SoundCloud'].map((platform) => (
                  <span
                    key={platform}
                    className="px-3 py-1.5 border border-white/10 text-xs text-zinc-500 tracking-wider"
                  >
                    {platform}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
