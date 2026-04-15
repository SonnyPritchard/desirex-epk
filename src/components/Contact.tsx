import { Mail } from 'lucide-react'

/*
  TODO: Replace BOOKING_EMAIL and PRESS_EMAIL with real contact addresses.
  Optional: wire the form to a service like Formspree, EmailJS, or a backend.
  For now the form links to the mailto address on submit — swap if needed.
*/
const BOOKING_EMAIL = 'booking@desirex.com'    // TODO: Replace
const PRESS_EMAIL   = 'press@desirex.com'      // TODO: Replace

const InstagramIcon = () => (
  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect x="2" y="2" width="20" height="20" rx="5" ry="5"/>
    <circle cx="12" cy="12" r="4"/>
    <circle cx="17.5" cy="6.5" r="1.5" fill="currentColor" stroke="none"/>
  </svg>
)

const YoutubeIcon = () => (
  <svg width="15" height="15" viewBox="0 0 24 24" fill="currentColor">
    <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
  </svg>
)

const SpotifyIcon = () => (
  <svg width="15" height="15" viewBox="0 0 24 24" fill="currentColor">
    <path d="M12 0C5.4 0 0 5.4 0 12s5.4 12 12 12 12-5.4 12-12S18.66 0 12 0zm5.521 17.34c-.24.359-.66.48-1.021.24-2.82-1.74-6.36-2.101-10.561-1.141-.418.122-.779-.179-.899-.539-.12-.421.18-.78.54-.9 4.56-1.021 8.52-.6 11.64 1.32.42.18.479.659.301 1.02zm1.44-3.3c-.301.42-.841.6-1.262.3-3.239-1.98-8.159-2.58-11.939-1.38-.479.12-1.02-.12-1.14-.6-.12-.48.12-1.021.6-1.141C9.6 9.9 15 10.561 18.72 12.84c.361.181.54.78.241 1.2zm.12-3.36C15.24 8.4 8.82 8.16 5.16 9.301c-.6.179-1.2-.181-1.38-.721-.18-.601.18-1.2.72-1.381 4.26-1.26 11.28-1.02 15.721 1.621.539.3.719 1.02.419 1.56-.299.421-1.02.599-1.559.3z"/>
  </svg>
)

const social = [
  {
    name: 'Instagram',
    handle: '@desirexofficial',
    url: 'https://www.instagram.com/desirexofficial/',
    Icon: InstagramIcon,
  },
  {
    name: 'YouTube',
    handle: '@desirexofficial',
    url: 'https://www.youtube.com/@desirexofficial',
    Icon: YoutubeIcon,
  },
  {
    name: 'Spotify',
    handle: 'DesireX',
    url: 'https://open.spotify.com/artist/45K51OH61Q78kAmZQVqwO4',
    Icon: SpotifyIcon,
  },
]

