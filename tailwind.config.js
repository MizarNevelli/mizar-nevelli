/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        /* Semantic tokens — reference CSS vars so light/dark themes work */
        base:     "rgb(var(--bg-base-rgb) / <alpha-value>)",
        surface:  "rgb(var(--bg-surface-rgb) / <alpha-value>)",
        elevated: "rgb(var(--bg-elevated-rgb) / <alpha-value>)",
        primary:  "rgb(var(--primary) / <alpha-value>)",
        accent: {
          DEFAULT: "rgb(var(--accent) / <alpha-value>)",
          soft:    "rgb(var(--accent-soft) / <alpha-value>)",
          glow:    "rgba(212, 160, 23, 0.35)",
        },
        /* Legacy static tokens — kept for any remaining ink-* usage */
        ink: {
          950: "#05060a",
          900: "#0a0b12",
          800: "#12141c",
          700: "#1c1f2a",
          600: "#2a2e3d",
        },
      },
      fontFamily: {
        sans: [
          '"IBM Plex Sans"',
          "system-ui",
          "-apple-system",
          "sans-serif",
        ],
        display: [
          '"IBM Plex Sans"',
          "system-ui",
          "-apple-system",
          "sans-serif",
        ],
        mono: [
          '"IBM Plex Mono"',
          "ui-monospace",
          "SFMono-Regular",
          "monospace",
        ],
      },
      backgroundImage: {
        "radial-fade":
          "radial-gradient(ellipse at top, rgba(212,160,23,0.25), transparent 60%)",
        "grid-fade":
          "linear-gradient(to bottom, transparent, #05060a 80%), radial-gradient(circle at center, rgba(212,160,23,0.15), transparent 60%)",
      },
      keyframes: {
        float: {
          "0%,100%": { transform: "translateY(0)" },
          "50%": { transform: "translateY(-6px)" },
        },
        pulseGlow: {
          "0%,100%": { boxShadow: "0 0 0 0 rgba(212,160,23,0.5)" },
          "50%": { boxShadow: "0 0 40px 8px rgba(212,160,23,0.5)" },
        },
        blink: {
          "0%,100%": { opacity: "1" },
          "50%": { opacity: "0" },
        },
      },
      animation: {
        float: "float 4s ease-in-out infinite",
        "pulse-glow": "pulseGlow 2.4s ease-in-out infinite",
        blink: "blink 1.1s step-start infinite",
      },
    },
  },
  plugins: [],
};
