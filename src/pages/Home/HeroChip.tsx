import { motion } from "framer-motion";
import { useTranslation } from "react-i18next";

export function HeroChip() {
  const { t } = useTranslation();
  return (
    <motion.p
      initial={{ opacity: 0, y: -8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.7, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
      className="font-mono text-[11px] tracking-[0.22em] text-white/35 uppercase"
    >
      {t("home.chip")}
      {/* <span
        aria-hidden
        className="inline-block w-[1.5px] h-[0.85em] bg-accent-soft align-middle ml-1 animate-blink"
      /> */}
    </motion.p>
  );
}
