export default function About() {
  return (
    <section id="about" className="py-16 md:py-28 px-6 bg-zinc-950">
      <div className="max-w-7xl mx-auto">
        <div className="grid md:grid-cols-2 gap-10 md:gap-16 items-center">
          {/* Artist photo */}
          <div className="order-2 md:order-1">
            <div className="mx-auto w-full max-w-[28rem] lg:max-w-[30rem] p-[10px]">
              <img
                src="/assets/artist-photo.jpg"
                alt="Desire X"
                className="block w-full aspect-[3/4] object-cover object-top"
                style={{
                  outline: '1px solid rgba(127, 29, 29, 0.4)',
                  outlineOffset: '10px',
                }}
              />
            </div>
          </div>

          {/* Bio text */}
          <div className="order-1 md:order-2">
            <p className="text-xs tracking-ultra uppercase text-red-500 mb-4">About the Artist</p>
            <h2 className="font-display text-5xl md:text-6xl text-white mb-6 leading-none">
              THE STORY
            </h2>
            <div className="section-divider" style={{ margin: '0 0 2rem' }} />

            <blockquote className="border-l-2 border-red-700 pl-5 mb-7">
              <p className="font-display text-xl md:text-2xl text-white leading-snug italic">
                "If I die from the weight of my regrets, would I still ascend with a
                broken soul made up of sins?"
              </p>
            </blockquote>

            <div className="space-y-5 text-zinc-400 leading-relaxed font-light">
              <p>
                Desire X is an alternative rock band from Bristol, UK. Formed in 2024 by
                founding member, songwriter and vocalist Adam Castelete, and joined by
                Mike Castelete (Guitar/Bass) and Sonny Pritchard (Guitar). The band are
                currently{' '}
                <a href="/drums" className="text-zinc-200 hover:text-white underline underline-offset-4">
                  looking for a new drummer
                </a>
                .
              </p>
              <p>
                The band deliver high-energy performances and have a growing
                catalogue of studio recordings. Their latest track, <em>Break the Chain</em>,
                {' '}currently has 25,000 streams and <em>Repair</em> over 30,000.
              </p>
              <p>
                The band's recent live shows at The Bristol Fleece and Bristol Exchange
                have contributed to their growth locally and built a reputation as a
                hard-hitting live act.
              </p>
              <p>
                With a new single set for June 2026 and imminent live shows in Bristol,
                Desire X continue to evolve their sound by exploring the balance between
                intensely passionate vocals, heavy riffs and ambient soundscapes.
              </p>
            </div>

            {/* Stats row */}
            <div className="mt-10 pt-8 border-t border-white/5 grid grid-cols-3 gap-2 sm:gap-4">
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
