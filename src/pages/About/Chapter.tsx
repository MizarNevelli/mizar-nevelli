import { motion, useInView } from "framer-motion";
import { useRef } from "react";
import { Trans, useTranslation } from "react-i18next";

type ChapterProps = {
  chapterKey: string;
};

/**
 * A single life-chapter block. Left rail: sticky year + place chip that stays
 * visible while the chapter is in view. Right column: eyebrow, title, body.
 * Uses `Trans` on the body so translations can embed HTML (`<em>` etc).
 */
export function Chapter({ chapterKey }: ChapterProps) {
  const { t } = useTranslation();
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, amount: 0.3 });

  const base = `about.chapters.${chapterKey}`;
  const tAny = t as (key: string) => string;

  return (
    <article
      ref={ref}
      className="relative grid md:grid-cols-[minmax(0,220px)_minmax(0,1fr)] gap-6 md:gap-16 py-20 md:py-28"
    >
      {/* Sticky year rail */}
      <aside className="md:sticky md:top-32 self-start">
        <div className="flex md:flex-col items-baseline md:items-start gap-4 md:gap-3">
          <div className="text-5xl md:text-6xl font-semibold text-white/90 tracking-tight tabular-nums">
            {tAny(`${base}.year`)}
          </div>
          <div className="flex items-center gap-2 text-xs uppercase tracking-widest text-white/40">
            <span className="inline-block h-px w-6 bg-white/20" />
            <span>{tAny(`${base}.place`)}</span>
          </div>
        </div>
      </aside>

      {/* Chapter body */}
      <div>
        <motion.p
          initial={{ opacity: 0, y: 12 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
          className="text-accent-soft uppercase tracking-widest text-xs mb-4"
        >
          {tAny(`${base}.eyebrow`)}
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
          {tAny(`${base}.title`)}
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
