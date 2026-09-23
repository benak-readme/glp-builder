# GLP Builder design guide

You are producing a **design JSON** for GLP Builder (https://glp-builder.netlify.app), a visual editor for
ReadMe Enterprise Global Landing Pages (the home page of a ReadMe docs hub that links to child projects).
The builder turns this JSON into the final HTML, so describe the page's **content and structure**; never write HTML or CSS.

## How to recreate an existing page
The goal is a **faithful copy of the source page**, used as the starting point for this hub's landing page.
The builder has built-in templates (Grandview, Aurora, Spotlight, Editorial, Terminal); **do not imitate any of
them**. Every choice below should come from what the source page actually shows.

1. Read the source page (fetch the URL). Note, top to bottom: brand name/logo, top nav links, hero text and
   alignment, search/Ask AI placement, each content block (how many cards per row, list vs grid, icons or not,
   numbered or not), every link, the brand color, text and background colors, fonts, light vs dark look,
   any background pattern.
2. Map each block to the closest builder feature below, **in the same order and with the same number of items**.
   Keep the real copy and the real link URLs (absolute URLs are fine; site-relative paths start with "/").
3. Match the look, not just the content:
   - **Colors:** use `theme.colorMode: "custom"` with the source's brand, heading, body and background colors
     (see `theme`). Only use "readme" if the user asks to keep the hub's own colors.
   - **Fonts:** set `typeface.custom: true` with the closest supported heading/body fonts and a `headingWeight`
     that matches how bold the source headings look.
   - **Only add optional flourishes the source actually has:** hero `bg: "glow"`, `searchSize: "large"`,
     `quickLinks`, the hero `panel`, section `eyebrow`s, `pattern`, `banner.glow`, a code window. If the source
     doesn't show it, leave it out.
   - Match the hero's alignment, the card density and corner radius, section backgrounds and dividers.
   - **Branding:** keep the source's company name, logo and brand colors unless the user asked to remove their branding
     (see "Branding: keep or remove" below).
4. Before replying, walk the source page block by block and check each one is in your JSON, in order.
5. Output ONE JSON object. Omit anything you'd leave at its default; the builder fills defaults in.

## Branding: keep or remove
Default: **keep their branding** (company and product names, logo, brand colors, real copy and links).

If the user asks to **remove their branding** (also: "without their branding", "unbranded", "no company names"),
recreate the layout and style exactly as usual (structure, block order, item counts, card styles, alignment, fonts,
background pattern), but remove anything that identifies the company:
- Company name: "Your company" (brand bar `name`), no `logoUrl`, no `tag` unless generic (e.g. "Developers").
- Product and feature names: generic equivalents ("Payments API", "Mobile SDK", "Identity"), not the source's names.
- Copy: rewrite headings and descriptions in the same tone and length, with no company-specific claims or names.
- Links: generic site-relative paths ("/docs/getting-started", "/reference", "/changelog"), never the source's domain.
- Colors: `theme.colorMode: "readme"` so the hub's own brand color is used; keep light/dark and pattern choices.
- Logos of third parties, customer names, and testimonials: drop them.
Name the page after the source, e.g. "Unbranded developer.acme.com".

## Top-level fields
- `typeface`: `{ custom: true, heading, body, mono }` (`custom: false` means Match Settings in ReadMe: inherit
  whatever fonts the hub uses; when recreating a page, prefer the closest supported fonts instead). Headings: "Fraunces" | "Syne" | "Space Mono" | "DM Mono" | "DM Sans" | "Geist" |
  "Geist Mono" | "IBM Plex Mono" | "IBM Plex Sans" | "IBM Plex Serif" | "Inter" | "Space Grotesk" | "Work Sans".
  Body: "Literata" | "Lora" | "Merriweather" | "DM Mono" | "DM Sans" | "Geist" | "Geist Mono" | "IBM Plex Mono" |
  "IBM Plex Sans" | "IBM Plex Serif" | "Inter" | "Space Grotesk" | "Work Sans". Optional `mono` (labels, small buttons):
  "DM Mono" | "Geist Mono" | "IBM Plex Mono" | "Space Mono". Pick the closest match to the source page.
  `headingWeight`: 400 | 500 | 600 (default) | 700 applies to every heading. One heading can differ with its own
  weight field beside it: `hero.titleWeight`, `banner.titleWeight`, a section's `headingWeight`, a card's
  `titleWeight`, a column's `headingWeight` (same values).
- Text formatting: in descriptions, intros, the hero subtitle, column text, link labels, banner text and the footer,
  `**word**` renders bold and `*word*` italic. Headings and card titles take `*word*` italic too.
- `brandBar`: custom header that replaces ReadMe's header on the landing page.
  `{ enabled, name, tag, logoUrl, links: [{label, href}], button: {enabled, label, href} }`.
  Use it when the page has its own logo row / top nav. `logoUrl` (an absolute image URL) replaces the wordmark.
- `searchMode`: where ReadMe's search + Ask AI sit. "native" (normal header) | "header" (centered in header)
  | "hero" (row under the hero) | "brand" (inside the brand bar). With `brandBar.enabled`, use "hero" or "brand".
- `hero`: `{ eyebrow, title, subtitle, align: "center"|"left", titleSize (px|null), subtitleSize (px|null),
  chip, chipHref, buttons (bool), btnPrimary: {label, href}, btnSecondary: {label, href}, searchHint }`.
  `searchHint` is a small line under the search row (only shown when searchMode is "hero").
  Also: `bg: "none"|"glow"` (soft brand-color glow behind the hero), `searchSize: "normal"|"large"` (a big search box,
  great for search-first help centers), `quickLinks: [{label, href}]` (pills under the hero), and
  `panel: { enabled, title, links: [{label, href, meta}] }` (a card beside a left-aligned hero listing sections with a
  small count; the search box moves into it when searchMode is "hero").
- `theme`: `{ colorMode: "readme" | "custom", colors: { light: {...}, dark: {...} }, pattern (bool) }`.
  "readme" inherits the hub's brand color. When recreating a page, use the source page's colors: set `colorMode: "custom"` and fill
  any of these roles in `colors.light` (hex "#RRGGBB"; leave out what you don't need): `brand` (buttons, links, icons,
  card accents), `heading`, `body`, `muted`, `cardBg`, `cardBorder`, `pageBg`. Add `colors.dark.brand` as a lighter tint
  that reads on dark backgrounds; other dark roles are optional. `pattern`: "none" | "dots" | "grid" | "lines" |
  "shapes" (faint full-width background), `patternStrength`: "subtle" | "medium".
- `layout`: `{ maxW: 960 | 1120 | 1280 }` content width.
- `banner`: call-to-action box below everything: `{ enabled, title, text, btnLabel, btnHref, align: "left"|"center",
  btn2Label, btn2Href, glow }`. Centered + two buttons + glow suits a closing "Can't find it?" block.
- `footer`: one line of small text at the bottom ("" to hide).
- `ticker`: `{ enabled, text }` scrolling strip (rarely wanted).
- `sections`: array (max 6) of content blocks, top to bottom. See below.

## Sections
Common fields: `label` (builder-only name), `eyebrow` (small label line above the heading, e.g. "Code samples"),
`heading`, `intro`, `align: "center"|"left"`,
`layout: { colMin (min card width px, 180-420), gap (px), spaceAbove (px), divider (bool),
dividerStyle: "hairline"|"accent", bg: "none"|"subtle"|"accent"|"dark", bento (bool), list (bool: cards as full-width
rows, title | description | count), autoH: true }`.

### Card section: `"type": "cards"`
- `source`: "static" (you list cards) | "liquid" (one card per child project, auto-generated by ReadMe;
  use when the page is just a grid of every project and you don't know them all).
- `styleMode: "custom"` and `style`: switches that compose the card look:
  `anchor` (whole card is a link), `icon` (icon tile), `iconInline` (icon beside title), `badge` (eyebrow pill),
  `bar` (accent top bar), `peek` (small list), `links` (list of chevron links + footnote; card is not itself a link),
  `cta` (call to action) + `ctaPlain` (as a text link instead of a button), `num` (numbered 01, 02, 03), `mono` (uppercase mono titles),
  `radius` (0-24), `density`: "roomy"|"comfortable"|"compact".
- `cards` (max 12), each: `title`, `blurb` (may be ""), `href`, `meta` (small count like "120 pages", optional), `icon` (a Font Awesome 6 free solid icon name,
  e.g. "book", "code", "rocket", "key", "life-ring", "clock-rotate-left"), `ctaText`,
  `eyebrow` + `badge: "dot"|"lock"` (when style.badge), `peekLabel` + `peekItems: [strings]` (when style.peek),
  `links: [{label, href}]` + `note` + `noteLinkLabel` + `noteHref` (when style.links; wrap words in *asterisks* for italics),
  `accent`: "green"|"purple"|"amber"|"blue"|"rose"|"slate" (ignored when theme is uniform/matchReadme).
- Liquid sections instead take `liquid: { eyebrow, icon, blurbFallback, peek, peekLabel, peekCount, ctaText }`.

### Code sample section: `"type": "code"`
- `code: { file, langs, text }`: a dark code window (file name in its title bar) beside the section's eyebrow/heading/intro,
  with `langs` (comma-separated) shown as chips. Use when the source page shows a quickstart snippet.

### Text-column section: `"type": "columns"`
- `columns` (1-4): `{ heading, body, ctas: [{label, href, style: "plain"|"button"|"filled"}] }`.
- Great for help/support strips; pair with `layout.bg: "dark"`.

## Mapping tips
- Pick-your-path cards with several question links: card section, `style.links: true`, `anchor: false`.
- Tiles that each open a doc set: `anchor: true, icon: true, iconInline: true, cta: true, ctaPlain: true`.
- A colored rule between blocks: `layout.divider: true, dividerStyle: "accent"` on the lower section.
- Can't reproduce something exactly (video, carousel, custom illustration)? Use the closest block and keep the copy.

## Complete example
A recreation of a (fictional) Acme developer hub: its own fonts, colors, and dotted background carried over.
```json
{
 "typeface": { "custom": true, "heading": "Inter", "body": "Inter", "headingWeight": 700 },
 "hero": {
  "eyebrow": "Platform docs",
  "chip": "",
  "chipHref": "",
  "title": "Welcome to Acme technical documentation",
  "subtitle": "Everything you need to build on the Acme platform: guides, the API reference, platform documentation, and release notes, all in one place.",
  "align": "left",
  "titleSize": 40,
  "subtitleSize": 18,
  "padY": 0,
  "buttons": true,
  "searchHint": "Search runs across every documentation set below. Ask AI answers in plain language, with links to the pages it used.",
  "btnPrimary": {
   "label": "Start building",
   "href": "/guides"
  },
  "btnSecondary": {
   "label": "Browse the API reference",
   "href": "/reference"
  }
 },
 "ticker": {
  "enabled": false,
  "text": "Documentation • Endpoints • SDKs • Guides"
 },
 "brandBar": {
  "enabled": true,
  "logoUrl": "",
  "name": "Acme",
  "tag": "Developers",
  "links": [
   {
    "label": "Guides",
    "href": "/guides"
   },
   {
    "label": "API reference",
    "href": "/reference"
   },
   {
    "label": "Platform guide",
    "href": "/platform"
   },
   {
    "label": "Release notes",
    "href": "/changelog"
   }
  ],
  "button": {
   "enabled": true,
   "label": "Log in",
   "href": "/login"
  }
 },
 "searchMode": "hero",
 "flattenHeader": false,
 "headerImage": {
  "enabled": false,
  "url": "",
  "height": 380,
  "tint": 0,
  "offset": 64
 },
 "theme": {
  "colorMode": "custom",
  "colors": {
   "light": { "brand": "#5B3DF5", "heading": "#111827", "body": "#4B5563", "pageBg": "#FFFFFF" },
   "dark": { "brand": "#A898FF" }
  },
  "pattern": "dots"
 },
 "cardStyle": {
  "anchor": true,
  "icon": false,
  "badge": false,
  "bar": false,
  "peek": false,
  "cta": false,
  "ctaPlain": false,
  "mono": false,
  "links": false,
  "iconInline": false,
  "radius": 16,
  "density": "comfortable"
 },
 "layout": {
  "maxW": 1120
 },
 "banner": {
  "enabled": false,
  "title": "Need help building your integration?",
  "text": "Our team can walk you through setup, auth, and best practices.",
  "btnLabel": "Contact us",
  "btnHref": "/contact"
 },
 "footer": "",
 "sections": [
  {
   "type": "cards",
   "label": "Audiences",
   "heading": "How are you working with Acme?",
   "intro": "Pick the path that matches how you work with us.",
   "align": "left",
   "source": "static",
   "styleMode": "custom",
   "style": {
    "anchor": false,
    "icon": false,
    "badge": false,
    "bar": false,
    "peek": false,
    "cta": false,
    "ctaPlain": false,
    "mono": false,
    "links": true,
    "iconInline": false,
    "radius": 8,
    "density": "comfortable"
   },
   "layout": {
    "colMin": 380,
    "gap": 24,
    "autoH": true,
    "cardMinH": 396,
    "bento": false,
    "spaceAbove": 48,
    "divider": false,
    "dividerStyle": "hairline",
    "bg": "none"
   },
   "cards": [
    {
     "icon": "book",
     "title": "Customers",
     "blurb": "",
     "href": "/guides",
     "ctaText": "View docs",
     "links": [
      {
       "label": "Are you building an integration using *standard API access*?",
       "href": "/guides/standard-access"
      },
      {
       "label": "Are you building an integration using the *analytics API*?",
       "href": "/guides/analytics-api"
      },
      {
       "label": "Not building an integration? Looking for detailed product information?",
       "href": "/platform"
      }
     ],
     "note": "",
     "noteLinkLabel": "",
     "noteHref": ""
    },
    {
     "icon": "book",
     "title": "Partners",
     "blurb": "",
     "href": "/partners",
     "ctaText": "View docs",
     "links": [
      {
       "label": "Do you have a partner agreement? Are you integrating your product with our platform?",
       "href": "/guides/partner-access"
      }
     ],
     "note": "Don't have a partner agreement yet?",
     "noteLinkLabel": "Apply for partnership",
     "noteHref": "/partners"
    }
   ]
  },
  {
   "type": "cards",
   "label": "Doc tiles",
   "heading": "Explore the documentation",
   "intro": "Learn more about our products and how to integrate them with your business.",
   "align": "left",
   "source": "static",
   "styleMode": "custom",
   "style": {
    "anchor": true,
    "icon": true,
    "badge": false,
    "bar": false,
    "peek": false,
    "cta": true,
    "ctaPlain": true,
    "mono": false,
    "links": false,
    "iconInline": true,
    "radius": 8,
    "density": "comfortable"
   },
   "layout": {
    "colMin": 300,
    "gap": 24,
    "autoH": true,
    "cardMinH": 396,
    "bento": false,
    "spaceAbove": 72,
    "divider": true,
    "dividerStyle": "accent",
    "bg": "none"
   },
   "cards": [
    {
     "icon": "list-check",
     "title": "Integration how-to",
     "blurb": "Step-by-step guides to reach specific business goals.",
     "href": "/guides",
     "ctaText": "Open",
     "links": [],
     "note": "",
     "noteLinkLabel": "",
     "noteHref": ""
    },
    {
     "icon": "code",
     "title": "Developer guide",
     "blurb": "Build and customize your integrations using our APIs.",
     "href": "/guides/getting-started",
     "ctaText": "Open",
     "links": [],
     "note": "",
     "noteLinkLabel": "",
     "noteHref": ""
    },
    {
     "icon": "book",
     "title": "API reference",
     "blurb": "Browse endpoints, parameters, and data definitions.",
     "href": "/reference",
     "ctaText": "Open",
     "links": [],
     "note": "",
     "noteLinkLabel": "",
     "noteHref": ""
    },
    {
     "icon": "table-cells-large",
     "title": "Platform guide",
     "blurb": "Detailed information about our platform products.",
     "href": "/platform",
     "ctaText": "Open",
     "links": [],
     "note": "",
     "noteLinkLabel": "",
     "noteHref": ""
    },
    {
     "icon": "clock-rotate-left",
     "title": "Release notes",
     "blurb": "Stay up to date with platform and API changes.",
     "href": "/changelog",
     "ctaText": "Open",
     "links": [],
     "note": "",
     "noteLinkLabel": "",
     "noteHref": ""
    }
   ]
  },
  {
   "type": "columns",
   "label": "Help strip",
   "heading": "",
   "intro": "",
   "align": "left",
   "layout": {
    "colMin": 258,
    "gap": 28,
    "autoH": true,
    "cardMinH": 396,
    "bento": false,
    "spaceAbove": 56,
    "divider": false,
    "dividerStyle": "hairline",
    "bg": "dark"
   },
   "columns": [
    {
     "heading": "Need a hand?",
     "body": "Search or ask AI at the top of this page, or start from one of these.",
     "ctas": []
    },
    {
     "heading": "Getting started",
     "body": "Authenticate and make your first call.",
     "ctas": [
      {
       "label": "Open",
       "href": "/guides/getting-started",
       "style": "plain"
      }
     ]
    },
    {
     "heading": "What's new",
     "body": "Latest platform and API changes.",
     "ctas": [
      {
       "label": "Open",
       "href": "/changelog",
       "style": "plain"
      }
     ]
    },
    {
     "heading": "Support",
     "body": "Product help for your team.",
     "ctas": [
      {
       "label": "Contact support",
       "href": "/support",
       "style": "plain"
      }
     ]
    }
   ]
  }
 ]
}
```
