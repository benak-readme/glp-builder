# GLP Builder

A visual editor for ReadMe Enterprise Global Landing Pages. Build the page with
forms or edit the HTML directly, then paste the result into
`dash.readme.io → your group → Global Landing Page`.

## What it does

New pages match your hub out of the box: ReadMe's own fonts, brand color, search
and Ask AI placement. Change only what you want to change.

### Pages and templates

- The Templates tab switches a page to Grandview, Aurora, Spotlight, Editorial or
  Terminal. Switching applies the template's look and keeps your text, links,
  cards and colors. A page you haven't edited yet takes the template's sample
  content instead.
- The Pages menu holds as many named pages as you like. Everything autosaves in
  the browser. If storage fails, the save indicator says "Not saved".
- Keep a `.json` backup file on disk that every change writes to (Chrome and
  Edge), or use Export all and Import in any browser.
- Undo and redo cover everything, including deleted sections and cards
  (⌘Z / ⇧⌘Z).

### Sections and cards

- Stack up to six sections of cards, text columns or a code sample. Each has its
  own heading, alignment, card style and grid. Section names in the sidebar are
  for you only and never appear on the page.
- Drag the grip handle to reorder sections, cards and columns.
- Card styles are built from individual switches: icon tile, access badge, accent
  bar, link list, preview list, button or text link, whole-card link, density and
  corner radius.
- "Auto from projects" sections render one card per child project with ReadMe's
  Liquid templating (`parentProject.childrenProjects`), so the page updates when
  projects are added or removed. They can also list each project's top guide
  categories.
- Icons default to the Font Awesome set ReadMe already loads. Emoji are still an
  option. Light and duotone styles need Font Awesome Pro and may not show in the
  preview.

### Header, hero and theme

- Search placement: native (default), centered in the header, under the hero, or
  off.
- Brand bar replaces ReadMe's header on the landing page with your logo, nav
  links and a button. ReadMe's real search and Ask AI keep working inside it.
- Optional hero background image, announcement chip, ticker, contact banner,
  dark section panels, accent dividers and background patterns.
- Fonts and colors follow ReadMe's Appearance settings: "Match Settings in
  ReadMe" by default, or Custom with ReadMe's supported fonts and per-role colors
  for light and dark mode.

### Editing in the preview

Click any heading, card title, link label or column text in the preview and type.
Enter saves, Escape cancels. In Edit mode, hover a section or card for its
toolbar and settings.

### Import with Claude

No API key needed. GLP Builder is an org-wide connector in Claude (Settings →
Connectors → Connect, or add `https://glp-builder.netlify.app/mcp` as a custom
connector). Ask Claude to recreate any docs landing page and it replies with a
builder link. You can also copy a prompt into Claude and paste its JSON back. The
format lives in `design-guide.md`; the connector is `netlify/functions/mcp.mjs`.

### Sharing

Share link stores the design and copies a short `…/g/<code>` URL. Whoever opens
it gets the design as an unsaved page they can keep. Older `#c=…` links still
open, and Share falls back to one if the short-link service is down.

## Deploying (GitHub → Netlify)

1. Push this folder to a GitHub repository (`index.html` at the root).
2. In Netlify: Add new site → Import an existing project → GitHub, and pick the
   repo.
3. Leave the build command empty and set the publish directory to `/` (the
   included `netlify.toml` does this).
4. Deploy. Every push to `main` redeploys, and pull requests get deploy previews.

The app is one `index.html` (React and Babel from a CDN, compiled in the
browser). Short share links use one Netlify function
(`netlify/functions/share.mjs`) that stores designs in Netlify Blobs. Netlify
provisions Blobs itself, so there are no keys to set; `package.json` only pins
`@netlify/blobs` for the function bundle.

## Notes

- Unsaved work is lost on refresh unless you keep a backup file or use Export
  all, Share link or Download.
- In "Auto from projects" sections the preview shows three sample projects.
  ReadMe renders your real child projects once the HTML is pasted into the dash.
