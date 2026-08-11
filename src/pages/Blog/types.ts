export type PostFrontmatter = {
  title: string
  date: string       // "YYYY-MM-DD"
  location: string
  cover: string         // "/blog/slug/cover.jpg" — used on mobile + OG
  coverDesktop?: string // optional wider crop served on md+ screens
  excerpt: string
}

export type Post = {
  slug: string
  frontmatter: PostFrontmatter
  Component: React.ComponentType
}
