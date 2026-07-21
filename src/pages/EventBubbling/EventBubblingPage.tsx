import { useCallback, useEffect, useMemo, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useTranslation } from "react-i18next";
import { CornerLabels } from "../../components/CornerLabels";

type Phase = "capture" | "target" | "bubble";
type TraceEntry = {
  id: number;
  layer: string;
  phase: Phase;
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

  const tAny = t as (key: string, params?: Record<string, string>) => string;
  const narration =
    status === "idle"
      ? t("eventBubbling.idleNarration")
      : activeEntry
        ? tAny(activeEntry.narrationKey, activeEntry.narrationParams)
        : "";

  return (
    <main className="pt-24 pb-24 px-6 max-w-6xl mx-auto">
      <CornerLabels
        topLeft="OBS. II · THE CASCADE"
        topRight="capture ↓  ·  bubble ↑"
        bottomLeft="fig. 03"
        bottomRight="dom · tracing"
      />

      <header className="max-w-3xl mx-auto pt-12">
        <div className="flex items-baseline gap-4 mb-6">
          <span className="obs-label">Obs. II</span>
          <span className="hair-t flex-1 mt-3" />
          <span className="coord">{t("eventBubbling.eyebrow")}</span>
        </div>
        <h1 className="font-display text-5xl md:text-7xl text-bone leading-[1.05] text-balance">
          {t("eventBubbling.title")}
        </h1>
        <p className="mt-6 text-bone/60 text-base md:text-lg leading-relaxed">
          {t("eventBubbling.description")}
        </p>
      </header>

      {/* Toggles */}
      <div className="mt-14 hair-t hair-b py-4 flex flex-wrap items-baseline gap-x-8 gap-y-3">
        <label className="flex items-baseline gap-2 cursor-pointer text-sm text-bone/70 hover:text-bone transition-colors">
          <input
            type="checkbox"
            checked={useCapture}
            onChange={(e) => setUseCapture(e.target.checked)}
            className="accent-star translate-y-[3px]"
          />
          <span className="font-mono text-xs uppercase tracking-[0.14em]">
            {t("eventBubbling.toggles.useCapture")}
          </span>
        </label>
        <label className="flex items-baseline gap-2 text-sm text-bone/70">
          <span className="coord">{t("eventBubbling.toggles.stopPropagation")}</span>
          <select
            value={stopAt ?? ""}
            onChange={(e) => setStopAt(e.target.value || null)}
            className="bg-transparent outline-none text-bone hair px-2 py-1 font-mono text-xs"
          >
            <option value="" className="bg-ink">
              {t("eventBubbling.toggles.none")}
            </option>
            {LAYERS.map((l) => (
              <option key={l} value={l} className="bg-ink">
                {l}
              </option>
            ))}
          </select>
        </label>
      </div>

      {/* Progress + status */}
      <div className="mt-8 max-w-3xl mx-auto">
        <div className="flex items-baseline justify-between mb-2">
          <StatusPill status={status} />
          <span className="coord">
            {t("eventBubbling.hopLabel")}{" "}
            <span className="text-bone tnum">
              {status === "idle" ? 0 : step + 1}
            </span>{" "}
            / <span className="tnum">{trace.length}</span>
          </span>
        </div>
        <div className="h-px bg-bone/10 overflow-hidden">
          <motion.div
            className="h-full bg-star"
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

      <div className="mt-10 grid md:grid-cols-[minmax(0,1.1fr)_minmax(0,1fr)] gap-8 items-start">
        <NestedBoxes
          activeLayer={activeLayer}
          phase={phase}
          onClickTarget={start}
          idle={status === "idle"}
        />

        <div className="hair flex flex-col min-h-[420px] bg-ink/40">
          <div className="hair-b px-4 py-3 flex items-baseline justify-between">
            <span className="obs-label">Propagation log</span>
            <span className="coord">fig. 03a</span>
          </div>
          <div className="p-4 font-mono text-sm space-y-1">
            <AnimatePresence initial={false}>
              {log.length === 0 && (
                <motion.p
                  key="empty"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="text-bone/40 text-xs"
                >
                  {t("eventBubbling.log.empty_prefix")}
                  <code className="text-star">#inner</code>
                  {t("eventBubbling.log.empty_suffix")}
                </motion.p>
              )}
              {log.map((entry, i) => (
                <motion.div
                  key={entry.id}
                  initial={{ opacity: 0, x: -6 }}
                  animate={{
                    opacity: 1,
                    x: 0,
                  }}
                  transition={{ duration: 0.28 }}
                  className={`flex items-baseline gap-3 px-2 py-1 border-l-2 transition-colors ${
                    i === step
                      ? "border-star bg-star/[0.06] text-bone"
                      : "border-transparent text-bone/70"
                  }`}
                >
                  <PhaseBadge phase={entry.phase} />
                  <span className="text-bone/90 tnum">{entry.layer}</span>
                  <span className="text-bone/40 truncate text-xs">
                    {t("eventBubbling.log.listener", { phase: entry.phase })}
                  </span>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        </div>
      </div>

      {/* Narration */}
      <div className="mt-10 min-h-[3.5rem] flex items-start justify-center">
        <AnimatePresence mode="wait">
          <motion.p
            key={`${status}-${step}`}
            initial={{ opacity: 0, y: 4 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -4 }}
            transition={{ duration: 0.28 }}
            className="text-center text-bone/80 max-w-2xl font-display text-xl md:text-2xl leading-snug"
          >
            <em>{narration}</em>
          </motion.p>
        </AnimatePresence>
      </div>

      {/* Controls */}
      <div className="mt-10 flex flex-col items-center gap-4">
        <PrimaryControls
          status={status}
          onStart={start}
          onResume={resume}
          onPause={pause}
          onReset={reset}
        />
        <div className="flex items-baseline gap-6 text-sm">
          <button
            onClick={stepBack}
            disabled={status === "idle" || step === 0}
            className="text-bone/60 hover:text-bone transition-colors disabled:opacity-25 disabled:cursor-not-allowed"
          >
            {t("eventBubbling.controls.prev")}
          </button>
          <button
            onClick={stepForward}
            disabled={status === "finished"}
            className="text-bone/60 hover:text-bone transition-colors disabled:opacity-25 disabled:cursor-not-allowed"
          >
            {t("eventBubbling.controls.next")}
          </button>
          <SpeedControl speed={speed} onChange={setSpeed} />
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
    narrationParams?: Record<string, string>,
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

function StatusPill({ status }: { status: Status }) {
  const { t } = useTranslation();
  const color: Record<Status, string> = {
    idle: "text-bone/40",
    running: "text-star",
    paused: "text-ember",
    finished: "text-bone",
  };
  return (
    <span className={`coord ${color[status]}`}>
      [ {t(`eventBubbling.status.${status}`)} ]
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
  const primaryClass =
    "inline-flex items-center gap-2 border border-bone px-6 py-2.5 text-bone hover:bg-bone hover:text-night transition-colors font-mono text-xs uppercase tracking-[0.18em]";
  const ghostClass =
    "hair px-5 py-2.5 text-bone/70 hover:text-bone hover:border-bone/50 transition-colors font-mono text-xs uppercase tracking-[0.18em]";

  if (status === "idle") {
    return (
      <button onClick={onStart} className={primaryClass}>
        <PlayIcon />
        {t("eventBubbling.controls.run")}
      </button>
    );
  }
  if (status === "running") {
    return (
      <div className="flex items-center gap-3">
        <button onClick={onPause} className={primaryClass}>
          <PauseIcon />
          {t("eventBubbling.controls.pause")}
        </button>
        <button onClick={onReset} className={ghostClass}>
          {t("eventBubbling.controls.reset")}
        </button>
      </div>
    );
  }
  if (status === "paused") {
    return (
      <div className="flex items-center gap-3">
        <button onClick={onResume} className={primaryClass}>
          <PlayIcon />
          {t("eventBubbling.controls.resume")}
        </button>
        <button onClick={onReset} className={ghostClass}>
          {t("eventBubbling.controls.reset")}
        </button>
      </div>
    );
  }
  return (
    <button onClick={onStart} className={primaryClass}>
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
    <div className="flex items-baseline gap-3 pl-6 hair-l">
      <span className="coord">rate ·</span>
      {options.map((s) => (
        <button
          key={s}
          onClick={() => onChange(s)}
          className={`transition-colors font-mono text-[11px] uppercase tracking-[0.16em] ${
            speed === s
              ? "text-star link-underline"
              : "text-bone/45 hover:text-bone"
          }`}
        >
          {t(`eventBubbling.speed.${s}`)}
        </button>
      ))}
    </div>
  );
}

function PhaseBadge({ phase }: { phase: Phase }) {
  const arrow: Record<Phase, string> = {
    capture: "↓",
    target: "◉",
    bubble: "↑",
  };
  const color: Record<Phase, string> = {
    capture: "text-star",
    target: "text-bone",
    bubble: "text-ember",
  };
  return (
    <span
      className={`font-mono text-[10px] uppercase tracking-[0.14em] ${color[phase]}`}
    >
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
 * Concentric orbits. Border style shifts per phase: dashed for capture,
 * solid for target, dotted for bubble. Active layer glows in the phase color.
 */
function NestedBoxes({
  activeLayer,
  phase,
  onClickTarget,
  idle,
}: NestedBoxesProps) {
  const { t } = useTranslation();
  const phaseGlow = (p: Phase | null) => {
    if (!p) return "transparent";
    if (p === "capture") return "rgba(123,197,255,0.55)";
    if (p === "bubble") return "rgba(240,184,114,0.55)";
    return "rgba(232,230,221,0.65)";
  };
  const borderStyle = (p: Phase | null) => {
    if (p === "capture") return "dashed";
    if (p === "bubble") return "dotted";
    return "solid";
  };
  const glow = phaseGlow(phase);
  const bStyle = borderStyle(phase);

  const layer = (name: string, children: React.ReactNode, extraClass = "") => {
    const active = activeLayer === name;
    return (
      <motion.div
        animate={{
          boxShadow: active
            ? `0 0 0 1px ${glow}, 0 0 30px ${glow}`
            : "0 0 0 1px rgba(232,230,221,0.15)",
        }}
        transition={{ duration: 0.35 }}
        style={active ? { borderStyle: bStyle } : undefined}
        className={`p-6 relative ${active ? "border border-transparent" : "hair"} ${extraClass}`}
      >
        <span className="absolute top-2 left-3 coord">{name}</span>
        {children}
      </motion.div>
    );
  };

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
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              animate={{
                boxShadow:
                  activeLayer === "#inner"
                    ? `0 0 0 1px ${glow}, 0 0 30px ${glow}`
                    : idle
                      ? "0 0 0 1px rgba(123,197,255,0.35), 0 0 20px rgba(123,197,255,0.15)"
                      : "0 0 0 1px rgba(232,230,221,0.15)",
              }}
              transition={{ duration: 0.35 }}
              className="w-full text-bone py-8 px-4 mt-6 font-mono text-sm uppercase tracking-[0.18em] relative bg-ink/60"
            >
              <span className="absolute top-2 left-3 coord">#inner</span>
              {idle
                ? t("eventBubbling.innerButton.idle")
                : t("eventBubbling.innerButton.default")}
            </motion.button>,
            "mt-6 bg-transparent",
          ),
          "mt-6 bg-transparent",
        ),
        "mt-6 bg-transparent",
      ),
      "mt-6 bg-transparent",
    ),
    "bg-transparent",
  );
}

const PlayIcon = () => (
  <svg width="10" height="10" viewBox="0 0 24 24" fill="currentColor" aria-hidden>
    <path d="M8 5v14l11-7z" />
  </svg>
);
const PauseIcon = () => (
  <svg width="10" height="10" viewBox="0 0 24 24" fill="currentColor" aria-hidden>
    <path d="M6 4h4v16H6zM14 4h4v16h-4z" />
  </svg>
);
const ReplayIcon = () => (
  <svg width="10" height="10" viewBox="0 0 24 24" fill="currentColor" aria-hidden>
    <path d="M12 5V1L7 6l5 5V7a5 5 0 1 1-5 5H5a7 7 0 1 0 7-7z" />
  </svg>
);
