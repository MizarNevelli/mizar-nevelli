import { useCallback, useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useTranslation } from "react-i18next";
import { CodeBlock } from "../../components/CodeBlock";
import { FiberTreeVisualizer } from "./FiberTreeVisualizer";
import { PageMeta } from "../../components/PageMeta";
import {
  SCENARIOS,
  SCENARIO_IDS,
  IDLE_FRAME,
  type FiberFrame,
  type ScenarioId,
} from "./scenarios";
import {
  StatusPill,
  PrimaryControls,
  SpeedControl,
  type Status,
  type Speed,
} from "../../components/VisualizerControls";

function useTimelinePlayer() {
  const ids = useRef<ReturnType<typeof setTimeout>[]>([]);
  const [frame, setFrame] = useState<FiberFrame>(IDLE_FRAME);
  const [narrationIdx, setNarrationIdx] = useState<number | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);

  const cancel = useCallback(() => {
    ids.current.forEach(clearTimeout);
    ids.current = [];
  }, []);

  const play = useCallback(
    (timeline: FiberFrame[], stepMs = 500) => {
      cancel();
      setIsPlaying(true);
      setFrame(timeline[0]);
      setNarrationIdx(0);
      let elapsed = stepMs;
      timeline.slice(1).forEach((f, raw) => {
        const i = raw + 1;
        const id = setTimeout(() => {
          setFrame(f);
          setNarrationIdx(i);
          if (i === timeline.length - 1) setIsPlaying(false);
        }, elapsed);
        ids.current.push(id);
        elapsed += stepMs;
      });
    },
    [cancel]
  );

  const reset = useCallback(() => {
    cancel();
    setIsPlaying(false);
    setFrame(IDLE_FRAME);
    setNarrationIdx(null);
  }, [cancel]);

  useEffect(() => cancel, [cancel]);

  return { frame, narrationIdx, isPlaying, play, reset };
}

const SPEED_MS: Record<Speed, number> = { slow: 2400, normal: 1600, fast: 900 };

function useStepPlayer(timeline: FiberFrame[]) {
  const [status, setStatus] = useState<Status>("idle");
  const [step, setStep] = useState(0);
  const [speed, setSpeed] = useState<Speed>("normal");

  const lastStep = timeline.length - 1;
  const safeStep = Math.min(step, lastStep);
  const frame = status === "idle" ? IDLE_FRAME : timeline[safeStep];

  useEffect(() => {
    if (status !== "running") return;
    if (step >= lastStep) { setStatus("finished"); return; }
    const id = window.setTimeout(() => setStep((s) => s + 1), SPEED_MS[speed]);
    return () => window.clearTimeout(id);
  }, [status, step, speed, lastStep]);

  const start   = () => { setStep(0); setStatus("running"); };
  const resume  = () => setStatus("running");
  const pause   = () => setStatus("paused");
  const reset   = () => { setStatus("idle"); setStep(0); };
  const forward = () => {
    if (status === "idle") setStatus("paused");
    if (step >= lastStep) { setStatus("finished"); return; }
    setStep((s) => s + 1);
    if (status === "running") setStatus("paused");
  };
  const back = () => {
    if (status === "idle") return;
    if (status === "finished" || status === "running") setStatus("paused");
    setStep((s) => Math.max(0, s - 1));
  };

  return { status, step: safeStep, speed, setSpeed, frame, start, resume, pause, reset, forward, back };
}

interface DemoPanelProps {
  scenarioId: Exclude<ScenarioId, "initialRender">;
  count: number;
  isPlaying: boolean;
  onIncrement: () => void;
}

