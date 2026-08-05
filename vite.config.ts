import { defineConfig, type Plugin } from 'vite'
import react from '@vitejs/plugin-react'
import mdx from '@mdx-js/rollup'
import remarkFrontmatter from 'remark-frontmatter'
import remarkMdxFrontmatter from 'remark-mdx-frontmatter'
import sitemap from 'vite-plugin-sitemap'
import { readdirSync, readFileSync, writeFileSync, mkdirSync, existsSync, statSync } from 'fs'
import { join, extname } from 'path'
import sharp from 'sharp'

const SITE_URL = process.env.VITE_SITE_URL ?? 'https://mizarnevelli.vercel.app'
const DEFAULT_OG = `${SITE_URL}/og.png`

type RouteMeta = {
  path: string
  title: string
  description: string
  image?: string
}

function parseFrontmatter(content: string): Record<string, string> {
  const match = content.match(/^---\r?\n([\s\S]*?)\r?\n---/)
  if (!match) return {}
  const result: Record<string, string> = {}
  for (const line of match[1].split('\n')) {
    const colon = line.indexOf(':')
    if (colon === -1) continue
    const key = line.slice(0, colon).trim()
    const val = line.slice(colon + 1).trim().replace(/^["']|["']$/g, '')
    result[key] = val
  }
  return result
}

function collectRoutes(root: string): RouteMeta[] {
  const routes: RouteMeta[] = [
    { path: '/', title: 'Mizar', description: 'Interactive JavaScript explainers built by a developer who codes on the road.' },
    { path: '/about', title: 'About', description: 'The story behind the name — a developer, seven countries, eight years of JavaScript.' },
    { path: '/blog', title: 'Blog', description: 'Field notes from the road. Travel dispatches from a remote JavaScript engineer.' },
    { path: '/contact', title: 'Contact', description: 'Get in touch about projects, freelance work, or collaborations.' },
    { path: '/event-loop', title: 'Event Loop', description: 'A visual walkthrough of the JavaScript event loop — call stack, microtasks, and task queue.' },
    { path: '/event-bubbling', title: 'Event Bubbling', description: 'See how DOM events propagate through the tree, step by step.' },
    { path: '/closures', title: 'Closures', description: 'Functions that carry their scope — an interactive guide to JavaScript closures.' },
  ]

  // Auto-discover blog posts from MDX frontmatter
  const blogDir = join(root, 'content/blog')
  if (existsSync(blogDir)) {
    for (const file of readdirSync(blogDir).filter(f => f.endsWith('.mdx'))) {
      const fm = parseFrontmatter(readFileSync(join(blogDir, file), 'utf-8'))
      const slug = file.replace('.mdx', '')
      routes.push({
        path: `/blog/${slug}`,
        title: fm.title ?? slug,
        description: fm.excerpt ?? '',
        image: fm.cover ? `${SITE_URL}${fm.cover}` : undefined,
      })
    }
  }

  return routes
}

function buildMetaBlock(route: RouteMeta): string {
  const fullTitle = route.title === 'Mizar' ? 'Mizar' : `${route.title} · Mizar`
  const image = route.image ?? DEFAULT_OG
  const url = `${SITE_URL}${route.path}`
  return [
    `<!-- ROUTE_META_START -->`,
    `    <title>${fullTitle}</title>`,
    `    <meta name="description" content="${route.description}">`,
    `    <link rel="canonical" href="${url}">`,
    `    <meta property="og:type" content="website">`,
    `    <meta property="og:site_name" content="Mizar">`,
    `    <meta property="og:title" content="${fullTitle}">`,
    `    <meta property="og:description" content="${route.description}">`,
    `    <meta property="og:image" content="${image}">`,
    `    <meta property="og:url" content="${url}">`,
    `    <meta name="twitter:card" content="summary_large_image">`,
    `    <meta name="twitter:title" content="${fullTitle}">`,
    `    <meta name="twitter:description" content="${route.description}">`,
    `    <meta name="twitter:image" content="${image}">`,
    `    <!-- ROUTE_META_END -->`,
  ].join('\n')
}

function collectImages(dir: string, found: string[] = []): string[] {
  if (!existsSync(dir)) return found
  for (const entry of readdirSync(dir, { withFileTypes: true })) {
    const full = join(dir, entry.name)
    if (entry.isDirectory()) collectImages(full, found)
    else if (/\.(jpe?g|png|webp)$/i.test(entry.name)) found.push(full)
  }
  return found
}

function compressBlogImages(): Plugin {
  return {
    name: 'compress-blog-images',
    apply: 'build',
    async closeBundle() {
      const blogDir = join(process.cwd(), 'dist/blog')
      const images = collectImages(blogDir)
      if (!images.length) return

      let saved = 0
      for (const file of images) {
        const before = statSync(file).size
        const ext = extname(file).toLowerCase()
        const img = sharp(file).rotate().resize({ width: 1200, withoutEnlargement: true })

        let buf: Buffer
        if (ext === '.png') buf = await img.png({ compressionLevel: 9 }).toBuffer()
        else if (ext === '.webp') buf = await img.webp({ quality: 60 }).toBuffer()
        else buf = await img.jpeg({ quality: 60, progressive: true, mozjpeg: true }).toBuffer()

        writeFileSync(file, buf)
        saved += before - buf.length
      }

      const kb = (saved / 1024).toFixed(0)
      console.log(`[compress-blog-images] ${images.length} image(s), saved ${kb} KB`)
    },
  }
}

function staticMeta(): Plugin {
  return {
    name: 'static-meta',
    apply: 'build',
    closeBundle() {
      const root = process.cwd()
      const distIndex = join(root, 'dist/index.html')
      if (!existsSync(distIndex)) return

      const template = readFileSync(distIndex, 'utf-8')
      const routes = collectRoutes(root)
      const marker = /[ \t]*<!-- ROUTE_META_START -->[\s\S]*?<!-- ROUTE_META_END -->/

      for (const route of routes) {
        const html = template.replace(marker, buildMetaBlock(route))

        if (route.path === '/') {
          writeFileSync(distIndex, html)
        } else {
          const dir = join(root, 'dist', route.path)
          mkdirSync(dir, { recursive: true })
          writeFileSync(join(dir, 'index.html'), html)
        }
      }

      console.log(`[static-meta] wrote ${routes.length} HTML files`)
    },
  }
}

export default defineConfig({
  plugins: [
    mdx({
      remarkPlugins: [remarkFrontmatter, remarkMdxFrontmatter],
      providerImportSource: "@mdx-js/react",
    }),
    sitemap({
      hostname: SITE_URL,
      dynamicRoutes: [
        '/',
        '/about',
        '/blog',
        '/contact',
        '/event-loop',
        '/event-bubbling',
        '/closures',
        // blog slugs are added automatically by staticMeta — sitemap still needs manual additions
        '/blog/portugal-2022',
      ],
      generateRobotsTxt: false,
    }),
    compressBlogImages(),
    staticMeta(),
    react(),
  ],
})
