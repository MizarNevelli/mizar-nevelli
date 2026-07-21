import { AnimatePresence, motion } from "framer-motion";
import { useTranslation } from "react-i18next";
import type { Frame, Scope } from "./scenarios";

type Props = {
  frame: Frame;
};

/**
 * Right column of /closures. A vertical stack of scope cards (outermost →
 * innermost), followed by a task-queue section when non-empty. Each scope
 * card animates in/out on its own so scope pushes and captured-scope hangs
 * read as physical events.
 */
export function ClosuresVisualizer({ frame }: Props) {
  const { t } = useTranslation();
  return (
    <div className="glass rounded-3xl p-5 md:p-6 min-h-[420px] flex flex-col gap-3">
      <div className="text-[10px] uppercase tracking-widest text-white/40 font-mono flex items-center justify-between">
        <span>Scope chain</span>
        <span>outer → inner</span>
      </div>

      <div className="relative flex flex-col gap-2 flex-1">
        <AnimatePresence initial={false}>
          {frame.scopes.map((scope) => (
            <ScopeCard
              key={scope.id}
              scope={scope}
              highlightName={
                frame.highlight?.scopeId === scope.id
                  ? frame.highlight.name
                  : undefined
              }
            />
          ))}
        </AnimatePresence>
      </div>

      <AnimatePresence initial={false}>
        {frame.queue.length > 0 && (
          <motion.div
            key="queue"
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
            className="overflow-hidden"
          >
            <div className="mt-2 pt-3 border-t border-white/10">
              <div className="text-[10px] uppercase tracking-widest text-white/40 font-mono mb-2">
                {t("closures.queueLabel")} · {frame.queue.length}
              </div>
              <ul className="space-y-1">
                <AnimatePresence initial={false}>
                  {frame.queue.map((item, i) => (
                    <motion.li
                      key={`${i}-${item}`}
                      initial={{ opacity: 0, x: -6 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: 6 }}
                      transition={{
                        duration: 0.28,
                        ease: [0.16, 1, 0.3, 1],
                      }}
                      className="rounded-lg bg-white/5 border border-white/10 px-3 py-1.5 text-[11px] font-mono text-white/80"
                    >
                      {item}
                    </motion.li>
                  ))}
                </AnimatePresence>
              </ul>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

type ScopeCardProps = {
  scope: Scope;
  highlightName?: string;
};

function ScopeCard({ scope, highlightName }: ScopeCardProps) {
  const { t } = useTranslation();
  const isActive = scope.status === "active";
  const isCaptured = scope.status === "captured";

  const cardClasses = [
    "relative rounded-xl p-3 md:p-4 transition-colors backdrop-blur-sm",
    isActive
      ? "border border-accent/60 bg-accent/[0.06] shadow-[0_0_28px_-8px_rgba(124,92,255,0.45)]"
      : "",
    isCaptured
      ? "border border-dashed border-white/25 bg-white/[0.02] opacity-90"
      : "",
    scope.status === "gone" ? "opacity-40" : "",
  ]
    .filter(Boolean)
    .join(" ");

  const statusColor: Record<Scope["status"], string> = {
    active: "text-accent-soft",
    captured: "text-white/60",
    gone: "text-white/30",
  };

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 6, height: 0 }}
      animate={{ opacity: 1, y: 0, height: "auto" }}
      exit={{ opacity: 0, y: -6, height: 0 }}
      transition={{ duration: 0.32, ease: [0.16, 1, 0.3, 1] }}
      className={cardClasses}
    >
      <div className="flex items-baseline justify-between gap-3">
        <div className="text-sm font-mono text-white">{scope.label}</div>
        <div className="flex items-center gap-1.5">
          <span
            className={`h-1.5 w-1.5 rounded-full ${
              isActive
                ? "bg-accent-soft animate-pulse"
                : isCaptured
                  ? "bg-white/40"
                  : "bg-white/20"
            }`}
          />
          <span
            className={`text-[10px] uppercase tracking-widest font-mono ${statusColor[scope.status]}`}
          >
            {t(`closures.scopeStatus.${scope.status}`)}
          </span>
        </div>
      </div>
      {scope.bindings.length > 0 && (
        <ul className="mt-2 space-y-1">
          {scope.bindings.map((b) => {
            const highlighted = highlightName === b.name;
            return (
              <li
                key={b.name}
                className={`flex items-baseline justify-between gap-3 px-2 py-1 rounded-md text-xs font-mono transition-colors ${
                  highlighted
                    ? "bg-accent/25 text-white"
                    : "text-white/75 hover:bg-white/[0.03]"
                }`}
              >
                <span>{b.name}</span>
                <span className="text-white/50">= {b.value}</span>
              </li>
            );
          })}
        </ul>
      )}
    </motion.div>
  );
}
