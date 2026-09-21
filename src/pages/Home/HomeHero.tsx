import { useT } from "../../hooks/useT";
import { HeroChip } from "./HeroChip";
import {
  motion,
  useMotionTemplate,
  useMotionValue,
  useScroll,
  useSpring,
  useTransform,
} from "framer-motion";

export const HomeHero = () => {
  const { t } = useT();
  const { scrollY } = useScroll();
  const heroOpacity = useTransform(scrollY, [0, 400], [1, 0]);
  const heroY = useTransform(scrollY, [0, 400], [0, -80]);
  const rawX = useMotionValue(200);
  const rawY = useMotionValue(120);
  const mouseX = useSpring(rawX, { stiffness: 400, damping: 40 });
  const mouseY = useSpring(rawY, { stiffness: 400, damping: 40 });
  const spotlightMask = useMotionTemplate`radial-gradient(380px at ${mouseX}px ${mouseY}px, white 0%, transparent 100%)`;

  return (
    <section className="relative z-10 min-h-[100dvh] flex items-center justify-center overflow-hidden">
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            "radial-gradient(ellipse 65% 55% at 50% 50%, rgba(5,6,10,0.9) 0%, rgba(5,6,10,0.7) 30%, rgba(5,6,10,0) 75%)",
        }}
      />

      <motion.div
        style={{
          opacity: heroOpacity,
          y: heroY,
          willChange: "transform, opacity",
        }}
        className="relative z-10 text-center px-6 max-w-4xl"
        onMouseMove={(e) => {
          const { left, top } = e.currentTarget.getBoundingClientRect();
          rawX.set(e.clientX - left);
          rawY.set(e.clientY - top);
        }}
      >
        <HeroChip />
        <div className="relative mt-5">
          {/* base layer — always dim */}
          <h1 className="text-5xl md:text-8xl font-semibold tracking-tight text-balance select-none">
            <span className="block text-white/[0.18]">
              {t("home.titleLine1")}
            </span>
            <span className="block text-white/[0.07]">
              {t("home.titleLine2")}
            </span>
          </h1>
          {/* mobile: soft mask-image via animated CSS vars, no useEffect */}
          <motion.h1
            aria-hidden
            animate={{
              "--mx": ["0%", "75%", "25%", "60%", "40%", "0%"],
              "--my": ["50%", "25%", "30%", "75%", "70%", "0%"],
            }}
            transition={{ duration: 12, repeat: Infinity, ease: "easeInOut" }}
            style={
              {
                WebkitMaskImage:
                  "radial-gradient(220px at var(--mx) var(--my), white 0%, transparent 100%)",
                maskImage:
                  "radial-gradient(220px at var(--mx) var(--my), white 0%, transparent 100%)",
              } as React.CSSProperties
            }
            className="md:hidden absolute inset-0 text-5xl font-semibold tracking-tight text-balance pointer-events-none"
          >
            <span className="block text-white/90">{t("home.titleLine1")}</span>
            <span className="block text-white/50">{t("home.titleLine2")}</span>
          </motion.h1>
          {/* desktop: JS mouse-tracked mask */}
          <motion.h1
            aria-hidden
            style={{
              WebkitMaskImage: spotlightMask,
              maskImage: spotlightMask,
            }}
            className="hidden md:block absolute inset-0 text-5xl md:text-8xl font-semibold tracking-tight text-balance pointer-events-none"
          >
            <span className="block text-white">{t("home.titleLine1")}</span>
            <span className="block text-white/40">{t("home.titleLine2")}</span>
          </motion.h1>
        </div>
        <p className="mt-8 text-base md:text-lg text-white/50 max-w-xl mx-auto text-balance [text-shadow:_0_2px_20px_rgba(5,6,10,0.9)]">
          {t("home.descriptionPrefix")}
          <span className="text-white/80">{t("home.descriptionName")}</span>
          {t("home.descriptionSuffix")}
        </p>
      </motion.div>
    </section>
  );
};
