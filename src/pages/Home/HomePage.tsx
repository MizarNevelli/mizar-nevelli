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
import { SpaceScene } from "../../components/SpaceScene";
import { HeroChip } from "./HeroChip";
import { StatCard } from "./StatCard";
import { FeatureCard } from "./FeatureCard";

/**
 * Apple-style long-scroll homepage:
 *  1. Hero: name + tagline over a soft radial glow
 *  2. Sticky globe section: globe pins while text panels swap on scroll
 *  3. Stats strip: travel + remote work in numbers
 *  4. Feature grid: pointers to the JS explainers
 */
export function HomePage() {
  const { t } = useTranslation();
  const globeSectionRef = useRef<HTMLElement>(null);

  // Scroll progress *within* the pinned globe section (0 at entry, 1 at exit).
  const { scrollYProgress: globeProgress } = useScroll({
    target: globeSectionRef,
    offset: ["start start", "end end"],
  });

  // Hero fades out as user starts to scroll (Apple hero pattern).
  const { scrollY } = useScroll();
  const heroOpacity = useTransform(scrollY, [0, 400], [1, 0]);
  const heroY = useTransform(scrollY, [0, 400], [0, -80]);

  return (
    <main className="relative">
      {/* ────────── HERO ────────── */}
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
        <SpaceScene />
        {/* Radial vignette — darkest behind the centered copy, transparent at
           the corners so the starfield stays visible around the edges. */}
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            background:
              "radial-gradient(ellipse 65% 55% at 50% 50%, rgba(5,6,10,0.9) 0%, rgba(5,6,10,0.7) 30%, rgba(5,6,10,0) 75%)",
          }}
        />
        {/* Blend the hero into the sticky globe section below. */}
        <div className="absolute inset-x-0 bottom-0 h-40 bg-gradient-to-b from-transparent to-ink-950 pointer-events-none" />

        <motion.div
          style={{
            opacity: heroOpacity,
            y: heroY,
            willChange: "transform, opacity",
          }}
          className="relative z-10 text-center px-6 max-w-4xl"
        >
          <HeroChip />
          <h1 className="mt-6 text-5xl md:text-8xl font-semibold tracking-tight gradient-text text-balance [text-shadow:_0_2px_30px_rgba(5,6,10,0.6)]">
            {t("home.titleLine1")}
            <br />
            {t("home.titleLine2")}
          </h1>
          <p className="mt-8 text-lg md:text-xl text-white/70 max-w-2xl mx-auto text-balance [text-shadow:_0_2px_20px_rgba(5,6,10,0.9)]">
            {t("home.descriptionPrefix")}
            <span className="text-white">{t("home.descriptionName")}</span>
            {t("home.descriptionSuffix")}
          </p>
          <div className="mt-12 flex items-center justify-center gap-3 text-sm text-white/40 [text-shadow:_0_2px_20px_rgba(5,6,10,0.9)]">
            <span>{t("home.scrollHint")}</span>
            <span className="inline-block h-6 w-[1px] bg-white/30 animate-pulse" />
          </div>
        </motion.div>
      </section>

      {/* ────────── STICKY GLOBE STORY ──────────
         Height is 400vh so each of the 3 panels gets ~one full viewport of
         scroll (≈ real seconds of reading time). */}
      <section
        ref={globeSectionRef}
        className="relative"
        style={{ height: "400dvh" }}
      >
        <div className="sticky top-0 h-[100dvh] flex items-center overflow-hidden">
          <div className="mx-auto grid md:grid-cols-2 gap-6 md:gap-8 items-center max-w-6xl px-6 w-full">
            {/* Globe — capped on mobile so it never overflows 100vh alongside the text */}
            <div className="relative order-2 md:order-1 mx-auto w-full max-w-[min(52dvh,100%)] md:max-w-none">
              <div className="absolute -inset-20 bg-radial-fade blur-2xl pointer-events-none" />
              <div className="relative">
                <Globe progress={globeProgress} />
              </div>
            </div>

            {/* Panel column — three headings crossfade + slide */}
            <div className="relative order-1 md:order-2 h-56 md:h-96">
              <StoryPanel
                progress={globeProgress}
                range={[0.0, 0.28]}
                eyebrow={t("home.panels.one.eyebrow")}
                heading={
                  <>
                    {t("home.panels.one.line1")}
                    <br />
                    {t("home.panels.one.line2")}
                  </>
                }
              />
              <StoryPanel
                progress={globeProgress}
                range={[0.36, 0.62]}
                eyebrow={t("home.panels.two.eyebrow")}
                heading={
                  <>
                    {t("home.panels.two.line1")}
                    <br />
                    {t("home.panels.two.line2")}
                  </>
                }
              />
              <StoryPanel
                progress={globeProgress}
                range={[0.72, 1.0]}
                eyebrow={t("home.panels.three.eyebrow")}
                heading={
                  <>
                    {t("home.panels.three.line1")}
                    <br />
                    {t("home.panels.three.line2")}
                  </>
                }
              />
            </div>
          </div>
        </div>
      </section>

      {/* ────────── STATS ────────── */}
      <section className="relative py-32 px-6">
        <div className="max-w-5xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-6">
          <ScrollReveal delay={0}>
            <StatCard value="27" label={t("home.stats.countries")} />
          </ScrollReveal>
          <ScrollReveal delay={0.1}>
            <StatCard value="8yrs" label={t("home.stats.writingJs")} />
          </ScrollReveal>
          <ScrollReveal delay={0.2}>
            <StatCard value="∞" label={t("home.stats.coffees")} />
          </ScrollReveal>
          <ScrollReveal delay={0.3}>
            <StatCard value="1000+" label={t("home.stats.cigarettes")} />
          </ScrollReveal>
        </div>
      </section>

      {/* ────────── EXPLAINERS ────────── */}
      <section className="relative py-32 px-6">
        <div className="max-w-6xl mx-auto">
          <ScrollReveal>
            <p className="text-accent-soft uppercase tracking-widest text-xs mb-3 text-center">
              {t("home.explainers.eyebrow")}
            </p>
            <h2 className="text-4xl md:text-6xl font-semibold tracking-tight text-white text-center text-balance">
              {t("home.explainers.line1")}
              <br />
              {t("home.explainers.line2")}
            </h2>
          </ScrollReveal>

          <div className="mt-16 grid md:grid-cols-2 gap-6">
            <ScrollReveal delay={0.1}>
              <FeatureCard
                to="/event-loop"
                eyebrow={t("home.features.eventLoop.eyebrow")}
                title={t("home.features.eventLoop.title")}
                body={t("home.features.eventLoop.body")}
                cta={t("home.featureCardCta")}
              />
            </ScrollReveal>
            <ScrollReveal delay={0.2}>
              <FeatureCard
                to="/event-bubbling"
                eyebrow={t("home.features.eventBubbling.eyebrow")}
                title={t("home.features.eventBubbling.title")}
                body={t("home.features.eventBubbling.body")}
                cta={t("home.featureCardCta")}
              />
            </ScrollReveal>
          </div>
        </div>
      </section>

      <footer className="py-16 text-center text-white/40 text-sm">
        {t("home.footer")}
      </footer>
    </main>
  );
}

