/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['"Plus Jakarta Sans"', 'sans-serif'],
        header: ['"Unbounded"', 'sans-serif'], // Brand Font
        mono: ['"JetBrains Mono"', 'monospace'],
      },
      colors: {
        flux: {
          bg: '#000000',
          primary: '#6366f1', // Indigo
          accent: '#a855f7',  // Purple
          glass: 'rgba(20, 20, 25, 0.6)',
        }
      },
      backgroundImage: {
        'flux-gradient': 'radial-gradient(circle at 50% -20%, #2e1065 0%, #000000 60%)',
      },
      animation: {
        'heartbeat': 'heartbeat 6s ease-in-out infinite',
      },
      keyframes: {
        heartbeat: {
          '0%, 100%': { opacity: '0', textShadow: '0 0 0px rgba(99, 102, 241, 0)' },
          '50%': { opacity: '1', textShadow: '0 0 80px rgba(99, 102, 241, 1), 0 0 30px rgba(168, 85, 247, 0.8)' },
        }
      }
    },
  },
  plugins: [],
}
