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
import {
  type Status,
  type Speed,
  StatusPill,
  PrimaryControls,
  SpeedControl,
} from "../VisualizerControls";

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
  const tx = t as (key: string) => string;
  const narration: string =
    status === "idle"
      ? t("eventLoop.idleNarration")
      : tx(`eventLoop.scenarios.${scenarioId}.narrations.${step}`);

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
    <main className="pt-32 pb-24 px-6 max-w-6xl mx-auto">
      <PageMeta
        title="Event Loop"
        description="A visual walkthrough of the JavaScript event loop — call stack, microtasks, and task queue."
        path="/event-loop"
      />
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
            {tx(`eventLoop.scenarios.${id}.label`)}
          </button>
        ))}
      </div>

      {/* Progress + status pill */}
      <div className="mt-8 max-w-3xl mx-auto">
        <div className="flex items-center justify-between text-xs uppercase tracking-widest text-white/40 mb-2">
          <StatusPill status={status} ns="eventLoop" />
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
          ns="eventLoop"
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
          <SpeedControl speed={speed} ns="eventLoop" onChange={setSpeed} />
        </div>
      </div>
    </main>
  );
}
