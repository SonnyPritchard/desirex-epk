import { ExternalLink, Play } from 'lucide-react'

const videos = [
  // TODO: Replace videoId values with real YouTube video IDs from @desirexofficial
  // Format: https://www.youtube.com/watch?v=VIDEO_ID  →  use VIDEO_ID below
  { title: 'Featured Music Video', subtitle: 'Official Music Video', videoId: '' },
  { title: 'Live Performance', subtitle: 'Live Session', videoId: '' },
  { title: 'Behind the Scenes', subtitle: 'Studio Footage', videoId: '' },
]

export default function Video() {
  const featured = videos[0]
  const secondary = videos.slice(1)

  return (
    <section id="video" className="py-28 px-6 bg-zinc-950">
      <div className="max-w-7xl mx-auto">
        {/* Section header */}
        <div className="text-center mb-16">
          <p className="text-xs tracking-ultra uppercase text-red-500 mb-4">Visual</p>
          <h2 className="font-display text-5xl md:text-7xl text-white mb-4 leading-none">VIDEO</h2>
          <div className="section-divider" />
        </div>

        {/* Featured video embed */}
        <div className="mb-8">
          {featured.videoId ? (
            <div className="relative w-full aspect-video bg-black">
              <iframe
                src={`https://www.youtube.com/embed/${featured.videoId}?rel=0&modestbranding=1`}
                className="w-full h-full"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
                title={featured.title}
              />
            </div>
          ) : (
            /* Placeholder when no video ID set yet */
            <div className="relative w-full aspect-video bg-zinc-900 border border-white/5 flex items-center justify-center">
              <div className="text-center">
                <div className="w-16 h-16 rounded-full border-2 border-red-800/60 flex items-center justify-center mx-auto mb-4">
                  <Play size={24} className="text-red-600 ml-1" fill="currentColor" />
                </div>
                <p className="text-zinc-400 font-medium">{featured.title}</p>
                <p className="text-xs text-zinc-600 mt-1">
                  Set videoId in src/components/Video.tsx to embed
                </p>
                <a
                  href="https://www.youtube.com/@desirexofficial"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-4 inline-flex items-center gap-2 px-5 py-2.5 border border-red-800/60 text-red-500 text-xs tracking-widest uppercase hover:bg-red-800/20 transition-colors"
                >
                  Watch on YouTube <ExternalLink size={12} />
                </a>
              </div>
            </div>
          )}
          <div className="mt-3 flex items-center justify-between">
            <div>
              <p className="text-white font-medium">{featured.title}</p>
              <p className="text-xs text-zinc-500 mt-0.5">{featured.subtitle}</p>
            </div>
            <a
              href="https://www.youtube.com/@desirexofficial"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 text-xs tracking-widest uppercase text-zinc-400 hover:text-white transition-colors"
            >
              All Videos <ExternalLink size={12} />
            </a>
          </div>
        </div>

        {/* Secondary video cards */}
        <div className="grid sm:grid-cols-2 gap-4 mt-10">
          {secondary.map((v, i) => (
            <div
              key={i}
              className="group relative aspect-video bg-zinc-900 border border-white/5 hover:border-red-900/40 overflow-hidden transition-all"
            >
              {v.videoId ? (
                <iframe
                  src={`https://www.youtube.com/embed/${v.videoId}?rel=0&modestbranding=1`}
                  className="w-full h-full"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                  title={v.title}
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center">
                  <div className="text-center px-4">
                    <Play size={20} className="text-zinc-600 mx-auto mb-2" />
                    <p className="text-xs text-zinc-400">{v.title}</p>
                    <p className="text-xs text-zinc-600 mt-1">{v.subtitle}</p>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
