module.exports = {
  mode: 'jit',
  purge: ['./src/**/*.{js,ts,jsx,tsx}'],
  darkMode: 'class', // or 'media' or 'class'
  theme: {
    screens: {
      xs: '500px',
      sm: '640px',
      // => @media (min-width: 640px) { ... }

      md: '908px',
      // => @media (min-width: 768px) { ... }

      lg: '1156px',
      // => @media (min-width: 1024px) { ... }

      xl: '1280px',
      // => @media (min-width: 1280px) { ... }

      '2xl': '1536px',
      // => @media (min-width: 1536px) { ... }
    },
    extend: {
      borderRadius: {
        '20': '20px',
      },
      backgroundImage: {
        bond: 'rgba(119, 36, 210, 1)',
        unbond:
          'linear-gradient(297.07deg, #8525EF 4.24%, #8525EF 4.25%, #41157C 35.24%, #170C34 85.03%)',
      },
      colors: {
        grey: '#BAB8C0',
        'grey-2': '#3A324B',
        primary: '#F365BD',
        highlight: '#8DE7D8',
        secondary: '#170c34',
        link: '#31a6f4',
        blue: '#31a6f4',
        info: '#bab8c0',
        // success: '#6fcf97',
        // green: '#3cb043',
        success: '#8DE7D8',
        green: '#8DE7D8',
        danger: '#FF979E',
        red: '#FF979E',
        warn: '#ffde34',
        yellow: '#ffde34',
        dark: '#0c0424',
        text: '#fff',
        background: '#170c34',
        divider: 'rgba(255,255,255,0.05)',
        'icon-btn-grey': '#5B526A',
        'main-background': '#111123',
        // 'modal-background': 'rgba(255, 255, 255, 0.1)',
        'modal-background': '#382A4B',
        // 'modal-inner-background': 'rgba(222, 199, 239, 0.25)',
        'modal-inner-background': 'rgba(255, 255, 255, 0.2)',
        'swap-background': 'rgba(14, 5, 37, 0.5)',
        'swap-inner-background': 'rgba(255,255,255,0.1)',
        'swap-settings-background': 'rgba(255, 255, 255, 0.2)',
        'background-2': '#4E3E5C',
        'background-3': '#373448',
        'background-4': '#474771',
        'background-5': '#3C2953',
        'background-bond': 'rgba(119, 36, 210, 1)',
        opaque: 'rgba(255,255,255,0.04)',
        'opaque-secondary': 'rgba(222, 199, 239, 0.13)',
        'opaque-tertiary': 'rgba(24,1,1,0.35)',
        'opaque-4': 'rgba(227, 200, 239, 0.03)',
        'opaque-5': 'rgba(222, 199, 239, 0.05)',
        'opaque-6': 'rgba(97, 67, 188, 0.07)',
        'opaque-inactive': 'rgba(227,200,239,0.02)',
        'opaque-border': 'rgba(138,127,169,0.3)',
        'opaque-border-secondary': 'rgba(255,255,255,0.1)',
        'border-light': '#DEC7EF',
        'border-1': '#837AA0',
        'border-2': '#605273',
        'opaque-xs': 'rgba(255,255,255,0.05)',
        'toggle-background': 'rgba(255,255,255,0.2)',
        'overlay-background': 'rgba(14, 5, 37, 0.7)',
        'scrollbar-track': '#6A5684',
      },
      textShadow: {
        white: '0px 0px 1px rgba(255,255,255, 0.5)',
        // '3xl': '0 0 3px rgba(0, 0, 0, .8), 0 0 5px rgba(0, 0, 0, .9)',
      },
    },
    boxShadow: {
      'primary-glow': '0 0 15px 4px rgba(198,19,127,0.5)',
      'success-glow': '0 0 15px 4px rgba(111,207,151,0.5)',
      dark: '0px 4px 50px rgba(81, 29, 102, 0.5);',
    },
  },
  variants: {
    extend: {},
    scrollbar: ['rounded'],
  },
  plugins: [require('tailwindcss-textshadow'), require('tailwind-scrollbar')],
};
