/** @type {import('tailwindcss').Config} */
export default {
  // Hover styles only on devices with a real pointer, so taps don't leave buttons stuck "hovered".
  future: { hoverOnlyWhenSupported: true },
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        ink: { DEFAULT: '#12372f', soft: '#4b6760' },
        accent: { DEFAULT: '#d15f35', dark: '#b04a24', soft: '#fbe3d6' },
        cream: '#f4f0e8',
        peach: '#f9d7b8'
      },
      fontFamily: {
        display: ['Fraunces', 'Georgia', 'serif'],
        sans: ['Inter', 'system-ui', '-apple-system', 'Segoe UI', 'sans-serif']
      },
      keyframes: {
        'drift-a': { '0%': { transform: 'translate(-8%, -6%) scale(1)' }, '100%': { transform: 'translate(22%, 14%) scale(1.12)' } },
        'drift-b': { '0%': { transform: 'translate(6%, 8%) scale(1.05)' }, '100%': { transform: 'translate(-24%, -12%) scale(0.95)' } },
        bob: { '0%,100%': { transform: 'translateY(0)' }, '50%': { transform: 'translateY(-7px)' } },
        ripple: { '0%': { transform: 'scale(0.6)', opacity: '0.55' }, '100%': { transform: 'scale(3.4)', opacity: '0' } },
        twinkle: { '0%,100%': { opacity: '0.15', transform: 'scale(0.8)' }, '50%': { opacity: '0.7', transform: 'scale(1.15)' } },
        'dash-flow': { to: { strokeDashoffset: '-160' } },
        'fade-up': { from: { opacity: '0', transform: 'translateY(12px)' }, to: { opacity: '1', transform: 'none' } },
        'fade-in': { from: { opacity: '0' }, to: { opacity: '1' } },
        pop: { '0%': { opacity: '0', transform: 'scale(0.92)' }, '60%': { opacity: '1', transform: 'scale(1.02)' }, '100%': { transform: 'scale(1)' } },
        confetti: { '0%': { transform: 'translateY(-10vh) rotate(0deg)', opacity: '1' }, '100%': { transform: 'translateY(105vh) rotate(720deg)', opacity: '0.8' } },
        shake: { '0%,100%': { transform: 'translateX(0)' }, '25%': { transform: 'translateX(-4px)' }, '75%': { transform: 'translateX(4px)' } },
        halo: { '0%,100%': { opacity: '0.35', transform: 'scale(1)' }, '50%': { opacity: '0.9', transform: 'scale(1.04)' } },
        'scan-line': { '0%,100%': { top: '8%' }, '50%': { top: '88%' } }
      },
      animation: {
        'drift-a': 'drift-a 16s ease-in-out infinite alternate',
        'drift-b': 'drift-b 19s ease-in-out infinite alternate',
        bob: 'bob 4s ease-in-out infinite',
        ripple: 'ripple 3.6s cubic-bezier(0.2, 0.6, 0.3, 1) infinite',
        twinkle: 'twinkle 4.5s ease-in-out infinite',
        'dash-flow': 'dash-flow 2.4s linear infinite',
        'fade-up': 'fade-up 420ms cubic-bezier(0.2, 0.8, 0.2, 1) both',
        'fade-in': 'fade-in 240ms ease-out both',
        pop: 'pop 480ms cubic-bezier(0.2, 0.8, 0.2, 1) both',
        confetti: 'confetti linear forwards',
        shake: 'shake 300ms ease-in-out',
        halo: 'halo 2.4s ease-in-out infinite',
        'scan-line': 'scan-line 2.4s ease-in-out infinite'
      }
    }
  },
  plugins: []
};
