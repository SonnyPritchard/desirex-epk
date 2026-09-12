#!/usr/bin/env python3
"""
Regenerate the Desire X booking one-pager (A4 PDF) from the assets in this repo.

    python3 press-kit/build.py

Writes public/assets/Desire-X-Press-Kit.pdf, which is served at
https://desirex.co.uk/assets/Desire-X-Press-Kit.pdf once deployed.

Needs: Pillow (pip install Pillow) and a Chromium/Chrome binary. Fonts are
pulled from Google Fonts once and embedded, so the PDF renders identically
anywhere. Edit the copy in HTML below — the stats and track list are the bits
that go stale.
"""
import base64, io, os, pathlib, re, shutil, subprocess, sys, urllib.request

ROOT   = pathlib.Path(__file__).resolve().parent.parent
ASSETS = ROOT / "public" / "assets"
OUT    = ASSETS / "Desire-X-Press-Kit.pdf"

FONT_CSS = ("https://fonts.googleapis.com/css2"
            "?family=Bebas+Neue&family=Inter:wght@300;400;500;600;700&display=swap")
KEEP_FACES = {("Bebas Neue", "400"), ("Inter", "300"), ("Inter", "500"), ("Inter", "600")}

UA = {"User-Agent": "Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 Chrome/120 Safari/537.36"}


def find_chrome():
    for name in ("chromium", "chromium-browser", "google-chrome", "google-chrome-stable"):
        p = shutil.which(name)
        if p:
            return p
    for p in sorted(pathlib.Path("/opt/pw-browsers").glob("chromium-*/chrome-linux/chrome")):
        return str(p)
    sys.exit("No Chromium/Chrome binary found — install one or set it on PATH.")


def embed_fonts():
    """Download the latin subsets we use and inline them as base64 @font-face rules."""
    css = urllib.request.urlopen(urllib.request.Request(FONT_CSS, headers=UA), timeout=30).read().decode()
    blocks, out = re.split(r"/\*\s*([a-z0-9\-\[\]]+)\s*\*/", css), []
    for i in range(1, len(blocks) - 1, 2):
        if blocks[i] != "latin":
            continue
        body = blocks[i + 1]
        fam = re.search(r"font-family:\s*'([^']+)'", body)
        wt  = re.search(r"font-weight:\s*(\d+)", body)
        url = re.search(r"url\((https://[^)]+\.woff2)\)", body)
        if not (fam and wt and url) or (fam.group(1), wt.group(1)) not in KEEP_FACES:
            continue
        data = urllib.request.urlopen(urllib.request.Request(url.group(1), headers=UA), timeout=30).read()
        out.append(
            f"@font-face{{font-family:'{fam.group(1)}';font-style:normal;font-weight:{wt.group(1)};"
            f"font-display:block;src:url(data:font/woff2;base64,{base64.b64encode(data).decode()}) format('woff2');}}"
        )
    return "\n".join(out)


def jpeg(path, box, quality=82):
    from PIL import Image
    im = Image.open(path).convert("RGB")
    im.thumbnail(box, Image.LANCZOS)
    buf = io.BytesIO()
    im.save(buf, "JPEG", quality=quality, optimize=True, progressive=True)
    return "data:image/jpeg;base64," + base64.b64encode(buf.getvalue()).decode()


def png(path, box):
    from PIL import Image
    im = Image.open(path).convert("RGBA")
    im.thumbnail(box, Image.LANCZOS)
    buf = io.BytesIO()
    im.save(buf, "PNG", optimize=True)
    return "data:image/png;base64," + base64.b64encode(buf.getvalue()).decode()


