import { useState } from 'react'

const photos = [
  {
    src: '/assets/gallery/live-1.jpg',
    alt: 'Desire X live performance photo 1',
  },
  {
    src: '/assets/gallery/live-2.jpg',
    alt: 'Desire X live performance photo 2',
  },
  {
    src: '/assets/gallery/live-3.jpg',
    alt: 'Desire X live performance photo 3',
  },
  {
    src: '/assets/gallery/live-4.jpg',
    alt: 'Desire X live performance photo 4',
  },
  {
    src: '/assets/gallery/live-5.jpg',
    alt: 'Desire X live performance photo 5',
  },
]

export default function Gallery() {
  const [activeIndex, setActiveIndex] = useState(0)
  const activePhoto = photos[activeIndex]
  const thumbnails = photos.filter((_, index) => index !== activeIndex)

  return (
    <section id="gallery" className="py-28 px-6 bg-black">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <p className="text-xs tracking-ultra uppercase text-red-500 mb-4">Live Photos</p>
          <h2 className="font-display text-5xl md:text-7xl text-white mb-4 leading-none">LIVE</h2>
          <div className="section-divider" />
        </div>

        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 lg:grid-rows-2 lg:h-[720px]">
            <figure className="overflow-hidden border border-white/5 bg-zinc-950/60 sm:col-span-2 lg:col-span-2 lg:row-span-2">
              <img
                key={activePhoto.src}
                src={activePhoto.src}
                alt={activePhoto.alt}
                className="w-full h-full aspect-[4/5] lg:aspect-auto object-cover object-center"
                loading="eager"
              />
            </figure>

            {thumbnails.map((photo) => (
              <button
                key={photo.src}
                type="button"
                onClick={() => setActiveIndex(photos.findIndex((item) => item.src === photo.src))}
                className="group overflow-hidden border border-white/5 bg-zinc-950/60 text-left transition-colors hover:border-red-700/60"
                aria-label={`Show ${photo.alt} as featured image`}
              >
                <img
                  src={photo.src}
                  alt={photo.alt}
                  className="w-full h-full aspect-[3/4] lg:aspect-auto object-cover object-center transition-transform duration-500 group-hover:scale-[1.02]"
                  loading="lazy"
                />
              </button>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
