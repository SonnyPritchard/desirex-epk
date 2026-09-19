# Desire X — Electronic Press Kit

Alt rock EPK site for Desire X (Bristol, UK). Vite + React + TypeScript + Tailwind CSS.

---

## Run locally

```bash
cd projects/desirex-epk
npm install
npm run dev
```

Opens at `http://localhost:5173`

### Production build

```bash
npm run build      # outputs to /dist
npm run preview    # preview the built site locally
```

---

## What to update before going live

### 1. Biography copy
**File:** `src/components/About.tsx`
Replace the three placeholder `<p>` blocks with the full artist biography.

### 2. Stats
**File:** `src/components/About.tsx`
The stats row currently shows sourced values (7.1K listeners, 1.1K Instagram). Update as numbers grow.

### 3. Hero background image
**File:** `src/components/Hero.tsx`
The artist photo from Spotify is used as the hero background at low opacity. To replace with a dedicated full-width shot, swap the `<img src="/assets/artist-photo.jpg" ...>` for a new file at `/public/assets/hero-bg.jpg` and update the `src` attribute.

### 4. Artist photo (About section)
**File:** `src/components/About.tsx`
Currently using `/assets/artist-photo.jpg` (the Spotify press image). Replace with a higher-res or different photo by swapping the file at `/public/assets/artist-photo.jpg`.

### 5. Videos — YouTube IDs
**File:** `src/components/Video.tsx`
Set the `videoId` fields in the `videos` array. Get the ID from: `youtube.com/watch?v=VIDEO_ID`.

### 6. Press quotes
**File:** `src/components/Press.tsx`
Replace the placeholder quotes with real press mentions. Set `url` to the source article if available.

### 7. Press photos
**File:** `src/components/Press.tsx`
Add filenames to the `photos` array (e.g. `['photo1.jpg', 'photo2.jpg']`).
Put the files at `/public/assets/press/`.

### 8. Show dates
**File:** `src/components/Shows.tsx`
The Fleece (Bristol, 18 Jul) is already listed. Add `ticketUrl` when tickets go live, or add more dates to the `dates` array.

### 9. Contact emails
**File:** `src/components/Contact.tsx`
`BOOKING_EMAIL` is `booking@desirex.co.uk`; the contact form posts through formsubmit.co to that address.

### 10. Page OG image
**Done.** `index.html` points at `/assets/og-image.jpg` (1200x630) for link previews. Regenerate it
if the band photo changes.

---

## `/drums` and `/apply` — retired

These URLs were the drummer recruitment landing page. The band are a full four-piece now, so
`drums.html` is a redirect stub that sends visitors to the homepage. The URLs stay alive
(rather than 404ing) because they were used in Meta ads and shared links.

The page is `noindex` so the old "Drummer Wanted" title drops out of Google, and its canonical
points at the homepage.

If the search ever restarts, the original React page (`src/drums/` — landing copy, application
form, FormSubmit wiring) is recoverable from git history at commit `295f381`.

---

## File structure

```
src/
  components/
    Nav.tsx         sticky top nav, mobile hamburger
    Hero.tsx        full-screen landing with CTAs
    About.tsx       bio + artist photo + stats
    Music.tsx       Spotify embed + 5 real tracks
    Video.tsx       YouTube embeds (IDs needed)
    Press.tsx       press photo grid (hidden until photos are added)
    Shows.tsx       tour dates, auto-split into upcoming / past
    Booking.tsx     booking + technical details for promoters
    Contact.tsx     social links + inquiry form
    Footer.tsx      logo, nav links, social icons
  index.css         Tailwind base + global styles
  App.tsx           top-level layout

public/
  assets/
    artist-photo.jpg   Spotify press image (in use)
    press/             add press photos here
```

---

## Social links

| Platform  | URL |
|-----------|-----|
| Instagram | https://www.instagram.com/desirexofficial/ |
| YouTube   | https://www.youtube.com/@desirexofficial |
| Spotify   | https://open.spotify.com/artist/45K51OH61Q78kAmZQVqwO4 |
