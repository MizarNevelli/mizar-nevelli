import { motion, AnimatePresence } from "framer-motion";
import { useT } from "../../hooks/useT";
import type { FiberFrame, NodeId, NodePhase } from "./scenarios";

const W = 100;
const H = 36;
const hw = W / 2;
const hh = H / 2;

interface NodeDef {
  id: NodeId;
  label: string;
  x: number;
  y: number;
  hasHook?: boolean;
}

const NODES: NodeDef[] = [
  { id: "app", label: "App", x: 260, y: 52 },
  { id: "header", label: "Header", x: 110, y: 145 },
  { id: "page", label: "Page", x: 400, y: 145 },
  { id: "logo", label: "Logo", x: 32, y: 232 },
  { id: "nav", label: "Nav", x: 185, y: 232 },
  { id: "counter", label: "Counter", x: 308, y: 232, hasHook: true },
  { id: "footer", label: "Footer", x: 472, y: 232 },
];

interface PhaseStyle {
  fill: string;
  stroke: string;
  text: string;
  glow: string;
  pulseScale: [number, number, number];
}

const PHASE: Record<NodePhase, PhaseStyle> = {
  hidden: {
    fill: "transparent",
    stroke: "transparent",
    text: "transparent",
    glow: "none",
    pulseScale: [1, 1, 1],
  },
  idle: {
    fill: "rgba(255,255,255,0.04)",
    stroke: "rgba(255,255,255,0.13)",
    text: "rgba(255,255,255,0.55)",
    glow: "none",
    pulseScale: [1, 1.014, 1],
  },
  new: {
    fill: "rgba(60,210,175,0.13)",
    stroke: "rgba(60,210,175,0.55)",
    text: "rgb(60,210,175)",
    glow: "drop-shadow(0 0 8px rgba(60,210,175,0.55))",
    pulseScale: [1, 1.04, 1],
  },
  render: {
    fill: "rgba(90,140,255,0.13)",
    stroke: "rgba(90,140,255,0.55)",
    text: "rgb(110,158,255)",
    glow: "drop-shadow(0 0 9px rgba(90,140,255,0.6))",
    pulseScale: [1, 1.045, 1],
  },
  bailout: {
    fill: "rgba(255,255,255,0.015)",
    stroke: "rgba(255,255,255,0.06)",
    text: "rgba(255,255,255,0.22)",
    glow: "none",
    pulseScale: [1, 1.006, 1],
  },
  dirty: {
    fill: "rgba(255,175,30,0.13)",
    stroke: "rgba(255,175,30,0.55)",
    text: "rgb(255,175,30)",
    glow: "drop-shadow(0 0 9px rgba(255,175,30,0.6))",
    pulseScale: [1, 1.048, 1],
  },
  commit: {
    fill: "rgba(60,215,120,0.13)",
    stroke: "rgba(60,215,120,0.55)",
    text: "rgb(60,215,120)",
    glow: "drop-shadow(0 0 9px rgba(60,215,120,0.6))",
    pulseScale: [1, 1.045, 1],
  },
  effect: {
    fill: "rgba(190,90,255,0.13)",
    stroke: "rgba(190,90,255,0.55)",
    text: "rgb(190,90,255)",
    glow: "drop-shadow(0 0 9px rgba(190,90,255,0.6))",
    pulseScale: [1, 1.045, 1],
  },
};

interface LineDef {
  from: NodeId;
  to: NodeId;
  kind: "child" | "sibling";
  x1: number;
  y1: number;
  x2: number;
  y2: number;
}

const LINES: LineDef[] = [
  {
    from: "app",
    to: "header",
    kind: "child",
    x1: 260,
    y1: 52 + hh,
    x2: 110,
    y2: 145 - hh,
  },
  {
    from: "header",
    to: "page",
    kind: "sibling",
    x1: 110 + hw,
    y1: 145,
    x2: 400 - hw,
    y2: 145,
  },
  {
    from: "header",
    to: "logo",
    kind: "child",
    x1: 110,
    y1: 145 + hh,
    x2: 32,
    y2: 232 - hh,
  },
  {
    from: "logo",
    to: "nav",
    kind: "sibling",
    x1: 32 + hw,
    y1: 232,
    x2: 185 - hw,
    y2: 232,
  },
  {
    from: "page",
    to: "counter",
    kind: "child",
    x1: 400,
    y1: 145 + hh,
    x2: 308,
    y2: 232 - hh,
  },
  {
    from: "counter",
    to: "footer",
    kind: "sibling",
    x1: 308 + hw,
    y1: 232,
    x2: 472 - hw,
    y2: 232,
  },
];

function FiberLine({ line, visible }: { line: LineDef; visible: boolean }) {
  return (
    <motion.line
      x1={line.x1}
      y1={line.y1}
      x2={line.x2}
      y2={line.y2}
      stroke={
        line.kind === "child"
          ? "rgba(255,255,255,0.18)"
          : "rgba(255,255,255,0.12)"
      }
      strokeWidth={1.2}
      strokeDasharray={line.kind === "sibling" ? "4 4" : undefined}
      strokeLinecap="round"
      animate={{ opacity: visible ? 1 : 0 }}
      transition={{ duration: 0.4 }}
    />
  );
}

