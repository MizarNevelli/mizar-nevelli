import { motion, useInView } from "framer-motion";
import { useRef } from "react";
import { useTranslation } from "react-i18next";

/**
 * Two-column pull-quote for the hobbies section. Snow | Water split with
 * animated SVG evocations (a peak, a wave) that draw themselves on reveal.
 */
export function OffKeyboard() {
  const { t } = useTranslation();
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, amount: 0.35 });

  return (
    <section
      ref={ref}
      className="relative py-24 md:py-32 border-y border-white/10"
    >
      <div className="max-w-5xl mx-auto px-6">
        <motion.p
          initial={{ opacity: 0, y: 8 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
          className="text-[10px] font-mono uppercase tracking-[0.2em] text-white/30 mb-4"
        >
          {t("about.offKeyboard.eyebrow")}
        </motion.p>
        <motion.h2
          initial={{ opacity: 0, y: 12 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.9, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
          className="text-4xl md:text-6xl font-semibold tracking-tight text-white text-balance leading-[1.05] max-w-3xl"
        >
          {t("about.offKeyboard.title")}
        </motion.h2>
        <motion.p
          initial={{ opacity: 0, y: 12 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.9, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
          className="mt-6 text-white/70 text-lg leading-relaxed max-w-2xl"
        >
          {t("about.offKeyboard.body")}
        </motion.p>

        <div className="mt-14 grid md:grid-cols-2 gap-6">
          <HorizonTile
            variant="snow"
            title={t("about.offKeyboard.snow")}
            sub={t("about.offKeyboard.snowSub")}
            delay={0.25}
            inView={inView}
          />
          <HorizonTile
            variant="water"
            title={t("about.offKeyboard.water")}
            sub={t("about.offKeyboard.waterSub")}
            delay={0.4}
            inView={inView}
          />
        </div>
      </div>
    </section>
  );
}

type HorizonTileProps = {
  variant: "snow" | "water";
  title: string;
  sub: string;
  delay: number;
  inView: boolean;
};

function HorizonTile({ variant, title, sub, delay, inView }: HorizonTileProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.9, delay, ease: [0.16, 1, 0.3, 1] }}
      className="relative overflow-hidden glass rounded-3xl p-8 min-h-[220px] flex flex-col justify-between group"
    >
      <div className="relative z-10">
        <p className="text-4xl md:text-5xl font-semibold text-white tracking-tight">
          {title}
        </p>
        <p className="mt-2 text-white/60 text-sm">— {sub}</p>
      </div>
      <div className="absolute inset-x-0 bottom-0 h-32 pointer-events-none">
        {variant === "snow" ? <PeakSvg inView={inView} /> : <WaveSvg inView={inView} />}
      </div>
    </motion.div>
  );
}

function PeakSvg({ inView }: { inView: boolean }) {
  return (
    <svg viewBox="0 0 400 128" className="w-full h-full" preserveAspectRatio="none">
      <motion.polyline
        points="0,120 80,72 130,90 210,20 290,80 350,52 400,90"
        fill="none"
        stroke="url(#peakG)"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
        initial={{ pathLength: 0, opacity: 0 }}
        animate={inView ? { pathLength: 1, opacity: 1 } : {}}
        transition={{ duration: 1.6, delay: 0.5, ease: [0.16, 1, 0.3, 1] }}
      />
      <defs>
        <linearGradient id="peakG" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0" stopColor="rgba(255,255,255,0.15)" />
          <stop offset="0.5" stopColor="rgba(255,255,255,0.6)" />
          <stop offset="1" stopColor="rgba(255,255,255,0.15)" />
        </linearGradient>
      </defs>
    </svg>
  );
}

function WaveSvg({ inView }: { inView: boolean }) {
  return (
    <svg viewBox="0 0 400 128" className="w-full h-full" preserveAspectRatio="none">
      <motion.path
        d="M0,80 C60,60 100,100 160,80 C220,60 260,100 320,80 C360,66 380,90 400,80"
        fill="none"
        stroke="url(#waveG)"
        strokeWidth="1.5"
        strokeLinecap="round"
        initial={{ pathLength: 0, opacity: 0 }}
        animate={inView ? { pathLength: 1, opacity: 1 } : {}}
        transition={{ duration: 1.6, delay: 0.5, ease: [0.16, 1, 0.3, 1] }}
      />
      <motion.path
        d="M0,100 C60,84 100,116 160,100 C220,84 260,116 320,100 C360,90 380,108 400,100"
        fill="none"
        stroke="rgba(170,140,255,0.35)"
        strokeWidth="1.2"
        strokeLinecap="round"
        initial={{ pathLength: 0, opacity: 0 }}
        animate={inView ? { pathLength: 1, opacity: 1 } : {}}
        transition={{ duration: 1.6, delay: 0.7, ease: [0.16, 1, 0.3, 1] }}
      />
      <defs>
        <linearGradient id="waveG" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0" stopColor="rgba(170,140,255,0.2)" />
          <stop offset="0.5" stopColor="rgba(255,255,255,0.7)" />
          <stop offset="1" stopColor="rgba(170,140,255,0.2)" />
        </linearGradient>
      </defs>
    </svg>
  );
}
