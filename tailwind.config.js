
/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        tetris: {
          dark: '#1a0b2e',
          blue: '#00f3ff',
          pink: '#ff00e0',
          yellow: '#ffcc00',
          purple: '#4a0e6b'
        }
      },
      fontFamily: {
        pixel: ['"Press Start 2P"', 'monospace'],
        retro: ['"VT323"', 'monospace']
      },
      animation: {
        'fall': 'fallBlock 0.5s ease-out',
        'bounce': 'pixelBounce 0.3s ease-in-out',
        'spin-slow': 'tetrisSpin 1s linear infinite'
      },
      keyframes: {
        fallBlock: {
          '0%': { transform: 'translateY(-100%) rotate(-10deg)', opacity: '0' },
          '100%': { transform: 'translateY(0) rotate(0)', opacity: '1' }
        },
        pixelBounce: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-10px)' }
        },
        tetrisSpin: {
          '0%': { transform: 'rotate(0deg)' },
          '100%': { transform: 'rotate(360deg)' }
        }
      }
    },
  },
  plugins: [],
}