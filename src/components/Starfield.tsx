import { useMemo } from "react";

type StarfieldProps = {
  /** Approximate number of stars to render. Defaults to 40. */
  count?: number;
  /** Seed-ish name so stars are stable across renders. */
  seed?: string;
  className?: string;
};

/**
 * A quiet, pin-sized starfield. Positions are computed once (deterministic per
 * seed) so they don't jump around on re-renders. Twinkle timings are staggered
 * per star via inline `animationDelay`.
 */
export function Starfield({
  count = 40,
  seed = "sky",
  className = "",
}: StarfieldProps) {
  const stars = useMemo(() => generate(count, seed), [count, seed]);
  return (
    <div
      aria-hidden
      className={`pointer-events-none absolute inset-0 overflow-hidden ${className}`}
    >
      {stars.map((s, i) => (
        <span
          key={i}
          className="absolute rounded-full bg-bone/70 animate-twinkle"
          style={{
            top: `${s.top}%`,
            left: `${s.left}%`,
            width: s.size,
            height: s.size,
            animationDelay: `${s.delay}s`,
            animationDuration: `${s.duration}s`,
            opacity: s.baseOpacity,
          }}
        />
      ))}
    </div>
  );
}

/** Deterministic pseudo-random generator (Mulberry32) so seeded fields stay put. */
function generate(count: number, seed: string) {
  const rng = mulberry32(hash(seed));
  return Array.from({ length: count }, () => ({
    top: rng() * 100,
    left: rng() * 100,
    size: rng() < 0.85 ? 1 : 2,
    delay: rng() * 6,
    duration: 5 + rng() * 7,
    baseOpacity: 0.15 + rng() * 0.55,
  }));
}

function hash(str: string): number {
  let h = 2166136261;
  for (let i = 0; i < str.length; i++) {
    h ^= str.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  return h >>> 0;
}

function mulberry32(a: number) {
  return function () {
    a |= 0;
    a = (a + 0x6d2b79f5) | 0;
    let t = a;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}
