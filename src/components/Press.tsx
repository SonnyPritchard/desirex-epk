/*
  Press section — quotes + photo gallery.
  TODO: Replace placeholder quotes with real press/blog mentions.
  TODO: Add press photo files to /public/assets/press/ and update the photos array.
*/

const quotes = [
  {
    text: '"DesireX delivers a sound that is simultaneously crushing and atmospheric — a force in modern metal."',
    source: 'Music Publication Name', // TODO: Replace
    url: '#', // TODO: Replace with real URL
  },
  {
    text: '"An artist with a distinct identity and the sonic weight to back it up."',
    source: 'Blog / Review Source', // TODO: Replace
    url: '#',
  },
  {
    text: '"Relentless energy with serious production value."',
    source: 'Press Outlet', // TODO: Replace
    url: '#',
  },
]

// TODO: Add real press photo filenames here, e.g. 'press-1.jpg'
// Files go in /public/assets/press/
const photos: string[] = []

export default function Press() {
  return (
    <section id="press" className="py-28 px-6 bg-black">
      <div className="max-w-7xl mx-auto">
        {/* Section header */}
        <div className="text-center mb-16">
          <p className="text-xs tracking-ultra uppercase text-red-500 mb-4">Media</p>
          <h2 className="font-display text-5xl md:text-7xl text-white mb-4 leading-none">PRESS</h2>
          <div className="section-divider" />
        </div>

        {/* Press quotes */}
        <div className="grid md:grid-cols-3 gap-6 mb-20">
          {quotes.map((q, i) => (
            <div
              key={i}
              className="relative p-6 border border-white/5 bg-zinc-950/60 flex flex-col gap-4"
            >
              {/* Decorative quote mark */}
              <span className="font-display text-6xl text-red-900/30 leading-none absolute top-4 right-5 select-none">
                "
              </span>
              <p className="text-zinc-300 leading-relaxed font-light text-sm italic relative z-10">
                {q.text}
              </p>
              <div className="mt-auto pt-4 border-t border-white/5">
                {q.url !== '#' ? (
                  <a
                    href={q.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-xs tracking-widest uppercase text-zinc-500 hover:text-red-400 transition-colors"
                  >
                    — {q.source}
                  </a>
                ) : (
                  <p className="text-xs tracking-widest uppercase text-zinc-600">— {q.source}</p>
                )}
              </div>
            </div>
          ))}
        </div>

        {/* Photo gallery */}
        <div>
          <p className="text-xs tracking-widest uppercase text-zinc-500 mb-6 text-center">
            Photo Gallery
          </p>
          {photos.length > 0 ? (
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              {photos.map((photo, i) => (
                <div key={i} className="aspect-square overflow-hidden bg-zinc-900">
                  <img
                    src={`/assets/press/${photo}`}
                    alt={`DesireX press photo ${i + 1}`}
                    className="press-photo w-full h-full object-cover grayscale hover:grayscale-0"
                  />
                </div>
              ))}
            </div>
          ) : (
            /* Placeholder grid */
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              {Array.from({ length: 4 }).map((_, i) => (
                <div
                  key={i}
                  className="aspect-square bg-zinc-900 border border-white/5 flex items-center justify-center"
                >
                  <div className="text-center p-4">
                    <p className="text-3xl mb-2">📷</p>
                    <p className="text-xs text-zinc-600">
                      Add photos to<br />/public/assets/press/
                    </p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Press contact */}
        <div className="mt-14 text-center">
          <p className="text-xs tracking-widest uppercase text-zinc-500 mb-3">
            Press inquiries & hi-res assets
          </p>
          <a
            href="#contact"
            className="inline-flex items-center gap-2 px-7 py-3 border border-red-800/60 text-red-500 text-xs tracking-widest uppercase hover:bg-red-800/20 transition-colors"
          >
            Request Press Kit
          </a>
        </div>
      </div>
    </section>
  )
}
