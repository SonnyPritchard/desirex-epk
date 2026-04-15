# DesireX — Electronic Press Kit

Modern metal EPK site. Vite + React + TypeScript + Tailwind CSS.

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

## What to swap before going live

### 1. Biography copy
**File:** `src/components/About.tsx`
Find the three `<p>` blocks under `{/* TODO: Replace the bio */}` and replace with the real biography.

### 2. Stats (Monthly listeners, YouTube subs, tracks)
**File:** `src/components/About.tsx`
Update the `value` fields in the stats array at the bottom of the component.

### 3. Hero tagline
**File:** `src/components/Hero.tsx`
Replace `"Modern Metal · Intense Energy · Raw Emotion"` with the real tagline.

### 4. Hero background image
**File:** `src/components/Hero.tsx`
Uncomment the `<img>` tag and put the image at `/public/assets/hero-bg.jpg`.
Recommended: landscape, dark-toned photo, min 1920×1080.

### 5. Artist photo (About section)
**File:** `src/components/About.tsx`
Replace the placeholder `<div>` with:
```tsx
<img src="/assets/artist-photo.jpg" alt="DesireX" className="w-full aspect-[3/4] object-cover" />
```
Put the file at `/public/assets/artist-photo.jpg`. Portrait orientation, 3:4 ratio works best.

### 6. Music — track list
**File:** `src/components/Music.tsx`
Update the `tracks` array with real track names and Spotify track IDs (from URL: `open.spotify.com/track/TRACK_ID`).

### 7. Videos — YouTube IDs
**File:** `src/components/Video.tsx`
Update the `videoId` fields in the `videos` array. Get the ID from: `youtube.com/watch?v=VIDEO_ID`.

### 8. Press quotes
**File:** `src/components/Press.tsx`
Replace the placeholder quotes with real press mentions. Add the source URL if available.

### 9. Press photos
**File:** `src/components/Press.tsx`
Add filenames to the `photos` array (e.g. `['photo1.jpg', 'photo2.jpg']`).
Put the files at `/public/assets/press/`.

### 10. Show dates
**File:** `src/components/Shows.tsx`
Replace or extend the `dates` array. Set `ticketUrl` when tickets are live, `status: 'sold-out'` when sold out.

### 11. Contact emails ⚠️ PLACEHOLDER — must update before going live
**File:** `src/components/Contact.tsx`
Replace `BOOKING_EMAIL` (`booking@desirex.com`) and `PRESS_EMAIL` (`press@desirex.com`) with real addresses.
These are placeholder values — the form will not reach anyone until updated.
The form generates a `mailto:` link on submit — swap to Formspree/EmailJS for server-side delivery if preferred.

### 12. Page meta / OG image
**File:** `index.html`
Add `<meta property="og:image" content="/assets/og-image.jpg" />` once you have a share image.

---

## File structure

```
src/
  components/
    Nav.tsx         sticky top nav, mobile hamburger
    Hero.tsx        full-screen landing with CTAs
    About.tsx       bio + artist photo + stats
    Music.tsx       Spotify embed + track list
    Video.tsx       YouTube embeds
    Press.tsx       press quotes + photo gallery
    Shows.tsx       tour dates + booking CTA
    Contact.tsx     social links + inquiry form
    Footer.tsx      logo, nav links, social icons
  index.css         Tailwind base + global styles (fonts, scrollbar, noise)
  App.tsx           top-level layout

public/
  assets/           put all images here
    press/          press photos subfolder
```

---

## Social links

| Platform  | URL |
|-----------|-----|
| Instagram | https://www.instagram.com/desirexofficial/ |
| YouTube   | https://www.youtube.com/@desirexofficial |
| Spotify   | https://open.spotify.com/artist/45K51OH61Q78kAmZQVqwO4 |