HTML = r"""<!doctype html>
<html lang="en"><head><meta charset="utf-8"><title>Desire X — Press Kit</title>
<style>
__FONTS__
@page { size: A4; margin: 0; }
* { margin:0; padding:0; box-sizing:border-box; }
html, body { width:210mm; height:297mm; }
body {
  background:#080808; color:#e5e5e5;
  font-family:'Inter',sans-serif; font-weight:300;
  -webkit-print-color-adjust:exact; print-color-adjust:exact;
  overflow:hidden;
}
.display { font-family:'Bebas Neue',sans-serif; font-weight:400; letter-spacing:.02em; }
.label {
  font-size:6.2pt; letter-spacing:.28em; text-transform:uppercase;
  color:#ef4444; font-weight:600;
}
.rule { height:1px; background:linear-gradient(90deg,#b91c1c,rgba(185,28,28,0)); margin:5pt 0 9pt; }

/* ---------- header ---------- */
header { padding:13mm 13mm 0; display:flex; justify-content:space-between; align-items:flex-end; }
header img { width:47mm; display:block; }
.head-meta { text-align:right; font-size:7pt; line-height:1.75; color:#a1a1aa; letter-spacing:.055em; }
.head-meta .strong { color:#fff; font-weight:500; }

/* ---------- banner ---------- */
.banner { margin:7mm 13mm 0; height:54mm; overflow:hidden; position:relative; border:1px solid rgba(185,28,28,.28); }
.banner img { width:100%; height:100%; object-fit:cover; object-position:center 34%; display:block; }
.banner::after {
  content:''; position:absolute; inset:0;
  background:linear-gradient(180deg,rgba(8,8,8,.30) 0%,rgba(8,8,8,0) 42%,rgba(8,8,8,.82) 100%);
}
.banner-cap {
  position:absolute; left:5mm; bottom:3.6mm; z-index:2;
  font-size:6pt; letter-spacing:.24em; text-transform:uppercase; color:#d4d4d8; font-weight:500;
}

/* ---------- body grid ---------- */
main { display:grid; grid-template-columns:1fr 62mm; gap:9mm; padding:7mm 13mm 0; }
h2.sec { font-size:15pt; line-height:1; color:#fff; }
p { font-size:8.1pt; line-height:1.62; color:#a1a1aa; }
p + p { margin-top:5pt; }
em { color:#e4e4e7; font-style:italic; }
.block + .block { margin-top:7mm; }

.quote { border-left:2px solid #b91c1c; padding-left:4.5mm; margin:0 0 6.5mm; }
.quote p { font-size:9.4pt; line-height:1.45; color:#fff; font-style:italic; font-weight:300; }

.facts { list-style:none; }
.facts li {
  font-size:7.6pt; color:#a1a1aa; line-height:1.45;
  padding:3.4pt 0 3.4pt 7.5pt; border-bottom:1px solid rgba(255,255,255,.055); position:relative;
}
.facts li:last-child { border-bottom:0; }
.facts li::before { content:''; position:absolute; left:0; top:8.2pt; width:3pt; height:1px; background:#b91c1c; }
.facts strong { color:#fff; font-weight:500; }

/* ---------- right column ---------- */
.stats { display:grid; grid-template-columns:1fr 1fr; gap:4mm 3mm; }
.stat .n { font-size:20pt; line-height:.92; color:#ef4444; }
.stat .l { font-size:5.6pt; letter-spacing:.19em; text-transform:uppercase; color:#71717a; margin-top:2.2pt; }

.tracks { list-style:none; }
.tracks li {
  display:flex; align-items:baseline; gap:4pt;
  font-size:7.6pt; color:#d4d4d8; padding:2.9pt 0;
  border-bottom:1px solid rgba(255,255,255,.055);
}
.tracks li:last-child { border-bottom:0; }
.tracks .num { font-family:'Bebas Neue',sans-serif; font-size:9pt; color:#3f3f46; width:11pt; flex:none; }
.tracks .yr { margin-left:auto; font-size:6pt; letter-spacing:.14em; text-transform:uppercase; color:#71717a; }

.links { list-style:none; }
.links li { font-size:7.3pt; padding:3pt 0; border-bottom:1px solid rgba(255,255,255,.055); display:flex; gap:5pt; }
.links li:last-child { border-bottom:0; }
.links .k { color:#71717a; letter-spacing:.12em; text-transform:uppercase; font-size:5.4pt; width:42pt; flex:none; padding-top:1.4pt; }
.links a { color:#e4e4e7; text-decoration:none; word-break:break-all; }

/* full-width live strip above the footer */
.strip { margin:8mm 13mm 0; }
.strip-inner { width:100%; display:grid; grid-template-columns:repeat(3,1fr); gap:3mm; }
.strip img { width:100%; height:34.5mm; object-fit:cover; display:block;
  filter:grayscale(.3) contrast(1.06); border:1px solid rgba(255,255,255,.08); }

/* ---------- footer ---------- */
footer {
  margin:8mm 13mm 0; padding:4.5mm 0 0; border-top:1px solid rgba(255,255,255,.09);
  display:flex; justify-content:space-between; align-items:center;
}
.cta { font-size:7.4pt; color:#a1a1aa; letter-spacing:.05em; }
.cta a { color:#fff; text-decoration:none; font-weight:500; }
.cta .em { color:#ef4444; }
footer .display { font-size:11pt; color:#27272a; letter-spacing:.3em; }
</style></head>
<body>

<header>
  <img src="__LOGO__" alt="Desire X">
  <div class="head-meta">
    <div class="strong">Alternative Rock &middot; Bristol, UK</div>
    <div>Press kit &middot; September 2026</div>
  </div>
</header>

<div class="banner">
  <img src="__BANNER__" alt="Desire X live">
  <div class="banner-cap">Live &mdash; Bristol</div>
</div>

<main>
  <div>
    <div class="block">
      <div class="quote">
        <p>&ldquo;If I die from the weight of my regrets, would I still ascend
        with a broken soul made up of sins?&rdquo;</p>
      </div>

      <div class="label">About</div>
      <h2 class="sec display">THE BAND</h2>
      <div class="rule"></div>
      <p>Desire X are an alternative rock band from Bristol, formed in 2024 by
      songwriter and vocalist <strong style="color:#e4e4e7;font-weight:500">Adam Castelete</strong>,
      with <strong style="color:#e4e4e7;font-weight:500">Mike Castelete</strong> (guitar/bass) and
      <strong style="color:#e4e4e7;font-weight:500">Sonny Pritchard</strong> (guitar).</p>
      <p>Their sound works the balance between intensely passionate vocals, heavy
      riffs and ambient soundscapes &mdash; six singles deep, with <em>Repair</em> past
      30,000 streams and <em>Break the Chain</em> past 25,000.</p>
      <p>Recent Bristol shows at The Fleece and Exchange have grown the band locally
      and built a reputation as a hard-hitting live act.</p>
    </div>

    <div class="block">
      <div class="label">On stage</div>
      <h2 class="sec display">LIVE</h2>
      <div class="rule"></div>
      <ul class="facts">
        <li><strong>Played:</strong> The Fleece, Bristol &middot; Exchange, Bristol</li>
        <li><strong>Draw:</strong> established local following in Bristol and the South West</li>
        <li><strong>Looking for:</strong> support slots, multi-band bills and festival dates</li>
        <li><strong>Travel:</strong> Bristol-based, touring the South West and wider UK</li>
        <li><strong>Set length:</strong> flexible &mdash; 25 to 45 minutes</li>
        <li><strong>Full EPK:</strong> streaming, live video and hi-res shots at desirex.co.uk</li>
      </ul>
    </div>
  </div>

  <aside>
    <div class="block">
      <div class="label">By the numbers</div>
      <div class="rule"></div>
      <div class="stats">
        <div class="stat"><div class="n display">7.1K</div><div class="l">Monthly listeners</div></div>
        <div class="stat"><div class="n display">55K+</div><div class="l">Streams, top 2 singles</div></div>
        <div class="stat"><div class="n display">1.1K</div><div class="l">Instagram</div></div>
        <div class="stat"><div class="n display">6</div><div class="l">Singles released</div></div>
      </div>
    </div>

    <div class="block">
      <div class="label">Discography</div>
      <div class="rule"></div>
      <ul class="tracks">
        <li><span class="num">01</span> Hold On<span class="yr">Single</span></li>
        <li><span class="num">02</span> Break the Chain<span class="yr">25K+</span></li>
        <li><span class="num">03</span> Repair<span class="yr">30K+</span></li>
        <li><span class="num">04</span> Remade<span class="yr">Single</span></li>
        <li><span class="num">05</span> No Miracle<span class="yr">Single</span></li>
        <li><span class="num">06</span> Warrior<span class="yr">Single</span></li>
      </ul>
    </div>

    <div class="block">
      <div class="label">Listen &amp; watch</div>
      <div class="rule"></div>
      <ul class="links">
        <li><span class="k">Web</span><a href="https://desirex.co.uk">desirex.co.uk</a></li>
        <li><span class="k">Spotify</span><a href="https://open.spotify.com/artist/45K51OH61Q78kAmZQVqwO4">Desire X &mdash; full discography</a></li>
        <li><span class="k">Instagram</span><a href="https://www.instagram.com/desirexofficial/">@desirexofficial</a></li>
        <li><span class="k">YouTube</span><a href="https://www.youtube.com/@desirexofficial">@desirexofficial</a></li>
      </ul>
    </div>

  </aside>
</main>

<div class="strip"><div class="strip-inner">
  <img src="__SHOT1__" alt="Desire X live">
  <img src="__SHOT2__" alt="Desire X live">
  <img src="__SHOT3__" alt="Desire X live">
</div></div>

<footer>
  <div class="cta">Booking &amp; press &mdash;
    <a href="mailto:booking@desirex.co.uk">booking@desirex.co.uk</a>
    <span class="em">&middot;</span> <a href="https://desirex.co.uk">desirex.co.uk</a></div>
  <div class="display">DESIRE X</div>
</footer>

</body></html>"""


