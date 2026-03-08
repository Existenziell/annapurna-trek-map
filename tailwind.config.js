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
        accent: 'var(--accent)',
        level: {
          1: 'var(--level-1)',
          2: 'var(--level-2)',
          3: 'var(--level-3)',
          4: 'var(--level-4)',
          5: 'var(--level-5)',
          6: 'var(--level-6)',
        },
      },
    },
  },
  variants: {
    extend: {},
  },
  plugins: [],
}