function DemoPanel({ scenarioId, count, isPlaying, onIncrement }: DemoPanelProps) {
  const { t } = useTranslation();
  return (
    <div className="relative flex flex-col items-center justify-center gap-7 rounded-2xl border border-white/[0.08] bg-white/[0.015] min-h-[200px] overflow-hidden p-10">
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            "radial-gradient(ellipse 70% 50% at 50% 60%, rgba(212,160,23,0.04), transparent)",
        }}
      />
      <AnimatePresence mode="wait">
        <motion.span
          key={count}
          initial={{ y: -16, opacity: 0, filter: "blur(6px)" }}
          animate={{ y: 0, opacity: 1, filter: "blur(0px)" }}
          exit={{ y: 16, opacity: 0, filter: "blur(6px)" }}
          transition={{ duration: 0.26, ease: [0.16, 1, 0.3, 1] }}
          className="text-7xl font-mono tabular-nums font-semibold text-white leading-none select-none"
        >
          {count}
        </motion.span>
      </AnimatePresence>

      <motion.button
        onClick={onIncrement}
        disabled={isPlaying}
        whileTap={{ scale: 0.93 }}
        className="px-8 py-3 rounded-xl bg-accent/10 border border-accent/25 text-accent-soft font-medium hover:bg-accent/[0.18] transition-colors disabled:opacity-40 disabled:cursor-not-allowed text-sm"
      >
        {isPlaying ? (
          <span className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-accent animate-pulse" />
            {t("reactFiber.demoPanel.reconciling")}
          </span>
        ) : (
          t("reactFiber.demoPanel.increment")
        )}
      </motion.button>

      {scenarioId === "effects" && (
        <p className="text-[11px] font-mono text-white/20 absolute bottom-3">
          {t("reactFiber.demoPanel.effectsNote")}
        </p>
      )}
    </div>
  );
}

