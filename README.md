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

### 9. Contact emails ⚠️ PLACEHOLDER — must update before going live
**File:** `src/components/Contact.tsx`
Replace `BOOKING_EMAIL` (`booking@desirex.com`) and `PRESS_EMAIL` (`press@desirex.com`) with real addresses.
These are placeholder values — the form will not reach anyone until updated.
The form generates a `mailto:` link on submit — swap to Formspree/EmailJS for server-side delivery if preferred.

### 10. Page OG image
**File:** `index.html`
Add `<meta property="og:image" content="/assets/og-image.jpg" />` once you have a share image (used for link previews on social).

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
    Press.tsx       press quotes + photo gallery
    Shows.tsx       tour dates + booking CTA
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
