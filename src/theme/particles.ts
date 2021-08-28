export const networkModalParticles = {
  fpsLimit: 60,
  background: {
    color: 'transparent',
  },
  particles: {
    number: {
      value: 15,
    },
    color: {
      value: ['#fff'],
    },
    links: {
      color: '#fff',
      enable: true,
    },
    move: {
      enable: true,
      speed: 1.5,
    },
    size: {
      value: 5,
      random: {
        enable: true,
        minimumValue: 1,
      },
      animation: {
        enable: true,
        speed: 2.5,
        minimumValue: 1,
      },
    },
    opacity: {
      value: 0.8,
      random: {
        enable: true,
        minimumValue: 0.4,
      },
    },
  },
};