export default function Contact() {
  return (
    <section id="contact" className="py-28 px-6 bg-black">
      <div className="max-w-7xl mx-auto">
        {/* Section header */}
        <div className="text-center mb-16">
          <p className="text-xs tracking-ultra uppercase text-red-500 mb-4">Get in Touch</p>
          <h2 className="font-display text-5xl md:text-7xl text-white mb-4 leading-none">CONTACT</h2>
          <div className="section-divider" />
        </div>

        <div className="grid lg:grid-cols-2 gap-16 max-w-5xl mx-auto">
          {/* Left — info */}
          <div className="space-y-10">
            {/* Booking */}
            <div>
              <p className="text-xs tracking-ultra uppercase text-red-500 mb-3">Booking</p>
              <a
                href={`mailto:${BOOKING_EMAIL}`}
                className="flex items-center gap-3 text-zinc-300 hover:text-white transition-colors group"
              >
                <Mail size={16} className="text-red-600 shrink-0" />
                <span className="text-sm group-hover:underline underline-offset-4">{BOOKING_EMAIL}</span>
              </a>
              <p className="text-xs text-zinc-600 mt-2 leading-relaxed">
                For live bookings, festival slots, tours, and collaborations.
              </p>
            </div>

            {/* Press */}
            <div>
              <p className="text-xs tracking-ultra uppercase text-red-500 mb-3">Press & Media</p>
              <a
                href={`mailto:${PRESS_EMAIL}`}
                className="flex items-center gap-3 text-zinc-300 hover:text-white transition-colors group"
              >
                <Mail size={16} className="text-red-600 shrink-0" />
                <span className="text-sm group-hover:underline underline-offset-4">{PRESS_EMAIL}</span>
              </a>
              <p className="text-xs text-zinc-600 mt-2 leading-relaxed">
                Hi-res photos, interview requests, and press materials.
              </p>
            </div>

            {/* Social */}
            <div>
              <p className="text-xs tracking-ultra uppercase text-red-500 mb-4">Follow</p>
              <div className="space-y-3">
                {social.map((s) => (
                  <a
                    key={s.name}
                    href={s.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-4 group"
                  >
                    <div className="w-9 h-9 border border-white/10 group-hover:border-red-700 flex items-center justify-center transition-colors shrink-0">
                      <span className="text-zinc-400 group-hover:text-red-500 transition-colors">
                        <s.Icon />
                      </span>
                    </div>
                    <div>
                      <p className="text-xs text-zinc-500 tracking-widest uppercase">{s.name}</p>
                      <p className="text-sm text-zinc-300 group-hover:text-white transition-colors">
                        {s.handle}
                      </p>
                    </div>
                  </a>
                ))}
              </div>
            </div>
          </div>

          {/* Right — inquiry form */}
          <div>
            <p className="text-xs tracking-ultra uppercase text-red-500 mb-6">Send a Message</p>
            <form
              onSubmit={(e) => {
                e.preventDefault()
                const data = new FormData(e.currentTarget)
                const subjectValue = String(data.get('subject') || 'General')
                const isPress = subjectValue === 'Press / Interview'
                const recipient = isPress ? PRESS_EMAIL : BOOKING_EMAIL
                const subject = encodeURIComponent(`EPK Inquiry: ${subjectValue}`)
                const body = encodeURIComponent(
                  `Name: ${data.get('name')}\nEmail: ${data.get('email')}\n\n${data.get('message')}`
                )
                window.location.href = `mailto:${recipient}?subject=${subject}&body=${body}`
              }}
              className="space-y-4"
            >
              <div className="grid sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs tracking-widest uppercase text-zinc-500 mb-2">Name</label>
                  <input
                    name="name"
                    type="text"
                    required
                    placeholder="Your name"
                    className="w-full bg-zinc-900 border border-white/10 focus:border-red-700 text-white text-sm px-4 py-3 outline-none transition-colors placeholder:text-zinc-600"
                  />
                </div>
                <div>
                  <label className="block text-xs tracking-widest uppercase text-zinc-500 mb-2">Email</label>
                  <input
                    name="email"
                    type="email"
                    required
                    placeholder="your@email.com"
                    className="w-full bg-zinc-900 border border-white/10 focus:border-red-700 text-white text-sm px-4 py-3 outline-none transition-colors placeholder:text-zinc-600"
                  />
                </div>
              </div>
              <div>
                <label className="block text-xs tracking-widest uppercase text-zinc-500 mb-2">Subject</label>
                <select
                  name="subject"
                  className="w-full bg-zinc-900 border border-white/10 focus:border-red-700 text-zinc-300 text-sm px-4 py-3 outline-none transition-colors"
                >
                  <option value="Booking Inquiry" className="bg-zinc-900">Booking Inquiry</option>
                  <option value="Press / Interview" className="bg-zinc-900">Press / Interview</option>
                  <option value="Collaboration" className="bg-zinc-900">Collaboration</option>
                  <option value="General" className="bg-zinc-900">General</option>
                </select>
              </div>
              <div>
                <label className="block text-xs tracking-widest uppercase text-zinc-500 mb-2">Message</label>
                <textarea
                  name="message"
                  required
                  rows={6}
                  placeholder="Your message..."
                  className="w-full bg-zinc-900 border border-white/10 focus:border-red-700 text-white text-sm px-4 py-3 outline-none transition-colors placeholder:text-zinc-600 resize-none"
                />
              </div>
              <button
                type="submit"
                className="w-full py-4 bg-red-700 hover:bg-red-600 text-white text-xs tracking-widest uppercase font-medium transition-colors"
              >
                Send Message
              </button>
            </form>
          </div>
        </div>
      </div>
    </section>
  )
}
