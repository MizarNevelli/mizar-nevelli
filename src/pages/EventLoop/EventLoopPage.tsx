import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useTranslation } from "react-i18next";
import { EventLoopVisualizer } from "./EventLoopVisualizer";
import { CodeBlock } from "../../components/CodeBlock";
import { CornerLabels } from "../../components/CornerLabels";
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

export function EventLoopPage() {
  const { t } = useTranslation();
  const [scenarioId, setScenarioId] = useState<ScenarioId>("classic");
  const [status, setStatus] = useState<Status>("idle");
  const [step, setStep] = useState(0);
  const [speed, setSpeed] = useState<Speed>("normal");

  const scenario = SCENARIOS[scenarioId];
  const lastStep = scenario.timeline.length - 1;
  const frame = status === "idle" ? IDLE_FRAME : scenario.timeline[step];

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
    <main className="pt-24 pb-24 px-6 max-w-6xl mx-auto">
      <CornerLabels
        topLeft="OBS. I · THE LOOP"
        topRight="single-threaded, 60 Hz"
        bottomLeft="fig. 02"
        bottomRight="scenario · playing"
      />

      <header className="max-w-3xl mx-auto pt-12">
        <div className="flex items-baseline gap-4 mb-6">
          <span className="obs-label">Obs. I</span>
          <span className="hair-t flex-1 mt-3" />
          <span className="coord">{t("eventLoop.eyebrow")}</span>
        </div>
        <h1 className="font-display text-5xl md:text-7xl text-bone leading-[1.05] text-balance">
          {t("eventLoop.title")}
        </h1>
        <p className="mt-6 text-bone/60 text-base md:text-lg leading-relaxed">
          {t("eventLoop.description")}
        </p>
      </header>

      {/* Scenario picker */}
      <div className="mt-14 hair-t hair-b py-4 flex flex-wrap items-baseline gap-x-8 gap-y-3">
        <span className="coord">scenario ·</span>
        {SCENARIO_IDS.map((id) => (
          <button
            key={id}
            onClick={() => setScenarioId(id)}
            className={`text-sm transition-colors ${
              scenarioId === id
                ? "text-bone link-underline"
                : "text-bone/50 hover:text-bone"
            }`}
          >
            {tAny(`eventLoop.scenarios.${id}.label`)}
          </button>
        ))}
      </div>

      {/* Progress + status */}
      <div className="mt-8 max-w-3xl mx-auto">
        <div className="flex items-baseline justify-between mb-2">
          <StatusPill status={status} />
          <span className="coord">
            {t("eventLoop.stepLabel")}{" "}
            <span className="text-bone tnum">
              {status === "idle" ? 0 : step + 1}
            </span>{" "}
            / <span className="tnum">{scenario.timeline.length}</span>
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
                  : `${((step + 1) / scenario.timeline.length) * 100}%`,
            }}
            transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
          />
        </div>
      </div>

      <div className="mt-10 grid md:grid-cols-[minmax(0,1fr)_minmax(0,1.2fr)] gap-6 items-start">
        <CodeBlock
          code={scenario.code}
          highlightLine={status === "idle" ? undefined : frame.line}
        />
        <EventLoopVisualizer frame={frame} />
      </div>

      {/* Narration */}
      <div className="mt-10 min-h-[3.5rem] flex items-start justify-center">
        <AnimatePresence mode="wait">
          <motion.p
            key={`${scenarioId}-${status}-${step}`}
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
            {t("eventLoop.controls.prev")}
          </button>
          <button
            onClick={stepForward}
            disabled={status === "finished"}
            className="text-bone/60 hover:text-bone transition-colors disabled:opacity-25 disabled:cursor-not-allowed"
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
    idle: "text-bone/40",
    running: "text-star",
    paused: "text-ember",
    finished: "text-bone",
  };
  return (
    <span className={`coord ${color[status]}`}>
      [ {t(`eventLoop.status.${status}`)} ]
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
        {t("eventLoop.controls.run")}
      </button>
    );
  }
  if (status === "running") {
    return (
      <div className="flex items-center gap-3">
        <button onClick={onPause} className={primaryClass}>
          <PauseIcon />
          {t("eventLoop.controls.pause")}
        </button>
        <button onClick={onReset} className={ghostClass}>
          {t("eventLoop.controls.reset")}
        </button>
      </div>
    );
  }
  if (status === "paused") {
    return (
      <div className="flex items-center gap-3">
        <button onClick={onResume} className={primaryClass}>
          <PlayIcon />
          {t("eventLoop.controls.resume")}
        </button>
        <button onClick={onReset} className={ghostClass}>
          {t("eventLoop.controls.reset")}
        </button>
      </div>
    );
  }
  return (
    <button onClick={onStart} className={primaryClass}>
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
          {t(`eventLoop.speed.${s}`)}
        </button>
      ))}
    </div>
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
