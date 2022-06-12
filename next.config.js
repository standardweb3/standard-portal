const withPWA = require('next-pwa');
const runtimeCaching = require('next-pwa/cache');

//const linguiConfig = require('./lingui.config.js');

//const { locales, sourceLocale } = linguiConfig;

const withBundleAnalyzer = require('@next/bundle-analyzer')({
  enabled: process.env.ANALYZE === 'true',
});

const securityHeaders = [
  {
    key: "Strict-Transport-Security",
    value: "max-age=31536000; includeSubDomains; preload"
  },
  {
    key: "X-Frame-Options",
    value: "SAMEORIGIN"
  },
  {
    key: "X-Content-Type-Options",
    value: "nosniff"
  },
  {
    key: "X-XSS-Protection",
    value: "1; mode=block"
  },
  {
    key: "Referrer-Policy",
    value: "no-referrer"
  }
]

module.exports = withBundleAnalyzer(
  withPWA({
    pwa: {
      dest: 'public',
      runtimeCaching,
      disable: process.env.NODE_ENV === 'development',
    },
    images: {
      domains: [
        'assets.sushi.com',
        'res.cloudinary.com',
        'raw.githubusercontent.com',
        'logos.covalenthq.com',
      ],
    },
    reactStrictMode: true,
    // i18n: {
    //   locales,
    //   defaultLocale: sourceLocale,
    // },
    webpack(config) {
      config.module.rules.push({
        test: /\.svg$/,
        use: ['@svgr/webpack'],
      });

      return config;
    },
    async redirects() {
      return [
        {
          source: '/',
          destination: '/dashboard',
          permanent: true,
        },
      ];
    },
    async headers() {
      return [
        {
          // Apply these headers to all routes in your application.
          source: '/:path*',
          headers: securityHeaders,
        },
      ]
    },
  }),
);

// Don't delete this console log, useful to see the config in Vercel deployments
console.log('next.config.js', JSON.stringify(module.exports, null, 2));
