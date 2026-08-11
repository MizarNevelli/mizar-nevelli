import { useEffect, useMemo, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useTranslation } from "react-i18next";
import { PageMeta } from "../../components/PageMeta";
import {
  type Status,
  type Speed,
  StatusPill,
  PrimaryControls,
  SpeedControl,
} from "../VisualizerControls";

type Phase = "capture" | "target" | "bubble";
type TraceEntry = {
  id: number;
  layer: string;
  phase: Phase;
  narrationKey: string;
  narrationParams?: Record<string, string>;
};

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

export function EventBubblingPage() {
  const { t } = useTranslation();
  const [stopAt, setStopAt] = useState<string | null>(null);
  const [useCapture, setUseCapture] = useState(false);
  const [speed, setSpeed] = useState<Speed>("normal");

  const trace = useMemo(
    () => buildTrace({ useCapture, stopAt }),
    [useCapture, stopAt]
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

  const start = () => {
    setStep(0);
    setStatus("running");
  };
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
    setStep(step + 1);
    if (status === "running") setStatus("paused");
  };
  const stepBack = () => {
    if (status === "idle") return;
    if (status === "finished" || status === "running") setStatus("paused");
    setStep(Math.max(0, step - 1));
  };

  const ti = t as (key: string, params?: Record<string, string>) => string;
  const narration =
    status === "idle"
      ? t("eventBubbling.idleNarration")
      : activeEntry
        ? ti(activeEntry.narrationKey, activeEntry.narrationParams)
        : "";

  return (
    <main className="pt-24 md:pt-32 pb-24 px-4 md:px-6 max-w-6xl mx-auto overflow-x-hidden">
      <PageMeta
        title="Event Bubbling"
        description="See how DOM events propagate through the tree, step by step."
        path="/event-bubbling"
      />
      <header className="text-center max-w-5xl mx-auto">
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
      <div className="mt-8 max-w-5xl mx-auto">
        <div className="flex items-center justify-between text-xs uppercase tracking-widest text-white/40 mb-2">
          <StatusPill status={status} ns="eventBubbling" />
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

      <div className="mt-8 grid grid-cols-1 md:grid-cols-[minmax(0,1.1fr)_minmax(0,1fr)] gap-8 items-start">
        <NestedBoxes
          activeLayer={activeLayer}
          phase={phase}
          onClickTarget={start}
          idle={status === "idle"}
        />
        <div className="glass rounded-3xl p-6 min-h-[200px] md:min-h-[420px]">
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
                  className="flex items-center gap-3 rounded-lg px-2 py-1 min-w-0 overflow-hidden"
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
          ns="eventBubbling"
          onStart={start}
          onResume={resume}
          onPause={pause}
          onReset={reset}
        />
        <div className="flex flex-wrap justify-center items-center gap-2 text-sm">
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
          <SpeedControl speed={speed} ns="eventBubbling" onChange={setSpeed} />
        </div>
      </div>
    </main>
  );
}

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
    narrationParams?: Record<string, string>
  ) => {
    entries.push({ id: id++, layer, phase, narrationKey, narrationParams });
  };

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
