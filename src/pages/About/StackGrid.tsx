import { motion, useInView } from "framer-motion";
import { useRef } from "react";
import { useTranslation } from "react-i18next";

const GROUPS: Array<{ key: string; items: string[] }> = [
  {
    key: "frontend",
    items: [
      "JavaScript",
      "TypeScript",
      "React",
      "Next.js",
      "Zustand",
      "SWR",
      "Framer Motion",
      "Tailwind",
      "HTML",
      "CSS",
    ],
  },
  {
    key: "runtime",
    items: ["Node.js", "REST APIs", "MongoDB", "Strapi", "Vitest"],
  },
  {
    key: "cloud",
    items: ["AWS", "Vercel", "Git · GitHub", "GitLab", "Postman"],
  },
  {
    key: "adjacent",
    items: ["GIS · Esri", "Algorand", "WordPress"],
  },
];

export function StackGrid() {
  const { t } = useTranslation();
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, amount: 0.25 });

  return (
    <section ref={ref} className="py-24 md:py-32 px-6">
      <div className="max-w-5xl mx-auto">
        <motion.p
          initial={{ opacity: 0, y: 8 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
          className="text-[10px] font-mono uppercase tracking-[0.2em] text-white/30 mb-4"
        >
          {t("about.stack.eyebrow")}
        </motion.p>
        <motion.h2
          initial={{ opacity: 0, y: 12 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.9, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
          className="text-4xl md:text-6xl font-semibold tracking-tight text-white text-balance leading-[1.05]"
        >
          {t("about.stack.title")}
        </motion.h2>
        <motion.p
          initial={{ opacity: 0, y: 12 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.9, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
          className="mt-6 text-white/70 text-lg max-w-2xl leading-relaxed"
        >
          {t("about.stack.body")}
        </motion.p>

        <div className="mt-12 max-w-2xl">
          {GROUPS.map((g, gi) => (
            <motion.div
              key={g.key}
              initial={{ opacity: 0, y: 12 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{
                duration: 0.7,
                delay: 0.3 + gi * 0.08,
                ease: [0.16, 1, 0.3, 1],
              }}
              className="py-5 border-t border-white/[0.06] first:border-t-0"
            >
              <p className="text-[10px] font-mono uppercase tracking-[0.2em] text-white/25 mb-2">
                {t(`about.stack.groups.${g.key}` as never)}
              </p>
              <p className="text-white/55 text-sm leading-relaxed">
                {g.items.join(", ")}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
