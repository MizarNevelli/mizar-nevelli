import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useTranslation } from "react-i18next";
import { EventLoopVisualizer } from "./EventLoopVisualizer";
import { CodeBlock } from "../../components/CodeBlock";
import { PageMeta } from "../../components/PageMeta";
import {
  SCENARIOS,
  SCENARIO_IDS,
  type ScenarioId,
  type Frame,
} from "./scenarios";

type Status = "idle" | "running" | "paused" | "finished";
type Speed = "slow" | "normal" | "fast";

const SPEED_MS: Record<Speed, number> = {
  slow: 2400,
  normal: 1600,
  fast: 900,
};

const IDLE_FRAME: Frame = {
  line: 0,
  stack: [],
  microtasks: [],
  macrotasks: [],
};

/**
 * Event Loop explainer. State machine:
 *   idle | running | paused | finished
 * Narration and scenario labels are pulled from i18n by scenario id + step.
 */
export function EventLoopPage() {
  const { t } = useTranslation();
  const [scenarioId, setScenarioId] = useState<ScenarioId>("classic");
  const [status, setStatus] = useState<Status>("idle");
  const [step, setStep] = useState(0);
  const [speed, setSpeed] = useState<Speed>("normal");

  const scenario = SCENARIOS[scenarioId];
  const lastStep = scenario.timeline.length - 1;
  const frame = status === "idle" ? IDLE_FRAME : scenario.timeline[step];

  // Dynamic key path — cast around the strict typed t() to look up by index.
  const tAny = t as (key: string) => string;
  const narration: string =
    status === "idle"
      ? t("eventLoop.idleNarration")
      : tAny(`eventLoop.scenarios.${scenarioId}.narrations.${step}`);

  useEffect(() => {
    setStatus("idle");
    setStep(0);
  }, [scenarioId]);

  useEffect(() => {
    if (status !== "running") return;
    if (step >= lastStep) {
      setStatus("finished");
      return;
    }
    const id = window.setTimeout(() => setStep(step + 1), SPEED_MS[speed]);
    return () => window.clearTimeout(id);
  }, [status, step, speed, lastStep]);

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
    if (status === "finished") setStatus("paused");
    if (status === "running") setStatus("paused");
    setStep(Math.max(0, step - 1));
  };

  return (
    <main className="pt-32 pb-24 px-6 max-w-6xl mx-auto"><PageMeta title="Event Loop" description="A visual walkthrough of the JavaScript event loop — call stack, microtasks, and task queue." path="/event-loop" />
      <header className="text-center max-w-3xl mx-auto">
        <p className="text-[10px] font-mono uppercase tracking-[0.2em] text-white/30 mb-3">
          {t("eventLoop.eyebrow")}
        </p>
        <h1 className="text-5xl md:text-7xl font-semibold tracking-tight text-white text-balance">
          {t("eventLoop.title")}
        </h1>
        <p className="mt-6 text-white/60 text-lg text-balance">
          {t("eventLoop.description")}
        </p>
      </header>

      {/* Scenario picker */}
      <div className="mt-12 flex justify-center flex-wrap gap-2">
        {SCENARIO_IDS.map((id) => (
          <button
            key={id}
            onClick={() => setScenarioId(id)}
            className={`px-4 py-2 rounded-lg text-sm transition-colors ${
              scenarioId === id
                ? "bg-accent text-white"
                : "border border-white/15 text-white/60 hover:text-white hover:border-white/25"
            }`}
          >
            {tAny(`eventLoop.scenarios.${id}.label`)}
          </button>
        ))}
      </div>

      {/* Progress + status pill */}
      <div className="mt-8 max-w-3xl mx-auto">
        <div className="flex items-center justify-between text-xs uppercase tracking-widest text-white/40 mb-2">
          <StatusPill status={status} />
          <span>
            {t("eventLoop.stepLabel")}{" "}
            <span className="text-white/80">
              {status === "idle" ? 0 : step + 1}
            </span>{" "}
            / {scenario.timeline.length}
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
                  : `${((step + 1) / scenario.timeline.length) * 100}%`,
            }}
            transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
          />
        </div>
      </div>

      <div className="mt-8 grid md:grid-cols-[minmax(0,1fr)_minmax(0,1.2fr)] gap-6 items-start">
        <CodeBlock
          code={scenario.code}
          highlightLine={status === "idle" ? undefined : frame.line}
        />
        <EventLoopVisualizer frame={frame} />
      </div>

      {/* Narration */}
      <div className="mt-8 min-h-[3.5rem] flex items-start justify-center">
        <AnimatePresence mode="wait">
          <motion.p
            key={`${scenarioId}-${status}-${step}`}
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
            {t("eventLoop.controls.prev")}
          </button>
          <button
            onClick={stepForward}
            disabled={status === "finished"}
            className="border border-white/15 px-4 py-2 rounded-lg text-white/60 hover:text-white hover:border-white/30 transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
          >
            {t("eventLoop.controls.next")}
          </button>
          <SpeedControl speed={speed} onChange={setSpeed} />
        </div>
      </div>
    </main>
  );
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
    <span className={color[status]}>● {t(`eventLoop.status.${status}`)}</span>
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
        className="group inline-flex items-center gap-2 rounded-full bg-accent px-8 py-3 text-white font-medium shadow-lg shadow-accent-glow hover:bg-accent-soft transition-colors"
      >
        <PlayIcon />
        {t("eventLoop.controls.run")}
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
          {t("eventLoop.controls.pause")}
        </button>
        <button
          onClick={onReset}
          className="rounded-lg border border-white/15 px-5 py-3 text-white/60 hover:text-white hover:border-white/30 transition-colors"
        >
          {t("eventLoop.controls.reset")}
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
          {t("eventLoop.controls.resume")}
        </button>
        <button
          onClick={onReset}
          className="rounded-lg border border-white/15 px-5 py-3 text-white/60 hover:text-white hover:border-white/30 transition-colors"
        >
          {t("eventLoop.controls.reset")}
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
      {t("eventLoop.controls.replay")}
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
          {t(`eventLoop.speed.${s}`)}
        </button>
      ))}
    </div>
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
