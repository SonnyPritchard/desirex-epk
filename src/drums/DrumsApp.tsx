import { ArrowDown, ExternalLink } from 'lucide-react'
import ApplyForm from './ApplyForm'

const SPOTIFY_URL = 'https://open.spotify.com/artist/45K51OH61Q78kAmZQVqwO4'
const YOUTUBE_URL = 'https://www.youtube.com/@desirexofficial'
const INSTAGRAM_URL = 'https://www.instagram.com/desirexofficial/'
/** "Hold On" — the current featured track on the EPK */
const FEATURED_TRACK_ID = '7DS7BTN9JGIFYZf1ToPVJX'

const facts = [
  { value: '7.1K', label: 'Monthly listeners' },
  { value: '6', label: 'Singles released' },
  { value: 'BS1', label: 'Bristol based' },
]

const lookingFor = [
  'Hits hard and stays tight. We want metal weight with an alt rock feel, so dynamics matter as much as power.',
  'Comfortable playing to a click and running backing tracks live.',
  'Based in or around Bristol, or happy to travel in for rehearsals and gigs.',
  'Has your own kit and a way to get it to shows.',
  'Keen to write, record and gig hard with us.',
]

const whatYouGet = [
  'A working band with released music, a growing audience and shows already on the calendar.',
  'New music on the way. You’d be playing on what comes next, not just learning the old stuff.',
  'A tight group who take the music seriously and not much else.',
  'Real rooms. We’ve played The Fleece and Exchange in Bristol recently, with more booked.',
]

