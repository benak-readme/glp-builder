# GLP Builder

A visual editor for building **Global Landing Pages** for ReadMe Enterprise
groups. Design the page with forms — or edit the raw HTML with a live
preview — then copy the generated snippet into
`dash.readme.io → your group → Global Landing Page`.

## Features

- **Multiple card sections** — stack as many sections as you need, each with
  its own heading, intro, alignment (independent of the hero), card style,
  and grid. Great for "For developers" up top and "Resources" below.
- **Fully granular card styles** — no more fixed templates. Compose any card
  look from individual switches: icon tile, badge/eyebrow, auto-number,
  `File_0N` label, top accent bar, preview list, CTA button, plain-text CTA,
  whole-card link, mono/uppercase, plus density and corner-radius controls.
- **Font Awesome icons** — cards accept emoji *or* a Font Awesome icon
  (e.g. solid `rocket`), using ReadMe's built-in Font Awesome. Light &
  duotone are Pro-only and may not show in the in-app preview.
- **Per-section Liquid mode** — any section's cards can auto-generate one per
  child project via ReadMe's Liquid templating (`parentProject.childrenProjects`),
  so the page updates itself when projects are added or removed. Optionally
  lists each project's top guide categories.
- **Search placement** — three modes: leave it native, center search + Ask AI
  in the header, or move them into a row under the hero. Ask AI always sits
  beside search.
- **Hero background image** — an optional full-bleed image (with darkening
  tint) behind the hero; pair it with the transparent header so it sits
  behind that too.
- **Saved pages + autosave** — your work is kept in the browser
  automatically as you edit. The **Pages** menu (top bar) holds as many named
  designs as you like — switch, create, rename, duplicate, or delete them, and
  the current one auto-saves. Nothing is lost on refresh.
- **Undo / redo** — top-bar buttons (and ⌘/Ctrl-Z, ⇧⌘/Ctrl-Z) roll back
  recent changes, including accidental section or card deletions.
- **One-color mode** — a top **Colors** section can force a single accent
  across every card, overriding the per-card colors.
- **Shareable links** — the Share button encodes your whole design into a
  URL (`#c=…`); anyone opening the link sees your exact configuration as an
  unsaved page they can add to their own list with one click. Links saved with
  older versions are migrated automatically.
- Native ReadMe **dark/light/system theming** via `data-color-mode` — no JS
  theme hacks
- 4 font pairings **plus a "Match ReadMe" option** that inherits the hub's
  own typeface (ReadMe's `--font-family`, i.e. its default or your Custom CSS)
- Per-card accent colors, hero buttons/chip, announcement ticker, contact
  banner, page-width control
- Copy or download the finished HTML

## Deploying (GitHub → Netlify)

1. Push this folder to a GitHub repository (`index.html` at the root).
2. In Netlify: **Add new site → Import an existing project → GitHub**, and
   pick the repo.
3. Build settings: leave **Build command** empty, set **Publish directory**
   to `/` (the included `netlify.toml` does this automatically).
4. Deploy. Every push to `main` redeploys automatically, and pull requests
   get deploy previews.

No build step exists — the app is a single self-contained `index.html`
(React + Babel from CDN, compiled in the browser). To update the app, just
edit/replace `index.html` and push.

## Notes

- Share links carry the design in the URL fragment; nothing is stored
  server-side. Unsaved work is lost on refresh unless you use **Share link**,
  **Download .html**, or **Copy HTML**.
- In Liquid mode the in-app preview shows 3 sample projects; ReadMe renders
  your real child projects server-side once the code is pasted into the dash.
