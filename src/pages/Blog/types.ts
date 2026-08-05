export type PostFrontmatter = {
  title: string
  date: string       // "YYYY-MM-DD"
  location: string
  cover: string      // "/blog/slug/cover.jpg"
  excerpt: string
}

export type Post = {
  slug: string
  frontmatter: PostFrontmatter
  Component: React.ComponentType
}
