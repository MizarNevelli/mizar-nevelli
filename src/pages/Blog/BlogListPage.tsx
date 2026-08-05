import { Link } from "react-router-dom";
import { PageMeta } from "../../components/PageMeta";
import type { Post, PostFrontmatter } from "./types";

const modules = import.meta.glob<{
  default: React.ComponentType;
  frontmatter: PostFrontmatter;
}>("/src/content/blog/*.mdx", { eager: true });

const posts: Post[] = Object.entries(modules)
  .map(([path, mod]) => ({
    slug: path.replace("/src/content/blog/", "").replace(".mdx", ""),
    frontmatter: mod.frontmatter,
    Component: mod.default,
  }))
  .sort(
    (a, b) =>
      new Date(b.frontmatter.date).getTime() -
      new Date(a.frontmatter.date).getTime()
  );

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString("en-GB", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}

export function BlogListPage() {
  return (
    <main className="relative min-h-screen bg-ink-950 pt-32 pb-24 px-6">
      <PageMeta title="Blog" description="Field notes from the road. Travel dispatches from a remote JavaScript engineer." path="/blog" />
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
                <div className="flex-1 min-w-0 relative">
                  {/* Ghost ordinal */}
                  <span
                    aria-hidden
                    className="absolute -top-2 -left-1 text-[5rem] leading-none font-bold text-white/[0.04] select-none pointer-events-none tabular-nums"
                  >
                    {String(i + 1).padStart(2, "0")}
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

                {/* Thumbnail */}
                {post.frontmatter.cover && (
                  <div className="shrink-0 hidden sm:block">
                    <img
                      src={post.frontmatter.cover}
                      alt=""
                      className="w-20 h-20 object-cover rounded-lg opacity-70 group-hover:opacity-100 transition-opacity"
                    />
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
