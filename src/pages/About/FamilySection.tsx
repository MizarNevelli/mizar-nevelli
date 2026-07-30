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
    <section ref={ref} className="relative py-24 md:py-32">
      <div className="max-w-5xl mx-auto">
        <motion.a
          href={CHEF_AKELA_URL}
          target="_blank"
          rel="noreferrer noopener"
          initial={{ opacity: 0, y: 16 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
          className="group block border-t border-white/10 pt-8 pb-4 hover:border-white/20 transition-colors duration-500"
        >
          <p className="text-[10px] font-mono uppercase tracking-[0.2em] text-white/30">
            {t("about.family.eyebrow")}
          </p>
          <h3
            className="mt-5 text-2xl md:text-3xl font-semibold text-white tracking-tight"
            dangerouslySetInnerHTML={{ __html: t("about.family.title") }}
          ></h3>
          <p className="mt-3 text-white/45 text-sm leading-relaxed max-w-xl">
            {t("about.family.body")}
          </p>

          <div className="mt-6 inline-flex items-center gap-1.5 text-[11px] font-mono text-white/30 group-hover:text-accent-soft transition-colors duration-300">
            {t("about.family.cta")}
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
