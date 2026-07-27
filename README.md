# GLP Builder

A visual editor for building **Global Landing Pages** for ReadMe Enterprise
groups. Design the page with forms — or edit the raw HTML with a live
preview — then copy the generated snippet into
`dash.readme.io → your group → Global Landing Page`.

## Features

- **Multiple card sections** — stack as many sections as you need, each with
  its own heading, intro, alignment (independent of the hero), card style,
  and grid. Great for "For developers" up top and "Resources" below. Each
  section also has its own **builder label** (sidebar/tab name only, never
  shown on the page) so you can keep track of what a section is for even if
  its on-page heading is blank or renamed.
- **Drag-and-drop reordering** — drag the grip handle on any section, card,
  or column to move it to any position; the ↑/↓ buttons still work too.
- **Fully granular card styles** — no more fixed templates. Compose any card
  look from individual switches: icon tile, badge/eyebrow, auto-number,
  `File_0N` label, top accent bar, preview list, CTA button, plain-text CTA,
  whole-card link, mono/uppercase, plus density and corner-radius controls.
- **Font Awesome icons by default** — cards use ReadMe's built-in Font
  Awesome (e.g. solid `rocket`) out of the box; emoji are still available as
  an alternate icon type. Light & duotone FA styles are Pro-only and may not
  show in the in-app preview.
- **Per-section Liquid mode** — any section's cards can auto-generate one per
  child project via ReadMe's Liquid templating (`parentProject.childrenProjects`),
  so the page updates itself when projects are added or removed. Optionally
  lists each project's top guide categories.
- **Search placement** — three modes: leave it native (the default), center
  search + Ask AI in the header, or move them into a row under the hero.
  Ask AI always sits beside search.
- **Native ReadMe styling by default** — new pages start with search/Ask AI
  left alone, the header un-flattened, and colors inheriting ReadMe's own
  accent (`--color-link-primary`) — so a fresh page matches your hub's look
  until you deliberately customize it.
- **Hero background image** — an optional full-bleed image (with darkening
  tint) behind the hero; pair it with the transparent header so it sits
  behind that too.
- **Saved pages + autosave** — your work is kept in the browser
  automatically as you edit. The **Pages** menu (top bar) holds as many named
  designs as you like — switch, create, rename, duplicate, or delete them, and
  the current one auto-saves. Nothing is lost on refresh. If browser storage
  is ever unavailable or full, the save indicator switches to a "Not saved"
  warning rather than silently claiming success.
- **Undo / redo** — top-bar buttons (and ⌘/Ctrl-Z, ⇧⌘/Ctrl-Z) roll back
  recent changes, including accidental section or card deletions.
- **One-color mode** — a top **Colors** section can force a single accent
  across every card, overriding the per-card colors.
- **Shareable links** — the Share button stores your design and copies a
  short `…/g/<code>` URL (nice for Slack). Anyone opening it sees your exact
  configuration as an unsaved page they can add to their own list with one
  click. Older inline links (`#c=…`) still open, and if the short-link
  service is unreachable Share falls back to an inline link automatically.
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

The app itself is a single self-contained `index.html` (React + Babel from
CDN, compiled in the browser). Short share links are backed by one Netlify
function (`netlify/functions/share.mjs`) storing designs in **Netlify
Blobs** — Netlify provisions this automatically, so no keys or extra setup
are needed; `package.json` just pins `@netlify/blobs` for the function
bundle. To update the app, edit `index.html` and push.

## Notes

- Short share links store the design in Netlify Blobs, keyed by the code in
  the URL. Older inline `#c=…` links carry the design in the URL fragment
  (nothing stored). Either way, unsaved work is lost on refresh unless you
  use **Share link**, **Download .html**, or **Copy HTML**.
- In Liquid mode the in-app preview shows 3 sample projects; ReadMe renders
  your real child projects server-side once the code is pasted into the dash.
