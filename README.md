# Sujal Pareek — Portfolio

A single-page personal portfolio built as a static site. Editorial/print-inspired
design system, React + Vite, deployable to Vercel with zero configuration.

**Live sections:** Hero · Summary · Experience · Selected Work · Recognition ·
Certifications · Competitive Programming · Contact

---

## Quick start

```bash
npm install
```

```bash
npm run dev
```

Then open http://localhost:5173.

| Script            | What it does                                     |
| ----------------- | ------------------------------------------------ |
| `npm run dev`     | Vite dev server with HMR                         |
| `npm run build`   | Production build into `dist/`                    |
| `npm run preview` | Serve the built `dist/` locally on port 4173     |

Requires Node 18+ (built and verified on Node 22).

---

## Before you deploy — two things to do

### 1. Add your résumé

Drop your PDF at exactly this path:

```
public/resume.pdf
```

Everything already points at `/resume.pdf` — the nav button, the hero CTA, the
contact ledger, the footer, and the no-JavaScript fallback. No code changes
needed. You can delete `public/README-resume.txt` afterwards.

### 2. If the domain ever changes

The site is currently pinned to `https://portfoliosujal-gamma.vercel.app`. If
you add a custom domain, search-and-replace that origin in three files:

- `index.html` — `<link rel="canonical">`, `og:url`, `og:image`, `twitter:image`, JSON-LD `url`
- `public/robots.txt` — the `Sitemap:` line
- `public/sitemap.xml` — the `<loc>` value

Open Graph images must be absolute URLs, so link previews on LinkedIn, Slack and
WhatsApp break silently if this is stale — the tags keep pointing at a host that
returns 404 and the preview renders with no image.

---

## Deploy to Vercel

No `vercel.json` is needed. The site is a single page with no client-side
router, so there are no rewrites to configure — Vercel auto-detects Vite and the
defaults are already correct.

### Option A — Git (recommended)