def main():
    html = (HTML
            .replace("__FONTS__",  embed_fonts())
            .replace("__LOGO__",   png(ASSETS / "desirex-header.png", (900, 900)))
            .replace("__BANNER__", jpeg(ASSETS / "gallery/live-3.jpg", (1200, 1200)))
            .replace("__SHOT1__",  jpeg(ASSETS / "gallery/live-1.jpg", (460, 460)))
            .replace("__SHOT2__",  jpeg(ASSETS / "gallery/live-4.jpg", (460, 460)))
            .replace("__SHOT3__",  jpeg(ASSETS / "gallery/live-5.jpg", (460, 460))))

    tmp = ROOT / "press-kit" / ".epk.tmp.html"
    tmp.write_text(html)
    try:
        subprocess.run([find_chrome(), "--headless", "--disable-gpu", "--no-sandbox",
                        "--no-pdf-header-footer", f"--print-to-pdf={OUT}",
                        "--virtual-time-budget=10000", str(tmp)],
                       check=True, stdout=subprocess.DEVNULL, stderr=subprocess.DEVNULL)
    finally:
        tmp.unlink(missing_ok=True)

    pages = len(re.findall(rb"/Type\s*/Page[^s]", OUT.read_bytes()))
    print(f"{OUT.relative_to(ROOT)} — {pages} page, {OUT.stat().st_size / 1024:.0f} KB")
    if pages != 1:
        sys.exit(f"Expected a single page, got {pages}. Trim the copy and re-run.")


if __name__ == "__main__":
    main()
