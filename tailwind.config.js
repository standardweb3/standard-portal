module.exports = {
  mode: 'jit',
  purge: ['./src/**/*.{js,ts,jsx,tsx}'],
  darkMode: 'class', // or 'media' or 'class'
  theme: {
    extend: {
      colors: {
        primary: '#c6137f',
        secondary: '#170c34',
        link: '#31a6f4',
        blue: '#31a6f4',
        info: '#bab8c0',
        success: '#6fcf97',
        green: '#3cb043',
        danger: '#eb5757',
        red: '#eb5757',
        warn: '#ffde34',
        yellow: '#ffde34',
        dark: '#0c0424',
        text: '#fff',
        background: '#170c34',
        'main-background': '#0c0424',
        // 'modal-background': 'rgba(255, 255, 255, 0.1)',
        'modal-background': 'rgba(14, 5, 37, 0.5)',
        // 'modal-inner-background': 'rgba(222, 199, 239, 0.25)',
        'modal-inner-background': 'rgba(255, 255, 255, 0.2)',
        'swap-background': 'rgba(14, 5, 37, 0.5)',
        'swap-inner-background': 'rgba(255,255,255,0.1)',
        'swap-settings-background': 'rgba(255, 255, 255, 0.2)',
        opaque: 'rgba(255,255,255,0.2)',
        'opaque-xs': 'rgba(255,255,255,0.05)',
        'toggle-background': 'rgba(255,255,255,0.2)',
        'overlay-background': 'rgba(14, 5, 37, 0.7)',
      },
      textShadow: {
        white: '0px 0px 1px rgba(255,255,255, 0.5)',
        // '3xl': '0 0 3px rgba(0, 0, 0, .8), 0 0 5px rgba(0, 0, 0, .9)',
      },
    },
    boxShadow: {
      'primary-glow': '0 0 15px 4px rgba(198,19,127,0.5)',
      'success-glow': '0 0 15px 4px rgba(111,207,151,0.5)',
    },
  },
  variants: {
    extend: {},
  },
  plugins: [require('tailwindcss-textshadow')],
};
