import { motion, useInView } from "framer-motion";
import { useRef } from "react";
import { useTranslation } from "react-i18next";

const CHEF_AKELA_URL = "https://www.chefakela.com/";
const AKELA_PHOTO =
  "https://static.wixstatic.com/media/5197e6_bde618d7ad974c77aa5c597aa095e59f~mv2.jpg/v1/crop/x_80,y_297,w_1285,h_1740/fill/w_639,h_866,al_c,q_85,usm_0.66_1.00_0.01,enc_avif,quality_auto/Chef%20Akela-2.jpg";

export function FamilySection() {
  const { t } = useTranslation();
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, amount: 0.3 });

  return (
    <section ref={ref} className="relative py-16 px-6">
      <div className="max-w-5xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
          className="border-t border-white/10 pt-12"
        >
          <div className="grid md:grid-cols-[1fr_300px] gap-8 md:gap-12 items-start">
            <div>
              <p className="text-[10px] font-mono uppercase tracking-[0.2em] text-white/30">
                {t("about.family.eyebrow")}
              </p>
              <h3
                className="mt-5 text-2xl md:text-3xl font-semibold text-white tracking-tight"
                dangerouslySetInnerHTML={{ __html: t("about.family.title") }}
              />
              <p className="text-lg text-white/45 leading-relaxed mt-5">
                {t("about.family.body")}
              </p>
              <a
                href={CHEF_AKELA_URL}
                target="_blank"
                rel="noreferrer noopener"
                className="group mt-6 inline-flex items-center gap-1.5 text-[11px] font-mono text-white/30 hover:text-accent-soft transition-colors duration-300"
              >
                {t("about.family.cta")}
                <ExternalArrow />
              </a>
            </div>

            <div
              className="relative"
              style={
                {
                  aspectRatio: "3/4",
                  maskImage: [
                    "linear-gradient(to right, transparent, black 20%, black 80%, transparent)",
                    "linear-gradient(to bottom, transparent 0%, black 16%, black 68%, transparent 100%)",
                  ].join(", "),
                  maskComposite: "intersect",
                  WebkitMaskImage: [
                    "linear-gradient(to right, transparent, black 20%, black 80%, transparent)",
                    "linear-gradient(to bottom, transparent 0%, black 16%, black 68%, transparent 100%)",
                  ].join(", "),
                  WebkitMaskComposite: "source-in",
                } as React.CSSProperties
              }
            >
              <img
                src={AKELA_PHOTO}
                alt="Akela Nevelli"
                className="absolute inset-0 w-full h-full object-cover grayscale brightness-[0.78] contrast-[1.12]"
              />
            </div>
          </div>
        </motion.div>
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
