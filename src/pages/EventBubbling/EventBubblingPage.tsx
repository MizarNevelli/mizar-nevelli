import { useCallback, useEffect, useMemo, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useTranslation } from "react-i18next";

type Phase = "capture" | "target" | "bubble";
type TraceEntry = {
  id: number;
  layer: string;
  phase: Phase;
  /** i18n key for the narration, plus optional interpolation params. */
  narrationKey: string;
  narrationParams?: Record<string, string>;
};
type Status = "idle" | "running" | "paused" | "finished";
type Speed = "slow" | "normal" | "fast";

const LAYERS = [
  "window",
  "document",
  "body",
  "#outer",
  "#middle",
  "#inner",
] as const;
const TARGET = "#inner";

const SPEED_MS: Record<Speed, number> = {
  slow: 1800,
  normal: 1100,
  fast: 550,
};

/**
 * Event bubbling explainer. Trace is pre-computed based on the toggles and
 * stepped through by a state machine (idle | running | paused | finished).
 * Narration text is looked up from i18n by key + interpolated params.
 */
export function EventBubblingPage() {
  const { t } = useTranslation();
  const [stopAt, setStopAt] = useState<string | null>(null);
  const [useCapture, setUseCapture] = useState(false);
  const [speed, setSpeed] = useState<Speed>("normal");

  const trace = useMemo(
    () => buildTrace({ useCapture, stopAt }),
    [useCapture, stopAt],
  );

  const [status, setStatus] = useState<Status>("idle");
  const [step, setStep] = useState(0);
  const lastStep = trace.length - 1;

  useEffect(() => {
    setStatus("idle");
    setStep(0);
  }, [trace]);

  useEffect(() => {
    if (status !== "running") return;
    if (step >= lastStep) {
      setStatus("finished");
      return;
    }
    const id = window.setTimeout(() => setStep(step + 1), SPEED_MS[speed]);
    return () => window.clearTimeout(id);
  }, [status, step, speed, lastStep]);

  const log = status === "idle" ? [] : trace.slice(0, step + 1);
  const activeEntry = status === "idle" ? null : trace[step];
  const activeLayer = activeEntry?.layer ?? null;
  const phase = activeEntry?.phase ?? null;

  const start = useCallback(() => {
    setStep(0);
    setStatus("running");
  }, []);
  const resume = () => setStatus("running");
  const pause = () => setStatus("paused");
  const reset = () => {
    setStatus("idle");
    setStep(0);
  };
  const stepForward = () => {
    if (status === "idle") setStatus("paused");
    if (step >= lastStep) {
      setStatus("finished");
      return;
    }
    if (status === "running") setStatus("paused");
    setStep(step + 1);
  };
  const stepBack = () => {
    if (status === "idle") return;
    if (status === "finished" || status === "running") setStatus("paused");
    setStep(Math.max(0, step - 1));
  };

  // Cast around strict i18n typing for dynamic key lookups.
  const tAny = t as (key: string, params?: Record<string, string>) => string;
  const narration =
    status === "idle"
      ? t("eventBubbling.idleNarration")
      : activeEntry
        ? tAny(activeEntry.narrationKey, activeEntry.narrationParams)
        : "";

  return (
    <main className="pt-32 pb-24 px-6 max-w-6xl mx-auto">
      <header className="text-center max-w-3xl mx-auto">
        <p className="text-[10px] font-mono uppercase tracking-[0.2em] text-white/30 mb-3">
          {t("eventBubbling.eyebrow")}
        </p>
        <h1 className="text-5xl md:text-7xl font-semibold tracking-tight text-white text-balance">
          {t("eventBubbling.title")}
        </h1>
        <p className="mt-6 text-white/60 text-lg text-balance">
          {t("eventBubbling.description")}
        </p>
      </header>

      {/* Toggles */}
      <div className="mt-10 flex justify-center flex-wrap gap-3 text-sm">
        <label className="border border-white/15 rounded-lg px-4 py-2 flex items-center gap-2 cursor-pointer">
          <input
            type="checkbox"
            checked={useCapture}
            onChange={(e) => setUseCapture(e.target.checked)}
            className="accent-accent"
          />
          {t("eventBubbling.toggles.useCapture")}
        </label>
        <label className="border border-white/15 rounded-lg px-4 py-2 flex items-center gap-2">
          {t("eventBubbling.toggles.stopPropagation")}
          <select
            value={stopAt ?? ""}
            onChange={(e) => setStopAt(e.target.value || null)}
            className="bg-transparent outline-none text-white"
          >
            <option value="">{t("eventBubbling.toggles.none")}</option>
            {LAYERS.map((l) => (
              <option key={l} value={l} className="bg-ink-800">
                {l}
              </option>
            ))}
          </select>
        </label>
      </div>

      {/* Progress + status */}
      <div className="mt-8 max-w-3xl mx-auto">
        <div className="flex items-center justify-between text-xs uppercase tracking-widest text-white/40 mb-2">
          <StatusPill status={status} />
          <span>
            {t("eventBubbling.hopLabel")}{" "}
            <span className="text-white/80">
              {status === "idle" ? 0 : step + 1}
            </span>{" "}
            / {trace.length}
          </span>
        </div>
        <div className="h-1 rounded-full bg-white/5 overflow-hidden">
          <motion.div
            className="h-full bg-gradient-to-r from-accent to-accent-soft"
            initial={false}
            animate={{
              width:
                status === "idle"
                  ? "0%"
                  : `${((step + 1) / trace.length) * 100}%`,
            }}
            transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
          />
        </div>
      </div>

      <div className="mt-8 grid md:grid-cols-[minmax(0,1.1fr)_minmax(0,1fr)] gap-8 items-start">
        <NestedBoxes
          activeLayer={activeLayer}
          phase={phase}
          onClickTarget={start}
          idle={status === "idle"}
        />
        <div className="glass rounded-3xl p-6 min-h-[420px]">
          <h3 className="text-white font-medium mb-4">
            {t("eventBubbling.log.title")}
          </h3>
          <div className="space-y-2 font-mono text-sm">
            <AnimatePresence initial={false}>
              {log.length === 0 && (
                <motion.p
                  key="empty"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="text-white/40"
                >
                  {t("eventBubbling.log.empty_prefix")}
                  <code className="text-accent-soft">#inner</code>
                  {t("eventBubbling.log.empty_suffix")}
                </motion.p>
              )}
              {log.map((entry, i) => (
                <motion.div
                  key={entry.id}
                  initial={{ opacity: 0, x: -8 }}
                  animate={{
                    opacity: 1,
                    x: 0,
                    backgroundColor:
                      i === step
                        ? "rgba(255,255,255,0.06)"
                        : "rgba(255,255,255,0)",
                  }}
                  transition={{ duration: 0.3 }}
                  className="flex items-center gap-3 rounded-lg px-2 py-1"
                >
                  <PhaseBadge phase={entry.phase} />
                  <span className="text-white/90">{entry.layer}</span>
                  <span className="text-white/40 truncate">
                    {t("eventBubbling.log.listener", { phase: entry.phase })}
                  </span>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        </div>
      </div>

      {/* Narration */}
      <div className="mt-8 min-h-[3.5rem] flex items-start justify-center">
        <AnimatePresence mode="wait">
          <motion.p
            key={`${status}-${step}`}
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -6 }}
            transition={{ duration: 0.28 }}
            className="text-center text-white/80 max-w-2xl text-lg leading-relaxed"
          >
            {narration}
          </motion.p>
        </AnimatePresence>
      </div>

      {/* Controls */}
      <div className="mt-8 flex flex-col items-center gap-4">
        <PrimaryControls
          status={status}
          onStart={start}
          onResume={resume}
          onPause={pause}
          onReset={reset}
        />
        <div className="flex items-center gap-2 text-sm">
          <button
            onClick={stepBack}
            disabled={status === "idle" || step === 0}
            className="border border-white/15 px-4 py-2 rounded-lg text-white/60 hover:text-white hover:border-white/30 transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
          >
            {t("eventBubbling.controls.prev")}
          </button>
          <button
            onClick={stepForward}
            disabled={status === "finished"}
            className="border border-white/15 px-4 py-2 rounded-lg text-white/60 hover:text-white hover:border-white/30 transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
          >
            {t("eventBubbling.controls.next")}
          </button>
          <SpeedControl speed={speed} onChange={setSpeed} />
        </div>
      </div>
    </main>
  );
}

/**
 * Turn the current toggle state into a full ordered list of hops. Each hop
 * carries an i18n key + params instead of rendered text, so re-rendering in a
 * different language just re-looks-up the key.
 */
function buildTrace({
  useCapture,
  stopAt,
}: {
  useCapture: boolean;
  stopAt: string | null;
}): TraceEntry[] {
  const entries: TraceEntry[] = [];
  let id = 0;
  const push = (
    layer: string,
    phase: Phase,
    narrationKey: string,
    narrationParams?: Record<string, string>,
  ) => {
    entries.push({ id: id++, layer, phase, narrationKey, narrationParams });
  };

  // Capture phase — top-down, up to (but not including) the target.
  for (const layer of LAYERS) {
    if (layer === TARGET) break;
    const key =
      layer === "window"
        ? "eventBubbling.narrations.captureStart"
        : "eventBubbling.narrations.capture";
    push(layer, "capture", key, { layer });
    if (useCapture && layer === stopAt) return entries;
  }

  push(TARGET, "target", "eventBubbling.narrations.target", { layer: TARGET });
  if (stopAt === TARGET) return entries;

  // Bubble phase — bottom-up, skipping the target itself.
  for (const layer of [...LAYERS].reverse()) {
    if (layer === TARGET) continue;
    const key =
      layer === "window"
        ? "eventBubbling.narrations.bubbleEnd"
        : "eventBubbling.narrations.bubble";
    push(layer, "bubble", key, { layer });
    if (!useCapture && layer === stopAt) break;
  }
  return entries;
}

function StatusPill({ status }: { status: Status }) {
  const { t } = useTranslation();
  const color: Record<Status, string> = {
    idle: "text-white/50",
    running: "text-emerald-400",
    paused: "text-amber-400",
    finished: "text-accent-soft",
  };
  return (
    <span className={color[status]}>
      ● {t(`eventBubbling.status.${status}`)}
    </span>
  );
}

type PrimaryControlsProps = {
  status: Status;
  onStart: () => void;
  onResume: () => void;
  onPause: () => void;
  onReset: () => void;
};

function PrimaryControls({
  status,
  onStart,
  onResume,
  onPause,
  onReset,
}: PrimaryControlsProps) {
  const { t } = useTranslation();
  if (status === "idle") {
    return (
      <button
        onClick={onStart}
        className="inline-flex items-center gap-2 rounded-full bg-accent px-8 py-3 text-white font-medium shadow-lg shadow-accent-glow hover:bg-accent-soft transition-colors"
      >
        <PlayIcon />
        {t("eventBubbling.controls.run")}
      </button>
    );
  }
  if (status === "running") {
    return (
      <div className="flex items-center gap-3">
        <button
          onClick={onPause}
          className="inline-flex items-center gap-2 rounded-lg border border-white/15 px-6 py-3 text-white hover:border-white/30 transition-colors"
        >
          <PauseIcon />
          {t("eventBubbling.controls.pause")}
        </button>
        <button
          onClick={onReset}
          className="rounded-lg border border-white/15 px-5 py-3 text-white/60 hover:text-white hover:border-white/30 transition-colors"
        >
          {t("eventBubbling.controls.reset")}
        </button>
      </div>
    );
  }
  if (status === "paused") {
    return (
      <div className="flex items-center gap-3">
        <button
          onClick={onResume}
          className="inline-flex items-center gap-2 rounded-full bg-accent px-6 py-3 text-white font-medium shadow-lg shadow-accent-glow hover:bg-accent-soft transition-colors"
        >
          <PlayIcon />
          {t("eventBubbling.controls.resume")}
        </button>
        <button
          onClick={onReset}
          className="rounded-lg border border-white/15 px-5 py-3 text-white/60 hover:text-white hover:border-white/30 transition-colors"
        >
          {t("eventBubbling.controls.reset")}
        </button>
      </div>
    );
  }
  return (
    <button
      onClick={onStart}
      className="inline-flex items-center gap-2 rounded-full bg-accent px-8 py-3 text-white font-medium shadow-lg shadow-accent-glow hover:bg-accent-soft transition-colors"
    >
      <ReplayIcon />
      {t("eventBubbling.controls.replay")}
    </button>
  );
}

function SpeedControl({
  speed,
  onChange,
}: {
  speed: Speed;
  onChange: (s: Speed) => void;
}) {
  const { t } = useTranslation();
  const options: Speed[] = ["slow", "normal", "fast"];
  return (
    <div className="border border-white/15 rounded-lg p-1 flex items-center text-xs ml-2">
      {options.map((s) => (
        <button
          key={s}
          onClick={() => onChange(s)}
          className={`px-3 py-1.5 rounded-md transition-colors capitalize ${
            speed === s
              ? "bg-white/10 text-white"
              : "text-white/50 hover:text-white"
          }`}
        >
          {t(`eventBubbling.speed.${s}`)}
        </button>
      ))}
    </div>
  );
}

function PhaseBadge({ phase }: { phase: Phase }) {
  const styles: Record<Phase, string> = {
    capture: "bg-sky-500/20 text-sky-300",
    target: "bg-accent/30 text-accent-soft",
    bubble: "bg-emerald-500/20 text-emerald-300",
  };
  const arrow: Record<Phase, string> = {
    capture: "↓",
    target: "◉",
    bubble: "↑",
  };
  return (
    <span className={`px-2 py-0.5 rounded text-xs ${styles[phase]}`}>
      {arrow[phase]} {phase}
    </span>
  );
}

type NestedBoxesProps = {
  activeLayer: string | null;
  phase: Phase | null;
  onClickTarget: () => void;
  idle: boolean;
};

/**
 * Concentric boxes representing window ⤳ #inner. The active layer glows in the
 * color of the current phase so the user can trace the propagation visually.
 */
function NestedBoxes({
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

  const layer = (name: string, children: React.ReactNode, extraClass = "") => (
    <motion.div
      animate={{
        boxShadow:
          activeLayer === name
            ? `0 0 0 3px ${glow}, 0 0 50px ${glow}`
            : "0 0 0 1px rgba(255,255,255,0.08)",
      }}
      transition={{ duration: 0.35 }}
      className={`rounded-2xl p-6 relative ${extraClass}`}
    >
      <span className="absolute top-2 left-3 text-xs font-mono text-white/40">
        {name}
      </span>
      {children}
    </motion.div>
  );

  return layer(
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
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
              animate={{
                boxShadow:
                  activeLayer === "#inner"
                    ? `0 0 0 3px ${glow}, 0 0 50px ${glow}`
                    : idle
                      ? "0 0 0 1px rgba(212,160,23,0.5), 0 0 30px rgba(212,160,23,0.25)"
                      : "0 0 0 1px rgba(255,255,255,0.15)",
              }}
              transition={{ duration: 0.35 }}
              className="w-full rounded-2xl bg-accent/20 text-white py-8 px-4 mt-6 font-medium relative"
            >
              <span className="absolute top-2 left-3 text-xs font-mono text-white/60">
                #inner
              </span>
              {idle
                ? t("eventBubbling.innerButton.idle")
                : t("eventBubbling.innerButton.default")}
            </motion.button>,
            "mt-6 bg-white/[0.02]",
          ),
          "mt-6 bg-white/[0.02]",
        ),
        "mt-6 bg-white/[0.02]",
      ),
      "mt-6 bg-white/[0.02]",
    ),
    "bg-white/[0.02]",
  );
}

const PlayIcon = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor" aria-hidden>
    <path d="M8 5v14l11-7z" />
  </svg>
);
const PauseIcon = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor" aria-hidden>
    <path d="M6 4h4v16H6zM14 4h4v16h-4z" />
  </svg>
);
const ReplayIcon = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor" aria-hidden>
    <path d="M12 5V1L7 6l5 5V7a5 5 0 1 1-5 5H5a7 7 0 1 0 7-7z" />
  </svg>
);
