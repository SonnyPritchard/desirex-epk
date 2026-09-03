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

A standalone landing page for Meta ads with a lead capture form and video upload:
`https://desirex.co.uk/drums` (and `/apply`). It's a second Vite entry
(`drums.html` → `src/drums/`) so it has its own title and Open Graph tags for the ad link preview.

Because GitHub Pages is static, the form posts to a small **Cloudflare Worker** in
[`/worker`](worker/) that stores each application and any uploaded clips in **R2** (Cloudflare's
file storage) and emails the band through **Resend**. Free tiers cover all of it.

```
Applicant  ──►  desirex.co.uk/drums (GitHub Pages)
                    │  POST application, PUT files, POST submit
                    ▼
                Cloudflare Worker (worker/)
                    ├── R2 bucket: applications/<id>.json + uploads/<id>/…
                    └── Resend ──► drums@desirex.co.uk   (+ confirmation to applicant)
```

### One-time setup

**1. Resend** (https://resend.com)
- Add and verify the domain `desirex.co.uk` (Resend gives you DNS records to add — SPF/DKIM TXT records; add them wherever the domain's DNS lives).
- Create an API key with sending permission.
- Sending from `drums@desirex.co.uk` needs no mailbox — but make sure `drums@desirex.co.uk` exists as an **alias** in Google Workspace so replies and the notifications land in the inbox.

**2. Cloudflare** (https://dash.cloudflare.com — free account is fine)
```bash
cd worker
npm install
npx wrangler login
npx wrangler r2 bucket create desirex-applications
npx wrangler secret put RESEND_API_KEY        # paste the Resend key
npm run deploy
```
`wrangler deploy` prints the worker URL, e.g. `https://desirex-apply.<your-subdomain>.workers.dev`.
Check it's alive: opening that URL should show `{"ok":true,"service":"desirex-apply"}`.

Config that isn't secret lives in `worker/wrangler.jsonc` (`FROM_EMAIL`, `NOTIFY_EMAIL`,
`ALLOWED_ORIGINS`). Change `NOTIFY_EMAIL` to whichever `@desirex.co.uk` alias you want.

**3. Point the site at the worker**
Either:
- GitHub → repo **Settings → Secrets and variables → Actions → Variables** → add
  `APPLY_API_URL` = the worker URL (no trailing slash). The Pages workflow passes it in as
  `VITE_APPLY_API_URL`. Re-run the deploy workflow once.
- or edit `DEFAULT_APPLY_API_URL` in `src/drums/config.ts`.

Until this is set the form shows "The form isn't connected yet" and points people at
`drums@desirex.co.uk` instead.

**4. Test it** — submit the form on the live page with a small clip. You should get the band
email (with a link to the uploaded file) and the applicant confirmation.

### Where applications live
- **Email**: one per application to `NOTIFY_EMAIL`, reply-to set to the applicant.
- **R2**: `applications/<id>.json` (all fields + email delivery status) and
  `uploads/<id>/…`. Browse them in the Cloudflare dashboard → R2 → `desirex-applications`.
  Uploaded files are served at `<worker-url>/files/<id>/<filename>`; the id is a random UUID so
  links are private to whoever has the email.
- Applications are stored even if the email fails, so nothing is lost — check the R2 bucket if in doubt.

### Limits & spam
- Up to 3 files per application, 100 MB each (Cloudflare's request size limit). Video, audio,
  images or PDF. Applicants can also paste links (YouTube/Instagram/Drive) instead.
- The form has a honeypot field. If Meta traffic brings bots, add
  [Cloudflare Turnstile](https://developers.cloudflare.com/turnstile/) or a rate-limiting rule on
  the worker.

### Editing the page
- Copy, bullets and stats: `src/drums/DrumsApp.tsx`
- Form fields: `src/drums/ApplyForm.tsx` (add the field to `ApplicationFields` in
  `src/drums/api.ts` and to the email in `worker/src/index.ts` too)
- Ad preview image: `og:image` in `drums.html` (currently the hero photo; swap for the poster once
  you have it — Meta likes 1200×630)
- Local dev: `npm run dev` then open `http://localhost:5173/drums`. For the API locally run
  `cd worker && cp .dev.vars.example .dev.vars && npm run dev` and set
  `VITE_APPLY_API_URL=http://localhost:8787` when starting Vite.

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
    ApplyForm.tsx   lead capture form + video upload
    api.ts          client for the worker API
    config.ts       worker URL + upload limits
worker/             Cloudflare Worker: stores applications in R2, emails via Resend

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
