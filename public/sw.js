if(!self.define){const e=e=>{"require"!==e&&(e+=".js");let i=Promise.resolve();return s[e]||(i=new Promise((async i=>{if("document"in self){const s=document.createElement("script");s.src=e,document.head.appendChild(s),s.onload=i}else importScripts(e),i()}))),i.then((()=>{if(!s[e])throw new Error(`Module ${e} didn’t register its module`);return s[e]}))},i=(i,s)=>{Promise.all(i.map(e)).then((e=>s(1===e.length?e[0]:e)))},s={require:Promise.resolve(i)};self.define=(i,n,a)=>{s[i]||(s[i]=Promise.resolve().then((()=>{let s={};const c={uri:location.origin+i.slice(1)};return Promise.all(n.map((i=>{switch(i){case"exports":return s;case"module":return c;default:return e(i)}}))).then((e=>{const i=a(...e);return s.default||(s.default=i),s}))})))}}define("./sw.js",["./workbox-21b21c9a"],(function(e){"use strict";importScripts(),self.skipWaiting(),e.clientsClaim(),e.precacheAndRoute([{url:"/_next/static/-PPZXGnRLCiVtyE4G588D/_buildManifest.js",revision:"-PPZXGnRLCiVtyE4G588D"},{url:"/_next/static/-PPZXGnRLCiVtyE4G588D/_ssgManifest.js",revision:"-PPZXGnRLCiVtyE4G588D"},{url:"/_next/static/chunks/112-3ce440982f47d4c28006.js",revision:"-PPZXGnRLCiVtyE4G588D"},{url:"/_next/static/chunks/118.c928a4df58e91ee3a99c.js",revision:"-PPZXGnRLCiVtyE4G588D"},{url:"/_next/static/chunks/119.5e8002e6283acce3ecd4.js",revision:"-PPZXGnRLCiVtyE4G588D"},{url:"/_next/static/chunks/249-b33fe59230d0c9932c06.js",revision:"-PPZXGnRLCiVtyE4G588D"},{url:"/_next/static/chunks/288-e4376846b0c180af08a8.js",revision:"-PPZXGnRLCiVtyE4G588D"},{url:"/_next/static/chunks/294-a94081b1039d45059e56.js",revision:"-PPZXGnRLCiVtyE4G588D"},{url:"/_next/static/chunks/359-b8b9938a5c24817061a6.js",revision:"-PPZXGnRLCiVtyE4G588D"},{url:"/_next/static/chunks/434-c8969e1a5fc5b63c5c89.js",revision:"-PPZXGnRLCiVtyE4G588D"},{url:"/_next/static/chunks/485.efec1c15f2cfe77f82d4.js",revision:"-PPZXGnRLCiVtyE4G588D"},{url:"/_next/static/chunks/493.c9b8146a1e42f0a9a316.js",revision:"-PPZXGnRLCiVtyE4G588D"},{url:"/_next/static/chunks/515-c870684380ac6da9d028.js",revision:"-PPZXGnRLCiVtyE4G588D"},{url:"/_next/static/chunks/553-696d9d5da1c229e49daa.js",revision:"-PPZXGnRLCiVtyE4G588D"},{url:"/_next/static/chunks/571.1a09eca66a7b6e1db8e0.js",revision:"-PPZXGnRLCiVtyE4G588D"},{url:"/_next/static/chunks/699-ff850436dc4cc076acba.js",revision:"-PPZXGnRLCiVtyE4G588D"},{url:"/_next/static/chunks/747.6ebfec86d25ea686b4b8.js",revision:"-PPZXGnRLCiVtyE4G588D"},{url:"/_next/static/chunks/802-b0aba6075f4ab3f96a2f.js",revision:"-PPZXGnRLCiVtyE4G588D"},{url:"/_next/static/chunks/878-9b655f09dfe605536fdc.js",revision:"-PPZXGnRLCiVtyE4G588D"},{url:"/_next/static/chunks/90.018e9fb58cb2cacd88de.js",revision:"-PPZXGnRLCiVtyE4G588D"},{url:"/_next/static/chunks/911-8d030143a57320d49d45.js",revision:"-PPZXGnRLCiVtyE4G588D"},{url:"/_next/static/chunks/936-9a516c24eac397649393.js",revision:"-PPZXGnRLCiVtyE4G588D"},{url:"/_next/static/chunks/983.022e3db62c7711d91ede.js",revision:"-PPZXGnRLCiVtyE4G588D"},{url:"/_next/static/chunks/b70d09f9.1e95bc296fd9dfe5bfb1.js",revision:"-PPZXGnRLCiVtyE4G588D"},{url:"/_next/static/chunks/framework-3af989d3dbeb77832f99.js",revision:"-PPZXGnRLCiVtyE4G588D"},{url:"/_next/static/chunks/main-0967e7b1815d4c63f10a.js",revision:"-PPZXGnRLCiVtyE4G588D"},{url:"/_next/static/chunks/pages/404-f7adf2e0e93b5eef649f.js",revision:"-PPZXGnRLCiVtyE4G588D"},{url:"/_next/static/chunks/pages/_app-ba478ccbe5e746582ed0.js",revision:"-PPZXGnRLCiVtyE4G588D"},{url:"/_next/static/chunks/pages/_error-ea939aab753d9e9db3bd.js",revision:"-PPZXGnRLCiVtyE4G588D"},{url:"/_next/static/chunks/pages/add/%5B%5B...pair%5D%5D-5a0f5bce3c596bb68b3c.js",revision:"-PPZXGnRLCiVtyE4G588D"},{url:"/_next/static/chunks/pages/bridge-4cde5db505025a2f85bf.js",revision:"-PPZXGnRLCiVtyE4G588D"},{url:"/_next/static/chunks/pages/dividend-4a0775b2a4f8aae48d45.js",revision:"-PPZXGnRLCiVtyE4G588D"},{url:"/_next/static/chunks/pages/farm-2cb58cac17c3d7e5024a.js",revision:"-PPZXGnRLCiVtyE4G588D"},{url:"/_next/static/chunks/pages/farmv2-96037f23e32195a800a1.js",revision:"-PPZXGnRLCiVtyE4G588D"},{url:"/_next/static/chunks/pages/find-432a59b19a26e948e806.js",revision:"-PPZXGnRLCiVtyE4G588D"},{url:"/_next/static/chunks/pages/index-8bae3856e9488e025235.js",revision:"-PPZXGnRLCiVtyE4G588D"},{url:"/_next/static/chunks/pages/pool-97a7345ec82f05494f94.js",revision:"-PPZXGnRLCiVtyE4G588D"},{url:"/_next/static/chunks/pages/remove/%5B%5B...pair%5D%5D-86e8990bb442d5aed0a3.js",revision:"-PPZXGnRLCiVtyE4G588D"},{url:"/_next/static/chunks/pages/swap/%5B%5B...pair%5D%5D-7f5d1506ac2d06625429.js",revision:"-PPZXGnRLCiVtyE4G588D"},{url:"/_next/static/chunks/pages/tokens-74a84029160957a63348.js",revision:"-PPZXGnRLCiVtyE4G588D"},{url:"/_next/static/chunks/polyfills-e7a279300235e161e32a.js",revision:"-PPZXGnRLCiVtyE4G588D"},{url:"/_next/static/chunks/webpack-39e74a8eef9ed95d21bb.js",revision:"-PPZXGnRLCiVtyE4G588D"},{url:"/_next/static/css/3d3c27b83f256ede13aa.css",revision:"-PPZXGnRLCiVtyE4G588D"},{url:"/_next/static/css/3d9be2a8ce8a8ea70e7a.css",revision:"-PPZXGnRLCiVtyE4G588D"},{url:"/_next/static/image/public/img/logos/logo.dark.10b6fe764be5521b33c9234cc97c184d.png",revision:"-PPZXGnRLCiVtyE4G588D"},{url:"/_next/static/image/public/img/logos/logo.light.c3ed354e9063e3adc1eddc3e2eb98a9e.png",revision:"-PPZXGnRLCiVtyE4G588D"},{url:"/_next/static/image/public/img/logos/logo.primary.92527241a37ffd349f5a07db26287101.png",revision:"-PPZXGnRLCiVtyE4G588D"},{url:"/_next/static/image/public/img/logos/logo.short.dark.63393a01210806dd343c09ce38b726ff.png",revision:"-PPZXGnRLCiVtyE4G588D"},{url:"/_next/static/image/public/img/logos/logo.short.light.63393a01210806dd343c09ce38b726ff.png",revision:"-PPZXGnRLCiVtyE4G588D"},{url:"/android-chrome-192x192.png",revision:"172640f57d84cb0c6067c85700144374"},{url:"/android-chrome-192x192.webp",revision:"cb4317f5b5fc8fd90f9c8d05438c27f4"},{url:"/android-chrome-512x512.png",revision:"24ef3ba32ca6a02cf36d322aa5d711a7"},{url:"/android-chrome-512x512.webp",revision:"dd63a3e1b52d3d37aaee97806694420d"},{url:"/apple-touch-icon-114x114.png",revision:"c315600cb39654b3fbbd14b989b444df"},{url:"/apple-touch-icon-120x120.png",revision:"0c73d8f3f69b4473691db39bbea23e61"},{url:"/apple-touch-icon-144x144.png",revision:"0935a3d16b60acbb85727f44ff33d19a"},{url:"/apple-touch-icon-152x152.png",revision:"b091edb4984e74a7a6b46f8b99ee6d0c"},{url:"/apple-touch-icon-180x180.png",revision:"1724e360b70343ab22e145202c3b25fb"},{url:"/apple-touch-icon-57x57.png",revision:"bbb360482044fefa2c9bdc1e45ca3848"},{url:"/apple-touch-icon-60x60.png",revision:"6bd51f6707eb7c1d0e4977c9c769b2de"},{url:"/apple-touch-icon-72x72.png",revision:"416fd775275860f412ca45a253efdd1e"},{url:"/apple-touch-icon-76x76.png",revision:"b1884c2316bf218b3b5cb9e4e40f5b31"},{url:"/apple-touch-icon.png",revision:"bbb360482044fefa2c9bdc1e45ca3848"},{url:"/assets/terms-of-service.pdf",revision:"04bc6f09874d6babbd26908816ab50f6"},{url:"/browserconfig.xml",revision:"e4e40b0c82d228add33b5bcfe276a859"},{url:"/favicon-16x16.png",revision:"38bcd6a5d27f6014ca534762122c779e"},{url:"/favicon-32x32.png",revision:"c1daa44454a4b915c1b044f9f6217ff1"},{url:"/favicon.ico",revision:"c6f1735578d22005e546f90f1cf0f28d"},{url:"/icons/bridge.svg",revision:"fd3dd5ea36f3f7683bae1d695ba1c165"},{url:"/icons/dividend.svg",revision:"b9b71439ece80c20e07ba2163e7b5feb"},{url:"/icons/farm.svg",revision:"00d61c2580203e31299102260f95a895"},{url:"/icons/filled/Collateralize.svg",revision:"d9c3565329ddf00ce21f314bae094612"},{url:"/icons/filled/Dividend.svg",revision:"64744c2c6e060418ea2546d639eb213d"},{url:"/icons/filled/Farm.svg",revision:"551a1f2d792e4dfd80ff6e7e9bbe8b9f"},{url:"/icons/filled/Home.svg",revision:"82fb8799fe2dffa37a53d14111bded6d"},{url:"/icons/filled/Setting.svg",revision:"0b36ab93aaae4280a8d503b72127f713"},{url:"/icons/filled/Swap.svg",revision:"4f2a68a6faf9f16155c6ce7577d64a91"},{url:"/icons/filled/Vault.svg",revision:"fd5d2674b3d87481897f5c1b90339ba0"},{url:"/icons/home.svg",revision:"931dc607906212d5c50f5f0b2093541c"},{url:"/icons/outlined/Collateralize.svg",revision:"879e353c5d5115cf4ef007179f407a35"},{url:"/icons/outlined/Dividend.svg",revision:"9fdc52c0573aa88c0e976e9426d4f343"},{url:"/icons/outlined/Farm.svg",revision:"41062f9ba2cb36d771cebc26ad0ec654"},{url:"/icons/outlined/Gas.svg",revision:"da6751b3fc02e6422b81ae3ddd94eb73"},{url:"/icons/outlined/Home.svg",revision:"94a7869075eac60bb21d136576bd48f3"},{url:"/icons/outlined/Setting.svg",revision:"61c16b7d14914e0ea3b79c9779765b7c"},{url:"/icons/outlined/Swap.svg",revision:"430791911b7daa6680a0a96e667fc0e2"},{url:"/icons/outlined/Switch.svg",revision:"53ff7a10d5e61c7ee77667599a020b5e"},{url:"/icons/outlined/Vault.svg",revision:"2f1f41b910f98974f834201f3e0da618"},{url:"/icons/pool.svg",revision:"382bef7e20de4af53e02de2d6c845745"},{url:"/icons/swap.svg",revision:"0fd97f2fbd9e46b3372d5e803155ef07"},{url:"/icons/tokens.svg",revision:"46b51f9b94063f686ecbd922f4e67d6b"},{url:"/img/bg-bond.png",revision:"6856ef7331e0cd73a5ef4d414ae09e26"},{url:"/img/bond-bg.png",revision:"d2a22aa80690a8eb09503db9867e78fe"},{url:"/img/bridge/anyswap.svg",revision:"b842c71c4e839494f289670936c1284b"},{url:"/img/bridge/bridge0.png",revision:"15f18439d117087142b523e947201a75"},{url:"/img/bridge/bridge1.png",revision:"d86f9238546f7e1c785a77c5a952fdb3"},{url:"/img/bridge/bridge2.png",revision:"80ea8965da6771335b1a53f4a448bb87"},{url:"/img/bridge/bridge3.png",revision:"6c4e2f99d54384bfacc98372beef66d4"},{url:"/img/bridge/bridge4.png",revision:"0fb618012ae35e49bc010d93292c6e7f"},{url:"/img/bridge/bridge5.png",revision:"16aa64aea41e6f548393d9023a8f389e"},{url:"/img/bridge/bridge6.png",revision:"e40e1597b63826c619073bca6471c33b"},{url:"/img/listings/coinone.svg",revision:"f0645da6bbe9e21a1b332880e1c00df7"},{url:"/img/listings/gate.svg",revision:"034d161896c5e83d7d5437f858023883"},{url:"/img/listings/kucoin.svg",revision:"2b7edbe6b8a2b048891f40da0c478e6d"},{url:"/img/logos/logo.dark.png",revision:"aafed964e75e42145a84a80321e714df"},{url:"/img/logos/logo.light.png",revision:"597504e6313ab8f2d13a61d0162b234f"},{url:"/img/logos/logo.primary.png",revision:"4c810b6c19a3662e3056c2bebd350f87"},{url:"/img/logos/logo.short.dark.png",revision:"28b241ee322bc9c7a618a5eb11155d20"},{url:"/img/logos/logo.short.light.png",revision:"28b241ee322bc9c7a618a5eb11155d20"},{url:"/img/networks/arbitrum-network.jpg",revision:"e13d4e3caa3a52004fa676acbacbb6bc"},{url:"/img/networks/avalanche-network.jpg",revision:"f22a74941d24f0c577eb5b013fa5dc54"},{url:"/img/networks/bsc-network.jpg",revision:"c234e4b9693f70ec697713cbafc53c65"},{url:"/img/networks/celo-network.jpg",revision:"b0c2f695de8497f3b331d7e268dd7bef"},{url:"/img/networks/ethereum-net.png",revision:"1630a7dd248a2dad3b89b526734d98cc"},{url:"/img/networks/fantom-network.jpg",revision:"b38c2308780b7cda16b72ad9ab67918a"},{url:"/img/networks/goerli-network.jpg",revision:"bfa3e8c83bbdd0b018a2af55904e85b0"},{url:"/img/networks/harmonyone-network.jpg",revision:"55abcda6471ba41f172a35dd9d65800d"},{url:"/img/networks/heco-network.jpg",revision:"624c6a297d927a977c6e4c8baae35705"},{url:"/img/networks/kovan-network.jpg",revision:"8eeea938b6b6e7740a072be055eb12a9"},{url:"/img/networks/mainnet-network.jpg",revision:"97195efc5b2a70b8c0a8755838f9bb1c"},{url:"/img/networks/matic-network.jpg",revision:"6f2764a8b0d4d876fafc4280852ba685"},{url:"/img/networks/moonbeam-network.jpg",revision:"18a53ab891fd339e5c0f53cba5ac5db1"},{url:"/img/networks/okex-network.jpg",revision:"ddbf0a958858042a11255cc62929fc37"},{url:"/img/networks/polygon-net.png",revision:"3f9aa7e51824fef67c0d42add1e95408"},{url:"/img/networks/polygon-network.jpg",revision:"f35785eb02bc3ef30f10a5ca88e687a9"},{url:"/img/networks/rinkeby-network.jpg",revision:"d7aecb9c343c81ec5d67ad06296b8d16"},{url:"/img/networks/ropsten-network.jpg",revision:"fc75a1a8c3ff4f9791f20bb05603c445"},{url:"/img/networks/shibuya-network.jpg",revision:"159f8e7a95e6c97bd6f50d47254b5e94"},{url:"/img/networks/shiden-network.jpg",revision:"466c328b0eeb5a78700bea1b2ad51479"},{url:"/img/networks/xdai-network.jpg",revision:"37ebe0774e6ccc2ed55b2ae2e358c02c"},{url:"/img/socials/discord.svg",revision:"260cbdcb5d447c7a504667e7af1aa4a1"},{url:"/img/socials/medium.svg",revision:"31853b7ada04666e543bc12684aa7337"},{url:"/img/socials/telegram.svg",revision:"97e5d688ca48a52764a1ae3a91f2a331"},{url:"/img/socials/twitter.svg",revision:"fa4b69272d03ee6117ed24f8a609cb1a"},{url:"/img/socials/website.svg",revision:"a74182e277214344726bb1d33042e5f6"},{url:"/img/wallets/bsc.jpg",revision:"c234e4b9693f70ec697713cbafc53c65"},{url:"/img/wallets/coinbase.svg",revision:"62578f5994645a1825d4829e2c4394b0"},{url:"/img/wallets/fortmatic.png",revision:"11562b35c593bdff062d22994aa93db7"},{url:"/img/wallets/injected.svg",revision:"d285b6cf22b4f1552bb4009333462632"},{url:"/img/wallets/keystone.png",revision:"a422aaf1212f68f2f0273f2bf00c5ca4"},{url:"/img/wallets/lattice.png",revision:"3101eb1ee2d95b6cdc32c6ec960c80e4"},{url:"/img/wallets/metamask.png",revision:"023762b6aec2a2249b8fdfb638f00ef3"},{url:"/img/wallets/portis.png",revision:"b234b2bfa0417c7e8711c3a8d17afeec"},{url:"/img/wallets/torus.png",revision:"9877cd978dfe022be2ffea8dd28f9ee7"},{url:"/img/wallets/wallet-connect.svg",revision:"8215855c185176eb79446ce8cc1f3998"},{url:"/logo.png",revision:"f352e1662738b2a0af2c754f8c310815"},{url:"/manifest.json",revision:"cd9abde91a309fd94641ef0d82d939b7"},{url:"/mstile-150x150.png",revision:"2a3d4ba9395df3e70f329ddd47ec4987"},{url:"/safari-pinned-tab.svg",revision:"ace5d937716500aa792618ab2b5f4938"},{url:"/site.webmanifest",revision:"b3163846e52556f760e03b240d92589d"},{url:"/splashscreens/ipad_splash.png",revision:"d87e45e17332e127588fece76ccef486"},{url:"/splashscreens/ipadpro1_splash.png",revision:"7499ec357761309e132157cb75b93e0b"},{url:"/splashscreens/ipadpro2_splash.png",revision:"c906e774c820bb2c59f266abd47f56a3"},{url:"/splashscreens/ipadpro3_splash.png",revision:"81f894833a69eeb30978ab76befce374"},{url:"/splashscreens/iphone5_splash.png",revision:"acfb3fe53f8e82944a39337125132800"},{url:"/splashscreens/iphone6_splash.png",revision:"426feb14e5aa1d4e9dad7bb1c52a6d96"},{url:"/splashscreens/iphoneplus_splash.png",revision:"c4b9f8b8aa6f59013c2a47d973b2823b"},{url:"/splashscreens/iphonex_splash.png",revision:"89af21b70a1a5a102a6fd01e64bc1fe8"},{url:"/splashscreens/iphonexr_splash.png",revision:"3bb19c58c7e6849356852743282001ad"},{url:"/splashscreens/iphonexsmax_splash.png",revision:"72b42a6c816b295181df2a599167cadd"}],{ignoreURLParametersMatching:[]}),e.cleanupOutdatedCaches(),e.registerRoute("/",new e.NetworkFirst({cacheName:"start-url",plugins:[{cacheWillUpdate:async({request:e,response:i,event:s,state:n})=>i&&"opaqueredirect"===i.type?new Response(i.body,{status:200,statusText:"OK",headers:i.headers}):i}]}),"GET"),e.registerRoute(/^https:\/\/fonts\.(?:gstatic)\.com\/.*/i,new e.CacheFirst({cacheName:"google-fonts-webfonts",plugins:[new e.ExpirationPlugin({maxEntries:4,maxAgeSeconds:31536e3})]}),"GET"),e.registerRoute(/^https:\/\/fonts\.(?:googleapis)\.com\/.*/i,new e.StaleWhileRevalidate({cacheName:"google-fonts-stylesheets",plugins:[new e.ExpirationPlugin({maxEntries:4,maxAgeSeconds:604800})]}),"GET"),e.registerRoute(/\.(?:eot|otf|ttc|ttf|woff|woff2|font.css)$/i,new e.StaleWhileRevalidate({cacheName:"static-font-assets",plugins:[new e.ExpirationPlugin({maxEntries:4,maxAgeSeconds:604800})]}),"GET"),e.registerRoute(/\.(?:jpg|jpeg|gif|png|svg|ico|webp)$/i,new e.StaleWhileRevalidate({cacheName:"static-image-assets",plugins:[new e.ExpirationPlugin({maxEntries:64,maxAgeSeconds:86400})]}),"GET"),e.registerRoute(/\/_next\/image\?url=.+$/i,new e.StaleWhileRevalidate({cacheName:"next-image",plugins:[new e.ExpirationPlugin({maxEntries:64,maxAgeSeconds:86400})]}),"GET"),e.registerRoute(/\.(?:mp3|wav|ogg)$/i,new e.CacheFirst({cacheName:"static-audio-assets",plugins:[new e.RangeRequestsPlugin,new e.ExpirationPlugin({maxEntries:32,maxAgeSeconds:86400})]}),"GET"),e.registerRoute(/\.(?:mp4)$/i,new e.CacheFirst({cacheName:"static-video-assets",plugins:[new e.RangeRequestsPlugin,new e.ExpirationPlugin({maxEntries:32,maxAgeSeconds:86400})]}),"GET"),e.registerRoute(/\.(?:js)$/i,new e.StaleWhileRevalidate({cacheName:"static-js-assets",plugins:[new e.ExpirationPlugin({maxEntries:32,maxAgeSeconds:86400})]}),"GET"),e.registerRoute(/\.(?:css|less)$/i,new e.StaleWhileRevalidate({cacheName:"static-style-assets",plugins:[new e.ExpirationPlugin({maxEntries:32,maxAgeSeconds:86400})]}),"GET"),e.registerRoute(/\/_next\/data\/.+\/.+\.json$/i,new e.StaleWhileRevalidate({cacheName:"next-data",plugins:[new e.ExpirationPlugin({maxEntries:32,maxAgeSeconds:86400})]}),"GET"),e.registerRoute(/\.(?:json|xml|csv)$/i,new e.NetworkFirst({cacheName:"static-data-assets",plugins:[new e.ExpirationPlugin({maxEntries:32,maxAgeSeconds:86400})]}),"GET"),e.registerRoute((({url:e})=>{if(!(self.origin===e.origin))return!1;const i=e.pathname;return!i.startsWith("/api/auth/")&&!!i.startsWith("/api/")}),new e.NetworkFirst({cacheName:"apis",networkTimeoutSeconds:10,plugins:[new e.ExpirationPlugin({maxEntries:16,maxAgeSeconds:86400})]}),"GET"),e.registerRoute((({url:e})=>{if(!(self.origin===e.origin))return!1;return!e.pathname.startsWith("/api/")}),new e.NetworkFirst({cacheName:"others",networkTimeoutSeconds:10,plugins:[new e.ExpirationPlugin({maxEntries:32,maxAgeSeconds:86400})]}),"GET"),e.registerRoute((({url:e})=>!(self.origin===e.origin)),new e.NetworkFirst({cacheName:"cross-origin",networkTimeoutSeconds:10,plugins:[new e.ExpirationPlugin({maxEntries:32,maxAgeSeconds:3600})]}),"GET")}));
