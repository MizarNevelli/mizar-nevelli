import { motion, useInView } from "framer-motion";
import { useRef } from "react";
import { useTranslation } from "react-i18next";

/**
 * Grouped technology tags. Each group animates in as a staggered cluster.
 * Keeps skills scannable rather than the "endless badges" pattern.
 */
export function StackGrid() {
  const { t } = useTranslation();
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, amount: 0.25 });

  const groups: Array<{ key: string; items: string[] }> = [
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
        "HTML · CSS",
      ],
    },
    {
      key: "runtime",
      items: ["Node.js", "REST APIs", "MongoDB", "Strapi", "Jest"],
    },
    {
      key: "cloud",
      items: ["AWS", "Vercel", "Git · GitHub", "GitLab", "Postman"],
    },
    {
      key: "adjacent",
      items: ["Python", "GIS · Esri", "Algorand", "WordPress"],
    },
  ];

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

        <div className="mt-12 grid md:grid-cols-2 gap-x-10 gap-y-10">
          {groups.map((g, gi) => (
            <motion.div
              key={g.key}
              initial={{ opacity: 0, y: 16 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{
                duration: 0.8,
                delay: 0.3 + gi * 0.1,
                ease: [0.16, 1, 0.3, 1],
              }}
            >
              <h4 className="text-xs uppercase tracking-widest text-white/40 mb-4 flex items-center gap-3">
                <span className="inline-block h-px w-6 bg-white/25" />
                {t(`about.stack.groups.${g.key}` as never)}
              </h4>
              <ul className="flex flex-wrap gap-2">
                {g.items.map((item, i) => (
                  <motion.li
                    key={item}
                    initial={{ opacity: 0, y: 8 }}
                    animate={inView ? { opacity: 1, y: 0 } : {}}
                    transition={{
                      duration: 0.5,
                      delay: 0.4 + gi * 0.1 + i * 0.03,
                      ease: [0.16, 1, 0.3, 1],
                    }}
                    className="rounded-full border border-white/[0.12] px-3.5 py-1.5 text-sm text-white/55 hover:text-white/80 hover:border-white/25 transition-colors"
                  >
                    {item}
                  </motion.li>
                ))}
              </ul>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
