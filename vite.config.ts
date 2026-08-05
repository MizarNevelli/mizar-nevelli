import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import mdx from '@mdx-js/rollup'
import remarkFrontmatter from 'remark-frontmatter'
import remarkMdxFrontmatter from 'remark-mdx-frontmatter'
import sitemap from 'vite-plugin-sitemap'

export default defineConfig({
  plugins: [
    mdx({
      remarkPlugins: [remarkFrontmatter, remarkMdxFrontmatter],
      providerImportSource: "@mdx-js/react",
    }),
    sitemap({
      hostname: process.env.VITE_SITE_URL ?? 'https://mizarnevelli.vercel.app',
      dynamicRoutes: [
        '/',
        '/about',
        '/blog',
        '/blog/portugal-2022',
        '/contact',
        '/event-loop',
        '/event-bubbling',
        '/closures',
      ],
      generateRobotsTxt: false,
    }),
    react(),
  ],
})
