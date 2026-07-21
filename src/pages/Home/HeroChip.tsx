import { motion } from "framer-motion";
import { useTranslation } from "react-i18next";

export function HeroChip() {
  const { t } = useTranslation();
  return (
    <motion.div
      initial={{ opacity: 0, y: -8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.9, delay: 0.15, ease: [0.16, 1, 0.3, 1] }}
      className="inline-flex items-baseline gap-2 hair px-3 py-1.5"
    >
      <span className="w-[3px] h-[3px] bg-star animate-twinkle" />
      <span className="coord">{t("home.chip")}</span>
    </motion.div>
  );
}
