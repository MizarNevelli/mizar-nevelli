import { useTranslation } from "react-i18next";
import { PlayIcon, PauseIcon, ReplayIcon } from "../components/Icons";

export type Status = "idle" | "running" | "paused" | "finished";
export type Speed = "slow" | "normal" | "fast";

export type PrimaryControlsProps = {
  status: Status;
  ns: string;
  onStart: () => void;
  onResume: () => void;
  onPause: () => void;
  onReset: () => void;
};

export function StatusPill({ status, ns }: { status: Status; ns: string }) {
  const { t } = useTranslation();
  const color: Record<Status, string> = {
    idle: "text-white/50",
    running: "text-emerald-400",
    paused: "text-amber-400",
    finished: "text-accent-soft",
  };
  return (
    <span className={color[status]}>
      ● {t(`${ns}.status.${status}` as never)}
    </span>
  );
}

export function PrimaryControls({
  status,
  ns,
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
        {t(`${ns}.controls.run` as never)}
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
          {t(`${ns}.controls.pause` as never)}
        </button>
        <button
          onClick={onReset}
          className="rounded-lg border border-white/15 px-5 py-3 text-white/60 hover:text-white hover:border-white/30 transition-colors"
        >
          {t(`${ns}.controls.reset` as never)}
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
          {t(`${ns}.controls.resume` as never)}
        </button>
        <button
          onClick={onReset}
          className="rounded-lg border border-white/15 px-5 py-3 text-white/60 hover:text-white hover:border-white/30 transition-colors"
        >
          {t(`${ns}.controls.reset` as never)}
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
      {t(`${ns}.controls.replay` as never)}
    </button>
  );
}

export function SpeedControl({
  speed,
  ns,
  onChange,
}: {
  speed: Speed;
  ns: string;
  onChange: (s: Speed) => void;
}) {
  const { t } = useTranslation();
  const options: Speed[] = ["slow", "normal", "fast"];
  return (
    <div className="border border-white/15 rounded-lg p-1 flex items-center text-xs">
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
          {t(`${ns}.speed.${s}` as never)}
        </button>
      ))}
    </div>
  );
}
