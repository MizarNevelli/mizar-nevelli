import { useTranslation } from "react-i18next";
import type { ScenarioId } from "./scenarios";
import { motion, AnimatePresence } from "framer-motion";

interface DemoPanelProps {
  scenarioId: Exclude<ScenarioId, "initialRender">;
  count: number;
  isPlaying: boolean;
  onIncrement: () => void;
}
export function DemoPanel({
  scenarioId,
  count,
  isPlaying,
  onIncrement,
}: DemoPanelProps) {
  const { t } = useTranslation();
  return (
    <div className="relative flex flex-col items-center justify-center gap-7 rounded-2xl border border-white/[0.08] bg-white/[0.015] min-h-[200px] overflow-hidden p-10">
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            "radial-gradient(ellipse 70% 50% at 50% 60%, rgba(212,160,23,0.04), transparent)",
        }}
      />
      <AnimatePresence mode="wait">
        <motion.span
          key={count}
          initial={{ y: -16, opacity: 0, filter: "blur(6px)" }}
          animate={{ y: 0, opacity: 1, filter: "blur(0px)" }}
          exit={{ y: 16, opacity: 0, filter: "blur(6px)" }}
          transition={{ duration: 0.26, ease: [0.16, 1, 0.3, 1] }}
          className="text-7xl font-mono tabular-nums font-semibold text-white leading-none select-none"
        >
          {count}
        </motion.span>
      </AnimatePresence>

      <motion.button
        onClick={onIncrement}
        disabled={isPlaying}
        whileTap={{ scale: 0.93 }}
        className="px-8 py-3 rounded-xl bg-accent/10 border border-accent/25 text-accent-soft font-medium hover:bg-accent/[0.18] transition-colors disabled:opacity-40 disabled:cursor-not-allowed text-sm"
      >
        {isPlaying ? (
          <span className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-accent animate-pulse" />
            {t("reactFiber.demoPanel.reconciling")}
          </span>
        ) : (
          t("reactFiber.demoPanel.increment")
        )}
      </motion.button>

      {scenarioId === "effects" && (
        <p className="text-[11px] font-mono text-white/20 absolute bottom-3">
          {t("reactFiber.demoPanel.effectsNote")}
        </p>
      )}
    </div>
  );
}
