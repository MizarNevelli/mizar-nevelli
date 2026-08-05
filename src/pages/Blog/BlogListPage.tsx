import { Link } from "react-router-dom";
import { PageMeta } from "../../components/PageMeta";
import { formatDate, formatOrdinal } from "../../utils/format";
import type { Post, PostFrontmatter } from "./types";

const modules = import.meta.glob<{
  default: React.ComponentType;
  frontmatter: PostFrontmatter;
}>("/content/blog/*.mdx", { eager: true });

const posts: Post[] = Object.entries(modules)
  .map(([path, mod]) => ({
    slug: path.replace("/content/blog/", "").replace(".mdx", ""),
    frontmatter: mod.frontmatter,
    Component: mod.default,
  }))
  .sort(
    (a, b) =>
      new Date(a.frontmatter.date).getTime() -
      new Date(b.frontmatter.date).getTime()
  );


export function BlogListPage() {
  return (
    <main className="relative min-h-screen bg-ink-950 pt-32 pb-24 px-6">
      <PageMeta
        title="Blog"
        description="Field notes from the road. Travel dispatches from a remote JavaScript engineer."
        path="/blog"
      />
      <div className="max-w-3xl mx-auto">
        {/* Header */}
        <p className="text-[10px] font-mono uppercase tracking-[0.2em] text-accent-soft mb-4">
          Field Notes
        </p>
        <h1 className="text-5xl md:text-6xl font-semibold tracking-tight text-white text-balance">
          Dispatches
          <br />
          <span className="text-white/35">from the road.</span>
        </h1>

        {/* Post list */}
        <ul className="mt-20">
          {posts.map((post, i) => (
            <li key={post.slug} className="border-t border-white/[0.06]">
              <Link
                to={`/blog/${post.slug}`}
                className="group flex items-start justify-between gap-6 py-10 hover:text-white transition-colors"
              >
                <div className="flex-1 min-w-0 relative pr-4">
                  {/* Ghost ordinal */}
                  <span
                    aria-hidden
                    className="absolute -top-2 -left-1 text-[5rem] leading-none font-bold text-white/[0.04] select-none pointer-events-none tabular-nums"
                  >
                    {formatOrdinal(i)}
                  </span>

                  <p className="font-mono text-[10px] uppercase tracking-widest text-accent-soft mb-2">
                    {post.frontmatter.location}
                  </p>
                  <p className="text-2xl md:text-3xl font-semibold text-white group-hover:text-white transition-colors leading-snug">
                    {post.frontmatter.title}
                  </p>
                  <p className="mt-2 text-sm text-white/40">
                    {formatDate(post.frontmatter.date)}
                  </p>
                  <p className="mt-3 text-sm text-white/50 leading-relaxed max-w-lg">
                    {post.frontmatter.excerpt}
                  </p>
                </div>

                {/* Cover — fades in from the right */}
                {post.frontmatter.cover && (
                  <div className="absolute inset-y-0 -right-6 w-[45vw] hidden sm:block overflow-hidden pointer-events-none">
                    <img
                      src={post.frontmatter.cover}
                      alt="post-preview-img"
                      className="w-full h-full object-cover opacity-25 group-hover:opacity-100 transition-opacity duration-500"
                    />
                    <div className="absolute inset-0 bg-gradient-to-r from-ink-950 via-ink-950/60 to-transparent" />
                  </div>
                )}
              </Link>
            </li>
          ))}
        </ul>

        {posts.length === 0 && (
          <p className="mt-20 text-white/30 text-sm">Nothing here yet.</p>
        )}
      </div>
    </main>
  );
}
