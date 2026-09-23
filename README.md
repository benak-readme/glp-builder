# GLP Builder

A visual editor for building **Global Landing Pages** for ReadMe Enterprise
groups. Design the page with forms — or edit the raw HTML with a live
preview — then copy the generated snippet into
`dash.readme.io → your group → Global Landing Page`.

## Features

- **Multiple card sections** — stack as many sections as you need, each with
  its own heading, intro, alignment (independent of the hero), card style,
  and grid. Great for "For developers" up top and "Resources" below. Rename
  any section in the sidebar (pencil next to its name) to keep track of it;
  that name is builder-only and never shown on the page.
- **Drag-and-drop reordering** — drag the grip handle on any section, card,
  or column to move it to any position; the ↑/↓ buttons still work too.
- **Fully granular card styles** — no more fixed templates. Compose any card
  look from individual switches: icon tile (above or beside the title),
  badge/eyebrow, top accent bar, link list, preview list, CTA button, plain-text CTA,
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
- **Brand bar** — a Header style that swaps ReadMe's header (on the landing
  page only) for your own wordmark or logo, nav links, and an outlined
  button like "Log in". ReadMe's real search and Ask AI move under the hero
  or into the brand bar, so they keep working with no Custom CSS or JS.
- **Link-list cards** — a card style that turns a card into rows of chevron
  links (wrap a word in `*asterisks*` for italics) with an optional footnote
  link. Great for "Customers / Partners" pick-your-path cards.
- **Page templates** — the **Templates** tab switches a page to Grandview, Aurora,
  Spotlight, Editorial or Terminal. Switching applies just the template's look and
  keeps your text, links, cards and colors. A page you haven't edited yet shows
  the template's sample content instead. **Grandview** opens a complete starting page
  (brand bar, search hero, audience link lists, icon doc tiles, dark help
  strip).
- **Edit text right in the preview** — click any heading, card title, link
  label, or column text in the live preview and type; Enter saves it back
  into the builder (and the code), Escape cancels.
- **Import with Claude** (top bar) — no API key needed. GLP Builder is an
  org-wide connector in Claude (Settings → Connectors → Connect; or add
  `https://glp-builder.netlify.app/mcp` as a custom connector). Ask Claude to
  recreate any docs landing page and it replies with a builder link. Or copy a
  ready-made prompt into Claude and paste its JSON reply back. The format
  Claude follows lives in `design-guide.md`; the connector is
  `netlify/functions/mcp.mjs`.
- **Backups that survive clearing your browser** (Pages menu) — keep a
  `.json` backup file on your computer that every change is saved to
  (Chrome/Edge), or Export all / Import in any browser.
- **Dark section panel, accent-rule dividers, background pattern** — for
  support strips and a more branded look.
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
- **Shareable links** — the Share button stores your design and copies a
  short `…/g/<code>` URL (nice for Slack). Anyone opening it sees your exact
  configuration as an unsaved page they can add to their own list with one
  click. Older inline links (`#c=…`) still open, and if the short-link
  service is unreachable Share falls back to an inline link automatically.
- Native ReadMe **dark/light/system theming** via `data-color-mode` — no JS
  theme hacks
- **Fonts and colors like ReadMe's Appearance settings** — "Match Settings in
  ReadMe" (the default) inherits the hub's own fonts and brand color; Custom
  offers ReadMe's supported heading/body/code fonts and per-role colors for
  light and dark mode
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
  keep a backup file or use **Export all**, **Share link**, or **Download**.
- In Liquid mode the in-app preview shows 3 sample projects; ReadMe renders
  your real child projects server-side once the code is pasted into the dash.
