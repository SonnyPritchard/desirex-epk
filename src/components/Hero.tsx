import { ChevronDown } from 'lucide-react'

export default function Hero() {
  const wordmark = (
    <img
      src="/assets/desirex-header.png"
      alt="Desire X"
      className="block w-full max-w-[980px] h-auto mx-auto object-contain drop-shadow-[0_0_40px_rgba(255,255,255,0.08)] pointer-events-none select-none"
    />
  )

  const tagline = 'Alt Rock · Bristol UK · Follow the Journey'

  const ctas = (
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
  )

  return (
    <section id="top" className="relative overflow-hidden">
      {/* ===== MOBILE: full-width band photo banner on top, content below ===== */}
      <div className="md:hidden relative min-h-screen flex flex-col bg-black">
        <div className="absolute inset-0 bg-gradient-to-b from-red-950/30 via-black to-black" />

        {/* Band photo banner — full landscape shot so all four members are visible */}
        <div className="relative">
          <img
            src="/assets/hero-bg.jpg"
            alt="Desire X — Adam Castelete, Mike Castelete, Sonny Pritchard, Sam Rawlings"
            className="block w-full object-cover"
            style={{ filter: 'brightness(1.32) contrast(1.03)' }}
          />
          {/* fade the photo into the dark content area */}
          <div className="absolute inset-x-0 bottom-0 h-2/5 bg-gradient-to-t from-black to-transparent" />
        </div>

        {/* Content — pulled up slightly to overlap the photo fade */}
        <div className="relative z-10 -mt-14 flex-1 flex flex-col justify-center px-6 pt-4 pb-16 text-center">
          <div className="mb-5 px-2">{wordmark}</div>
          <p className="text-zinc-400 text-sm tracking-widest uppercase mb-3 font-light">{tagline}</p>
          <div className="w-16 h-px bg-red-700 mx-auto mb-9" />
          {ctas}
        </div>
      </div>

      {/* ===== DESKTOP: full-bleed background, content anchored to lower third so faces stay clear ===== */}
      <div className="hidden md:flex relative min-h-screen flex-col items-center justify-end text-center">
        <div className="absolute inset-0 bg-black" />
        <div className="absolute inset-0 bg-gradient-to-b from-red-950/40 via-transparent to-black" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(185,28,28,0.15)_0%,transparent_70%)]" />
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
        {/* brightened full-bleed band photo */}
        <div className="absolute inset-0 opacity-60">
          <img
            src="/assets/hero-bg.jpg"
            className="w-full h-full object-cover object-center"
            style={{ filter: 'brightness(1.35) contrast(1.04)' }}
            alt=""
          />
        </div>
        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/20 to-transparent" />

        <div className="relative z-10 px-6 max-w-6xl mx-auto pb-[12vh]">
          <div className="mx-auto mb-6 flex justify-center px-4 max-w-[480px] lg:max-w-[560px]">{wordmark}</div>
          <p className="text-zinc-400 text-base tracking-widest uppercase mb-3 font-light">{tagline}</p>
          <div className="w-16 h-px bg-red-700 mx-auto mb-10" />
          {ctas}
        </div>
      </div>

      {/* Scroll indicator */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-10 flex flex-col items-center gap-2 opacity-40 pointer-events-none">
        <span className="text-xs tracking-widest uppercase text-zinc-500">Scroll</span>
        <ChevronDown size={16} className="text-zinc-500 animate-bounce" />
      </div>
    </section>
  )
}
