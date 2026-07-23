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
      className="group block border-t border-white/10 pt-8 pb-4 hover:border-white/20 transition-colors duration-500"
    >
      <p className="text-[10px] font-mono uppercase tracking-[0.22em] text-white/30">
        {eyebrow}
      </p>
      <h3 className="mt-5 text-2xl md:text-3xl font-semibold tracking-tight text-white">
        {title}
      </h3>
      <p className="mt-3 text-white/45 text-sm leading-relaxed max-w-sm">
        {body}
      </p>
      <div className="mt-6 flex items-center gap-1.5 text-[11px] font-mono text-white/30 group-hover:text-accent-soft transition-colors duration-300">
        {cta}
        <span className="transition-transform group-hover:translate-x-1 inline-block">
          →
        </span>
      </div>
    </Link>
  );
}
