import { motion, useInView } from "framer-motion";
import { useRef } from "react";
import { Trans, useTranslation } from "react-i18next";

type ChapterProps = {
  chapterKey: string;
};

export function Chapter({ chapterKey }: ChapterProps) {
  const { t } = useTranslation();
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, amount: 0.3 });

  const base = `about.chapters.${chapterKey}`;
  const tx = (key: string) => t(key as never);

  return (
    <article
      ref={ref}
      className="relative grid md:grid-cols-[minmax(0,220px)_minmax(0,1fr)] gap-6 md:gap-16 py-20 md:py-28"
    >
      {/* Sticky year rail */}
      <aside className="md:sticky md:top-32 self-start">
        <div className="relative flex md:flex-col items-baseline md:items-start gap-4 md:gap-3 overflow-hidden">
          <span
            aria-hidden
            className="absolute -top-3 -left-2 text-[4.5rem] md:text-[6rem] font-bold leading-none text-white/[0.04] select-none pointer-events-none tabular-nums"
          >
            {tx(`${base}.year`)}
          </span>
          <div className="relative text-5xl md:text-6xl font-semibold text-white/90 tracking-tight tabular-nums">
            {tx(`${base}.year`)}
          </div>
          <div className="relative flex items-center gap-2 text-xs uppercase tracking-widest text-white/40">
            <span className="inline-block h-px w-6 bg-white/20" />
            <span>{tx(`${base}.place`)}</span>
          </div>
        </div>
      </aside>

      {/* Chapter body */}
      <div>
        <motion.p
          initial={{ opacity: 0, y: 12 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
          className="text-[10px] font-mono uppercase tracking-[0.2em] text-white/30 mb-4"
        >
          {tx(`${base}.eyebrow`)}
        </motion.p>
        <motion.h3
          initial={{ opacity: 0, y: 12 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{
            duration: 0.9,
            delay: 0.1,
            ease: [0.16, 1, 0.3, 1],
          }}
          className="text-3xl md:text-5xl font-semibold tracking-tight text-white text-balance leading-[1.1]"
        >
          {tx(`${base}.title`)}
        </motion.h3>
        <motion.p
          initial={{ opacity: 0, y: 12 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{
            duration: 0.9,
            delay: 0.2,
            ease: [0.16, 1, 0.3, 1],
          }}
          className="mt-6 text-white/70 text-lg leading-relaxed max-w-2xl"
        >
          <Trans
            i18nKey={`${base}.body` as never}
            components={{ em: <em className="text-white" /> }}
          />
        </motion.p>
      </div>
    </article>
  );
}
