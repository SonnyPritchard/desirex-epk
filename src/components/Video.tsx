import { useEffect, useRef, useState } from 'react'
import { ChevronLeft, ChevronRight, ExternalLink, Play } from 'lucide-react'

const featuredVideo = {
  label: 'New Release',
  title: 'The Edge',
  videoId: 'Jaq05s5-mjY',
  youtubeUrl: 'https://www.youtube.com/watch?v=Jaq05s5-mjY',
}

/*
  Live clips — self-hosted from /public/assets/video/. Each clip is a 1080p H.264
  MP4 (with +faststart so it streams) plus a JPG poster of the same name.
  preload="none" means nothing downloads until someone presses play.
*/
type LiveClip = {
  title: string
  subtitle: string
  file: string
}

const liveClips: LiveClip[] = [
  { title: 'Hold On', subtitle: 'Live at The Fleece, Bristol', file: 'hold-on-live-fleece' },
  { title: 'Hold On', subtitle: 'Live at The Fleece, Bristol · From the crowd', file: 'hold-on-live-fleece-crowd' },
  { title: 'Break the Chain', subtitle: 'Live at The Fleece, Bristol', file: 'break-the-chain-live-fleece' },
  { title: 'No Miracle', subtitle: 'Live at The Fleece, Bristol', file: 'no-miracle-live-fleece' },
]

/*
  Swipeable carousel built on CSS scroll-snap: the track scrolls natively (touch,
  trackpad, shift+wheel), and the arrows and dots just scroll it to a slide. The
  active slide is whichever sits nearest the middle of the track; the others are
  dimmed, and clicking one brings it to the middle. Leaving a clip pauses it.

  Clips show a play button over the poster and only get native controls once
  started. Chrome sizes a video's controls to the part that's on screen when
  they first appear, so adding them while a clip is still sliding into the
  middle (or peeking in at the edge) leaves them squashed. By the time someone
  presses play, the clip is sitting still in the middle.
*/
function LiveClipsCarousel() {
  const trackRef = useRef<HTMLDivElement>(null)
  const [active, setActive] = useState(0)
  const [started, setStarted] = useState<number | null>(null)

  const slides = () => Array.from(trackRef.current?.children ?? []) as HTMLElement[]

  function goTo(index: number) {
    const track = trackRef.current
    const slide = slides()[index]
    if (!track || !slide) return
    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    track.scrollTo({
      left: slide.offsetLeft - (track.clientWidth - slide.offsetWidth) / 2,
      behavior: reduceMotion ? 'auto' : 'smooth',
    })
  }

  function onScroll() {
    const track = trackRef.current
    if (!track) return
    const middle = track.scrollLeft + track.clientWidth / 2
    let nearest = 0
    let nearestDistance = Infinity
    slides().forEach((slide, i) => {
      const distance = Math.abs(slide.offsetLeft + slide.offsetWidth / 2 - middle)
      if (distance < nearestDistance) {
        nearest = i
        nearestDistance = distance
      }
    })
    if (nearest !== active) {
      setActive(nearest)
      setStarted(null)
    }
  }

  function play(index: number) {
    const video = trackRef.current?.querySelectorAll('video')[index]
    if (!video) return
    setStarted(index)
    video.play().catch(() => undefined) // the controls are showing now, so they can retry
  }

  // Only the clip in the middle keeps playing.
  useEffect(() => {
    trackRef.current?.querySelectorAll('video').forEach((video, i) => {
      if (i !== active) video.pause()
    })
  }, [active])

  const arrowClass =
    'w-11 h-11 flex items-center justify-center border border-white/10 text-zinc-300 transition-colors hover:border-red-700/60 hover:text-white disabled:opacity-30 disabled:pointer-events-none'

  return (
    <div role="region" aria-roledescription="carousel" aria-label="Live clips">
      {/*
        Bleeds to the screen edge on mobile so the neighbouring clips peek in.
        Slide width and edge padding are both in cqw (this wrapper's width) and
        add up to 100, so the first and last clips can sit dead centre too. The
        mask fades the side clips out at the edges instead of cutting them off.
      */}
      <div className="-mx-6 md:mx-0 [container-type:inline-size] [mask-image:linear-gradient(to_right,transparent,#000_8%,#000_92%,transparent)] md:[mask-image:linear-gradient(to_right,transparent,#000_12%,#000_88%,transparent)]">
        <div
          ref={trackRef}
          onScroll={onScroll}
          className="relative flex gap-4 md:gap-6 overflow-x-auto snap-x snap-mandatory no-scrollbar px-[10cqw] md:px-[15cqw]"
        >
          {liveClips.map((clip, i) => (
            <figure
              key={clip.file}
              role="group"
              aria-roledescription="slide"
              aria-label={`${i + 1} of ${liveClips.length}: ${clip.title}`}
              className={`relative flex-none w-[80cqw] md:w-[70cqw] snap-center border bg-zinc-950/60 transition-[opacity,transform,border-color] duration-500 ${
                i === active ? 'border-red-900/50' : 'border-white/5 opacity-40 md:scale-[0.94]'
              }`}
            >
              <div className="relative">
                <video
                  src={`/assets/video/${clip.file}.mp4`}
                  poster={`/assets/video/${clip.file}.jpg`}
                  className="block w-full aspect-video bg-black object-cover"
                  controls={i === started}
                  playsInline
                  preload="none"
                  aria-label={`${clip.title} — ${clip.subtitle}`}
                />
                {i === active && i !== started && (
                  <button
                    type="button"
                    onClick={() => play(i)}
                    className="group absolute inset-0 flex items-center justify-center"
                    aria-label={`Play ${clip.title}, ${clip.subtitle}`}
                  >
                    <span className="w-16 h-16 md:w-20 md:h-20 rounded-full bg-black/50 border-2 border-red-600/80 flex items-center justify-center transition-transform duration-300 group-hover:scale-110">
                      <Play size={26} className="text-red-500 ml-1" fill="currentColor" />
                    </span>
                  </button>
                )}
              </div>
              <figcaption className="px-4 py-3">
                <p className="text-white font-medium">{clip.title}</p>
                <p className="text-xs text-zinc-500 mt-0.5">{clip.subtitle}</p>
              </figcaption>

              {/* Clicking a side clip brings it to the middle rather than playing it */}
              {i !== active && (
                <button
                  type="button"
                  onClick={() => goTo(i)}
                  className="absolute inset-0 z-10 cursor-pointer"
                  aria-label={`Show ${clip.title}, ${clip.subtitle}`}
                />
              )}
            </figure>
          ))}
        </div>
      </div>

      <div className="mt-6 flex items-center justify-center gap-5">
        <button
          type="button"
          onClick={() => goTo(active - 1)}
          disabled={active === 0}
          className={arrowClass}
          aria-label="Previous clip"
        >
          <ChevronLeft size={18} />
        </button>

        <div className="flex items-center gap-1">
          {liveClips.map((clip, i) => (
            <button
              key={clip.file}
              type="button"
              onClick={() => goTo(i)}
              className="px-1 py-4"
              aria-label={`Go to clip ${i + 1}: ${clip.title}`}
              aria-current={i === active}
            >
              <span
                className={`block h-[3px] transition-all duration-300 ${
                  i === active ? 'w-8 bg-red-600' : 'w-4 bg-white/20 hover:bg-white/40'
                }`}
              />
            </button>
          ))}
        </div>

        <button
          type="button"
          onClick={() => goTo(active + 1)}
          disabled={active === liveClips.length - 1}
          className={arrowClass}
          aria-label="Next clip"
        >
          <ChevronRight size={18} />
        </button>
      </div>
    </div>
  )
}

