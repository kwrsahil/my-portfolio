# my-portfolio

Personal portfolio site for **Sahil Kumar Kunwar** — developer based in Japan.  
Live at → [sahilkunwar.com.np](https://sahilkunwar.com.np)

---

## Overview

A single-file, zero-dependency static portfolio. No build step, no framework, no bundler. Just `index.html` deployed directly to Cloudflare Pages.

The site is fully bilingual (English / Japanese) and documents one real-world project: **Shift Tracker**, a compliance-first shift management tool built to solve Japan's labor law hour-limit problem for international students.

---

## File structure

```
my-portfolio-main/
├── index.html          # Entire site — HTML, CSS, and JS in one file
├── favicon.svg         # Nav logo reused as browser tab icon
├── _redirects          # Cloudflare Pages: www → non-www redirect
├── wrangler.jsonc      # Cloudflare Pages / Workers config
├── robots.txt          # Allows all crawlers, points to sitemap
├── sitemap.xml         # Single-URL sitemap for SEO
├── package-lock.json   # Lockfile (no runtime dependencies)
└── .gitignore          # Standard ignores
```

---

## How the site works

### Language system

The bilingual system is CSS-driven — no JavaScript involved in switching content.

`<body>` carries a `data-lang` attribute (`"en"` or `"jp"`). Two sets of CSS rules control visibility:

```css
/* All language-tagged elements are hidden by default */
[data-en], [data-jp]               { display: none; }
[data-en-inline], [data-jp-inline] { display: none; }

/* Only the active language is shown */
body[data-lang="en"] [data-en]        { display: revert; }
body[data-lang="en"] [data-en-inline] { display: inline; }
body[data-lang="jp"] [data-jp]        { display: revert; }
body[data-lang="jp"] [data-jp-inline] { display: inline; }
```

- `data-en` / `data-jp` — used on block elements (`<div>`, `<p>`)
- `data-en-inline` / `data-jp-inline` — used on inline elements (`<span>`)

Switching language is a single `setAttribute` call on `<body>`. The preference is saved to `localStorage` and restored on next visit. If no saved preference exists, the browser's locale is checked — Japanese locale defaults to `jp`, everything else to `en`.

### Language toggle button

A single button in the nav shows the *opposite* language — the one you'll switch *to*:

```js
function setLang(lang) {
  document.body.setAttribute('data-lang', lang);
  const btn = document.getElementById('lang-toggle-btn');
  btn.textContent = lang === 'en' ? 'JP' : 'EN'; // show the other language
  localStorage.setItem('lang', lang);
}

function toggleLang() {
  const current = document.body.getAttribute('data-lang');
  setLang(current === 'en' ? 'jp' : 'en');
}
```

### Scroll reveal

Section content fades up into view as the user scrolls using `IntersectionObserver`. Elements with the `.reveal` class start invisible (`opacity: 0`, `translateY(22px)`) and transition to visible when they enter the viewport.

```js
const obs = new IntersectionObserver(entries => {
  entries.forEach(e => { if (e.isIntersecting) e.target.classList.add('visible'); });
}, { threshold: 0.08, rootMargin: '0px 0px -30px 0px' });
document.querySelectorAll('.reveal').forEach(el => obs.observe(el));
```

### Scroll spy

The active nav link is highlighted based on which section is currently in view. On every scroll event, each section's position relative to the viewport top is checked, and the matching nav link gets the `.active` class.

```js
function onScroll() {
  let current = '';
  sections.forEach(s => {
    if (s.getBoundingClientRect().top <= 120) current = s.id;
  });
  navLinks.forEach(a => {
    a.classList.toggle('active', a.getAttribute('href') === '#' + current);
  });
}
window.addEventListener('scroll', onScroll, { passive: true });
```

### Live version badge

The project version shown in the Work section is fetched live from the GitHub tags API on page load. If the fetch fails (offline, rate-limited), the hardcoded fallback `v1.8` is shown silently.

```js
fetch('https://api.github.com/repos/kwrsahil/shift-tracker/git/refs/tags')
  .then(r => r.json())
  .then(tags => {
    const latest = tags[tags.length - 1].ref.replace('refs/tags/', '');
    document.getElementById('version-badge').textContent = latest;
    document.getElementById('project-version').textContent = latest;
  })
  .catch(() => {});
```

### Design tokens

All colors and fonts are defined as CSS custom properties on `:root`:

| Token        | Value       | Usage                          |
|--------------|-------------|--------------------------------|
| `--bg`       | `#0a0a0a`   | Page background                |
| `--surface`  | `#111`      | Card / project header bg       |
| `--border`   | `#222`      | All borders and dividers       |
| `--text`     | `#e8e3db`   | Primary text                   |
| `--muted`    | `#5a5550`   | Secondary / subdued text       |
| `--accent`   | `#c8f060`   | Green — highlights, nav active |
| `--accent2`  | `#ff6b35`   | Orange — project tags, KUNWAR  |
| `--fd`       | Bebas Neue  | Display / heading font         |
| `--fs`       | Instrument Serif | Italic accent font        |
| `--fm`       | Inter       | Body / UI font                 |

### Fonts

Loaded from Google Fonts with `preconnect` for performance:
- **Bebas Neue** — large display headings
- **Instrument Serif** (italic) — stylistic italic accents
- **Inter** (300, 400, 500) — all body text and UI

### Responsive layout

Two CSS grid layouts break to single-column below `700px`:

```css
@media (max-width: 700px) {
  .about-grid    { grid-template-columns: 1fr; }
  .contact-grid  { grid-template-columns: 1fr; }
}
```

All font sizes and spacing use `clamp()` for fluid scaling between breakpoints without additional media queries.

---

## Sections

| # | ID        | Content                                               |
|---|-----------|-------------------------------------------------------|
| — | Hero      | Name, tagline, skill badges, fade-up animation        |
| 1 | `#about`  | Bio (EN + JP), fact table with key stats              |
| 2 | `#work`   | Shift Tracker project card with features + tech stack |
| 3 | `#skills` | 4-column skill grid: Frontend, Tooling, Learning, Languages |
| 4 | `#contact`| Email + GitHub links                                  |

---

## Deployment

Deployed to **Cloudflare Pages** as a static asset site. `wrangler.jsonc` points the asset directory at the repo root (`.`), so all files are served directly — no build step required.

`_redirects` enforces a canonical non-www URL:

```
https://www.sahilkunwar.com.np/* https://sahilkunwar.com.np/:splat 301
```

---

## Favicon

`favicon.svg` is the same SVG logo used in the nav — a geometric mark in accent green (`#c8f060`) on a dark background. Referenced in `<head>`:

```html
<link rel="icon" href="/favicon.svg" type="image/svg+xml">
```

---

## SEO

- Primary meta tags: `description`, `keywords`, `author`, `robots`
- Canonical URL set to `https://sahilkunwar.com.np`
- Open Graph tags for social sharing (EN locale + JP alternate)
- Twitter card (`summary`)
- `sitemap.xml` linked from both `<head>` and `robots.txt`

---

## Contact

- Email: [sahilkunwarofficial@gmail.com](mailto:sahilkunwarofficial@gmail.com)
- GitHub: [github.com/kwrsahil](https://github.com/kwrsahil)

---

© 2026 Sahil Kumar Kunwar
