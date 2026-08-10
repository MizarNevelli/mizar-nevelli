# Mizar Nevelli portfolio

Personal portfolio and JavaScript explainer site. Built with React 19, Vite, Three.js, and Framer Motion. Deployed on Vercel.

## What it is

Three things in one:

1. A portfolio — who I am, where I've been, what I work with
2. A set of interactive JavaScript explainers (event loop, event bubbling, closures) with step-by-step visualizers
3. A travel blog, written in MDX, no CMS, published by pushing to git

## Stack

| Layer     | Choice                        | Why                                                                                 |
| --------- | ----------------------------- | ----------------------------------------------------------------------------------- |
| Framework | React 19                      | Native `<title>` / `<meta>` hoisting in the component tree — no react-helmet needed |
| Build     | Vite 8                        | Fast enough that I stopped thinking about it                                        |
| Routing   | React Router 7                | Data router API, `ScrollRestoration` built in                                       |
| Styling   | Tailwind CSS 3                | Utility-first, no runtime, predictable                                              |
| Animation | Framer Motion 12              | `motion` components for scroll-driven and interaction animations                    |
| 3D        | Three.js + @react-three/fiber | Starfield background rendered on a fixed canvas behind the whole page               |
| Globe     | COBE                          | WebGL globe with custom amber color palette                                         |
| Blog      | MDX + @mdx-js/rollup          | Posts are `.mdx` files in `content/blog/`. No database, no CMS, no API              |
| i18n      | i18next                       | EN and IT locales, browser language detection                                       |
| Linting   | oxlint                        | Fast Rust linter with explicit rules for hooks, console, and unused vars            |

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

**Three.js canvas lives in the Layout, never unmounts.** `SpaceScene` is mounted once in `Layout` (`App.tsx`) on a `position: fixed` canvas at `z-index: 0`. Visibility is toggled per route via a CSS `visibility` property and a `SPACE_ROUTES` set — the canvas stays alive on every page, so there is never a WebGL context loss on navigation. Hero and globe sections sit at `z-10` with transparent backgrounds so stars show through. Stats and footer sections use `bg-base` to cover the canvas once the starfield portion is done scrolling.

**Route-level code splitting.** Home, About, Blog, and Contact are eagerly imported (on the critical rendering path). The three visualizer pages (Event Loop, Event Bubbling, Closures) are lazy-loaded via `React.lazy` — they pull in heavy Three.js and animation code only when visited. This dropped the main bundle from ~1.5 MB to ~573 KB gzip.

**Fonts load without blocking render.** Google Fonts are loaded with `media="print"` + `onload="this.media='all'"` — the browser fetches the stylesheet in the background and applies it once ready, without blocking FCP. A `<noscript>` fallback covers the rare case of JS being disabled.

**Globe uses ResizeObserver, not offsetWidth.** Reading `canvas.offsetWidth` synchronously forces a layout reflow. The Globe component instead uses a `ResizeObserver` callback, which delivers sizes asynchronously. The globe is created once on the first callback (real dimensions guaranteed) and updated with `globe.update()` on subsequent resizes — no destroy/recreate cycle, which eliminates a WebGL `drawArrays: no buffer bound` error.

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

## Testing

**Unit tests** — Vitest, run against pure logic with no browser.

```bash
npm test           # run once
npm run test:watch # watch mode
npm run test:ui    # visual dashboard
```

**E2E tests** — Playwright, spins up the Vite dev server and tests critical flows in Chromium.

```bash
npm run test:e2e        # headless
npm run test:e2e:ui     # interactive UI
```

**What's covered:**

| Suite | File                                     | What it guards                                                        |
| ----- | ---------------------------------------- | --------------------------------------------------------------------- |
| Unit  | `tests/unit/format.test.ts`              | `formatDate` / `formatOrdinal` edge cases                             |
| Unit  | `tests/unit/closures-scenarios.test.ts`  | Scenario data integrity, `forVar` → all `3`, `forLet` → `0,1,2`       |
| Unit  | `tests/unit/eventloop-scenarios.test.ts` | Microtask drains before macrotask, narration count ≡ timeline length  |
| Unit  | `tests/unit/closures-safestep.test.ts`   | Regression: step overflow on scenario switch (the `frame.line` crash) |
| E2E   | `tests/e2e/closures.spec.ts`             | Run / Pause / Reset flow, scenario-switch crash regression            |
| E2E   | `tests/e2e/navigation.spec.ts`           | All routes load without JS errors                                     |
| E2E   | `tests/e2e/language.spec.ts`             | EN/IT switch, localStorage persistence                                |

**What's deliberately not tested:** Framer Motion animations (timing = flaky), Three.js / WebGL canvas (not testable in jsdom), scroll-driven effects.

## License

MIT
