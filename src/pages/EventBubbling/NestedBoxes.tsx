import type { ReactNode } from "react";
import { motion } from "framer-motion";
import { useTranslation } from "react-i18next";

export type Phase = "capture" | "target" | "bubble";

export type NestedBoxesProps = {
  activeLayer: string | null;
  phase: Phase | null;
  onClickTarget: () => void;
  idle: boolean;
};

export function NestedBoxes({
  activeLayer,
  phase,
  onClickTarget,
  idle,
}: NestedBoxesProps) {
  const { t } = useTranslation();

  const phaseColor = (p: Phase | null) => {
    if (!p) return "transparent";
    if (p === "capture") return "rgba(56,189,248,0.55)";
    if (p === "bubble") return "rgba(52,211,153,0.55)";
    return "rgba(212,160,23,0.65)";
  };
  const glow = phaseColor(phase);

  const layer = (name: string, children: ReactNode, extraClass = "") => (
    <motion.div
      animate={{
        boxShadow:
          activeLayer === name
            ? `inset 0 0 0 2px ${glow}`
            : "inset 0 0 0 1px rgba(255,255,255,0.08)",
      }}
      transition={{ duration: 0.35 }}
      className={`rounded-xl md:rounded-2xl p-3 md:p-6 relative ${extraClass}`}
    >
      <span className="absolute top-2 left-3 text-xs font-mono text-white/40">
        {name}
      </span>
      {children}
    </motion.div>
  );

  return (
    <div className="overflow-hidden rounded-xl md:rounded-2xl mx-1 md:mx-0">
      {layer(
        "window",
        layer(
          "document",
          layer(
            "body",
            layer(
              "#outer",
              layer(
                "#middle",
                <motion.button
                  onClick={onClickTarget}
                  whileTap={{ scale: 0.97 }}
                  animate={{
                    boxShadow:
                      activeLayer === "#inner"
                        ? `inset 0 0 0 2px ${glow}`
                        : idle
                          ? "inset 0 0 0 1px rgba(212,160,23,0.5)"
                          : "0 0 0 1px rgba(255,255,255,0.15)",
                  }}
                  transition={{ duration: 0.35 }}
                  className="w-full rounded-xl md:rounded-2xl bg-accent/20 text-white py-7 md:py-8 px-4 mt-3 md:mt-6 font-medium relative"
                >
                  <span className="absolute top-2 left-3 text-xs font-mono text-white/60">
                    #inner
                  </span>
                  {idle
                    ? t("eventBubbling.innerButton.idle")
                    : t("eventBubbling.innerButton.default")}
                </motion.button>,
                "mt-3 md:mt-6 bg-white/[0.02]"
              ),
              "mt-3 md:mt-6 bg-white/[0.02]"
            ),
            "mt-3 md:mt-6 bg-white/[0.02]"
          ),
          "mt-3 md:mt-6 bg-white/[0.02]"
        ),
        "bg-white/[0.02]"
      )}
    </div>
  );
}