export default function Video() {
  return (
    <section id="video" className="pt-10 pb-16 md:pt-20 md:pb-28 px-6 bg-black">
      <div className="max-w-7xl mx-auto">
        {/* Section header — the featured video's title doubles as the heading */}
        <div className="text-center mb-8 md:mb-12">
          <p className="text-xs tracking-ultra uppercase text-red-500 mb-4">{featuredVideo.label}</p>
          <h2 className="font-display text-5xl md:text-7xl text-white mb-4 leading-none uppercase">
            {featuredVideo.title}
          </h2>
          <div className="section-divider" style={{ marginBottom: 0 }} />
        </div>

        {/* Featured video embed */}
        <div className="max-w-5xl mx-auto">
          {featuredVideo.videoId ? (
            <div className="relative w-full aspect-video bg-black border border-white/5 overflow-hidden">
              <iframe
                src={`https://www.youtube-nocookie.com/embed/${featuredVideo.videoId}?rel=0`}
                className="w-full h-full"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                allowFullScreen
                loading="lazy"
                referrerPolicy="strict-origin-when-cross-origin"
                title={featuredVideo.title}
              />
            </div>
          ) : (
            <div className="relative w-full aspect-video bg-zinc-900 border border-white/5 flex items-center justify-center">
              <div className="text-center">
                <div className="w-16 h-16 rounded-full border-2 border-red-800/60 flex items-center justify-center mx-auto mb-4">
                  <Play size={24} className="text-red-600 ml-1" fill="currentColor" />
                </div>
                <p className="text-zinc-400 font-medium">Featured Music Video</p>
              </div>
            </div>
          )}

          <div className="mt-5 flex justify-center">
            <a
              href={featuredVideo.youtubeUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-5 py-2.5 border border-red-800/60 text-red-500 text-xs tracking-widest uppercase hover:bg-red-800/20 transition-colors"
            >
              Watch on YouTube <ExternalLink size={12} />
            </a>
          </div>
        </div>

        {/* Live clips */}
        <div className="mt-12 md:mt-20 max-w-5xl mx-auto">
          <div className="text-center mb-8 md:mb-10">
            <p className="text-xs tracking-ultra uppercase text-red-500 mb-3">Live Clips</p>
            <h3 className="font-display text-3xl md:text-5xl text-white leading-none">
              LIVE AT THE FLEECE
            </h3>
          </div>

          <LiveClipsCarousel />
        </div>
      </div>
    </section>
  )
}