type StoryPanelProps = {
  progress: MotionValue<number>;
  /** [enter, exit] on the parent scroll progress. Panel is fully visible in
   *  the middle 70% of the range and hard-crossfades in/out at the edges so
   *  two panels never overlap while readable. */
  range: [number, number];
  eyebrow: string;
  heading: React.ReactNode;
};

/**
 * A single story panel. Fades and slides in/out on a dedicated slice of scroll
 * progress. Non-overlapping ranges prevent the double-text unreadability that
 * naive opacity crossfades produce.
 */
function StoryPanel({ progress, range, eyebrow, heading }: StoryPanelProps) {
  const [enter, exit] = range;
  const span = exit - enter;
  const fadeIn = enter + span * 0.15;
  const fadeOut = exit - span * 0.15;

  const opacity = useTransform(
    progress,
    [enter, fadeIn, fadeOut, exit],
    [0, 1, 1, 0]
  );
  // Panels slide up 24px as they leave and start 24px below as they enter —
  // Apple's classic "vertical replace" motion.
  const y = useTransform(
    progress,
    [enter, fadeIn, fadeOut, exit],
    [24, 0, 0, -24]
  );

  return (
    <motion.div
      style={{ opacity, y, willChange: "transform, opacity" }}
      className="absolute inset-0 flex flex-col justify-center"
    >
      <p className="text-accent-soft uppercase tracking-widest text-xs mb-3">
        {eyebrow}
      </p>
      <h2 className="text-4xl md:text-5xl font-semibold tracking-tight text-white [text-shadow:_0_2px_20px_rgba(5,6,10,0.6)]">
        {heading}
      </h2>
    </motion.div>
  );
}
