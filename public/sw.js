if (!self.define) {
  const e = (e) => {
      'require' !== e && (e += '.js');
      let s = Promise.resolve();
      return (
        a[e] ||
          (s = new Promise(async (s) => {
            if ('document' in self) {
              const a = document.createElement('script');
              (a.src = e), document.head.appendChild(a), (a.onload = s);
            } else importScripts(e), s();
          })),
        s.then(() => {
          if (!a[e]) throw new Error(`Module ${e} didn’t register its module`);
          return a[e];
        })
      );
    },
    s = (s, a) => {
      Promise.all(s.map(e)).then((e) => a(1 === e.length ? e[0] : e));
    },
    a = { require: Promise.resolve(s) };
  self.define = (s, i, n) => {
    a[s] ||
      (a[s] = Promise.resolve().then(() => {
        let a = {};
        const t = { uri: location.origin + s.slice(1) };
        return Promise.all(
          i.map((s) => {
            switch (s) {
              case 'exports':
                return a;
              case 'module':
                return t;
              default:
                return e(s);
            }
          }),
        ).then((e) => {
          const s = n(...e);
          return a.default || (a.default = s), a;
        });
      }));
  };
}
define('./sw.js', ['./workbox-21b21c9a'], function(e) {
  'use strict';
  importScripts(),
    self.skipWaiting(),
    e.clientsClaim(),
    e.precacheAndRoute(
      [
        {
          url: '/_next/static/chunks/119.5e8002e6283acce3ecd4.js',
          revision: 'y1PUa8OUKAO8rDlcQutRG',
        },
        {
          url: '/_next/static/chunks/160-45c4a6d6557930b89ecf.js',
          revision: 'y1PUa8OUKAO8rDlcQutRG',
        },
        {
          url: '/_next/static/chunks/169.6551a1f3811e399da2e9.js',
          revision: 'y1PUa8OUKAO8rDlcQutRG',
        },
        {
          url: '/_next/static/chunks/249-b33fe59230d0c9932c06.js',
          revision: 'y1PUa8OUKAO8rDlcQutRG',
        },
        {
          url: '/_next/static/chunks/277d8923.cfa554dfc5f2b8f932ca.js',
          revision: 'y1PUa8OUKAO8rDlcQutRG',
        },
        {
          url: '/_next/static/chunks/294-a94081b1039d45059e56.js',
          revision: 'y1PUa8OUKAO8rDlcQutRG',
        },
        {
          url: '/_next/static/chunks/359-b8b9938a5c24817061a6.js',
          revision: 'y1PUa8OUKAO8rDlcQutRG',
        },
        {
          url: '/_next/static/chunks/434-37987af8646d0ec9717e.js',
          revision: 'y1PUa8OUKAO8rDlcQutRG',
        },
        {
          url: '/_next/static/chunks/485.8d62f68219192610a36e.js',
          revision: 'y1PUa8OUKAO8rDlcQutRG',
        },
        {
          url: '/_next/static/chunks/509-c84d37014d88b99159c7.js',
          revision: 'y1PUa8OUKAO8rDlcQutRG',
        },
        {
          url: '/_next/static/chunks/55a21ef8.118feae1e25f6b8bf37d.js',
          revision: 'y1PUa8OUKAO8rDlcQutRG',
        },
        {
          url: '/_next/static/chunks/571.1a09eca66a7b6e1db8e0.js',
          revision: 'y1PUa8OUKAO8rDlcQutRG',
        },
        {
          url: '/_next/static/chunks/699-c426c5e0c8035ef8b5a5.js',
          revision: 'y1PUa8OUKAO8rDlcQutRG',
        },
        {
          url: '/_next/static/chunks/707-73c5b547e107ddbc792f.js',
          revision: 'y1PUa8OUKAO8rDlcQutRG',
        },
        {
          url: '/_next/static/chunks/712-4242167939fa22a8e04a.js',
          revision: 'y1PUa8OUKAO8rDlcQutRG',
        },
        {
          url: '/_next/static/chunks/747.6ebfec86d25ea686b4b8.js',
          revision: 'y1PUa8OUKAO8rDlcQutRG',
        },
        {
          url: '/_next/static/chunks/802-b0aba6075f4ab3f96a2f.js',
          revision: 'y1PUa8OUKAO8rDlcQutRG',
        },
        {
          url: '/_next/static/chunks/819.825a07adf8133f3e5dd7.js',
          revision: 'y1PUa8OUKAO8rDlcQutRG',
        },
        {
          url: '/_next/static/chunks/878.56b4173f80ac890410f5.js',
          revision: 'y1PUa8OUKAO8rDlcQutRG',
        },
        {
          url: '/_next/static/chunks/90.3ca79b925e30a414f7c8.js',
          revision: 'y1PUa8OUKAO8rDlcQutRG',
        },
        {
          url: '/_next/static/chunks/911-8d030143a57320d49d45.js',
          revision: 'y1PUa8OUKAO8rDlcQutRG',
        },
        {
          url: '/_next/static/chunks/942-2515de0a473eb3cbb6dc.js',
          revision: 'y1PUa8OUKAO8rDlcQutRG',
        },
        {
          url: '/_next/static/chunks/983.022e3db62c7711d91ede.js',
          revision: 'y1PUa8OUKAO8rDlcQutRG',
        },
        {
          url: '/_next/static/chunks/framework-3af989d3dbeb77832f99.js',
          revision: 'y1PUa8OUKAO8rDlcQutRG',
        },
        {
          url: '/_next/static/chunks/main-fb8ab73d5e277f3b0f30.js',
          revision: 'y1PUa8OUKAO8rDlcQutRG',
        },
        {
          url: '/_next/static/chunks/pages/404-f7adf2e0e93b5eef649f.js',
          revision: 'y1PUa8OUKAO8rDlcQutRG',
        },
        {
          url: '/_next/static/chunks/pages/_app-7f04088353e729ff4379.js',
          revision: 'y1PUa8OUKAO8rDlcQutRG',
        },
        {
          url: '/_next/static/chunks/pages/_error-ea939aab753d9e9db3bd.js',
          revision: 'y1PUa8OUKAO8rDlcQutRG',
        },
        {
          url:
            '/_next/static/chunks/pages/add/%5B%5B...pair%5D%5D-fe7fce41950f62f8ee5d.js',
          revision: 'y1PUa8OUKAO8rDlcQutRG',
        },
        {
          url: '/_next/static/chunks/pages/farm-031b0237aadb9634bbce.js',
          revision: 'y1PUa8OUKAO8rDlcQutRG',
        },
        {
          url: '/_next/static/chunks/pages/find-ab10d427e6a29aa6b01e.js',
          revision: 'y1PUa8OUKAO8rDlcQutRG',
        },
        {
          url: '/_next/static/chunks/pages/index-8bae3856e9488e025235.js',
          revision: 'y1PUa8OUKAO8rDlcQutRG',
        },
        {
          url: '/_next/static/chunks/pages/pool-6c150ba55755e79039bb.js',
          revision: 'y1PUa8OUKAO8rDlcQutRG',
        },
        {
          url:
            '/_next/static/chunks/pages/remove/%5B%5B...pair%5D%5D-1d0179695aca1eb79938.js',
          revision: 'y1PUa8OUKAO8rDlcQutRG',
        },
        {
          url:
            '/_next/static/chunks/pages/swap/%5B%5B...pair%5D%5D-7ed7644c56d602184703.js',
          revision: 'y1PUa8OUKAO8rDlcQutRG',
        },
        {
          url: '/_next/static/chunks/polyfills-e7a279300235e161e32a.js',
          revision: 'y1PUa8OUKAO8rDlcQutRG',
        },
        {
          url: '/_next/static/chunks/webpack-a504b23ee7d170fa2548.js',
          revision: 'y1PUa8OUKAO8rDlcQutRG',
        },
        {
          url: '/_next/static/css/3d3c27b83f256ede13aa.css',
          revision: 'y1PUa8OUKAO8rDlcQutRG',
        },
        {
          url: '/_next/static/css/615bcb3759f254243339.css',
          revision: 'y1PUa8OUKAO8rDlcQutRG',
        },
        {
          url:
            '/_next/static/image/public/img/logos/logo.dark.primary.10b6fe764be5521b33c9234cc97c184d.png',
          revision: 'y1PUa8OUKAO8rDlcQutRG',
        },
        {
          url:
            '/_next/static/image/public/img/logos/logo.light.c3ed354e9063e3adc1eddc3e2eb98a9e.png',
          revision: 'y1PUa8OUKAO8rDlcQutRG',
        },
        {
          url:
            '/_next/static/image/public/img/logos/logo.primary.92527241a37ffd349f5a07db26287101.png',
          revision: 'y1PUa8OUKAO8rDlcQutRG',
        },
        {
          url: '/_next/static/y1PUa8OUKAO8rDlcQutRG/_buildManifest.js',
          revision: 'y1PUa8OUKAO8rDlcQutRG',
        },
        {
          url: '/_next/static/y1PUa8OUKAO8rDlcQutRG/_ssgManifest.js',
          revision: 'y1PUa8OUKAO8rDlcQutRG',
        },
        { url: '/favicon.ico', revision: 'e778ed3136a141f6dbd2db44a81a31cf' },
        {
          url: '/icons/filled/Collateralize.svg',
          revision: 'd9c3565329ddf00ce21f314bae094612',
        },
        {
          url: '/icons/filled/Farm.svg',
          revision: '551a1f2d792e4dfd80ff6e7e9bbe8b9f',
        },
        {
          url: '/icons/filled/Home.svg',
          revision: '82fb8799fe2dffa37a53d14111bded6d',
        },
        {
          url: '/icons/filled/Setting.svg',
          revision: '0b36ab93aaae4280a8d503b72127f713',
        },
        {
          url: '/icons/filled/Swap.svg',
          revision: '4f2a68a6faf9f16155c6ce7577d64a91',
        },
        {
          url: '/icons/filled/Vault.svg',
          revision: 'fd5d2674b3d87481897f5c1b90339ba0',
        },
        {
          url: '/icons/outlined/Collateralize.svg',
          revision: '879e353c5d5115cf4ef007179f407a35',
        },
        {
          url: '/icons/outlined/Farm.svg',
          revision: '41062f9ba2cb36d771cebc26ad0ec654',
        },
        {
          url: '/icons/outlined/Gas.svg',
          revision: 'da6751b3fc02e6422b81ae3ddd94eb73',
        },
        {
          url: '/icons/outlined/Home.svg',
          revision: '94a7869075eac60bb21d136576bd48f3',
        },
        {
          url: '/icons/outlined/Setting.svg',
          revision: '61c16b7d14914e0ea3b79c9779765b7c',
        },
        {
          url: '/icons/outlined/Swap.svg',
          revision: '430791911b7daa6680a0a96e667fc0e2',
        },
        {
          url: '/icons/outlined/Switch.svg',
          revision: '53ff7a10d5e61c7ee77667599a020b5e',
        },
        {
          url: '/icons/outlined/Vault.svg',
          revision: '2f1f41b910f98974f834201f3e0da618',
        },
        {
          url: '/img/logos/logo.dark.png',
          revision: '20c7d604d0db5cf65d5764172e1df807',
        },
        {
          url: '/img/logos/logo.dark.primary.png',
          revision: 'aafed964e75e42145a84a80321e714df',
        },
        {
          url: '/img/logos/logo.light.png',
          revision: '597504e6313ab8f2d13a61d0162b234f',
        },
        {
          url: '/img/logos/logo.primary.png',
          revision: '4c810b6c19a3662e3056c2bebd350f87',
        },
        {
          url: '/img/networks/arbitrum-network.jpg',
          revision: 'e13d4e3caa3a52004fa676acbacbb6bc',
        },
        {
          url: '/img/networks/avalanche-network.jpg',
          revision: 'f22a74941d24f0c577eb5b013fa5dc54',
        },
        {
          url: '/img/networks/bsc-network.jpg',
          revision: 'c234e4b9693f70ec697713cbafc53c65',
        },
        {
          url: '/img/networks/celo-network.jpg',
          revision: 'b0c2f695de8497f3b331d7e268dd7bef',
        },
        {
          url: '/img/networks/ethereum-net.png',
          revision: '1630a7dd248a2dad3b89b526734d98cc',
        },
        {
          url: '/img/networks/fantom-network.jpg',
          revision: 'b38c2308780b7cda16b72ad9ab67918a',
        },
        {
          url: '/img/networks/goerli-network.jpg',
          revision: 'bfa3e8c83bbdd0b018a2af55904e85b0',
        },
        {
          url: '/img/networks/harmonyone-network.jpg',
          revision: '55abcda6471ba41f172a35dd9d65800d',
        },
        {
          url: '/img/networks/heco-network.jpg',
          revision: '624c6a297d927a977c6e4c8baae35705',
        },
        {
          url: '/img/networks/kovan-network.jpg',
          revision: '8eeea938b6b6e7740a072be055eb12a9',
        },
        {
          url: '/img/networks/mainnet-network.jpg',
          revision: '97195efc5b2a70b8c0a8755838f9bb1c',
        },
        {
          url: '/img/networks/matic-network.jpg',
          revision: '6f2764a8b0d4d876fafc4280852ba685',
        },
        {
          url: '/img/networks/moonbeam-network.jpg',
          revision: '18a53ab891fd339e5c0f53cba5ac5db1',
        },
        {
          url: '/img/networks/okex-network.jpg',
          revision: 'ddbf0a958858042a11255cc62929fc37',
        },
        {
          url: '/img/networks/polygon-net.png',
          revision: '3f9aa7e51824fef67c0d42add1e95408',
        },
        {
          url: '/img/networks/polygon-network.jpg',
          revision: 'f35785eb02bc3ef30f10a5ca88e687a9',
        },
        {
          url: '/img/networks/rinkeby-network.jpg',
          revision: 'd7aecb9c343c81ec5d67ad06296b8d16',
        },
        {
          url: '/img/networks/ropsten-network.jpg',
          revision: 'fc75a1a8c3ff4f9791f20bb05603c445',
        },
        {
          url: '/img/networks/shibuya-network.jpg',
          revision: '159f8e7a95e6c97bd6f50d47254b5e94',
        },
        {
          url: '/img/networks/shiden-network.jpg',
          revision: '466c328b0eeb5a78700bea1b2ad51479',
        },
        {
          url: '/img/networks/xdai-network.jpg',
          revision: '37ebe0774e6ccc2ed55b2ae2e358c02c',
        },
        {
          url: '/img/wallets/bsc.jpg',
          revision: 'c234e4b9693f70ec697713cbafc53c65',
        },
        {
          url: '/img/wallets/coinbase.svg',
          revision: '62578f5994645a1825d4829e2c4394b0',
        },
        {
          url: '/img/wallets/fortmatic.png',
          revision: '11562b35c593bdff062d22994aa93db7',
        },
        {
          url: '/img/wallets/injected.svg',
          revision: 'd285b6cf22b4f1552bb4009333462632',
        },
        {
          url: '/img/wallets/keystone.png',
          revision: 'a422aaf1212f68f2f0273f2bf00c5ca4',
        },
        {
          url: '/img/wallets/lattice.png',
          revision: '3101eb1ee2d95b6cdc32c6ec960c80e4',
        },
        {
          url: '/img/wallets/metamask.png',
          revision: '023762b6aec2a2249b8fdfb638f00ef3',
        },
        {
          url: '/img/wallets/portis.png',
          revision: 'b234b2bfa0417c7e8711c3a8d17afeec',
        },
        {
          url: '/img/wallets/torus.png',
          revision: '9877cd978dfe022be2ffea8dd28f9ee7',
        },
        {
          url: '/img/wallets/wallet-connect.svg',
          revision: '8215855c185176eb79446ce8cc1f3998',
        },
      ],
      { ignoreURLParametersMatching: [] },
    ),
    e.cleanupOutdatedCaches(),
    e.registerRoute(
      '/',
      new e.NetworkFirst({
        cacheName: 'start-url',
        plugins: [
          {
            cacheWillUpdate: async ({
              request: e,
              response: s,
              event: a,
              state: i,
            }) =>
              s && 'opaqueredirect' === s.type
                ? new Response(s.body, {
                    status: 200,
                    statusText: 'OK',
                    headers: s.headers,
                  })
                : s,
          },
        ],
      }),
      'GET',
    ),
    e.registerRoute(
      /^https:\/\/fonts\.(?:gstatic)\.com\/.*/i,
      new e.CacheFirst({
        cacheName: 'google-fonts-webfonts',
        plugins: [
          new e.ExpirationPlugin({ maxEntries: 4, maxAgeSeconds: 31536e3 }),
        ],
      }),
      'GET',
    ),
    e.registerRoute(
      /^https:\/\/fonts\.(?:googleapis)\.com\/.*/i,
      new e.StaleWhileRevalidate({
        cacheName: 'google-fonts-stylesheets',
        plugins: [
          new e.ExpirationPlugin({ maxEntries: 4, maxAgeSeconds: 604800 }),
        ],
      }),
      'GET',
    ),
    e.registerRoute(
      /\.(?:eot|otf|ttc|ttf|woff|woff2|font.css)$/i,
      new e.StaleWhileRevalidate({
        cacheName: 'static-font-assets',
        plugins: [
          new e.ExpirationPlugin({ maxEntries: 4, maxAgeSeconds: 604800 }),
        ],
      }),
      'GET',
    ),
    e.registerRoute(
      /\.(?:jpg|jpeg|gif|png|svg|ico|webp)$/i,
      new e.StaleWhileRevalidate({
        cacheName: 'static-image-assets',
        plugins: [
          new e.ExpirationPlugin({ maxEntries: 64, maxAgeSeconds: 86400 }),
        ],
      }),
      'GET',
    ),
    e.registerRoute(
      /\/_next\/image\?url=.+$/i,
      new e.StaleWhileRevalidate({
        cacheName: 'next-image',
        plugins: [
          new e.ExpirationPlugin({ maxEntries: 64, maxAgeSeconds: 86400 }),
        ],
      }),
      'GET',
    ),
    e.registerRoute(
      /\.(?:mp3|wav|ogg)$/i,
      new e.CacheFirst({
        cacheName: 'static-audio-assets',
        plugins: [
          new e.RangeRequestsPlugin(),
          new e.ExpirationPlugin({ maxEntries: 32, maxAgeSeconds: 86400 }),
        ],
      }),
      'GET',
    ),
    e.registerRoute(
      /\.(?:mp4)$/i,
      new e.CacheFirst({
        cacheName: 'static-video-assets',
        plugins: [
          new e.RangeRequestsPlugin(),
          new e.ExpirationPlugin({ maxEntries: 32, maxAgeSeconds: 86400 }),
        ],
      }),
      'GET',
    ),
    e.registerRoute(
      /\.(?:js)$/i,
      new e.StaleWhileRevalidate({
        cacheName: 'static-js-assets',
        plugins: [
          new e.ExpirationPlugin({ maxEntries: 32, maxAgeSeconds: 86400 }),
        ],
      }),
      'GET',
    ),
    e.registerRoute(
      /\.(?:css|less)$/i,
      new e.StaleWhileRevalidate({
        cacheName: 'static-style-assets',
        plugins: [
          new e.ExpirationPlugin({ maxEntries: 32, maxAgeSeconds: 86400 }),
        ],
      }),
      'GET',
    ),
    e.registerRoute(
      /\/_next\/data\/.+\/.+\.json$/i,
      new e.StaleWhileRevalidate({
        cacheName: 'next-data',
        plugins: [
          new e.ExpirationPlugin({ maxEntries: 32, maxAgeSeconds: 86400 }),
        ],
      }),
      'GET',
    ),
    e.registerRoute(
      /\.(?:json|xml|csv)$/i,
      new e.NetworkFirst({
        cacheName: 'static-data-assets',
        plugins: [
          new e.ExpirationPlugin({ maxEntries: 32, maxAgeSeconds: 86400 }),
        ],
      }),
      'GET',
    ),
    e.registerRoute(
      ({ url: e }) => {
        if (!(self.origin === e.origin)) return !1;
        const s = e.pathname;
        return !s.startsWith('/api/auth/') && !!s.startsWith('/api/');
      },
      new e.NetworkFirst({
        cacheName: 'apis',
        networkTimeoutSeconds: 10,
        plugins: [
          new e.ExpirationPlugin({ maxEntries: 16, maxAgeSeconds: 86400 }),
        ],
      }),
      'GET',
    ),
    e.registerRoute(
      ({ url: e }) => {
        if (!(self.origin === e.origin)) return !1;
        return !e.pathname.startsWith('/api/');
      },
      new e.NetworkFirst({
        cacheName: 'others',
        networkTimeoutSeconds: 10,
        plugins: [
          new e.ExpirationPlugin({ maxEntries: 32, maxAgeSeconds: 86400 }),
        ],
      }),
      'GET',
    ),
    e.registerRoute(
      ({ url: e }) => !(self.origin === e.origin),
      new e.NetworkFirst({
        cacheName: 'cross-origin',
        networkTimeoutSeconds: 10,
        plugins: [
          new e.ExpirationPlugin({ maxEntries: 32, maxAgeSeconds: 3600 }),
        ],
      }),
      'GET',
    );
});
