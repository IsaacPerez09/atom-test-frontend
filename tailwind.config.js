/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./src/**/*.{html,ts}'],
  theme: {
    extend: {
      colors: {
        primary: {
          50: '#f0f9ff',
          500: '#0ea5e9',
          600: '#0284c7',
          700: '#0369a1',
        },
      },
    },
  },
  plugins: [
    function ({ addUtilities }) {
      addUtilities({
        '.focus-visible-ring': {
          '&:focus': {
            outline: 'none',
          },
          '&:focus-visible': {
            outline: '2px solid #00a6ffff',
            outlineOffset: '2px',
          },
        },
      });
    },
  ],
};