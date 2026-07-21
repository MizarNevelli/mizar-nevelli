import { motion, useScroll, useTransform } from "framer-motion";
import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";
import { SpaceScene } from "./SpaceScene";
import { Chapter } from "./Chapter";
import { OffKeyboard } from "./OffKeyboard";
import { FamilySection } from "./FamilySection";
import { StackGrid } from "./StackGrid";

const CHAPTER_KEYS = [
  "origin",
  "leap",
  "pivot",
  "firstCommit",
  "engineering",
  "matures",
  "now",
] as const;

/**
 * About page — a long-scroll narrative told in seven chapters, with a
 * hobbies split, a stack survey, and a closing CTA. Every section fades in on
 * view; the chapter year rails stick to the viewport as their body scrolls.
 */
export function AboutPage() {
  const { t } = useTranslation();

  // Hero fades + drifts as user starts to scroll.
  const { scrollY } = useScroll();
  const heroOpacity = useTransform(scrollY, [0, 500], [1, 0]);
  const heroY = useTransform(scrollY, [0, 500], [0, -60]);

  return (
    <main className="relative">
      {/* ────────── HERO ────────── */}
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
        <SpaceScene />
        {/* Radial vignette — darkest exactly behind the centered text, fully
           transparent at the corners so the starfield stays visible there. */}
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            background:
              "radial-gradient(ellipse 65% 55% at 50% 50%, rgba(5,6,10,0.9) 0%, rgba(5,6,10,0.7) 30%, rgba(5,6,10,0) 75%)",
          }}
        />
        {/* Extra fade at the bottom edge so the hero blends into the chapters. */}
        <div className="absolute inset-x-0 bottom-0 h-40 bg-gradient-to-b from-transparent to-ink-950 pointer-events-none" />

        {/* Labeled Mizar star — a single glowing dot in the corner. */}
        <div className="absolute top-[22%] right-[18%] hidden md:flex flex-col items-end gap-1 pointer-events-none z-10">
          <div className="flex items-baseline gap-2">
            <span className="text-xs text-white/60 [text-shadow:_0_1px_10px_rgba(5,6,10,0.9)]">
              Mizar, the star
            </span>
            <span className="inline-block h-2 w-2 rounded-full bg-white shadow-[0_0_20px_6px_rgba(170,140,255,0.7)]" />
          </div>
          <span className="text-[11px] text-white/40 [text-shadow:_0_1px_10px_rgba(5,6,10,0.9)]">
            in the Big Dipper's handle
          </span>
        </div>

        <motion.div
          style={{
            opacity: heroOpacity,
            y: heroY,
            willChange: "transform, opacity",
          }}
          className="relative z-10 text-center px-6 max-w-4xl"
        >
          <motion.p
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
            className="text-accent-soft uppercase tracking-widest text-xs mb-6 [text-shadow:_0_2px_20px_rgba(5,6,10,0.9)]"
          >
            {t("about.hero.eyebrow")}
          </motion.p>
          <motion.h1
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
            className="text-5xl md:text-8xl font-semibold tracking-tight gradient-text text-balance leading-[1.02] [text-shadow:_0_2px_30px_rgba(5,6,10,0.6)]"
          >
            {t("about.hero.titleLine1")}
            <br />
            {t("about.hero.titleLine2")}
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.4, ease: [0.16, 1, 0.3, 1] }}
            className="mt-8 text-base md:text-lg text-white/70 max-w-2xl mx-auto leading-relaxed text-balance [text-shadow:_0_2px_20px_rgba(5,6,10,0.9)]"
          >
            {t("about.hero.subtitle")}
          </motion.p>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.7, delay: 0.8 }}
            className="mt-16 flex items-center justify-center gap-3 text-xs uppercase tracking-widest text-white/40"
          >
            <span className="inline-block h-px w-8 bg-white/20" />
            <span>{t("about.hero.scrollHint")}</span>
            <span className="inline-block h-px w-8 bg-white/20" />
          </motion.div>
        </motion.div>
      </section>

      {/* ────────── CHAPTERS ────────── */}
      <section className="relative">
        {/* Faint vertical thread down the left rail (desktop only) */}
        <div
          aria-hidden
          className="hidden md:block absolute top-0 bottom-0 left-1/2 -translate-x-[calc(50%+220px)] w-px bg-gradient-to-b from-transparent via-white/10 to-transparent pointer-events-none"
        />
        <div className="max-w-5xl mx-auto px-6 divide-y divide-white/10">
          {CHAPTER_KEYS.map((k) => (
            <Chapter key={k} chapterKey={k} />
          ))}
        </div>
      </section>

      {/* ────────── OFF THE KEYBOARD ────────── */}
      <OffKeyboard />

      {/* ────────── FAMILY ────────── */}
      <FamilySection />

      {/* ────────── STACK ────────── */}
      <StackGrid />

      {/* ────────── CLOSING CTA ────────── */}
      <section className="relative py-32 px-6 border-t border-white/10 overflow-hidden">
        <div className="absolute inset-0 bg-radial-fade pointer-events-none" />
        <div className="relative max-w-3xl mx-auto text-center">
          <motion.p
            initial={{ opacity: 0, y: 8 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.4 }}
            transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
            className="text-accent-soft uppercase tracking-widest text-xs mb-4"
          >
            {t("about.closing.eyebrow")}
          </motion.p>
          <motion.h2
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.4 }}
            transition={{ duration: 0.9, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
            className="text-3xl md:text-5xl font-mono font-medium tracking-tight gradient-text text-balance"
          >
            {t("about.closing.title")}
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.4 }}
            transition={{ duration: 0.9, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
            className="mt-6 text-white/70 text-lg max-w-xl mx-auto leading-relaxed"
          >
            {t("about.closing.body")}
          </motion.p>
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.4 }}
            transition={{ duration: 0.9, delay: 0.3, ease: [0.16, 1, 0.3, 1] }}
            className="mt-10"
          >
            <Link
              to="/contact"
              className="group inline-flex items-center gap-3 rounded-full bg-accent px-8 py-3 text-white font-medium shadow-lg shadow-accent-glow hover:bg-accent-soft transition-colors"
            >
              {t("about.closing.cta")}
              <span className="transition-transform group-hover:translate-x-1">
                →
              </span>
            </Link>
          </motion.div>
        </div>
      </section>
    </main>
  );
}
