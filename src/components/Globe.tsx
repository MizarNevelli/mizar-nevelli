import createGlobe, { type COBEOptions } from "cobe";
import { useEffect, useRef } from "react";
import { useMotionValue, type MotionValue } from "framer-motion";

type GlobeProps = {
  progress?: MotionValue<number>;
  className?: string;
  markers?: Array<{ location: [number, number]; size?: number }>;
};

const DEFAULT_MARKERS: NonNullable<GlobeProps["markers"]> = [
  { location: [45.4642, 9.19] },       // Milan
  { location: [35.6762, 139.6503] },   // Tokyo
  { location: [-33.8688, 151.2093] },  // Sydney
  { location: [40.7128, -74.006] },    // New York
  { location: [-22.9068, -43.1729] },  // Rio
  { location: [28.6139, 77.209] },     // Delhi
  { location: [51.5074, -0.1278] },    // London
  { location: [37.7749, -122.4194] },  // San Francisco
];

export function Globe({
  progress,
  className,
  markers = DEFAULT_MARKERS,
}: GlobeProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const fallback = useMotionValue(0);
  const source = progress ?? fallback;

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const dpr = Math.min(window.devicePixelRatio || 1, 1.5);
    let globe: ReturnType<typeof createGlobe> | null = null;
    let rafId = 0;
    let phi = 0;
    let smoothProgress = source.get();

    const tick = () => {
      phi += 0.0025;
      smoothProgress += (source.get() - smoothProgress) * 0.12;
      globe?.update({ phi: phi + smoothProgress * Math.PI * 2, scale: 0.92 });
      rafId = requestAnimationFrame(tick);
    };

    const buildOptions = (width: number): COBEOptions => ({
      devicePixelRatio: dpr,
      width: width * dpr,
      height: width * dpr,
      phi: 0,
      theta: 0.25,
      dark: 1,
      diffuse: 1.2,
      mapSamples: 16000,
      mapBrightness: 6,
      baseColor: [0.18, 0.13, 0.04],
      markerColor: [0.95, 0.72, 0.18],
      glowColor: [0.85, 0.58, 0.12],
      markers: markers.map((m) => ({
        location: m.location,
        size: m.size ?? 0.05,
      })),
      scale: 1,
    });

    // ResizeObserver delivers sizes without forcing a layout reflow.
    // Create the globe once on the first callback (real size guaranteed),
    // then only update width/height on subsequent resizes — no destroy/recreate,
    // which eliminates the "no buffer bound to enabled attribute" WebGL error.
    const ro = new ResizeObserver((entries) => {
      const width = entries[0]?.contentRect.width;
      if (!width) return;

      if (!globe) {
        globe = createGlobe(canvas, buildOptions(width));
        canvas.style.opacity = "1";
        rafId = requestAnimationFrame(tick);
      } else {
        globe.update({ width: width * dpr, height: width * dpr });
      }
    });

    ro.observe(canvas);

    return () => {
      ro.disconnect();
      cancelAnimationFrame(rafId);
      globe?.destroy();
    };
  }, [markers, source]);

  return (
    <canvas
      ref={canvasRef}
      className={className}
      style={{
        width: "100%",
        aspectRatio: "1",
        opacity: 0,
        transition: "opacity 1s ease",
        contain: "layout paint size",
      }}
    />
  );
}
