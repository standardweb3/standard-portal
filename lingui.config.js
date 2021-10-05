module.exports = {
  catalogs: [
    {
      path: '<rootDir>/locale/{locale}',
      include: ['<rootDir>/src'],
      exclude: ['**/node_modules/**'],
    },
  ],
  compileNamespace: 'cjs',
  extractBabelOptions: {},
  fallbackLocales: {},
  format: 'po-gettext',
  formatOptions: { origins: false, lineNumbers: false },
  sourceLocale: 'en',
  locales: ['en'],
  orderBy: 'messageId',
  pseudoLocale: '',
  rootDir: '.',
  runtimeConfigModule: ['@lingui/core', 'i18n'],
};
