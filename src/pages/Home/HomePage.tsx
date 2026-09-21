import {
  motion,
  useScroll,
  useTransform,
  type MotionValue,
} from "framer-motion";
import { lazy, Suspense, useRef } from "react";
import { useT } from "../../hooks/useT";
import { ScrollReveal } from "../../components/ScrollReveal";
import { StatCard } from "./StatCard";
import { FeatureCard } from "./FeatureCard";
import { PageMeta } from "../../components/PageMeta";
import { HomeHero } from "./HomeHero";

const Globe = lazy(() =>
  import("../../components/Globe").then((m) => ({ default: m.Globe }))
);

export function HomePage() {
  const { t, tx } = useT();
  const globeSectionRef = useRef<HTMLElement>(null);
  const { scrollYProgress: globeProgress } = useScroll({
    target: globeSectionRef,
    offset: ["start start", "end end"],
  });
  const currYear: number = new Date().getFullYear();
  const yearsOfExp: string = `${currYear - 2018}y`;

  return (
    <main className="relative">
      <PageMeta
        title="Mizar"
        description="Interactive JavaScript explainers built by a developer who codes on the road."
        path="/"
      />
      <HomeHero />
      <section
        ref={globeSectionRef}
        className="relative z-10"
        style={{ height: "430dvh" }}
      >
        <div className="sticky top-0 h-[100dvh] flex items-center overflow-hidden">
          <div className="mx-auto grid md:grid-cols-2 gap-6 md:gap-8 items-center max-w-6xl px-6 w-full">
            <div className="relative order-2 md:order-1 mx-auto w-full max-w-[min(52dvh,100%)] md:max-w-none">
              <div
                className="absolute -inset-20 blur-2xl pointer-events-none"
                style={{
                  background:
                    "radial-gradient(ellipse at center, rgba(212,160,23,0.09), transparent 60%)",
                }}
              />
              <div className="relative">
                <Suspense fallback={null}>
                  <Globe progress={globeProgress} />
                </Suspense>
              </div>
            </div>

            <div className="relative order-1 md:order-2 h-56 md:h-96">
              <StoryPanel
                progress={globeProgress}
                range={[0.0, 0.3]}
                eyebrow={tx("home.panels.one.eyebrow", {
                  years: String(currYear - 2018),
                })}
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
                range={[0.23, 0.53]}
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
                range={[0.47, 0.77]}
                eyebrow={t("home.panels.three.eyebrow")}
                heading={
                  <>
                    {t("home.panels.three.line1")}
                    <br />
                    {t("home.panels.three.line2")}
                  </>
                }
              />
              <StoryPanel
                progress={globeProgress}
                range={[0.7, 1.0]}
                eyebrow={t("home.panels.four.eyebrow")}
                heading={
                  <>
                    {t("home.panels.four.line1")}
                    <br />
                    {t("home.panels.four.line2")}
                  </>
                }
              />
            </div>
          </div>
        </div>

        <div className="absolute inset-x-0 bottom-0 h-[50vh] bg-gradient-to-b from-transparent to-ink-950 pointer-events-none" />
      </section>

      <section className="relative z-10 bg-ink-950 py-28 px-6 border-t border-white/[0.07]">
        <div className="max-w-6xl mx-auto grid grid-cols-2 md:grid-cols-4 border border-white/[0.06] rounded-xl overflow-hidden">
          <ScrollReveal delay={0}>
            <div className="border-b md:border-b-0 md:border-r border-white/[0.06] p-8 md:p-10">
              <StatCard value={yearsOfExp} label={t("home.stats.writingJs")} />
            </div>
          </ScrollReveal>
          <ScrollReveal delay={0.1}>
            <div className="border-b md:border-b-0 md:border-r border-white/[0.06] p-8 md:p-10">
              <StatCard value="50+" label={t("home.stats.projects")} />
            </div>
          </ScrollReveal>
          <ScrollReveal delay={0.2}>
            <div className="border-b md:border-b-0 md:border-r border-white/[0.06] p-8 md:p-10">
              <StatCard value="∞" label={t("home.stats.coffees")} />
            </div>
          </ScrollReveal>
          <ScrollReveal delay={0.3}>
            <div className="p-8 md:p-10">
              <StatCard value="27" label={t("home.stats.countries")} />
            </div>
          </ScrollReveal>
        </div>
      </section>

      <section className="relative z-10 bg-ink-950 py-28 px-6 border-t border-white/[0.07]">
        <div className="max-w-6xl mx-auto">
          <ScrollReveal>
            <h2 className="text-4xl md:text-5xl font-semibold tracking-tight text-white text-balance">
              {t("home.explainers.line1")}
              <br />
              <span className="text-white/40">
                {t("home.explainers.line2")}
              </span>
            </h2>
            <div className="text-regular mt-3 sm:w-2/3 text-white/50">
              {t("home.explainers.line3")}
            </div>
          </ScrollReveal>

          <div className="mt-14 grid md:grid-cols-2 lg:grid-cols-4 md:gap-x-12">
            <ScrollReveal delay={0.1}>
              <FeatureCard
                to="/event-loop"
                eyebrow={t("home.features.eventLoop.eyebrow")}
                title={t("home.features.eventLoop.title")}
                body={t("home.features.eventLoop.body")}
                cta={t("home.featureCardCta")}
                index={0}
              />
            </ScrollReveal>
            <ScrollReveal delay={0.2}>
              <FeatureCard
                to="/event-bubbling"
                eyebrow={t("home.features.eventBubbling.eyebrow")}
                title={t("home.features.eventBubbling.title")}
                body={t("home.features.eventBubbling.body")}
                cta={t("home.featureCardCta")}
                index={1}
              />
            </ScrollReveal>
            <ScrollReveal delay={0.3}>
              <FeatureCard
                to="/closures"
                eyebrow={t("home.features.closures.eyebrow")}
                title={t("home.features.closures.title")}
                body={t("home.features.closures.body")}
                cta={t("home.featureCardCta")}
                index={2}
              />
            </ScrollReveal>
            <ScrollReveal delay={0.4}>
              <FeatureCard
                to="/react-fiber"
                eyebrow={t("home.features.reactFiber.eyebrow")}
                title={t("home.features.reactFiber.title")}
                body={t("home.features.reactFiber.body")}
                cta={t("home.featureCardCta")}
                index={3}
              />
            </ScrollReveal>
          </div>
        </div>
      </section>

      <footer className="relative z-10 bg-ink-950 py-16 text-center text-sm text-accent-soft/70">
        ©{currYear}, {t("home.footer")} &hearts;
      </footer>
    </main>
  );
}

type StoryPanelProps = {
  progress: MotionValue<number>;
  range: [number, number];
  eyebrow: string;
  heading: React.ReactNode;
};

function StoryPanel({ progress, range, eyebrow, heading }: StoryPanelProps) {
  const [enter, exit] = range;
  const span = exit - enter;
  const fadeIn = enter + span * 0.2;
  const fadeOut = exit - span * 0.2;

  const opacity = useTransform(
    progress,
    [enter, fadeIn, fadeOut, exit],
    [0, 1, 1, 0]
  );

  const y = useTransform(
    progress,
    [enter, fadeIn, fadeOut, exit],
    [28, 0, 0, -20]
  );

  return (
    <motion.div
      style={{ opacity, y, willChange: "transform, opacity" }}
      className="absolute inset-0 flex flex-col justify-center"
    >
      <p className="text-white/35 font-mono text-[11px] tracking-[0.18em] uppercase mb-4">
        {eyebrow}
      </p>
      <h2 className="text-3xl md:text-4xl font-semibold tracking-tight text-white">
        {heading}
      </h2>
    </motion.div>
  );
}
