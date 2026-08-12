import { motion, useInView } from "framer-motion";
import { useRef } from "react";
import { useTranslation } from "react-i18next";

const TAGS = ["React", "TypeScript", "React Router", "Tailwind CSS"];

export function FreelanceSection() {
  const { t } = useTranslation();
  const tx = (k: string) => t(k as never);

  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, amount: 0.2 });

  return (
    <section className="max-w-5xl mx-auto px-6 border-t border-white/10">
      <div ref={ref} className="py-16 md:py-24">
        <motion.p
          initial={{ opacity: 0, y: 10 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
          className="text-[10px] font-mono uppercase tracking-[0.2em] text-white/30 mb-4"
        >
          {tx("about.freelance.eyebrow")}
        </motion.p>
        <motion.h2
          initial={{ opacity: 0, y: 12 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8, delay: 0.05, ease: [0.16, 1, 0.3, 1] }}
          className="text-3xl md:text-5xl font-semibold tracking-tight text-white"
        >
          {tx("about.freelance.title")}
        </motion.h2>

        <motion.article
          initial={{ opacity: 0, y: 16 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8, delay: 0.15, ease: [0.16, 1, 0.3, 1] }}
          className="mt-12 grid md:grid-cols-[minmax(0,220px)_minmax(0,1fr)] gap-6 md:gap-16 border-t border-white/[0.06] pt-10 md:pt-14"
        >
          <aside className="md:sticky md:top-32 self-start">
            <a
              href="https://www.pcabroker.com/en/"
              target="_blank"
              rel="noopener noreferrer"
              className="text-xs font-mono uppercase tracking-widest text-white/40 hover:text-white/70 transition-colors"
            >
              {tx("about.freelance.homerisk.client")} ↗
            </a>
            <p className="text-sm text-white/25 font-mono mt-1">
              {tx("about.freelance.homerisk.year")}
            </p>
          </aside>

          <div>
            <div className="flex items-start justify-between gap-4 flex-wrap">
              <h3 className="text-2xl md:text-3xl font-semibold tracking-tight text-white">
                {tx("about.freelance.homerisk.name")}
              </h3>
            </div>

            <p className="mt-5 text-white/60 text-lg leading-relaxed max-w-2xl">
              {tx("about.freelance.homerisk.description")}
            </p>

            <div className="mt-5 flex flex-wrap gap-2">
              {TAGS.map((tag) => (
                <span
                  key={tag}
                  className="text-xs font-mono text-white/50 border border-white/[0.08] rounded px-2.5 py-1"
                >
                  {tag}
                </span>
              ))}
            </div>
          </div>
        </motion.article>
      </div>
    </section>
  );
}
