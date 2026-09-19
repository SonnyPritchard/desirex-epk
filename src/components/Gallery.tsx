import { useState } from 'react'

type Photo = {
  src: string
  alt: string
}

// The featured shot is whichever photo leads this list.
const photos: Photo[] = [
  {
    src: '/assets/gallery/live-6.jpg',
    alt: 'Desire X full band on stage, vocalist front and centre under green and white lights',
  },
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
  {
    src: '/assets/gallery/live-7.jpg',
    alt: 'Desire X guitarist playing side-on in a beam of stage light',
  },
  {
    src: '/assets/gallery/live-8.jpg',
    alt: 'Desire X vocalist leaning out over the crowd, mic raised',
  },
  {
    src: '/assets/gallery/live-9.jpg',
    alt: 'Desire X vocalist crouched low under red and blue stage lights',
  },
  {
    src: '/assets/gallery/live-10.jpg',
    alt: 'Desire X bassist playing under blue stage lights',
  },
]

type ThumbnailProps = {
  photo: Photo
  onSelect: () => void
  imgClassName: string
  className?: string
}

function Thumbnail({ photo, onSelect, imgClassName, className = '' }: ThumbnailProps) {
  return (
    <button
      type="button"
      onClick={onSelect}
      className={`group overflow-hidden border border-white/5 bg-zinc-950/60 text-left transition-colors hover:border-red-700/60 ${className}`}
      aria-label={`Show ${photo.alt} as featured image`}
    >
      <img
        src={photo.src}
        alt={photo.alt}
        className={`w-full h-full object-cover object-center transition-transform duration-500 group-hover:scale-[1.02] ${imgClassName}`}
        loading="lazy"
      />
    </button>
  )
}

export default function Gallery() {
  const [activeIndex, setActiveIndex] = useState(0)
  const activePhoto = photos[activeIndex]
  const others = photos
    .map((photo, index) => ({ photo, index }))
    .filter((item) => item.index !== activeIndex)
  // The collage grid holds exactly four thumbnails alongside the featured shot;
  // anything beyond that flows into the strip underneath.
  const collageThumbnails = others.slice(0, 4)
  const stripThumbnails = others.slice(4)

  return (
    <section id="gallery" className="py-16 md:py-28 px-6 bg-black">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-10 md:mb-16">
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

            {collageThumbnails.map(({ photo, index }) => (
              <Thumbnail
                key={photo.src}
                photo={photo}
                onSelect={() => setActiveIndex(index)}
                imgClassName="aspect-[3/4] lg:aspect-auto"
              />
            ))}
          </div>

          {stripThumbnails.length > 0 && (
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4 mt-4">
              {stripThumbnails.map(({ photo, index }, position) => (
                <Thumbnail
                  key={photo.src}
                  photo={photo}
                  onSelect={() => setActiveIndex(index)}
                  imgClassName="aspect-[4/3]"
                  // An odd one out would sit alone in the two-column mobile grid, so let it fill the row.
                  className={
                    stripThumbnails.length % 2 === 1 && position === stripThumbnails.length - 1
                      ? 'col-span-2 sm:col-span-1'
                      : ''
                  }
                />
              ))}
            </div>
          )}
        </div>
      </div>
    </section>
  )
}
