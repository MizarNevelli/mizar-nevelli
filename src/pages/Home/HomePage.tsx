import {
  motion,
  useScroll,
  useTransform,
  type MotionValue,
} from "framer-motion";
import { useRef } from "react";
import { useTranslation } from "react-i18next";
import { Globe } from "../../components/Globe";
import { ScrollReveal } from "../../components/ScrollReveal";
import { Starfield } from "../../components/Starfield";
import { CornerLabels } from "../../components/CornerLabels";
import { HeroChip } from "./HeroChip";
import { StatCard } from "./StatCard";
import { FeatureCard } from "./FeatureCard";

/**
 * Observatory / star chart aesthetic.
 *  1. Hero — quiet serif display over dot-grid + starfield, coord labels
 *  2. Sticky observation — globe pinned in a hairline card, obs. panels swap
 *  3. Log — ruled table of stats (countries, years, coffees…)
 *  4. Index — two obs. cards linking to the explainers
 */
export function HomePage() {
  const { t } = useTranslation();
  const globeSectionRef = useRef<HTMLElement>(null);

  const { scrollYProgress: globeProgress } = useScroll({
    target: globeSectionRef,
    offset: ["start start", "end end"],
  });

  const { scrollY } = useScroll();
  const heroOpacity = useTransform(scrollY, [0, 400], [1, 0]);
  const heroY = useTransform(scrollY, [0, 400], [0, -80]);

  return (
    <main className="relative">
      <CornerLabels
        topLeft="MIZAR · ζ UMa · 13h 23m 55.5s"
        topRight="LAT 45.46°N — Milano"
        bottomLeft="fig. 00"
        bottomRight="recording · 2026"
      />

      {/* ────────── HERO ────────── */}
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden dot-grid">
        <Starfield seed="hero" count={60} />
        <motion.div
          style={{
            opacity: heroOpacity,
            y: heroY,
            willChange: "transform, opacity",
          }}
          className="relative z-10 text-center px-6 max-w-3xl"
        >
          <HeroChip />
          <h1 className="mt-10 font-display text-5xl md:text-7xl text-bone leading-[1.05] text-balance">
            {t("home.titleLine1")}
            <br />
            <em className="text-bone/85">{t("home.titleLine2")}</em>
          </h1>
          <p className="mt-8 text-base md:text-lg text-bone/60 max-w-xl mx-auto leading-relaxed">
            {t("home.descriptionPrefix")}
            <span className="text-bone">{t("home.descriptionName")}</span>
            {t("home.descriptionSuffix")}
          </p>
          <div className="mt-16 flex items-center justify-center gap-3">
            <span className="hair-t w-8" />
            <span className="coord">{t("home.scrollHint")}</span>
            <span className="hair-t w-8" />
          </div>
        </motion.div>
      </section>

      {/* ────────── STICKY OBSERVATION ────────── */}
      <section
        ref={globeSectionRef}
        className="relative"
        style={{ height: "400vh" }}
      >
        <div className="sticky top-0 h-[100dvh] flex items-center overflow-hidden">
          <div className="mx-auto grid md:grid-cols-2 gap-8 md:gap-12 items-center max-w-6xl px-6 w-full">
            {/* Globe wrapped in an observation card */}
            <div className="relative order-2 md:order-1 mx-auto w-full max-w-[min(52vh,100%)] md:max-w-none">
              <div className="relative corner-ticks hair p-4 md:p-6">
                <span className="tick-bl" />
                <span className="tick-br" />
                <div className="flex items-center justify-between mb-3">
                  <span className="coord">obs. terrestrial</span>
                  <span className="coord">fig. 01</span>
                </div>
                <Globe progress={globeProgress} />
              </div>
            </div>

            {/* Observation panels */}
            <div className="relative order-1 md:order-2 h-56 md:h-96">
              <StoryPanel
                progress={globeProgress}
                range={[0.0, 0.28]}
                index="I"
                eyebrow={t("home.panels.one.eyebrow")}
                line1={t("home.panels.one.line1")}
                line2={t("home.panels.one.line2")}
              />
              <StoryPanel
                progress={globeProgress}
                range={[0.36, 0.62]}
                index="II"
                eyebrow={t("home.panels.two.eyebrow")}
                line1={t("home.panels.two.line1")}
                line2={t("home.panels.two.line2")}
              />
              <StoryPanel
                progress={globeProgress}
                range={[0.72, 1.0]}
                index="III"
                eyebrow={t("home.panels.three.eyebrow")}
                line1={t("home.panels.three.line1")}
                line2={t("home.panels.three.line2")}
              />
            </div>
          </div>
        </div>
      </section>

      {/* ────────── LOG / STATS ────────── */}
      <section className="relative py-32 px-6">
        <div className="max-w-5xl mx-auto">
          <ScrollReveal>
            <div className="flex items-baseline justify-between hair-b pb-3 mb-8">
              <span className="obs-label">Log</span>
              <span className="coord">n = 4</span>
            </div>
          </ScrollReveal>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-x-6 gap-y-8">
            <ScrollReveal delay={0}>
              <StatCard
                value="27"
                label={t("home.stats.countries")}
                index="i"
              />
            </ScrollReveal>
            <ScrollReveal delay={0.08}>
              <StatCard
                value="8yr"
                label={t("home.stats.writingJs")}
                index="ii"
              />
            </ScrollReveal>
            <ScrollReveal delay={0.16}>
              <StatCard
                value="∞"
                label={t("home.stats.coffees")}
                index="iii"
              />
            </ScrollReveal>
            <ScrollReveal delay={0.24}>
              <StatCard
                value="1"
                label={t("home.stats.eventLoop")}
                index="iv"
              />
            </ScrollReveal>
          </div>
        </div>
      </section>

      {/* ────────── INDEX / EXPLAINERS ────────── */}
      <section className="relative py-32 px-6">
        <div className="max-w-6xl mx-auto">
          <ScrollReveal>
            <div className="flex items-baseline justify-between hair-b pb-3 mb-12">
              <span className="obs-label">Index — Observations</span>
              <span className="coord">02 entries</span>
            </div>
            <h2 className="font-display text-4xl md:text-6xl text-bone leading-tight text-balance max-w-3xl">
              {t("home.explainers.line1")}{" "}
              <em>{t("home.explainers.line2")}</em>
            </h2>
          </ScrollReveal>

          <div className="mt-16 grid md:grid-cols-2 gap-6 md:gap-8">
            <ScrollReveal delay={0.08}>
              <FeatureCard
                to="/event-loop"
                index="I"
                eyebrow={t("home.features.eventLoop.eyebrow")}
                title={t("home.features.eventLoop.title")}
                body={t("home.features.eventLoop.body")}
                cta={t("home.featureCardCta")}
              />
            </ScrollReveal>
            <ScrollReveal delay={0.16}>
              <FeatureCard
                to="/event-bubbling"
                index="II"
                eyebrow={t("home.features.eventBubbling.eyebrow")}
                title={t("home.features.eventBubbling.title")}
                body={t("home.features.eventBubbling.body")}
                cta={t("home.featureCardCta")}
              />
            </ScrollReveal>
          </div>
        </div>
      </section>

      <footer className="hair-t py-10 text-center">
        <p className="coord">{t("home.footer")}</p>
      </footer>
    </main>
  );
}

