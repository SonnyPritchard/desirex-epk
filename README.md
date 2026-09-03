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
**File:** `index.html`
Add `<meta property="og:image" content="/assets/og-image.jpg" />` once you have a share image (used for link previews on social).

---

## Drummer recruitment page — `/drums` (alias `/apply`)

A standalone landing page for Meta ads with a lead capture form:
`https://desirex.co.uk/drums/` (and `/apply/`). Use the trailing-slash URL in the ad.
It's a second Vite entry (`drums.html` → `src/drums/`) so it has its own title and Open Graph tags
for the ad link preview.

The form posts to **FormSubmit** (https://formsubmit.co) via AJAX — the same service as the EPK
contact form — so there's no backend and nothing to deploy. Each application arrives as an email
with subject `Drummer application: <name> (<location>)`, reply-to set to the applicant.

### Where applications go
**File:** `src/drums/config.ts` — `APPLY_EMAIL`, currently `booking@desirex.co.uk` (already
activated with FormSubmit, so it works immediately). To use another alias such as
`drums@desirex.co.uk`, change that one line: FormSubmit will email the new address once asking you
to confirm it, and holds the first submission until you click the link. All aliases land in the
same Google Workspace inbox anyway. Missed an email? FormSubmit keeps 30 days of submissions in its archive.

### Video clips
FormSubmit caps attachments at 10 MB per submission and doesn't retain them, which rules out direct
video upload. The form asks for links instead (required) and tells applicants how: upload to YouTube
as Unlisted, Google Drive, Dropbox or WeTransfer, or share a public Instagram/TikTok post.

### Spam
The form includes FormSubmit's `_honey` honeypot field. reCAPTCHA is disabled (`_captcha=false`) so
the submit stays on-page; if ad traffic brings bots, remove that line in `src/drums/ApplyForm.tsx`
or add a `_blacklist` of phrases (see the FormSubmit docs).

### Editing the page
- Copy, bullets and stats: `src/drums/DrumsApp.tsx`
- Form fields: `src/drums/ApplyForm.tsx` — field `name` attributes become the row labels in the email
- Ad preview image: `og:image` in `drums.html` (currently the hero photo; swap for the poster once
  you have it — Meta likes 1200×630)
- Local dev: `npm run dev` then open `http://localhost:5173/drums`

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
  drums.tsx         entry for the /drums landing page
  drums/
    DrumsApp.tsx    drummer recruitment landing page
    ApplyForm.tsx   lead capture form (FormSubmit)
    config.ts       destination email for applications

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