export default function DrumsApp() {
  return (
    <>
      {/* Minimal nav */}
      <header className="absolute top-0 left-0 right-0 z-50">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <a href="/" className="font-display text-2xl tracking-ultra text-white hover:text-red-600 transition-colors">
            DESIRE X
          </a>
          <div className="flex items-center gap-6">
            <a href="/" className="hidden sm:inline text-xs tracking-widest uppercase text-zinc-400 hover:text-white transition-colors">
              Press Kit
            </a>
            <a
              href="#apply"
              className="px-5 py-2 border border-red-700 text-red-500 text-xs tracking-widest uppercase hover:bg-red-700 hover:text-white transition-all"
            >
              Apply
            </a>
          </div>
        </div>
      </header>

      <main>
        {/* Hero */}
        <section className="relative min-h-[100svh] flex flex-col justify-end overflow-hidden bg-black">
          <div className="absolute inset-0">
            <img
              src="/assets/hero-bg.jpg"
              alt=""
              className="w-full h-full object-cover object-center opacity-50"
              style={{ filter: 'brightness(1.2) contrast(1.05)' }}
            />
          </div>
          <div className="absolute inset-0 bg-gradient-to-b from-black/70 via-black/20 to-black" />
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom,rgba(185,28,28,0.25)_0%,transparent_60%)]" />

          <div className="relative z-10 px-6 pb-20 pt-32 max-w-5xl mx-auto w-full text-center">
            <p className="text-xs tracking-ultra uppercase text-red-500 mb-5">Desire X · Alt Rock · Bristol UK</p>
            <h1 className="font-display text-white leading-[0.9] text-[clamp(3.5rem,14vw,9.5rem)]">
              WE NEED
              <br />
              <span className="text-red-600">A DRUMMER</span>
            </h1>
            <p className="mt-6 text-zinc-300 text-base md:text-lg font-light max-w-2xl mx-auto leading-relaxed">
              Our drummer's just left and the calendar hasn't slowed down. We've got releases, shows
              and rehearsals lined up, and we need someone who hits hard and wants to build this with us.
            </p>
            <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4">
              <a
                href="#apply"
                className="btn-primary w-full sm:w-auto px-10 py-4 bg-red-700 hover:bg-red-600 text-white text-xs tracking-widest uppercase font-medium transition-colors text-center"
              >
                Apply Now
              </a>
              <a
                href="#listen"
                className="w-full sm:w-auto px-10 py-4 border border-white/20 hover:border-white/60 text-white text-xs tracking-widest uppercase font-medium transition-all hover:bg-white/5 text-center"
              >
                Hear the Music
              </a>
            </div>
            <p className="mt-6 text-xs text-zinc-500 tracking-widest uppercase">Takes about 3 minutes · A phone clip is fine</p>
          </div>

          <div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-10 opacity-40 pointer-events-none">
            <ArrowDown size={16} className="text-zinc-400 animate-bounce" />
          </div>
        </section>

        {/* Facts strip */}
        <section className="bg-zinc-950 border-y border-white/5">
          <div className="max-w-5xl mx-auto px-6 py-8 grid grid-cols-3 gap-4 text-center">
            {facts.map((f) => (
              <div key={f.label}>
                <p className="font-display text-3xl md:text-4xl text-red-500">{f.value}</p>
                <p className="text-[10px] md:text-xs text-zinc-500 tracking-widest uppercase mt-1">{f.label}</p>
              </div>
            ))}
          </div>
        </section>

        {/* The gig */}
        <section className="py-16 md:py-24 px-6 bg-black">
          <div className="max-w-5xl mx-auto grid md:grid-cols-2 gap-12 md:gap-16">
            <div>
              <p className="text-xs tracking-ultra uppercase text-red-500 mb-4">Who we're after</p>
              <h2 className="font-display text-4xl md:text-5xl text-white leading-none mb-6">THE DRUMMER</h2>
              <div className="section-divider" style={{ margin: '0 0 1.5rem' }} />
              <ul className="space-y-4">
                {lookingFor.map((item) => (
                  <li key={item} className="flex gap-4 text-zinc-400 font-light leading-relaxed">
                    <span className="mt-2.5 w-1.5 h-1.5 bg-red-700 shrink-0" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <p className="text-xs tracking-ultra uppercase text-red-500 mb-4">What you're joining</p>
              <h2 className="font-display text-4xl md:text-5xl text-white leading-none mb-6">THE BAND</h2>
              <div className="section-divider" style={{ margin: '0 0 1.5rem' }} />
              <ul className="space-y-4">
                {whatYouGet.map((item) => (
                  <li key={item} className="flex gap-4 text-zinc-400 font-light leading-relaxed">
                    <span className="mt-2.5 w-1.5 h-1.5 bg-red-700 shrink-0" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
              <p className="mt-8 text-sm text-zinc-500 leading-relaxed">
                Desire X formed in Bristol in 2024 around songwriter and vocalist Adam Castelete, with Mike
                Castelete (guitar/bass) and Sonny Pritchard (guitar). Heavy riffs, big vocals, ambient
                edges.{' '}
                <a href="/" className="text-zinc-300 hover:text-white underline underline-offset-4">
                  Full story on the press kit
                </a>
                .
              </p>
            </div>
          </div>
        </section>

        {/* Listen */}
        <section id="listen" className="py-16 md:py-24 px-6 bg-zinc-950 scroll-mt-10">
          <div className="max-w-5xl mx-auto grid md:grid-cols-5 gap-10 items-center">
            <div className="md:col-span-2">
              <p className="text-xs tracking-ultra uppercase text-red-500 mb-4">Do your homework</p>
              <h2 className="font-display text-4xl md:text-5xl text-white leading-none mb-6">HEAR IT FIRST</h2>
              <div className="section-divider" style={{ margin: '0 0 1.5rem' }} />
              <p className="text-zinc-400 font-light leading-relaxed mb-6">
                Have a listen before you apply. Send us a clip of you playing one of ours if you fancy
                it, though it's not required.
              </p>
              <div className="flex flex-col gap-3">
                {[
                  { label: 'Spotify', href: SPOTIFY_URL },
                  { label: 'YouTube', href: YOUTUBE_URL },
                  { label: 'Instagram', href: INSTAGRAM_URL },
                ].map((l) => (
                  <a
                    key={l.label}
                    href={l.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 text-sm text-zinc-300 hover:text-white transition-colors"
                  >
                    <ExternalLink size={14} className="text-red-600" />
                    {l.label}
                  </a>
                ))}
              </div>
            </div>
            <div className="md:col-span-3">
              <iframe
                title="Desire X on Spotify"
                className="w-full spotify-frame"
                src={`https://open.spotify.com/embed/track/${FEATURED_TRACK_ID}?utm_source=generator&theme=0`}
                width="100%"
                height="352"
                frameBorder="0"
                allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"
                loading="lazy"
              />
            </div>
          </div>
        </section>

        {/* Apply */}
        <section id="apply" className="relative py-16 md:py-28 px-6 bg-black scroll-mt-6">
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,rgba(185,28,28,0.12)_0%,transparent_60%)] pointer-events-none" />
          <div className="relative max-w-3xl mx-auto">
            <div className="text-center mb-10 md:mb-14">
              <p className="text-xs tracking-ultra uppercase text-red-500 mb-4">Apply</p>
              <h2 className="font-display text-5xl md:text-7xl text-white leading-none mb-4">SHOW US WHAT YOU'VE GOT</h2>
              <div className="section-divider" />
              <p className="text-zinc-400 font-light leading-relaxed max-w-xl mx-auto">
                Fill this in, drop a link to you playing, and we'll get back to you. Shortlisted
                drummers get a few tracks to learn and a jam in Bristol.
              </p>
            </div>
            <div className="relative">
              <ApplyForm />
            </div>
          </div>
        </section>
      </main>

      <footer className="py-10 px-6 bg-zinc-950 border-t border-white/5">
        <div className="max-w-5xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <a href="/" className="font-display text-xl tracking-ultra text-white hover:text-red-600 transition-colors">
            DESIRE X
          </a>
          <p className="text-xs text-zinc-600">© {new Date().getFullYear()} Desire X · Bristol, UK</p>
          <a href="/" className="text-xs tracking-widest uppercase text-zinc-500 hover:text-white transition-colors">
            Electronic Press Kit
          </a>
        </div>
      </footer>
    </>
  )
}
