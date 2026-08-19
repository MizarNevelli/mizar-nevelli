import { motion } from "framer-motion";

type BurgerIconProps = {
  open: boolean;
};

/**
 * Animated burger → X icon. Both lines share the same geometry (a horizontal
 * line at y=8) and are moved into position via CSS transforms, that way
 * framer-motion never has to interpolate raw SVG y1/y2 attributes, which need
 * seed values before they can animate.
 */
export function BurgerIcon({ open }: BurgerIconProps) {
  const spring = { duration: 0.25, ease: [0.16, 1, 0.3, 1] } as const;
  return (
    <svg width="22" height="16" viewBox="0 0 22 16" aria-hidden>
      <motion.line
        x1="1"
        y1="8"
        x2="21"
        y2="8"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinecap="round"
        style={{ originX: "11px", originY: "8px" }}
        animate={{ translateY: open ? 0 : -5, rotate: open ? 45 : 0 }}
        transition={spring}
      />
      <motion.line
        x1="1"
        y1="8"
        x2="21"
        y2="8"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinecap="round"
        style={{ originX: "11px", originY: "8px" }}
        animate={{ translateY: open ? 0 : 5, rotate: open ? -45 : 0 }}
        transition={spring}
      />
    </svg>
  );
}
