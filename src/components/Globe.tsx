import createGlobe, { type COBEOptions } from 'cobe'
import { useEffect, useRef } from 'react'
import { useMotionValue, type MotionValue } from 'framer-motion'

type GlobeProps = {
  /** External progress driver (0 → 1) used for scroll-linked rotation & zoom. */
  progress?: MotionValue<number>
  className?: string
  /** Highlight markers: [latitude, longitude] pairs. */
  markers?: Array<{ location: [number, number]; size?: number }>
}

const DEFAULT_MARKERS: NonNullable<GlobeProps['markers']> = [
  { location: [45.4642, 9.19] }, // Milan
  { location: [35.6762, 139.6503] }, // Tokyo
  { location: [-33.8688, 151.2093] }, // Sydney
  { location: [40.7128, -74.006] }, // New York
  { location: [-22.9068, -43.1729] }, // Rio
  { location: [28.6139, 77.209] }, // Delhi
  { location: [51.5074, -0.1278] }, // London
  { location: [37.7749, -122.4194] }, // San Francisco
]

/**
 * Interactive WebGL globe (cobe). Rotation phi and zoom are driven either by
 * a scroll-linked progress value or by an internal auto-rotation.
 */
export function Globe({
  progress,
  className,
  markers = DEFAULT_MARKERS,
}: GlobeProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const fallback = useMotionValue(0)
  const source = progress ?? fallback

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    // Cap DPR at 1.5 — the fragment shader gets expensive fast on retina.
    const dpr = Math.min(window.devicePixelRatio || 1, 1.5)
    const width = canvas.offsetWidth || 500
    const baseOptions: COBEOptions = {
      devicePixelRatio: dpr,
      width: width * dpr,
      height: width * dpr,
      phi: 0,
      theta: 0.25,
      dark: 1,
      diffuse: 1.2,
      mapSamples: 16000,
      mapBrightness: 6,
      baseColor: [0.12, 0.18, 0.34],
      markerColor: [0.48, 0.77, 1.0],
      glowColor: [0.48, 0.77, 1.0],
      markers: markers.map((m) => ({
        location: m.location,
        size: m.size ?? 0.05,
      })),
      scale: 1,
    }

    const globe = createGlobe(canvas, baseOptions)

    let phi = 0
    // Smooth the scroll input with a lightweight lerp instead of a spring —
    // no wobble on scroll-stop, and it tracks the finger/wheel more tightly.
    let smoothProgress = source.get()
    let rafId = 0
    // Baseline scale < 1 so the zoom-in on scroll never clips the canvas edges.
    // Cobe fills the canvas at scale=1, so we stay inside [0.82 .. 1.0].
    const MIN_SCALE = 0.82
    const MAX_SCALE = 1.0
    const tick = () => {
      phi += 0.0025 // slow auto-drift
      smoothProgress += (source.get() - smoothProgress) * 0.12
      globe.update({
        phi: phi + smoothProgress * Math.PI * 2,
        scale: MIN_SCALE + smoothProgress * (MAX_SCALE - MIN_SCALE),
      })
      rafId = requestAnimationFrame(tick)
    }
    rafId = requestAnimationFrame(tick)

    // Fade in once rendering starts to hide the first-frame flash.
    requestAnimationFrame(() => (canvas.style.opacity = '1'))

    return () => {
      cancelAnimationFrame(rafId)
      globe.destroy()
    }
  }, [markers, source])

  return (
    <canvas
      ref={canvasRef}
      className={className}
      style={{
        width: '100%',
        aspectRatio: '1',
        opacity: 0,
        transition: 'opacity 1s ease',
        contain: 'layout paint size',
      }}
    />
  )
}
