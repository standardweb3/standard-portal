module.exports = {
  plugins: [
    'postcss-import',
    ['@digitalnative/postcss-preset-env', { stage: 1 }],
    'tailwindcss',
    'autoprefixer',
  ],
};
