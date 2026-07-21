import { motion, useInView, type Variants } from 'framer-motion'
import { useRef, type ReactNode } from 'react'

type ScrollRevealProps = {
  children: ReactNode
  delay?: number
  className?: string
  /** Distance in pixels to translate up from. */
  y?: number
}

const variants: Variants = {
  hidden: { opacity: 0, y: 40, filter: 'blur(8px)' },
  visible: {
    opacity: 1,
    y: 0,
    filter: 'blur(0px)',
    transition: { duration: 0.9, ease: [0.16, 1, 0.3, 1] },
  },
}

/**
 * Reveal children with a soft blur + rise once they enter the viewport.
 * Uses `once: true` so scroll-back doesn't retrigger the animation.
 */
export function ScrollReveal({
  children,
  delay = 0,
  className,
  y = 40,
}: ScrollRevealProps) {
  const ref = useRef<HTMLDivElement>(null)
  const inView = useInView(ref, { once: true, amount: 0.35 })

  return (
    <motion.div
      ref={ref}
      className={className}
      variants={variants}
      initial="hidden"
      animate={inView ? 'visible' : 'hidden'}
      custom={y}
      transition={{ delay }}
    >
      {children}
    </motion.div>
  )
}
