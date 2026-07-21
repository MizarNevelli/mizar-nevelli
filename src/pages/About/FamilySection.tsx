import { motion, useInView } from "framer-motion";
import { useRef } from "react";
import { useTranslation } from "react-i18next";

const CHEF_AKELA_URL = "https://www.chefakela.com/";

/**
 * A small family aside — a linked mini-card pointing to the user's brother's
 * site (Akela Nevelli, chef & businessman). Sits between the hobbies split
 * and the tech-stack block. Deliberately quieter than surrounding sections
 * so it reads as a personal footnote, not a paid promo.
 */
export function FamilySection() {
  const { t } = useTranslation();
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, amount: 0.4 });

  return (
    <section ref={ref} className="relative py-24 md:py-32 px-6">
      <div className="max-w-3xl mx-auto">
        <motion.a
          href={CHEF_AKELA_URL}
          target="_blank"
          rel="noreferrer noopener"
          initial={{ opacity: 0, y: 16 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
          className="group relative block glass rounded-3xl p-8 md:p-10 overflow-hidden transition-transform duration-500 hover:-translate-y-0.5"
        >
          <div className="absolute -top-24 -right-24 h-64 w-64 rounded-full bg-accent/20 blur-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none" />

          <p className="text-accent-soft uppercase tracking-widest text-xs">
            {t("about.family.eyebrow")}
          </p>
          <h3 className="mt-3 text-3xl md:text-4xl font-semibold text-white tracking-tight">
            {t("about.family.title")}
          </h3>
          <p className="mt-4 text-white/60 leading-relaxed max-w-2xl">
            {t("about.family.body")}
          </p>

          <div className="mt-8 inline-flex items-center gap-2 text-white/80 group-hover:text-accent-soft transition-colors">
            <span className="font-mono text-sm">{t("about.family.cta")}</span>
            <ExternalArrow />
          </div>
        </motion.a>
      </div>
    </section>
  );
}

function ExternalArrow() {
  return (
    <svg
      width="14"
      height="14"
      viewBox="0 0 14 14"
      aria-hidden
      className="transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
    >
      <path
        d="M4 10L10 4M10 4H5M10 4V9"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}
