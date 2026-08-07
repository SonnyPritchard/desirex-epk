import { useState } from 'react'

const tracks = [
  { title: 'Hold On', subtitle: 'Single', spotifyId: '7DS7BTN9JGIFYZf1ToPVJX' },
  { title: 'Break the Chain', subtitle: 'Single', spotifyId: '1IBM8JHX8JQG0LDVkCzQoV' },
  { title: 'Repair', subtitle: 'Single', spotifyId: '59UHKsTe5mLPbHijgsJSJb' },
  { title: 'Remade', subtitle: 'Single', spotifyId: '0QYeWQRnuxtBjenh7c2sa3' },
  { title: 'No Miracle', subtitle: 'Single', spotifyId: '7oU99XtvxsJly7FQ5Er0XI' },
  { title: 'Warrior', subtitle: 'Single', spotifyId: '0TzSE5laQfxrol4z3tyhVI' },
]

export default function Music() {
  const [activeIndex, setActiveIndex] = useState(0)
  const activeTrack = tracks[activeIndex]

  return (
    <section id="music" className="py-16 md:py-28 px-6 bg-black">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-10 md:mb-16">
          <p className="text-xs tracking-ultra uppercase text-red-500 mb-4">Discography</p>
          <h2 className="font-display text-5xl md:text-7xl text-white mb-4 leading-none">MUSIC</h2>
          <div className="section-divider" />
        </div>

        <div className="max-w-5xl mx-auto grid lg:grid-cols-[0.9fr_1.1fr] gap-6 lg:gap-8 items-start">
          <div>
            <p className="text-xs tracking-widest uppercase text-zinc-500 mb-5">Featured Tracks</p>
            <div className="space-y-3">
              {tracks.map((track, index) => {
                const active = index === activeIndex

                return (
                  <button
                    key={track.spotifyId}
                    type="button"
                    onClick={() => setActiveIndex(index)}
                    className={`w-full text-left p-4 border transition-all ${
                      active
                        ? 'border-red-700 bg-zinc-950 text-white'
                        : 'border-white/5 bg-zinc-950/40 text-zinc-300 hover:border-white/15 hover:bg-zinc-900/50'
                    }`}
                  >
                    <div className="flex items-center gap-4">
                      <span className={`font-display text-3xl w-10 shrink-0 ${active ? 'text-red-500' : 'text-zinc-700'}`}>
                        {String(index + 1).padStart(2, '0')}
                      </span>
                      <div>
                        <p className="font-medium">{track.title}</p>
                        <p className={`text-xs tracking-widest uppercase mt-1 ${active ? 'text-zinc-400' : 'text-zinc-500'}`}>
                          {track.subtitle}
                        </p>
                      </div>
                    </div>
                  </button>
                )
              })}
            </div>
          </div>

          <div className="border border-white/5 bg-zinc-950/60 p-4 sm:p-5">
            <div className="mb-4">
              <p className="text-white font-medium text-lg">{activeTrack.title}</p>
              <p className="text-xs tracking-widest uppercase text-zinc-500 mt-1">{activeTrack.subtitle}</p>
            </div>

            <iframe
              key={activeTrack.spotifyId}
              className="w-full spotify-frame"
              src={`https://open.spotify.com/embed/track/${activeTrack.spotifyId}?utm_source=generator&theme=0`}
              width="100%"
              height="152"
              allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"
              loading="lazy"
              title={`${activeTrack.title} on Spotify`}
            />

            <div className="mt-8 pt-5 border-t border-white/5">
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
