import { Link } from "react-router-dom";

type FeatureCardProps = {
  to: string;
  eyebrow: string;
  title: string;
  body: string;
  cta: string;
  /** Roman-numeral index for the corner tag (e.g. "I", "II"). */
  index: string;
};

/**
 * An index-card feature reference. Flat, hairline-bordered, roman-numeral tag
 * top-left. On hover the arrow slides and the border brightens — no glow.
 */
export function FeatureCard({
  to,
  eyebrow,
  title,
  body,
  cta,
  index,
}: FeatureCardProps) {
  return (
    <Link
      to={to}
      className="group relative block hair p-8 md:p-10 transition-colors hover:border-star/50"
    >
      <div className="flex items-baseline justify-between">
        <span className="obs-label">Obs. {index}</span>
        <span className="coord">{eyebrow}</span>
      </div>
      <h3 className="mt-8 font-display text-3xl md:text-4xl text-bone leading-tight">
        {title}
      </h3>
      <p className="mt-4 text-bone/60 max-w-md leading-relaxed">{body}</p>
      <div className="mt-10 hair-t pt-4 flex items-center justify-between text-sm text-bone/70 group-hover:text-star transition-colors">
        <span className="link-underline">{cta}</span>
        <span className="transition-transform group-hover:translate-x-1">→</span>
      </div>
    </Link>
  );
}
