import { Link } from "react-router-dom";

type FeatureCardProps = {
  to: string;
  eyebrow: string;
  title: string;
  body: string;
  cta: string;
};

export function FeatureCard({ to, eyebrow, title, body, cta }: FeatureCardProps) {
  return (
    <Link
      to={to}
      className="group relative block glass rounded-3xl p-8 md:p-10 overflow-hidden transition-transform duration-500 hover:-translate-y-1"
    >
      <div className="absolute -top-24 -right-24 h-64 w-64 rounded-full bg-accent/20 blur-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
      <p className="text-accent-soft uppercase tracking-widest text-xs">
        {eyebrow}
      </p>
      <h3 className="mt-3 text-3xl md:text-4xl font-semibold text-white tracking-tight">
        {title}
      </h3>
      <p className="mt-4 text-white/60 max-w-md">{body}</p>
      <div className="mt-8 inline-flex items-center gap-2 text-white/80 group-hover:text-accent-soft transition-colors">
        {cta}
        <span className="transition-transform group-hover:translate-x-1">
          →
        </span>
      </div>
    </Link>
  );
}
