/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      fontFamily: {
        display: ['"Instrument Serif"', 'ui-serif', 'Georgia', 'serif'],
        sans: ['Inter', 'system-ui', '-apple-system', 'BlinkMacSystemFont', 'sans-serif'],
        mono: ['"JetBrains Mono"', 'ui-monospace', 'SFMono-Regular', 'monospace'],
      },
      colors: {
        night: '#050813',
        ink: '#0d1226',
        bone: {
          DEFAULT: '#e8e6dd',
          soft: 'rgba(232, 230, 221, 0.65)',
          faint: 'rgba(232, 230, 221, 0.35)',
        },
        star: {
          DEFAULT: '#7bc5ff',
          dim: 'rgba(123, 197, 255, 0.55)',
        },
        ember: '#f0b872',
      },
      borderColor: {
        hair: 'rgba(232, 230, 221, 0.15)',
      },
      keyframes: {
        twinkle: {
          '0%, 100%': { opacity: '0.25' },
          '50%': { opacity: '1' },
        },
      },
      animation: {
        twinkle: 'twinkle 6s ease-in-out infinite',
      },
    },
  },
  plugins: [],
}
