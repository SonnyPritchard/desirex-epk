import { ExternalLink, Play } from 'lucide-react'

const featuredVideo = {
  title: 'Break The Chain',
  subtitle: 'Official Music Video',
  videoId: 'ED2_oCE2nwk',
  youtubeUrl: 'https://www.youtube.com/watch?v=ED2_oCE2nwk',
}

export default function Video() {
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
      </div>
    </section>
  )
}
