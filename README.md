# GLP Builder

A visual editor for building **Global Landing Pages** for ReadMe Enterprise groups.
Design the page with forms (or edit the raw HTML with a live preview), then copy
the generated HTML into `dash.readme.io → your group → Global Landing Page`.

**Features**
- 3 templates: Audience Split, Solutions Grid (dLocal-style), Quick Links
- 4 font pairing presets, per-card accent colors with native ReadMe dark-mode support
- Layout controls: page width, columns, gap, card height
- Hero eyebrow/buttons, section heading, contact banner, footer
- Code view: edit the raw HTML next to a live preview
- Copy or download the finished snippet

## Hosting on GitHub Pages

1. Create a new **public** repository (e.g. `glp-builder`) at github.com/new
   — Pages on a *private* repo requires a paid plan; there are no secrets in
   this app, so public is fine.
2. Upload `index.html` and this `README.md` (drag-and-drop works on the
   "uploading an existing file" link, no git required).
3. Go to **Settings → Pages → Build and deployment**, set Source to
   **Deploy from a branch**, pick `main` and `/ (root)`, and save.
4. Your app goes live at `https://<your-username>.github.io/glp-builder/`
   within a minute or two.

Any commit to `main` redeploys automatically. No build step — the page is a
single self-contained `index.html` (React + Babel from CDN, compiled in the
browser).

## Notes

- Nothing is stored anywhere; all state lives in the browser session. Refreshing
  loses unsaved work, so use **Download .html** or **Copy HTML** when done.
- If the tool ever needs faster loads, the same component drops into a Vite
  React project unchanged.
