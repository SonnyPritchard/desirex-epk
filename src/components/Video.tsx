import { ExternalLink, Play } from 'lucide-react'

const featuredVideo = {
  title: 'The Edge',
  subtitle: 'Official Music Video',
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
  { title: 'Break the Chain', subtitle: 'Live at The Fleece, Bristol', file: 'break-the-chain-live-fleece' },
  { title: 'No Miracle', subtitle: 'Live at The Fleece, Bristol', file: 'no-miracle-live-fleece' },
  { title: 'From the Crowd', subtitle: 'Live at The Fleece, Bristol', file: 'live-fleece-crowd' },
]

/** Only one clip plays at a time — starting one pauses the rest. */
function pauseOtherClips(playing: HTMLVideoElement) {
  document.querySelectorAll<HTMLVideoElement>('#video video').forEach((video) => {
    if (video !== playing) video.pause()
  })
}

export default function Video() {
  return (
    <section id="video" className="py-16 md:py-28 px-6 bg-black">
      <div className="max-w-7xl mx-auto">
        {/* Section header */}
        <div className="text-center mb-10 md:mb-16">
          <p className="text-xs tracking-ultra uppercase text-red-500 mb-4">Visual</p>
          <h2 className="font-display text-5xl md:text-7xl text-white mb-4 leading-none">VIDEO</h2>
          <div className="section-divider" />
        </div>

        {/* Featured video embed */}
        <div className="mb-8 max-w-5xl mx-auto">
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

          <div className="mt-4 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <p className="text-white font-medium">{featuredVideo.title}</p>
              <p className="text-xs text-zinc-500 mt-0.5">{featuredVideo.subtitle}</p>
            </div>
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
        <div className="mt-16 md:mt-24 max-w-5xl mx-auto">
          <div className="text-center mb-8 md:mb-10">
            <p className="text-xs tracking-ultra uppercase text-red-500 mb-3">Live Clips</p>
            <h3 className="font-display text-3xl md:text-5xl text-white leading-none">
              LIVE AT THE FLEECE
            </h3>
          </div>

          <div className="grid sm:grid-cols-2 gap-6">
            {liveClips.map((clip) => (
              <figure key={clip.file} className="border border-white/5 bg-zinc-950/60">
                <video
                  src={`/assets/video/${clip.file}.mp4`}
                  poster={`/assets/video/${clip.file}.jpg`}
                  className="block w-full aspect-video bg-black object-cover"
                  controls
                  playsInline
                  preload="none"
                  onPlay={(e) => pauseOtherClips(e.currentTarget)}
                  aria-label={`${clip.title} — ${clip.subtitle}`}
                />
                <figcaption className="px-4 py-3">
                  <p className="text-white font-medium">{clip.title}</p>
                  <p className="text-xs text-zinc-500 mt-0.5">{clip.subtitle}</p>
                </figcaption>
              </figure>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
