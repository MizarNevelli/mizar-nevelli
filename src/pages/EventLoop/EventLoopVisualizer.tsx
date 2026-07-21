import { AnimatePresence, motion } from "framer-motion";
import { useTranslation } from "react-i18next";
import type { Frame } from "./scenarios";

type Props = {
  frame: Frame;
};

type ColumnKey = "stack" | "microtasks" | "macrotasks";

const columns: ColumnKey[] = ["stack", "microtasks", "macrotasks"];

/**
 * Three-column ledger. No glass, no gradients — hairline-bordered cards with
 * a `star` left-tick on the header and monospace queue rows.
 */
export function EventLoopVisualizer({ frame }: Props) {
  const { t } = useTranslation();
  return (
    <div className="grid grid-cols-3 gap-4 min-h-[420px]">
      {columns.map((col) => (
        <div key={col} className="hair flex flex-col">
          <div className="hair-b px-3 py-3 flex items-baseline justify-between">
            <div>
              <div className="obs-label">
                {t(`eventLoop.visualizer.${col}.title`)}
              </div>
              <div className="coord mt-1 normal-case tracking-[0.06em]">
                {t(`eventLoop.visualizer.${col}.hint`)}
              </div>
            </div>
          </div>
          <div className="relative flex-1 p-2 flex flex-col-reverse gap-1 overflow-hidden">
            <AnimatePresence initial={false}>
              {frame[col].map((item, i) => (
                <motion.div
                  key={`${item}-${i}`}
                  layout
                  initial={{ opacity: 0, x: -6 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 6 }}
                  transition={{ duration: 0.28, ease: [0.16, 1, 0.3, 1] }}
                  className="hair px-3 py-2 text-xs font-mono text-bone bg-ink/60"
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
