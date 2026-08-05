import { Link, useParams } from "react-router-dom";
import { MDXProvider } from "@mdx-js/react";
import type { Post, PostFrontmatter } from "./types";
import { PageMeta } from "../../components/PageMeta";

const SITE_URL = import.meta.env.VITE_SITE_URL ?? "https://mizarnevelli.vercel.app";

const modules = import.meta.glob<{
  default: React.ComponentType;
  frontmatter: PostFrontmatter;
}>("/src/content/blog/*.mdx", { eager: true });

const posts: Post[] = Object.entries(modules).map(([path, mod]) => ({
  slug: path.replace("/src/content/blog/", "").replace(".mdx", ""),
  frontmatter: mod.frontmatter,
  Component: mod.default,
}));

const components = {
  h1: (props: React.HTMLAttributes<HTMLHeadingElement>) => (
    <h1
      className="mt-10 mb-4 text-3xl font-semibold tracking-tight text-white"
      {...props}
    />
  ),
  h2: (props: React.HTMLAttributes<HTMLHeadingElement>) => (
    <h2
      className="mt-16 mb-5 text-3xl font-bold tracking-tight text-white"
      {...props}
    />
  ),
  h3: (props: React.HTMLAttributes<HTMLHeadingElement>) => (
    <h3 className="mt-8 mb-3 text-xl font-semibold text-white" {...props} />
  ),
  p: (props: React.HTMLAttributes<HTMLParagraphElement>) => (
    <p
      className="text-white/70 leading-[1.85] text-[1.0625rem] mb-6"
      {...props}
    />
  ),
  img: (props: React.ImgHTMLAttributes<HTMLImageElement>) => (
    // eslint-disable-next-line jsx-a11y/alt-text
    <img className="w-full rounded-xl my-8" {...props} />
  ),
  blockquote: (props: React.HTMLAttributes<HTMLQuoteElement>) => (
    <blockquote
      className="border-l-2 border-accent-soft pl-5 my-6 text-white/55 italic"
      {...props}
    />
  ),
  a: (props: React.AnchorHTMLAttributes<HTMLAnchorElement>) => (
    <a
      className="text-accent-soft underline underline-offset-4 hover:text-white transition-colors"
      {...props}
    />
  ),
  code: (props: React.HTMLAttributes<HTMLElement>) => (
    <code
      className="font-mono text-[0.9em] bg-white/[0.07] rounded px-1.5 py-0.5"
      {...props}
    />
  ),
  pre: (props: React.HTMLAttributes<HTMLPreElement>) => (
    <pre
      className="font-mono text-sm bg-white/[0.05] border border-white/[0.08] rounded-xl px-5 py-4 my-6 overflow-x-auto"
      {...props}
    />
  ),
  ul: (props: React.HTMLAttributes<HTMLUListElement>) => (
    <ul
      className="list-disc list-outside pl-5 space-y-1.5 mb-6 text-white/70"
      {...props}
    />
  ),
  ol: (props: React.OlHTMLAttributes<HTMLOListElement>) => (
    <ol
      className="list-decimal list-outside pl-5 space-y-1.5 mb-6 text-white/70"
      {...props}
    />
  ),
  li: (props: React.HTMLAttributes<HTMLLIElement>) => (
    <li className="text-[1.0625rem] leading-[1.85]" {...props} />
  ),
  hr: () => <hr className="border-white/[0.08] my-10" />,
};

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString("en-GB", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}

export function BlogPostPage() {
  const { slug } = useParams<{ slug: string }>();
  const post = posts.find((p) => p.slug === slug);

  if (!post) {
    return (
      <main className="min-h-screen bg-ink-950 flex items-center justify-center">
        <div className="text-center">
          <p className="text-white/30 text-sm mb-6">Post not found.</p>
          <Link
            to="/blog"
            className="text-white/50 hover:text-white text-sm transition-colors"
          >
            Go Back to list
          </Link>
        </div>
      </main>
    );
  }

  const { frontmatter, Component } = post;

  return (
    <main className="relative min-h-screen bg-ink-950">
      <PageMeta
        title={frontmatter.title}
        description={frontmatter.excerpt}
        image={frontmatter.cover ? `${SITE_URL}${frontmatter.cover}` : undefined}
        path={`/blog/${post.slug}`}
      />
      {/* Cover image — absolutely positioned, bleeds behind title and into prose */}
      {frontmatter.cover && (
        <div className="absolute inset-x-0 top-0 h-[92vh] overflow-hidden pointer-events-none">
          <img
            src={frontmatter.cover}
            alt={frontmatter.title}
            className="w-full h-full object-cover object-center"
          />
          <div
            className="absolute inset-0"
            style={{
              background:
                "linear-gradient(to bottom, rgba(5,6,10,0.25) 0%, rgba(5,6,10,0.4) 45%, rgba(5,6,10,0.82) 72%, rgba(5,6,10,1) 100%)",
            }}
          />
        </div>
      )}

      {/* Title — floats over the image */}
      <div
        className="relative z-10 flex items-end px-6"
        style={{
          minHeight: frontmatter.cover ? "72vh" : "auto",
          paddingTop: frontmatter.cover ? 0 : "8rem",
          paddingBottom: "2.5rem",
        }}
      >
        <div className="max-w-2xl mx-auto w-full">
          <p className="font-mono text-[10px] uppercase tracking-widest text-accent-soft mb-3">
            {frontmatter.location}
          </p>
          <h1 className="text-4xl md:text-5xl font-semibold tracking-tight text-white leading-tight text-balance">
            {frontmatter.title}
          </h1>
        </div>
      </div>

      {/* Metadata + prose — flows directly below, image already faded */}
      <div className="relative z-10 max-w-2xl mx-auto px-6 pt-8 pb-32">
        {/* Back link + date */}
        <div className="flex items-center justify-between mb-12">
          <Link
            to="/blog"
            className="text-white/35 hover:text-white text-sm transition-colors"
          >
            Go back to list
          </Link>
          <time
            dateTime={frontmatter.date}
            className="font-mono text-[11px] text-white/30 uppercase tracking-widest"
          >
            {formatDate(frontmatter.date)}
          </time>
        </div>

        {/* MDX content */}
        <MDXProvider
          components={components as Record<string, React.ComponentType>}
        >
          <article>
            <Component />
          </article>
        </MDXProvider>
      </div>
    </main>
  );
}
