module.exports = {
  mode: 'jit',
  content: ['./pages/**/*.{js,ts,jsx,tsx}', './components/**/*.{js,ts,jsx,tsx}'],
  darkMode: 'class',
  theme: {
    extend: {
      fontFamily: {
        sans: [
          'Gotu',
        ],
      },
      colors: {
        'brand': '#a6d1c9',
        'brand-dark': '#282b29',
        'cta': '#C90076',
      }
    },
  },
  variants: {
    extend: {},
  },
  plugins: [],
}
