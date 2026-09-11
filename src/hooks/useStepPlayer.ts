import { useEffect, useState } from "react";
import type { Speed, Status } from "../components/VisualizerControls";
import { IDLE_FRAME, type FiberFrame } from "../pages/ReactFiber/scenarios";

const SPEED_MS: Record<Speed, number> = { slow: 2400, normal: 1600, fast: 900 };

export function useStepPlayer(timeline: FiberFrame[]) {
  const [status, setStatus] = useState<Status>("idle");
  const [step, setStep] = useState(0);
  const [speed, setSpeed] = useState<Speed>("normal");

  const lastStep = timeline.length - 1;
  const safeStep = Math.min(step, lastStep);
  const frame = status === "idle" ? IDLE_FRAME : timeline[safeStep];

  useEffect(() => {
    if (status !== "running") return;
    if (step >= lastStep) {
      setStatus("finished");
      return;
    }
    const id = window.setTimeout(() => setStep((s) => s + 1), SPEED_MS[speed]);
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
  const forward = () => {
    if (status === "idle") setStatus("paused");
    if (step >= lastStep) {
      setStatus("finished");
      return;
    }
    setStep((s) => s + 1);
    if (status === "running") setStatus("paused");
  };
  const back = () => {
    if (status === "idle") return;
    if (status === "finished" || status === "running") setStatus("paused");
    setStep((s) => Math.max(0, s - 1));
  };

  return {
    status,
    step: safeStep,
    speed,
    setSpeed,
    frame,
    start,
    resume,
    pause,
    reset,
    forward,
    back,
  };
}
