module.exports = {
  mode: 'jit',
  content: ['./app/**/*.{js,ts,jsx,tsx}', './components/**/*.{js,ts,jsx,tsx}'],
  darkMode: 'class',
  theme: {
    extend: {
      fontFamily: {
        sans: [
          'Gotu',
        ],
      },
      colors: {
        'accent': '#a6d1c9',
      },
    },
  },
  variants: {
    extend: {},
  },
  plugins: [],
}
