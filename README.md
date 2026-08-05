# mizarnevelli.vercel.app

Personal portfolio and JavaScript explainer site. Built with React 19, Vite, Three.js, and Framer Motion. Deployed on Vercel.

## What it is

Three things in one:

1. A portfolio — who I am, where I've been, what I work with
2. A set of interactive JavaScript explainers (event loop, event bubbling, closures) with step-by-step visualizers
3. A travel blog, written in MDX, no CMS, published by pushing to git

## Stack

| Layer | Choice | Why |
|-------|--------|-----|
| Framework | React 19 | Native `<title>` / `<meta>` hoisting in the component tree — no react-helmet needed |
| Build | Vite 8 | Fast enough that I stopped thinking about it |
| Routing | React Router 7 | Data router API, `ScrollRestoration` built in |
| Styling | Tailwind CSS 3 | Utility-first, no runtime, predictable |
| Animation | Framer Motion 12 | `motion` components for scroll-driven and interaction animations |
| 3D | Three.js + @react-three/fiber | Starfield background rendered on a fixed canvas behind the whole page |
| Globe | COBE | WebGL globe with custom amber color palette |
| Blog | MDX + @mdx-js/rollup | Posts are `.mdx` files in `content/blog/`. No database, no CMS, no API |
| i18n | i18next | EN and IT locales, browser language detection |
| Linting | oxlint | Fast, zero config |

## Project structure

```
content/
  blog/
    portugal-22.mdx       # write posts here

public/
  blog/
    portugal-22/
      cover.jpg           # images per post slug

src/
  components/             # Nav, Globe, SpaceScene, ScrollReveal, PageMeta...
  pages/
    Home/                 # long-scroll hero + sticky globe + stats + JS explainers grid
    About/                # seven-chapter timeline, stack, hobbies
    Blog/                 # list page + post reader
    EventLoop/            # interactive visualizer
    EventBubbling/        # interactive visualizer
    Closures/             # interactive visualizer
    Contact/
  i18n/
    locales/              # en.json, it.json

vite.config.ts            # MDX plugin, sitemap, image compression, per-route meta injection
```

## Architecture decisions

**No SSR, no Next.js.** The site is a SPA deployed as static files on Vercel. For social sharing (WhatsApp, Slack, iMessage), scrapers need HTML with meta tags already in the `<head>` — they don't execute JavaScript. To solve this without a server, `vite.config.ts` has a `staticMeta` plugin that runs after build, reads each route's metadata (and blog post frontmatter directly from the `.mdx` files), and writes a static `index.html` per route into `dist/`. Vercel serves static files before checking rewrites, so scrapers get pre-filled HTML and users get the normal React SPA.

**Blog posts are MDX files.** Publishing means writing a file and pushing. No API calls, no CMS credentials, no webhook to configure. Frontmatter (`title`, `date`, `location`, `cover`, `excerpt`) drives the list page, the post header, and the OG tags. The `staticMeta` plugin auto-discovers new posts at build time — you don't touch any config.

**Images are compressed at build time.** Phone photos go into `public/blog/[slug]/` at full resolution. The `compressBlogImages` Vite plugin runs after build, walks `dist/blog/`, and compresses every JPEG/PNG/WebP with sharp — quality 78, max 1920px wide, EXIF orientation applied before resize. The originals in `public/` stay untouched. WhatsApp's scraper caps OG images at ~300KB; uncompressed phone photos average 3–5MB and get silently ignored.

**Three.js canvas is fixed behind the whole page.** `SpaceScene` mounts once on a `position: fixed` canvas at `z-index: 0`. Hero and globe sections sit at `z-10` with transparent backgrounds so stars show through. Stats and footer sections have `bg-ink-950` to cover the canvas once the starfield portion is done scrolling. This avoids mounting/unmounting the canvas on navigation.

**i18n without route prefixes.** Language is detected from the browser and stored in localStorage. No `/en/` or `/it/` URL prefixes — the same URL works for both languages. Not ideal for SEO across languages, but acceptable for a personal site.

## Running locally

```bash
npm install
npm run dev
```

## Building

```bash
npm run build
```

The build runs TypeScript, Vite, then three custom plugins in sequence:
1. `compressBlogImages` — compresses images in `dist/blog/`
2. `staticMeta` — writes per-route `index.html` files with correct OG tags
3. `vite-plugin-sitemap` — writes `sitemap.xml`

## Adding a blog post

1. Create `content/blog/your-slug.mdx` with this frontmatter:

```mdx
---
title: "Post title"
date: "YYYY-MM-DD"
location: "City, Country"
cover: "/blog/your-slug/cover.jpg"
excerpt: "One sentence shown in the list and as OG description."
---

Your content here. Standard markdown plus any React component you want to embed.
```

2. Put images in `public/blog/your-slug/`
3. Add `/blog/your-slug` to the `dynamicRoutes` array in `vite.config.ts` (for sitemap only)
4. Push — Vercel builds and deploys

## License

MIT
