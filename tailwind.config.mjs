/** @type {import('tailwindcss').Config} */
export default {
  content: ['./src/**/*.{astro,html,js,jsx,ts,tsx}'],
  theme: {
    extend: {
      colors: {
        // fuerte.digital — Dark Editorial
        night: '#0A0A0F',
        card: '#12121A',
        teal: '#183A37',
        plum: '#432534',
        sand: '#EFD6AC',
        orange: '#C44900',
        border: 'rgba(255,255,255,0.06)',
        // Legacy (Roman Becker)
        espresso: '#2C1A0E',
        caramel: '#C8873A',
        cream: '#FDF6ED',
        latte: '#E8D5B7',
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
        serif: ['Instrument Serif', 'Georgia', 'serif'],
      },
      fontSize: {
        'display': ['clamp(4rem, 10vw, 9rem)', { lineHeight: '0.95', letterSpacing: '-0.03em', fontWeight: '900' }],
        'heading': ['clamp(2.5rem, 5vw, 4.5rem)', { lineHeight: '1.05', letterSpacing: '-0.02em' }],
      },
      animation: {
        'glow-pulse': 'glow-pulse 6s ease-in-out infinite alternate',
        'float': 'float 8s ease-in-out infinite',
      },
      keyframes: {
        'glow-pulse': {
          '0%': { opacity: '0.4', transform: 'scale(1)' },
          '100%': { opacity: '0.7', transform: 'scale(1.15)' },
        },
        'float': {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-20px)' },
        },
      },
    },
  },
};
