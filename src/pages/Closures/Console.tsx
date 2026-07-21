import { AnimatePresence, motion } from "framer-motion";
import { useTranslation } from "react-i18next";

type ConsoleProps = {
  entries: string[];
};

/**
 * A dev-tools style console box. Accumulates `console.log`-like entries and
 * animates each new line in. The whole point of the for-var vs for-let
 * scenarios lives here — the console output is the punchline.
 */
export function Console({ entries }: ConsoleProps) {
  const { t } = useTranslation();
  return (
    <div className="rounded-2xl border border-white/10 bg-ink-950/80 overflow-hidden">
      <div className="flex items-center gap-2 px-4 py-2.5 border-b border-white/10 bg-white/[0.02]">
        <span className="h-2 w-2 rounded-full bg-red-500/60" />
        <span className="h-2 w-2 rounded-full bg-yellow-500/60" />
        <span className="h-2 w-2 rounded-full bg-green-500/60" />
        <span className="ml-2 text-[11px] uppercase tracking-widest text-white/40 font-mono">
          {t("closures.consoleTitle")}
        </span>
      </div>
      <div className="p-4 min-h-[6rem] font-mono text-sm">
        {entries.length === 0 ? (
          <p className="text-white/30">{t("closures.consoleEmpty")}</p>
        ) : (
          <ul className="space-y-1">
            <AnimatePresence initial={false}>
              {entries.map((entry, i) => (
                <motion.li
                  key={`${i}-${entry}`}
                  initial={{ opacity: 0, x: -8 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
                  className="flex items-baseline gap-3"
                >
                  <span className="text-accent-soft select-none">›</span>
                  <span className="text-white/90">{entry}</span>
                </motion.li>
              ))}
            </AnimatePresence>
          </ul>
        )}
      </div>
    </div>
  );
}