1. Push this folder to a GitHub repository.
2. Go to [vercel.com/new](https://vercel.com/new) and import that repository.
3. Confirm the auto-detected settings and deploy:
   - **Framework preset:** Vite
   - **Build command:** `npm run build`
   - **Output directory:** `dist`
   - **Install command:** `npm install`
4. Every push to the default branch redeploys automatically.

### Option B — CLI

```bash
npx vercel --prod
```

Accept the detected Vite settings when prompted.

---

## Project structure

```
.
├─ index.html                 # SEO meta, Open Graph, JSON-LD, no-JS fallback,
│                             # and the pre-paint theme script
├─ vite.config.js             # Build config + vendor chunk splitting
├─ public/
│  ├─ resume.pdf              # ← you add this
│  ├─ og.png                  # 1200×630 link-preview card
│  ├─ favicon.svg
│  ├─ robots.txt
│  ├─ sitemap.xml
│  └─ proof/                  # Everything the site shows as evidence
│     ├─ achievements/        # Event photos + scanned certificates (jpg)
│     │                       #   <slug>.jpg       full size, max 1600px
│     │                       #   <slug>-thumb.jpg grid size, max 900px
│     ├─ certs/               # Certificate + letter PDFs, opened in a new tab
│     └─ thumbs/              # PNG previews rendered from those PDFs
├─ assets-source/             # Your untouched originals. NOT deployed —
│                             # kept out of public/ so 3MB of duplicates
│                             # never ship. Safe to keep in git as a backup.
├─ scripts/
│  ├─ og-template.html        # Source for og.png — see "Regenerating og.png"
│  ├─ pdf-thumb.html          # pdf.js harness used by make-cert-thumbs
│  └─ make-cert-thumbs.mjs    # Renders certificate PDFs to PNG previews
└─ src/
   ├─ main.jsx
   ├─ App.jsx                 # Composition root only
   ├─ index.css               # Design tokens, reset, shared primitives
   ├─ data/                   # All copy lives here, not in components
   │  ├─ profile.js           # Name, summary, links, education, skills
   │  ├─ experience.js        # Roles + volunteer work
   │  ├─ projects.js          # Projects and their repo URLs
   │  ├─ achievements.js      # Awards, certifications, CP stats
   │  └─ sections.js          # Section order, numbering, nav labels
   ├─ hooks/
   │  ├─ useTheme.js          # Day/night edition with persistence
   │  ├─ useScrollSpy.js      # IntersectionObserver-based nav highlighting
   │  └─ useHashLanding.js    # Makes /#section deep links work in an SPA
   └─ components/             # One .jsx + one .module.css per component
      ├─ Nav.jsx              ├─ Achievements.jsx
      ├─ Hero.jsx             ├─ Certifications.jsx
      ├─ About.jsx            ├─ Competitive.jsx
      ├─ Experience.jsx       ├─ Contact.jsx
      ├─ Projects.jsx         ├─ Footer.jsx
      ├─ Section.jsx          ├─ Reveal.jsx
      ├─ Icons.jsx            ├─ SplitWords.jsx     (masked word reveal)
      ├─ CountUp.jsx          ├─ ScrollProgress.jsx
      ├─ CommandPalette.jsx   ├─ ProofSlider.jsx    (gallery carousel)
      └─ Lightbox.jsx
```

### Editing content

You should almost never need to touch a component to change what the site says.
All copy lives in `src/data/`. To add a project, append an object to the array in
`src/data/projects.js`:

```js
{
  id: 'my-project',
  name: 'My Project',
  domain: 'Full-stack platform',   // small label above the title
  primary: true,                    // true = "Selected Work", false = "Additional work"
  tagline: 'One sentence describing it.',
  stack: ['React', 'Node.js'],
  bullets: ['Impact point one.', 'Impact point two.'],
  repo: 'https://github.com/SujalP21/my-project',
  live: 'https://my-project.vercel.app/',  // or null when there's no deployment
}
```

`live` renders a "Live demo" link beside "View code" and adds the project to the
command palette's **Live demos** group. Set it to `null` rather than guessing a
URL — a dead demo link costs more than an absent one. The current values were
read from each repository's `homepage` field and checked for a 200 response.

Section numbering is derived automatically — nothing else needs updating.

### Adding or swapping proof

**A photo or scanned certificate** (Achievements): drop the image in
`public/proof/achievements/` as `<slug>.jpg` plus a `<slug>-thumb.jpg`, then add
an entry to that achievement's `gallery` array in `src/data/achievements.js`:

```js
{
  src:    '/proof/achievements/my-award.jpg',
  thumb:  '/proof/achievements/my-award-thumb.jpg',
  width:  1600,          // intrinsic size — reserves the box, prevents layout shift
  height: 1200,
  caption: 'What this image shows.',
}
```

The first entry becomes the large plate; the rest become the thumbnail strip
below it. Any number of images work — the lightbox pages through them.

Keep source images at **1600px max** (and thumbs at 900px). A straight-from-phone
photo is 4000px and several megabytes, which is the single easiest way to wreck
a Lighthouse score.

**A certificate PDF** (Certifications / Experience): drop it in
`public/proof/certs/`, add its slug to the `JOBS` array in
`scripts/make-cert-thumbs.mjs`, then run:

```bash
node scripts/make-cert-thumbs.mjs
```

That renders page 1 of each PDF to `public/proof/thumbs/<slug>.png` at 1200×850.
pdf.js runs inside headless Chrome during the script and is never shipped to
visitors.

---

## Design system

A cool, near-monochrome "drafting paper" system — graphite and blue-black with a
single deep cobalt accent used as an editorial marker rather than decoration.

| Token           | Day edition | Night edition |
| --------------- | ----------- | ------------- |
| Paper           | `#F1F2F4`   | `#0B0E13`     |
| Ink             | `#0E1116`   | `#E3E7EE`     |
| Ink (tertiary)  | `#676E7A`   | `#7C8494`     |
| Accent          | `#1D3FA0`   | `#7D9FF0`     |

`--ink-tertiary` is contrast-pinned: the mono labels render at 11px, which WCAG
counts as normal text, so both values sit above 4.5:1 against their paper.
Lightening them for aesthetics would fail an accessibility audit.

Typefaces: **Newsreader** (display), **IBM Plex Sans** (body), **IBM Plex Mono**
(labels, metadata, figures). All three load from Google Fonts in a single
request with `display=swap` and `preconnect`.

Theme follows the OS by default and persists a manual override in
`localStorage` under `sp-theme`. An inline script in `index.html` applies the
theme before first paint so there is no flash of the wrong edition.

---

## Regenerating `og.png`

`public/og.png` is rendered from `scripts/og-template.html`. If you change the
card, re-render it with headless Chrome:

```bash
chrome --headless=new --disable-gpu --window-size=1200,630 --screenshot=public/og.png scripts/og-template.html
```

On Windows use the full path to `chrome.exe`. Keep the output at exactly
1200×630 — that is what the `og:image:width` / `og:image:height` tags declare.

---

## Keyboard

| Shortcut | Action |
| -------- | ------ |
| `⌘K` / `Ctrl+K` | Open the command palette |
| `↑` `↓` | Move through palette results |
| `↵` | Run the highlighted command |
| `esc` | Close the palette or the proof lightbox |
| `←` `→` | Page through proofs in the lightbox or slider |

The palette indexes every section, project repo, certificate PDF, external
profile and the theme toggle. Matching is ranked — prefix hits beat substring
hits, which beat scattered-character hits — so `dtr` surfaces DocuTutor-RAG
first rather than burying it in noise.

## Proof galleries

Achievements with more than one image render as a **slider**: one framed plate
with `← 01 / 03 →` controls beside the caption. Swipe works on touch, arrow keys
work when the plate has focus, and clicking opens the full-size lightbox at the
current frame. Achievements whose only evidence is a document (The Big Code
Challenge) show no plate at all — just a link to the PDF.

Swipe is wired from raw pointer events rather than Framer Motion's `drag`, which
lives in the `domMax` feature bundle; importing it for one gesture would roughly
double the motion chunk.

## Accessibility & performance notes

- Every animation is gated behind `prefers-reduced-motion`. When it is set,
  elements render in their final state with no transform and no observer
  attached — `SplitWords` returns a plain string, `CountUp` renders the final
  figure, and `ScrollProgress` renders nothing at all.
- All motion is `transform`/`opacity` only, so it composites off the main thread
  and never triggers layout or paint. The count-up writes directly to a DOM node
  rather than through React state, avoiding ~85 re-renders per figure.
- Reveal masks are padded out and pulled back with equal negative margins, so
  `overflow: hidden` never slices glyph ink that sits outside its advance width
  (italic capitals and the roman `S` both do).
- Motion is loaded through Framer Motion's `LazyMotion` + `domAnimation` with
  `strict` mode, so the heavyweight layout-projection features never ship.
- Library code is split into long-cache `react` and `motion` chunks, so editing
  content only invalidates the small app chunk.
- Icons are inline SVG — no icon font, no icon package.
- Skip link, focus-visible outlines, and a labelled link per project row.
