module.exports = {
  mode: 'jit',
  purge: ['./src/**/*.{js,ts,jsx,tsx}'],
  darkMode: 'class', // or 'media' or 'class'
  theme: {
    extend: {
      colors: {
        primary: '#c6137f',
        link: '#31a6f4',
        info: '#bab8c0',
        success: '#6fcf97',
        danger: '#eb5757',
        dark: '#0c0424',
        text: '#fff',
        background: '#170c34',
        'modal-background': 'rgba(255, 255, 255, 0.1)',
        'modal-inner-background': 'rgba(222, 199, 239, 0.13)',
        'overlay-background': 'rgba(14, 5, 37, 0.7)',
      },
    },
  },
  variants: {
    extend: {},
  },
  plugins: [],
};
