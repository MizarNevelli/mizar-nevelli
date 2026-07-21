import { useMemo } from "react";

type StarFieldProps = {
  count?: number;
  seed?: string;
  className?: string;
};

/**
 * Decorative starfield for the About hero. Deterministic per-seed positions
 * so React re-renders don't shuffle stars around.
 */
export function StarField({
  count = 60,
  seed = "about",
  className = "",
}: StarFieldProps) {
  const stars = useMemo(() => generate(count, seed), [count, seed]);
  return (
    <div
      aria-hidden
      className={`pointer-events-none absolute inset-0 overflow-hidden ${className}`}
    >
      {stars.map((s, i) => (
        <span
          key={i}
          className="absolute rounded-full bg-white/70 animate-pulse"
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

function generate(count: number, seed: string) {
  const rng = mulberry32(hash(seed));
  return Array.from({ length: count }, () => ({
    top: rng() * 100,
    left: rng() * 100,
    size: rng() < 0.85 ? 1 : 2,
    delay: rng() * 6,
    duration: 4 + rng() * 6,
    baseOpacity: 0.2 + rng() * 0.55,
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
