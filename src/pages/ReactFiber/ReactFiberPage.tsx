import { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useT } from "../../hooks/useT";
import { CodeBlock } from "../../components/CodeBlock";
import { FiberTreeVisualizer } from "./FiberTreeVisualizer";
import { PageMeta } from "../../components/PageMeta";
import { SCENARIOS, SCENARIO_IDS, type ScenarioId } from "./scenarios";
import {
  StatusPill,
  PrimaryControls,
  SpeedControl,
} from "../../components/VisualizerControls";
import { DemoPanel } from "./DemoPanel";
import { useTimelinePlayer } from "../../hooks/useTimelinePlayer";
import { useStepPlayer } from "../../hooks/useStepPlayer";

function NarrationLog({
  scenarioId,
  narrationIdx,
  playCount,
}: {
  scenarioId: Exclude<ScenarioId, "initialRender">;
  narrationIdx: number | null;
  playCount: number;
}) {
  const { t, tx } = useT();
  const bottomRef = useRef<HTMLDivElement>(null);

  if (narrationIdx === null) {
    return (
      <p className="text-center text-white/35 text-sm">
        {t("reactFiber.interactiveIdleNarration")}
      </p>
    );
  }

  return (
    <div className="flex flex-col gap-3 px-1">
      {Array.from({ length: narrationIdx + 1 }, (_, i) => (
        <motion.div
          key={`${playCount}-${i}`}
          initial={{ opacity: 0, y: 6 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.25 }}
          className="flex gap-3 text-sm leading-relaxed"
        >
          <span className="shrink-0 font-mono text-xs text-white/20 pt-0.5 w-4 text-right select-none">
            {i + 1}
          </span>
          <span
            className={i === narrationIdx ? "text-white/90" : "text-white/30"}
          >
            {tx(`reactFiber.scenarios.${scenarioId}.narrations.${i}`)}
          </span>
        </motion.div>
      ))}
      <div ref={bottomRef} />
    </div>
  );
}

export function ReactFiberPage() {
  const { t, tx } = useT();
  const [scenarioId, setScenarioId] = useState<ScenarioId>("initialRender");
  // interactive state (stateUpdate + effects)
  const [count, setCount] = useState(0);
  const player = useTimelinePlayer();
  // step-based state (initialRender)
  const stepper = useStepPlayer(SCENARIOS.initialRender.timeline);
  const isInteractive = scenarioId !== "initialRender";
  const scenario = SCENARIOS[scenarioId];

  const frame = isInteractive ? player.frame : stepper.frame;
  const narration: string =
    stepper.status === "idle"
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

      <div className="text-center max-w-5xl mx-auto">
        <p className="text-[10px] font-mono uppercase tracking-[0.2em] text-white/30 mb-3">
          {t("reactFiber.eyebrow")}
        </p>
        <h1 className="text-5xl font-semibold tracking-tight text-white text-balance">
          {t("reactFiber.title")}
        </h1>
        <p className="mt-6 text-white/60 text-lg max-w-2xl mx-auto text-balance">
          {t("reactFiber.description")}
        </p>
      </div>

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
              <SpeedControl
                speed={stepper.speed}
                ns="reactFiber"
                onChange={stepper.setSpeed}
              />
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

          <div className="mt-10 mx-auto w-full">
            <NarrationLog
              scenarioId={scenarioId as Exclude<ScenarioId, "initialRender">}
              narrationIdx={player.narrationIdx}
              playCount={player.playCount}
            />
          </div>
        </>
      )}
    </main>
  );
}
