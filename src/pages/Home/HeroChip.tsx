import { motion } from "framer-motion";
import { useTranslation } from "react-i18next";

export function HeroChip() {
  const { t } = useTranslation();
  return (
    <motion.div
      initial={{ opacity: 0, y: -12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8, delay: 0.15, ease: [0.16, 1, 0.3, 1] }}
      className="inline-flex items-center gap-2 rounded-full glass px-4 py-1.5 text-xs text-white/70"
    >
      <span className="h-1.5 w-1.5 rounded-full bg-accent animate-pulse-glow" />
      {t("home.chip")}
    </motion.div>
  );
}
