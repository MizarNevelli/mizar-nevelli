import { useEffect, useMemo, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useTranslation } from "react-i18next";
import { CodeBlock } from "../../components/CodeBlock";
import { ClosuresVisualizer } from "./ClosuresVisualizer";
import { PageMeta } from "../../components/PageMeta";
import { Console } from "./Console";
import {
  SCENARIOS,
  SCENARIO_IDS,
  IDLE_FRAME,
  type ScenarioId,
} from "./scenarios";
import {
  StatusPill,
  PrimaryControls,
  SpeedControl,
  type Status,
  type Speed,
} from "../VisualizerControls";

const SPEED_MS: Record<Speed, number> = {
  slow: 2400,
  normal: 1600,
  fast: 900,
};

export function ClosuresPage() {
  const { t } = useTranslation();
  const [scenarioId, setScenarioId] = useState<ScenarioId>("basic");
  const [status, setStatus] = useState<Status>("idle");
  const [step, setStep] = useState(0);
  const [speed, setSpeed] = useState<Speed>("normal");

  const scenario = SCENARIOS[scenarioId];
  const lastStep = scenario.timeline.length - 1;
  const safeStep = Math.min(step, lastStep);
  const frame = status === "idle" ? IDLE_FRAME : scenario.timeline[safeStep];

  const tx = (key: string) => t(key as never);
  const narration: string =
    status === "idle"
      ? t("closures.idleNarration")
      : tx(`closures.scenarios.${scenarioId}.narrations.${step}`);

  // Accumulated console entries up to (and including) the current step.
  const consoleEntries = useMemo(() => {
    if (status === "idle") return [];
    return scenario.timeline
      .slice(0, step + 1)
      .map((f) => f.log)
      .filter((v): v is string => v != null);
  }, [status, step, scenario]);

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
        title="Closures"
        description="Functions that carry their scope — an interactive guide to JavaScript closures."
        path="/closures"
      />
      <header className="text-center max-w-5xl mx-auto">
        <p className="text-[10px] font-mono uppercase tracking-[0.2em] text-white/30 mb-3">
          {t("closures.eyebrow")}
        </p>
        <h1 className="text-5xl md:text-7xl font-semibold tracking-tight text-white text-balance">
          {t("closures.title")}
        </h1>
        <p className="mt-6 text-white/60 text-lg text-balance">
          {t("closures.description")}
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
            {tx(`closures.scenarios.${id}.label`)}
          </button>
        ))}
      </div>

      {/* Progress + status */}
      <div className="mt-8 max-w-5xl mx-auto">
        <div className="flex items-center justify-between text-xs uppercase tracking-widest text-white/40 mb-2">
          <StatusPill status={status} ns="closures" />
          <span>
            {t("closures.stepLabel")}{" "}
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

      {/* Code + visualizer */}
      <div className="mt-8 grid md:grid-cols-[minmax(0,1fr)_minmax(0,1.15fr)] gap-6 items-start">
        <CodeBlock
          code={scenario.code}
          highlightLine={
            status === "idle" || frame?.line === 0 ? undefined : frame?.line
          }
        />
        <ClosuresVisualizer frame={frame} />
      </div>

      {/* Console output */}
      <div className="mt-6">
        <Console entries={consoleEntries} />
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
          ns="closures"
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
            {t("closures.controls.prev")}
          </button>
          <button
            onClick={stepForward}
            disabled={status === "finished"}
            className="border border-white/15 px-4 py-2 rounded-lg text-white/60 hover:text-white hover:border-white/30 transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
          >
            {t("closures.controls.next")}
          </button>
          <SpeedControl speed={speed} ns="closures" onChange={setSpeed} />
        </div>
      </div>
    </main>
  );
}
