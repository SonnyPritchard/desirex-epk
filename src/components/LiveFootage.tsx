import { useRef, useState } from 'react'
import { Play } from 'lucide-react'

type Clip = {
  title: string
  subtitle: string
  src: string
  poster: string
  duration: string
}

// Clips are 1080p H.264 web encodes of the original 4K phone footage, so they
// play in every browser. The featured clip is whichever one leads this list.
const clips: Clip[] = [
  {
    title: 'Live at The Fleece',
    subtitle: 'The Fleece, Bristol',
    src: '/assets/live/live-0927.mp4',
    poster: '/assets/live/live-0927.jpg',
    duration: '0:13',
  },
  {
    title: 'Break the Chain',
    subtitle: 'Live at The Fleece',
    src: '/assets/live/break-the-chain-live.mp4',
    poster: '/assets/live/break-the-chain-live.jpg',
    duration: '0:24',
  },
  {
    title: 'Hold On (Part 1)',
    subtitle: 'Live at The Fleece',
    src: '/assets/live/hold-on-live-1.mp4',
    poster: '/assets/live/hold-on-live-1.jpg',
    duration: '0:19',
  },
  {
    title: 'Hold On (Part 2)',
    subtitle: 'Live at The Fleece',
    src: '/assets/live/hold-on-live-2.mp4',
    poster: '/assets/live/hold-on-live-2.jpg',
    duration: '0:54',
  },
  {
    title: 'No Miracle (Intro)',
    subtitle: 'Live at The Fleece',
    src: '/assets/live/no-miracle-intro-live.mp4',
    poster: '/assets/live/no-miracle-intro-live.jpg',
    duration: '0:42',
  },
]

export default function LiveFootage() {
  const [activeIndex, setActiveIndex] = useState(0)
  const videoRef = useRef<HTMLVideoElement>(null)
  const activeClip = clips[activeIndex]

  const selectClip = (index: number) => {
    setActiveIndex(index)
    // Picking a clip is an explicit play request, so start it once the new source is in.
    requestAnimationFrame(() => {
      videoRef.current?.play().catch(() => {})
    })
    videoRef.current?.scrollIntoView({ behavior: 'smooth', block: 'center' })
  }

  return (
    <section id="live-footage" className="py-16 md:py-28 px-6 bg-black">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-10 md:mb-16">
          <p className="text-xs tracking-ultra uppercase text-red-500 mb-4">On Stage</p>
          <h2 className="font-display text-5xl md:text-7xl text-white mb-4 leading-none">LIVE FOOTAGE</h2>
          <div className="section-divider" />
        </div>

        <div className="max-w-5xl mx-auto">
          <div className="relative w-full aspect-video bg-zinc-950 border border-white/5 overflow-hidden">
            <video
              ref={videoRef}
              key={activeClip.src}
              src={activeClip.src}
              poster={activeClip.poster}
              className="w-full h-full object-contain bg-black"
              controls
              playsInline
              preload="metadata"
              aria-label={`${activeClip.title}, ${activeClip.subtitle}`}
            />
          </div>

          <div className="mt-4 mb-8">
            <p className="text-white font-medium">{activeClip.title}</p>
            <p className="text-xs text-zinc-500 mt-0.5">{activeClip.subtitle}</p>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
            {clips.map((clip, index) => {
              const active = index === activeIndex

              return (
                <button
                  key={clip.src}
                  type="button"
                  onClick={() => selectClip(index)}
                  // An odd one out would sit alone in the two-column mobile grid, so let it fill the row.
                  className={`group text-left border transition-colors ${
                    active ? 'border-red-700 bg-zinc-950' : 'border-white/5 bg-zinc-950/40 hover:border-white/15'
                  } ${clips.length % 2 === 1 && index === clips.length - 1 ? 'col-span-2 sm:col-span-1' : ''}`}
                  aria-label={`Play ${clip.title}`}
                  aria-pressed={active}
                >
                  <div className="relative aspect-video overflow-hidden">
                    <img
                      src={clip.poster}
                      alt=""
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-[1.03]"
                      loading="lazy"
                    />
                    <div className="absolute inset-0 flex items-center justify-center bg-black/30">
                      <Play size={20} className={active ? 'text-red-500' : 'text-white/80'} fill="currentColor" />
                    </div>
                    <span className="absolute bottom-1.5 right-1.5 px-1.5 py-0.5 bg-black/70 text-[10px] tracking-wider text-zinc-300">
                      {clip.duration}
                    </span>
                  </div>
                  <div className="p-3">
                    <p className={`text-sm font-medium leading-tight ${active ? 'text-white' : 'text-zinc-300'}`}>
                      {clip.title}
                    </p>
                  </div>
                </button>
              )
            })}
          </div>
        </div>
      </div>
    </section>
  )
}
