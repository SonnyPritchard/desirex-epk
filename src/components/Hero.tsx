import { ChevronDown } from 'lucide-react'

export default function Hero() {
  return (
    <section
      id="top"
      className="relative min-h-screen flex flex-col items-center justify-center text-center overflow-hidden"
    >
      {/* Background gradient layers */}
      <div className="absolute inset-0 bg-black" />
      <div className="absolute inset-0 bg-gradient-to-b from-red-950/40 via-transparent to-black" />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(185,28,28,0.15)_0%,transparent_70%)]" />

      {/* Grid lines texture */}
      <div
        className="absolute inset-0 opacity-[0.04]"
        style={{
          backgroundImage: `
            linear-gradient(rgba(255,255,255,0.5) 1px, transparent 1px),
            linear-gradient(90deg, rgba(255,255,255,0.5) 1px, transparent 1px)
          `,
          backgroundSize: '80px 80px',
        }}
      />

      {/* Hero background image */}
      <div className="absolute inset-0 opacity-30">
        <img src="/assets/hero-bg.jpg" className="w-full h-full object-cover object-center" alt="" />
      </div>

      {/* Vignette */}
      <div className="absolute inset-0 bg-gradient-to-t from-black via-black/20 to-transparent" />

      {/* Content */}
      <div className="relative z-10 px-6 max-w-6xl mx-auto">
        {/* Artist header */}
        <div className="mx-auto mb-5 flex justify-center px-2 pt-6 sm:px-4 sm:pt-8">
          <img
            src="/assets/desirex-header.png"
            alt="Desire X"
            className="block w-full max-w-[980px] h-auto object-contain drop-shadow-[0_0_40px_rgba(255,255,255,0.08)] pointer-events-none select-none"
          />
        </div>

        {/* Tagline */}
        <p className="text-zinc-400 text-sm md:text-base tracking-widest uppercase mb-3 font-light">
          Alt Rock · Bristol UK · Follow the Journey
        </p>

        <div className="w-16 h-px bg-red-700 mx-auto mb-10" />

        {/* CTAs */}
        <div className="flex flex-col sm:flex-row flex-wrap items-center justify-center gap-4">
          <a
            href="https://open.spotify.com/artist/45K51OH61Q78kAmZQVqwO4"
            target="_blank"
            rel="noopener noreferrer"
            className="btn-primary w-full sm:w-auto justify-center px-8 py-3.5 bg-red-700 hover:bg-red-600 text-white text-xs tracking-widest uppercase font-medium transition-colors text-center"
          >
            Listen on Spotify
          </a>
          <a
            href="https://www.youtube.com/@desirexofficial"
            target="_blank"
            rel="noopener noreferrer"
            className="w-full sm:w-auto px-8 py-3.5 border border-white/20 hover:border-white/60 text-white text-xs tracking-widest uppercase font-medium transition-all hover:bg-white/5 text-center"
          >
            Watch on YouTube
          </a>
          <a
            href="#contact"
            className="w-full sm:w-auto px-8 py-3.5 border border-red-800/60 hover:border-red-600 text-red-400 hover:text-red-300 text-xs tracking-widest uppercase font-medium transition-all text-center"
          >
            Book / Contact
          </a>
        </div>
      </div>

      {/* Scroll indicator */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-10 flex flex-col items-center gap-2 opacity-40">
        <span className="text-xs tracking-widest uppercase text-zinc-500">Scroll</span>
        <ChevronDown size={16} className="text-zinc-500 animate-bounce" />
      </div>
    </section>
  )
}
