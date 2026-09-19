/*
  Press photos — promo shots for press, promoters and listings.

  Drop image files into /public/assets/press/ and add the filenames below.
  While the array is empty the whole section renders nothing, so the live EPK
  never shows an empty grid or a "add your photos here" placeholder to an agent.

  These are promo/press shots. Live shots belong in Gallery.tsx.
*/
const photos: string[] = []

export default function Press() {
  if (photos.length === 0) return null

  return (
    <section id="press" className="py-16 md:py-28 px-6 bg-black">
      <div className="max-w-7xl mx-auto">
        {/* Section header */}
        <div className="text-center mb-10 md:mb-16">
          <p className="text-xs tracking-ultra uppercase text-red-500 mb-4">Media</p>
          <h2 className="font-display text-5xl md:text-7xl text-white mb-4 leading-none">PRESS</h2>
          <div className="section-divider" />
        </div>

        {/* Photo grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {photos.map((photo, i) => (
            <div key={photo} className="aspect-square overflow-hidden bg-zinc-900">
              <img
                src={`/assets/press/${photo}`}
                alt={`Desire X press photo ${i + 1}`}
                loading="lazy"
                className="press-photo w-full h-full object-cover grayscale hover:grayscale-0"
              />
            </div>
          ))}
        </div>

        {/* Press contact */}
        <div className="mt-14 text-center">
          <p className="text-xs tracking-widest uppercase text-zinc-500 mb-3">
            Press enquiries &amp; hi-res assets
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
