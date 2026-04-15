export default function About() {
  return (
    <section id="about" className="py-28 px-6 bg-zinc-950">
      <div className="max-w-7xl mx-auto">
        <div className="grid md:grid-cols-2 gap-16 items-center">
          {/* Artist photo */}
          <div className="relative order-2 md:order-1">
            <img
              src="/assets/artist-photo.jpg"
              alt="Desire X"
              className="w-full aspect-[3/4] object-cover object-top"
            />
            {/* Decorative border accent */}
            <div className="absolute -bottom-3 -right-3 w-full h-full border border-red-900/40 pointer-events-none" />
          </div>

          {/* Bio text */}
          <div className="order-1 md:order-2">
            <p className="text-xs tracking-ultra uppercase text-red-500 mb-4">About the Artist</p>
            <h2 className="font-display text-5xl md:text-6xl text-white mb-6 leading-none">
              THE STORY
            </h2>
            <div className="section-divider" style={{ margin: '0 0 2rem' }} />

            <div className="space-y-5 text-zinc-400 leading-relaxed font-light">
              <p>
                Desire X is an alt rock act out of Bristol, UK — built on raw energy, direct
                songwriting, and the kind of live presence that makes rooms pay attention.
              </p>
              <p>
                With tracks like <em>Break the Chain</em>, <em>Warrior</em>, and <em>Repair</em>
                {' '}accumulating over 7,000 monthly listeners on Spotify, Desire X are steadily
                building an audience that follows the journey from first riff to last note.
              </p>
              <p>
                {/* TODO: Expand with full artist biography when available */}
                We'll take good care of you.
              </p>
            </div>

            {/* Stats row */}
            <div className="mt-10 pt-8 border-t border-white/5 grid grid-cols-3 gap-4">
              {[
                { label: 'Monthly Listeners', value: '7.1K' },
                { label: 'Instagram', value: '1.1K' },
                { label: 'Tracks on Spotify', value: '5+' },
              ].map((stat) => (
                <div key={stat.label}>
                  <p className="font-display text-3xl text-red-500">{stat.value}</p>
                  <p className="text-xs text-zinc-500 tracking-widest uppercase mt-1">{stat.label}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
