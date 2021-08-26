/** @type {import('next').NextConfig} */

const linguiConfig = require('./lingui.config.js');

const { locales, sourceLocale } = linguiConfig;

module.exports = {
  reactStrictMode: true,
  images: {
    domains: [
      'res.cloudinary.com',
      'raw.githubusercontent.com',
      'logos.covalenthq.com',
    ],
  },
  i18n: {
    locales,
    defaultLocale: sourceLocale,
  },
};
