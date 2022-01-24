const withPWA = require('next-pwa');
const runtimeCaching = require('next-pwa/cache');
const withAntdLess = require('next-plugin-antd-less');
// const withTM = require('next-transpile-modules')(['redux-persist'])
const pluginAntdLess = withAntdLess({
  // modifyVars: {
  //   '@THEME--DARK': 'theme-dark',
  // },
  lessVarsFilePath: './src/celer/app/app.less',
  // cssLoaderOptions: {
  // esModule: false,
  // sourceMap: false,
  // modules: {
  // mode: 'local',
  // localIdentName: '[hash:2]',
  // },
  // },
});
// const linguiConfig = require('./lingui.config.js');

// const { locales, sourceLocale } = linguiConfig;

const withBundleAnalyzer = require('@next/bundle-analyzer')({
  enabled: process.env.ANALYZE === 'true',
});

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
          destination: '/trade',
          permanent: true,
        },
      ];
    },
  }),
);

// Don't delete this console log, useful to see the config in Vercel deployments
console.log('next.config.js', JSON.stringify(module.exports, null, 2));
