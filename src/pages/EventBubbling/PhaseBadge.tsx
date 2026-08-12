import type { Phase } from "./NestedBoxes";

export function PhaseBadge({ phase }: { phase: Phase }) {
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
