/** @type {import('tailwindcss').Config} */
export default {
  content: [
    './index.html',
    './src/**/*.{js,ts,jsx,tsx}',
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        background: 'var(--bg-canvas, #ffffff)',
        foreground: 'var(--text-main, #09090b)',
        border: 'var(--border-subtle, #e4e4e7)',
        card: '#ffffff',
        'card-foreground': '#09090b',
        muted: '#f4f4f5',
        'muted-foreground': '#71717a',
        accent: '#f4f4f5',
        'accent-foreground': '#09090b',
        pitch: '#000000',
        obsidian: {
          950: '#030303',
          900: '#070707',
          850: '#0c0c0c',
          800: '#121212',
          700: '#1c1c1c',
          600: '#282828',
        },
        dbz: {
          10: '#00e4ff',
          20: '#00a3ff',
          30: '#00de36',
          35: '#009e19',
          40: '#ffff00',
          45: '#ffb000',
          50: '#ff0000',
          55: '#c00000',
          60: '#ff00ff',
          65: '#990099',
          70: '#ffffff',
        }
      },
      fontFamily: {
        sans: ['Absans', 'system-ui', '-apple-system', 'sans-serif'],
        serif: ['Absans', 'Georgia', 'serif'],
        display: ['Absans', 'system-ui', 'sans-serif'],
        absans: ['Absans', 'sans-serif'],
        mono: ['"IBM Plex Mono"', 'ui-monospace', 'monospace'],
      },
    },
  },
  plugins: [],
}
