import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
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
      new Date(b.frontmatter.date).getTime() -
      new Date(a.frontmatter.date).getTime()
  );

export function BlogListPage() {
  const { t, i18n } = useTranslation();
  return (
    <main className="relative h-[100dvh] bg-ink-950 flex flex-col overflow-hidden pt-24 md:pt-32 px-6">
      <PageMeta
        title="Blog"
        description="Field notes from the road. Travel dispatches from a remote JavaScript engineer."
        path="/blog"
      />
      <div className="max-w-5xl mx-auto w-full flex flex-col flex-1 min-h-0">
        <p className="text-[10px] font-mono uppercase tracking-[0.2em] text-accent-soft mb-4">
          {t("blog.eyebrow")}
        </p>
        <h1 className="text-4xl md:text-6xl font-semibold tracking-tight text-white text-balance">
          {t("blog.titleLine1")}
          <br />
          <span className="text-white/35">{t("blog.titleLine2")}</span>
        </h1>
        <div className="md:max-w-[40vw] mt-2 mb-2 md:mb-5">
          {t("blog.subtitle")}
        </div>

        <ul className="flex-1 min-h-0 overflow-y-auto pb-10 scrollbar-none [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
          {posts.map((post, i) => (
            <li key={post.slug} className="border-t border-white/[0.06]">
              <Link
                to={`/blog/${post.slug}`}
                className="group flex items-start justify-between gap-6 py-10 hover:text-white transition-colors"
              >
                <div className="flex-1 min-w-0 w-full relative pr-4">
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
                    {formatDate(post.frontmatter.date, i18n.resolvedLanguage)}
                  </p>
                  <p className="mt-3 text-sm text-white/50 leading-relaxed max-w-lg">
                    {post.frontmatter.excerpt}
                  </p>
                </div>

                {post.frontmatter.cover && (
                  <div className="absolute inset-y-0 right-0 w-[45vw] hidden sm:block overflow-hidden pointer-events-none">
                    <img
                      src={post.frontmatter.cover}
                      alt={post.frontmatter.title}
                      className="w-full h-full object-cover opacity-[0.04] group-hover:opacity-95 transition-opacity duration-500"
                    />
                    <div className="absolute inset-0 bg-gradient-to-r from-ink-950 via-transparent to-transparent" />
                  </div>
                )}
              </Link>
            </li>
          ))}
        </ul>

        {posts.length === 0 && (
          <p className="mt-20 text-white/30 text-sm">{t("blog.empty")}</p>
        )}
      </div>
    </main>
  );
}