function FiberNode({
  node,
  phase,
  index,
}: {
  node: NodeDef;
  phase: NodePhase;
  index: number;
}) {
  const style = PHASE[phase];
  const { x, y } = node;

  return (
    <AnimatePresence>
      {phase !== "hidden" && (
        <motion.g
          key={node.id}
          style={{ transformOrigin: `${x}px ${y}px`, filter: style.glow }}
          initial={{ opacity: 0, scale: 0.75 }}
          animate={{
            opacity: 1,
            scale: style.pulseScale,
          }}
          exit={{ opacity: 0, scale: 0.75 }}
          transition={{
            opacity: { duration: 0.35 },
            scale: {
              duration: 2.6 + index * 0.15,
              repeat: Infinity,
              ease: "easeInOut",
              delay: index * 0.38,
              times: [0, 0.5, 1],
            },
          }}
        >
          <motion.rect
            x={x - hw}
            y={y - hh}
            width={W}
            height={H}
            rx={9}
            animate={{ fill: style.fill, stroke: style.stroke }}
            transition={{ duration: 0.35 }}
            strokeWidth={1.5}
          />
          <text
            x={x - hw + 7}
            y={y - hh + 11}
            fontSize={8}
            fontFamily="IBM Plex Mono, monospace"
            fill="rgba(255,255,255,0.28)"
          >
            ƒ
          </text>
          {node.hasHook && (
            <motion.circle
              cx={x + hw - 7}
              cy={y - hh + 7}
              r={3}
              animate={{ fill: style.stroke }}
              transition={{ duration: 0.35 }}
            />
          )}
          <motion.text
            x={x}
            y={y + 5}
            textAnchor="middle"
            fontSize={12}
            fontFamily="IBM Plex Mono, monospace"
            fontWeight={500}
            animate={{ fill: style.text }}
            transition={{ duration: 0.35 }}
          >
            {node.label}
          </motion.text>
        </motion.g>
      )}
    </AnimatePresence>
  );
}

const LEGEND_PHASES: Array<{ phase: NodePhase; key: string }> = [
  { phase: "new", key: "new" },
  { phase: "render", key: "render" },
  { phase: "bailout", key: "bailout" },
  { phase: "dirty", key: "dirty" },
  { phase: "commit", key: "commit" },
  { phase: "effect", key: "effect" },
];

function PhaseBadge({ phase, label }: { phase: NodePhase; label: string }) {
  const style = PHASE[phase];
  return (
    <span className="inline-flex items-center gap-1.5">
      <span
        className="inline-block w-2 h-2 rounded-full"
        style={{ backgroundColor: style.stroke }}
      />
      <span className="text-white/45">{label}</span>
    </span>
  );
}

export function FiberTreeVisualizer({ frame }: { frame: FiberFrame }) {
  const { tx } = useT();

  const lineVisible = (from: NodeId, to: NodeId) =>
    frame.nodes[from] !== "hidden" && frame.nodes[to] !== "hidden";

  return (
    <div className="flex flex-col gap-4">
      <div className="rounded-2xl border border-white/[0.08] bg-white/[0.02] p-4 overflow-hidden">
        <svg
          viewBox="-30 10 580 260"
          width="100%"
          aria-label="React Fiber tree"
        >
          <g>
            {LINES.map((line) => (
              <FiberLine
                key={`${line.from}-${line.to}`}
                line={line}
                visible={lineVisible(line.from, line.to)}
              />
            ))}
          </g>

          <g>
            {NODES.map((node, i) => (
              <FiberNode
                key={node.id}
                node={node}
                phase={frame.nodes[node.id]}
                index={i}
              />
            ))}
          </g>
        </svg>
      </div>

      <div className="flex flex-wrap gap-x-4 gap-y-2 px-1 text-[11px] font-mono">
        {LEGEND_PHASES.map(({ phase, key }) => (
          <PhaseBadge
            key={phase}
            phase={phase}
            label={tx(`reactFiber.phases.${key}`)}
          />
        ))}
        <span className="inline-flex items-center gap-1.5 ml-auto">
          <svg width="24" height="8" className="shrink-0">
            <line
              x1="0"
              y1="4"
              x2="24"
              y2="4"
              stroke="rgba(255,255,255,0.3)"
              strokeWidth="1.2"
            />
          </svg>
          <span className="text-white/30">{tx("reactFiber.legend.child")}</span>
          <svg width="24" height="8" className="shrink-0 ml-2">
            <line
              x1="0"
              y1="4"
              x2="24"
              y2="4"
              stroke="rgba(255,255,255,0.25)"
              strokeWidth="1.2"
              strokeDasharray="4 3"
            />
          </svg>
          <span className="text-white/30">
            {tx("reactFiber.legend.sibling")}
          </span>
        </span>
      </div>
    </div>
  );
}
