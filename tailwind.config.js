/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      fontFamily: {
        display: [
          '"SF Pro Display"',
          'Inter',
          'system-ui',
          '-apple-system',
          'BlinkMacSystemFont',
          'sans-serif',
        ],
        mono: ['"JetBrains Mono"', 'ui-monospace', 'SFMono-Regular', 'monospace'],
      },
      colors: {
        ink: {
          950: '#05060a',
          900: '#0a0b12',
          800: '#12141c',
          700: '#1c1f2a',
          600: '#2a2e3d',
        },
        accent: {
          DEFAULT: '#7c5cff',
          soft: '#a68cff',
          glow: 'rgba(124, 92, 255, 0.35)',
        },
      },
      backgroundImage: {
        'radial-fade':
          'radial-gradient(ellipse at top, rgba(124,92,255,0.25), transparent 60%)',
        'grid-fade':
          'linear-gradient(to bottom, transparent, #05060a 80%), radial-gradient(circle at center, rgba(124,92,255,0.15), transparent 60%)',
      },
      keyframes: {
        float: {
          '0%,100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-6px)' },
        },
        pulseGlow: {
          '0%,100%': { boxShadow: '0 0 0 0 rgba(124,92,255,0.5)' },
          '50%': { boxShadow: '0 0 40px 8px rgba(124,92,255,0.5)' },
        },
        blink: {
          '0%,100%': { opacity: '1' },
          '50%': { opacity: '0' },
        },
      },
      animation: {
        float: 'float 4s ease-in-out infinite',
        'pulse-glow': 'pulseGlow 2.4s ease-in-out infinite',
        blink: 'blink 1.1s step-start infinite',
      },
    },
  },
  plugins: [],
}
