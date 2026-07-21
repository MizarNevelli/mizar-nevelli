import { AnimatePresence, motion } from "framer-motion";
import { useTranslation } from "react-i18next";
import type { Frame } from "./scenarios";

type Props = {
  frame: Frame;
};

type ColumnKey = "stack" | "microtasks" | "macrotasks";

const columns: Array<{ key: ColumnKey; accent: string }> = [
  { key: "stack", accent: "from-white/20 to-white/5" },
  { key: "microtasks", accent: "from-accent/40 to-accent/5" },
  { key: "macrotasks", accent: "from-sky-500/40 to-sky-500/5" },
];

/**
 * Three-column visualization. Each queue is rendered as a stack of pills that
 * animate in/out as frames advance.
 */
export function EventLoopVisualizer({ frame }: Props) {
  const { t } = useTranslation();
  return (
    <div className="glass rounded-3xl p-6 grid grid-cols-3 gap-4 min-h-[420px]">
      {columns.map((col) => (
        <div key={col.key} className="flex flex-col">
          <div className="mb-3">
            <h3 className="text-white font-medium">
              {t(`eventLoop.visualizer.${col.key}.title`)}
            </h3>
            <p className="text-xs text-white/40">
              {t(`eventLoop.visualizer.${col.key}.hint`)}
            </p>
          </div>
          <div
            className={`relative flex-1 rounded-2xl bg-gradient-to-b ${col.accent} p-2 flex flex-col-reverse gap-2 overflow-hidden`}
          >
            <AnimatePresence initial={false}>
              {frame[col.key].map((item, i) => (
                <motion.div
                  key={`${item}-${i}`}
                  layout
                  initial={{ opacity: 0, y: 10, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: -10, scale: 0.95 }}
                  transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
                  className="rounded-lg bg-white/10 border border-white/10 px-3 py-2 text-xs font-mono text-white/90 backdrop-blur-sm"
                >
                  {item}
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        </div>
      ))}
    </div>
  );
}