export function ReactFiberPage() {
  const { t } = useTranslation();
  const [scenarioId, setScenarioId] = useState<ScenarioId>("initialRender");

  // interactive state (stateUpdate + effects)
  const [count, setCount] = useState(0);
  const player = useTimelinePlayer();

  // step-based state (initialRender)
  const stepper = useStepPlayer(SCENARIOS.initialRender.timeline);

  const tx = (key: string) => t(key as never);
  const isInteractive = scenarioId !== "initialRender";
  const scenario = SCENARIOS[scenarioId];

  // derive current frame + narration depending on mode
  const frame = isInteractive ? player.frame : stepper.frame;
  const narration: string = isInteractive
    ? player.narrationIdx === null
      ? t("reactFiber.idleNarration")
      : tx(`reactFiber.scenarios.${scenarioId}.narrations.${player.narrationIdx}`)
    : stepper.status === "idle"
    ? t("reactFiber.idleNarration")
    : tx(`reactFiber.scenarios.initialRender.narrations.${stepper.step}`);

  // reset both players on scenario switch
  useEffect(() => {
    player.reset();
    stepper.reset();
    setCount(0);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [scenarioId]);

  const handleIncrement = () => {
    if (player.isPlaying) return;
    setCount((c) => c + 1);
    player.play(scenario.timeline, 500);
  };

  return (
    <main className="pt-32 pb-24 px-6 max-w-6xl mx-auto">
      <PageMeta
        title="React Fiber"
        description={t("reactFiber.description")}
        path="/react-fiber"
      />

      <header className="text-center max-w-5xl mx-auto">
        <p className="text-[10px] font-mono uppercase tracking-[0.2em] text-white/30 mb-3">
          {t("reactFiber.eyebrow")}
        </p>
        <h1 className="text-5xl md:text-7xl font-semibold tracking-tight text-white text-balance">
          {t("reactFiber.title")}
        </h1>
        <p className="mt-6 text-white/60 text-lg max-w-2xl mx-auto text-balance">
          {t("reactFiber.description")}
        </p>
      </header>

      {/* scenario selector */}
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
            {tx(`reactFiber.scenarios.${id}.label`)}
          </button>
        ))}
      </div>

      {/* ── Initial render: step-based layout ── */}
      {!isInteractive && (
        <>
          <div className="mt-8 max-w-5xl mx-auto">
            <div className="flex items-center justify-between text-xs uppercase tracking-widest text-white/40 mb-2">
              <StatusPill status={stepper.status} ns="reactFiber" />
              <span>
                {t("reactFiber.stepLabel")}{" "}
                <span className="text-white/80">
                  {stepper.status === "idle" ? 0 : stepper.step + 1}
                </span>{" "}
                / {SCENARIOS.initialRender.timeline.length}
              </span>
            </div>
            <div className="h-1 rounded-full bg-white/5 overflow-hidden">
              <motion.div
                className="h-full bg-gradient-to-r from-accent to-accent-soft"
                initial={false}
                animate={{
                  width:
                    stepper.status === "idle"
                      ? "0%"
                      : `${((stepper.step + 1) / SCENARIOS.initialRender.timeline.length) * 100}%`,
                }}
                transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
              />
            </div>
          </div>

          <div className="mt-8 grid md:grid-cols-[minmax(0,1fr)_minmax(0,1.3fr)] gap-6 items-start">
            <CodeBlock
              code={scenario.code}
              highlightLine={
                stepper.status === "idle" || !frame.codeHighlight
                  ? undefined
                  : frame.codeHighlight
              }
            />
            <FiberTreeVisualizer frame={frame} />
          </div>

          <div className="mt-8 min-h-[3.5rem] flex items-start justify-center">
            <AnimatePresence mode="wait">
              <motion.p
                key={`ir-${stepper.status}-${stepper.step}`}
                initial={{ opacity: 0, y: 6 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -6 }}
                transition={{ duration: 0.28 }}
                className="text-center text-white/75 max-w-2xl text-lg leading-relaxed"
              >
                {narration}
              </motion.p>
            </AnimatePresence>
          </div>

          <div className="mt-8 flex flex-col items-center gap-4">
            <PrimaryControls
              status={stepper.status}
              ns="reactFiber"
              onStart={stepper.start}
              onResume={stepper.resume}
              onPause={stepper.pause}
              onReset={stepper.reset}
            />
            <div className="flex flex-wrap justify-center items-center gap-2 text-sm">
              <button
                onClick={stepper.back}
                disabled={stepper.status === "idle" || stepper.step === 0}
                className="border border-white/15 px-4 py-2 rounded-lg text-white/60 hover:text-white hover:border-white/30 transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
              >
                {t("reactFiber.controls.prev")}
              </button>
              <button
                onClick={stepper.forward}
                disabled={stepper.status === "finished"}
                className="border border-white/15 px-4 py-2 rounded-lg text-white/60 hover:text-white hover:border-white/30 transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
              >
                {t("reactFiber.controls.next")}
              </button>
              <SpeedControl speed={stepper.speed} ns="reactFiber" onChange={stepper.setSpeed} />
            </div>
          </div>
        </>
      )}

      {/* ── State update / effects: interactive layout ── */}
      {isInteractive && (
        <>
          <div className="mt-10 grid md:grid-cols-[minmax(0,1fr)_minmax(0,1.3fr)] gap-6 items-start">
            <div className="flex flex-col gap-5">
              <DemoPanel
                scenarioId={scenarioId as Exclude<ScenarioId, "initialRender">}
                count={count}
                isPlaying={player.isPlaying}
                onIncrement={handleIncrement}
              />
              <CodeBlock
                code={scenario.code}
                highlightLine={frame.codeHighlight}
              />
            </div>
            <FiberTreeVisualizer frame={frame} />
          </div>

          <div className="mt-10 min-h-[3.5rem] flex items-start justify-center">
            <AnimatePresence mode="wait">
              <motion.p
                key={`${scenarioId}-${player.narrationIdx}`}
                initial={{ opacity: 0, y: 6 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -6 }}
                transition={{ duration: 0.28 }}
                className="text-center text-white/75 max-w-2xl text-lg leading-relaxed"
              >
                {narration}
              </motion.p>
            </AnimatePresence>
          </div>
        </>
      )}
    </main>
  );
}