type StoryPanelProps = {
  progress: MotionValue<number>;
  range: [number, number];
  index: string;
  eyebrow: string;
  line1: string;
  line2: string;
};

/**
 * Observation panel — serif italic pull-quote with an obs. index leader.
 * Non-overlapping scroll ranges + subtle y-slide, no double-vision crossfade.
 */
function StoryPanel({
  progress,
  range,
  index,
  eyebrow,
  line1,
  line2,
}: StoryPanelProps) {
  const [enter, exit] = range;
  const span = exit - enter;
  const fadeIn = enter + span * 0.15;
  const fadeOut = exit - span * 0.15;

  const opacity = useTransform(
    progress,
    [enter, fadeIn, fadeOut, exit],
    [0, 1, 1, 0],
  );
  const y = useTransform(
    progress,
    [enter, fadeIn, fadeOut, exit],
    [16, 0, 0, -16],
  );

  return (
    <motion.div
      style={{ opacity, y, willChange: "transform, opacity" }}
      className="absolute inset-0 flex flex-col justify-center"
    >
      <div className="flex items-baseline gap-4 mb-6">
        <span className="obs-label">Obs. {index}</span>
        <span className="hair-t flex-1 mt-3" />
        <span className="coord">{eyebrow}</span>
      </div>
      <h2 className="font-display text-3xl md:text-5xl text-bone leading-tight">
        {line1}
        <br />
        <em className="text-bone/85">{line2}</em>
      </h2>
    </motion.div>
  );
}
