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
      gridTemplateColumns: {
        // Simple 16 column grid
        '13': 'repeat(13, minmax(0, 1fr))',
        '14': 'repeat(14, minmax(0, 1fr))',
        '15': 'repeat(15, minmax(0, 1fr))',
        '16': 'repeat(16, minmax(0, 1fr))',
        '17': 'repeat(17, minmax(0, 1fr))',
        '18': 'repeat(18, minmax(0, 1fr))',
        '19': 'repeat(19, minmax(0, 1fr))',
        '20': 'repeat(20, minmax(0, 1fr))',
        '21': 'repeat(21, minmax(0, 1fr))',

        // Complex site-specific column configuration
      },
      borderRadius: {
        '20': '20px',
      },
      backgroundImage: {
        bond: 'rgba(119, 36, 210, 1)',
        unbond:
          'linear-gradient(297.07deg, #8525EF 4.24%, #8525EF 4.25%, #41157C 35.24%, #170C34 85.03%)',
        xstnd: 'linear-gradient(#A18CD1 0%, #FBC2EB 100%)',
      },
      colors: {
        grey: '#BAB8C0',
        'grey-2': '#3A324B',
        primary: '#F365BD',
        bright: '#8525EF',
        highlight: '#8DE7D8',
        secondary: '#170c34',
        link: '#31a6f4',
        blue: '#31a6f4',
        info: '#bab8c0',
        success: '#8DE7D8',
        green: '#8DE7D8',
        danger: '#FF979E',
        red: '#FF979E',
        warn: '#ffde34',
        yellow: '#ffde34',
        dark: '#0c0424',
        text: '#fff',
        black: '#000',
        divider: 'rgba(255,255,255,0.05)',
        'icon-btn-grey': '#5B526A',
        background: '#170c34',
        'background-2': '#373448',
        'background-main': '#111123',
        'background-modal': '#382A4B',
        'background-modal-inner': 'rgba(255, 255, 255, 0.2)',
        'background-settings': '#4E3E5C',
        'background-farm-list': '#474771',
        'background-bond': 'rgba(119, 36, 210, 1)',
        'background-currency-input-xs': 'rgba(77, 36, 96, 0.2)',
        opaque: 'rgba(255,255,255,0.04)',
        'opaque-secondary': 'rgba(222, 199, 239, 0.13)',
        'opaque-slider': 'rgba(24,1,1,0.35)',
        'opaque-farm-list': 'rgba(222, 199, 239, 0.05)',
        'opaque-alert': 'rgba(97, 67, 188, 0.07)',
        'opaque-inactive': 'rgba(227,200,239,0.02)',
        'opaque-border': 'rgba(138,127,169,0.3)',
        'opaque-border-2': 'rgba(255,255,255,0.1)',
        'opaque-xs': 'rgba(255,255,255,0.05)',
        'border-light': '#DEC7EF',
        border: '#837AA0',
        'border-2': '#605273',
        'scrollbar-track': '#6A5684',
      },
      textShadow: {
        white: '0px 0px 1px rgba(255,255,255, 0.5)',
        // '3xl': '0 0 3px rgba(0, 0, 0, .8), 0 0 5px rgba(0, 0, 0, .9)',
      },
    },
    boxShadow: {
      dark: '0px 4px 50px rgba(81, 29, 102, 0.5);',
    },
  },
  variants: {
    extend: {},
    scrollbar: ['rounded'],
  },
  plugins: [
    require('tailwindcss-textshadow'),
    require('tailwind-scrollbar'),
    // require('daisyui'),
  ],
};
