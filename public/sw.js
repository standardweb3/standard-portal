if(!self.define){const e=e=>{"require"!==e&&(e+=".js");let s=Promise.resolve();return i[e]||(s=new Promise((async s=>{if("document"in self){const i=document.createElement("script");i.src=e,document.head.appendChild(i),i.onload=s}else importScripts(e),s()}))),s.then((()=>{if(!i[e])throw new Error(`Module ${e} didn’t register its module`);return i[e]}))},s=(s,i)=>{Promise.all(s.map(e)).then((e=>i(1===e.length?e[0]:e)))},i={require:Promise.resolve(s)};self.define=(s,n,a)=>{i[s]||(i[s]=Promise.resolve().then((()=>{let i={};const c={uri:location.origin+s.slice(1)};return Promise.all(n.map((s=>{switch(s){case"exports":return i;case"module":return c;default:return e(s)}}))).then((e=>{const s=a(...e);return i.default||(i.default=s),i}))})))}}define("./sw.js",["./workbox-21b21c9a"],(function(e){"use strict";importScripts(),self.skipWaiting(),e.clientsClaim(),e.precacheAndRoute([{url:"/_next/static/chunks/1119.599933643a6bc60f4775.js",revision:"kBXnVsP5lWBzUoUjWDzJ3"},{url:"/_next/static/chunks/1629-8e2882e8407918261c07.js",revision:"kBXnVsP5lWBzUoUjWDzJ3"},{url:"/_next/static/chunks/2027.92de5e42a0e4241595d7.js",revision:"kBXnVsP5lWBzUoUjWDzJ3"},{url:"/_next/static/chunks/2119-93ae6672a11dbc394132.js",revision:"kBXnVsP5lWBzUoUjWDzJ3"},{url:"/_next/static/chunks/2485.115fbb2863e039b4ea96.js",revision:"kBXnVsP5lWBzUoUjWDzJ3"},{url:"/_next/static/chunks/2589-a4a8665e88479c045fc9.js",revision:"kBXnVsP5lWBzUoUjWDzJ3"},{url:"/_next/static/chunks/3334-3c4ff5c23a958b3ee364.js",revision:"kBXnVsP5lWBzUoUjWDzJ3"},{url:"/_next/static/chunks/3511-23d7a431efb693d9a6f2.js",revision:"kBXnVsP5lWBzUoUjWDzJ3"},{url:"/_next/static/chunks/3620.6e575f8bfbbc917c052f.js",revision:"kBXnVsP5lWBzUoUjWDzJ3"},{url:"/_next/static/chunks/3646.8416a5c2b3d30805142b.js",revision:"kBXnVsP5lWBzUoUjWDzJ3"},{url:"/_next/static/chunks/3744-60ee3abd04f97b9aa904.js",revision:"kBXnVsP5lWBzUoUjWDzJ3"},{url:"/_next/static/chunks/3802-c9cf08e4502a48af9e57.js",revision:"kBXnVsP5lWBzUoUjWDzJ3"},{url:"/_next/static/chunks/4050-df5a51f0416f8008cddf.js",revision:"kBXnVsP5lWBzUoUjWDzJ3"},{url:"/_next/static/chunks/4719.27f1c520d3df0f59b4cc.js",revision:"kBXnVsP5lWBzUoUjWDzJ3"},{url:"/_next/static/chunks/553-fe35bb7619d4970b71c3.js",revision:"kBXnVsP5lWBzUoUjWDzJ3"},{url:"/_next/static/chunks/5859-a24bb37f00fc99359d12.js",revision:"kBXnVsP5lWBzUoUjWDzJ3"},{url:"/_next/static/chunks/5887-6ed769c52d80a0391415.js",revision:"kBXnVsP5lWBzUoUjWDzJ3"},{url:"/_next/static/chunks/5936-e45e1d37076fffaffc91.js",revision:"kBXnVsP5lWBzUoUjWDzJ3"},{url:"/_next/static/chunks/595-e69400d1dcdea9ba1add.js",revision:"kBXnVsP5lWBzUoUjWDzJ3"},{url:"/_next/static/chunks/6071-472a191238b09ea97cc0.js",revision:"kBXnVsP5lWBzUoUjWDzJ3"},{url:"/_next/static/chunks/6684-181050ff0b6fb2f09c3d.js",revision:"kBXnVsP5lWBzUoUjWDzJ3"},{url:"/_next/static/chunks/69.01687cb96aefb4283041.js",revision:"kBXnVsP5lWBzUoUjWDzJ3"},{url:"/_next/static/chunks/6919-e92cca8e5db6be69f989.js",revision:"kBXnVsP5lWBzUoUjWDzJ3"},{url:"/_next/static/chunks/703-dc43b16a2960dea69df0.js",revision:"kBXnVsP5lWBzUoUjWDzJ3"},{url:"/_next/static/chunks/7294-c9af22d00140324e476b.js",revision:"kBXnVsP5lWBzUoUjWDzJ3"},{url:"/_next/static/chunks/7571.a644d90ecb5ba5f8e7d2.js",revision:"kBXnVsP5lWBzUoUjWDzJ3"},{url:"/_next/static/chunks/7719-09e2b851df41f0bc4e3c.js",revision:"kBXnVsP5lWBzUoUjWDzJ3"},{url:"/_next/static/chunks/7902.5f15cbd70ce095b33fd7.js",revision:"kBXnVsP5lWBzUoUjWDzJ3"},{url:"/_next/static/chunks/8090.a74e7cccfc32c0313edb.js",revision:"kBXnVsP5lWBzUoUjWDzJ3"},{url:"/_next/static/chunks/9258-f5317008a21ea35aa1ca.js",revision:"kBXnVsP5lWBzUoUjWDzJ3"},{url:"/_next/static/chunks/9521-eb67710bb1e7c6a8219f.js",revision:"kBXnVsP5lWBzUoUjWDzJ3"},{url:"/_next/static/chunks/983.1cd4cc95dac264d813f4.js",revision:"kBXnVsP5lWBzUoUjWDzJ3"},{url:"/_next/static/chunks/9878.df03886f15669ba2a614.js",revision:"kBXnVsP5lWBzUoUjWDzJ3"},{url:"/_next/static/chunks/b70d09f9.73092740c7786d78a652.js",revision:"kBXnVsP5lWBzUoUjWDzJ3"},{url:"/_next/static/chunks/framework-336caa3f6419768205fe.js",revision:"kBXnVsP5lWBzUoUjWDzJ3"},{url:"/_next/static/chunks/main-c37bd3feb431d05885d1.js",revision:"kBXnVsP5lWBzUoUjWDzJ3"},{url:"/_next/static/chunks/pages/404-39bdbcde260dfda15690.js",revision:"kBXnVsP5lWBzUoUjWDzJ3"},{url:"/_next/static/chunks/pages/_error-cd3a4dcc303cc09fa80f.js",revision:"kBXnVsP5lWBzUoUjWDzJ3"},{url:"/_next/static/chunks/pages/add/%5B%5B...pair%5D%5D-fc91c218187ce4fc48fa.js",revision:"kBXnVsP5lWBzUoUjWDzJ3"},{url:"/_next/static/chunks/pages/amms-9a227fa3229e176d3dde.js",revision:"kBXnVsP5lWBzUoUjWDzJ3"},{url:"/_next/static/chunks/pages/borrow-18be5aae2a72001a382f.js",revision:"kBXnVsP5lWBzUoUjWDzJ3"},{url:"/_next/static/chunks/pages/borrow/collateralize/%5B...collateral%5D-6206421076c552d5a3bf.js",revision:"kBXnVsP5lWBzUoUjWDzJ3"},{url:"/_next/static/chunks/pages/bridge-14118dbfc979d4239b37.js",revision:"kBXnVsP5lWBzUoUjWDzJ3"},{url:"/_next/static/chunks/pages/bridge-old-493097009172306ff16b.js",revision:"kBXnVsP5lWBzUoUjWDzJ3"},{url:"/_next/static/chunks/pages/campaign-01f1df337226c4e55cf6.js",revision:"kBXnVsP5lWBzUoUjWDzJ3"},{url:"/_next/static/chunks/pages/dashboard-e4f728fc0c2b2f15b880.js",revision:"kBXnVsP5lWBzUoUjWDzJ3"},{url:"/_next/static/chunks/pages/dividend-25df3be6904e6effb1e8.js",revision:"kBXnVsP5lWBzUoUjWDzJ3"},{url:"/_next/static/chunks/pages/explorer-19666e4d78d678280fd2.js",revision:"kBXnVsP5lWBzUoUjWDzJ3"},{url:"/_next/static/chunks/pages/farm-21088b6f117c731cd2b3.js",revision:"kBXnVsP5lWBzUoUjWDzJ3"},{url:"/_next/static/chunks/pages/farmv2-db9c3aa9f1941a954089.js",revision:"kBXnVsP5lWBzUoUjWDzJ3"},{url:"/_next/static/chunks/pages/find-19af7d3c52e37a0a1091.js",revision:"kBXnVsP5lWBzUoUjWDzJ3"},{url:"/_next/static/chunks/pages/index-8958241e9e1a7767fe75.js",revision:"kBXnVsP5lWBzUoUjWDzJ3"},{url:"/_next/static/chunks/pages/migrate-c28baa582fe3e406f774.js",revision:"kBXnVsP5lWBzUoUjWDzJ3"},{url:"/_next/static/chunks/pages/pool-1d63a62c60cc904932f1.js",revision:"kBXnVsP5lWBzUoUjWDzJ3"},{url:"/_next/static/chunks/pages/remove/%5B%5B...pair%5D%5D-6e4c0baa66b27347faef.js",revision:"kBXnVsP5lWBzUoUjWDzJ3"},{url:"/_next/static/chunks/pages/router-6689bdd4ed45a904df6d.js",revision:"kBXnVsP5lWBzUoUjWDzJ3"},{url:"/_next/static/chunks/pages/router/history-79974861262d3abc969c.js",revision:"kBXnVsP5lWBzUoUjWDzJ3"},{url:"/_next/static/chunks/pages/trade-b8db0d2fef3edd8e0dbb.js",revision:"kBXnVsP5lWBzUoUjWDzJ3"},{url:"/_next/static/chunks/pages/trade/buy/%5B%5B...pair%5D%5D-47602f0f66908087b0df.js",revision:"kBXnVsP5lWBzUoUjWDzJ3"},{url:"/_next/static/chunks/pages/v1dividend-38757b48cbdad70ba49d.js",revision:"kBXnVsP5lWBzUoUjWDzJ3"},{url:"/_next/static/chunks/pages/v2dividend-4c62c4ca071670aadadf.js",revision:"kBXnVsP5lWBzUoUjWDzJ3"},{url:"/_next/static/chunks/pages/vault/%5Baddress%5D-5fde18f79e5de7c5b069.js",revision:"kBXnVsP5lWBzUoUjWDzJ3"},{url:"/_next/static/chunks/pages/vault/%5Baddress%5D/deposit-6c5f02cff23b54ff2ef8.js",revision:"kBXnVsP5lWBzUoUjWDzJ3"},{url:"/_next/static/chunks/pages/vault/%5Baddress%5D/mint-8ae3c28ea26c2922334b.js",revision:"kBXnVsP5lWBzUoUjWDzJ3"},{url:"/_next/static/chunks/pages/vault/%5Baddress%5D/withdraw-f88e9910c4b586b17873.js",revision:"kBXnVsP5lWBzUoUjWDzJ3"},{url:"/_next/static/chunks/pages/vault/404-06b693336753b1040d02.js",revision:"kBXnVsP5lWBzUoUjWDzJ3"},{url:"/_next/static/chunks/pages/vaults-e2933e14984a5c7bb04d.js",revision:"kBXnVsP5lWBzUoUjWDzJ3"},{url:"/_next/static/chunks/polyfills-b69b38e0e606287ba003.js",revision:"kBXnVsP5lWBzUoUjWDzJ3"},{url:"/_next/static/chunks/webpack-d90f43dc58ebab579f57.js",revision:"kBXnVsP5lWBzUoUjWDzJ3"},{url:"/_next/static/css/3d3c27b83f256ede13aa.css",revision:"kBXnVsP5lWBzUoUjWDzJ3"},{url:"/_next/static/css/5a0ecc04bd7205a6f339.css",revision:"kBXnVsP5lWBzUoUjWDzJ3"},{url:"/_next/static/image/public/img/logos/logo.dark.10b6fe764be5521b33c9234cc97c184d.png",revision:"kBXnVsP5lWBzUoUjWDzJ3"},{url:"/_next/static/image/public/img/logos/logo.light.c3ed354e9063e3adc1eddc3e2eb98a9e.png",revision:"kBXnVsP5lWBzUoUjWDzJ3"},{url:"/_next/static/image/public/img/logos/logo.primary.92527241a37ffd349f5a07db26287101.png",revision:"kBXnVsP5lWBzUoUjWDzJ3"},{url:"/_next/static/kBXnVsP5lWBzUoUjWDzJ3/_buildManifest.js",revision:"kBXnVsP5lWBzUoUjWDzJ3"},{url:"/_next/static/kBXnVsP5lWBzUoUjWDzJ3/_ssgManifest.js",revision:"kBXnVsP5lWBzUoUjWDzJ3"},{url:"/android-chrome-192x192.png",revision:"172640f57d84cb0c6067c85700144374"},{url:"/android-chrome-192x192.webp",revision:"cb4317f5b5fc8fd90f9c8d05438c27f4"},{url:"/android-chrome-512x512.png",revision:"24ef3ba32ca6a02cf36d322aa5d711a7"},{url:"/android-chrome-512x512.webp",revision:"dd63a3e1b52d3d37aaee97806694420d"},{url:"/apple-touch-icon-114x114.png",revision:"c315600cb39654b3fbbd14b989b444df"},{url:"/apple-touch-icon-120x120.png",revision:"0c73d8f3f69b4473691db39bbea23e61"},{url:"/apple-touch-icon-144x144.png",revision:"0935a3d16b60acbb85727f44ff33d19a"},{url:"/apple-touch-icon-152x152.png",revision:"b091edb4984e74a7a6b46f8b99ee6d0c"},{url:"/apple-touch-icon-180x180.png",revision:"1724e360b70343ab22e145202c3b25fb"},{url:"/apple-touch-icon-57x57.png",revision:"bbb360482044fefa2c9bdc1e45ca3848"},{url:"/apple-touch-icon-60x60.png",revision:"6bd51f6707eb7c1d0e4977c9c769b2de"},{url:"/apple-touch-icon-72x72.png",revision:"416fd775275860f412ca45a253efdd1e"},{url:"/apple-touch-icon-76x76.png",revision:"b1884c2316bf218b3b5cb9e4e40f5b31"},{url:"/apple-touch-icon.png",revision:"bbb360482044fefa2c9bdc1e45ca3848"},{url:"/assets/terms-of-service.pdf",revision:"04bc6f09874d6babbd26908816ab50f6"},{url:"/browserconfig.xml",revision:"e4e40b0c82d228add33b5bcfe276a859"},{url:"/favicon-16x16.png",revision:"38bcd6a5d27f6014ca534762122c779e"},{url:"/favicon-32x32.png",revision:"c1daa44454a4b915c1b044f9f6217ff1"},{url:"/favicon.ico",revision:"c6f1735578d22005e546f90f1cf0f28d"},{url:"/icons/amms.svg",revision:"149f735c2e40b229454a21f5f0bd82a8"},{url:"/icons/borrow.svg",revision:"b011f45050093eac630b9e23fa878123"},{url:"/icons/bridge.svg",revision:"fd3dd5ea36f3f7683bae1d695ba1c165"},{url:"/icons/campaign.svg",revision:"0b1abdfcbef7ce02680362674137f2d5"},{url:"/icons/dashboard.svg",revision:"4cde42367b32baa1f4ae61e4e4c32f6f"},{url:"/icons/dividend.svg",revision:"b9b71439ece80c20e07ba2163e7b5feb"},{url:"/icons/dividendv1.svg",revision:"b011f45050093eac630b9e23fa878123"},{url:"/icons/etherscan.png",revision:"7fafa7d78c72e378d6fa97f19d697f21"},{url:"/icons/explorer.svg",revision:"44388da6935f1ff8749511af8d63c0db"},{url:"/icons/farm.svg",revision:"00d61c2580203e31299102260f95a895"},{url:"/icons/filled/Collateralize.svg",revision:"d9c3565329ddf00ce21f314bae094612"},{url:"/icons/filled/Dividend.svg",revision:"64744c2c6e060418ea2546d639eb213d"},{url:"/icons/filled/Farm.svg",revision:"551a1f2d792e4dfd80ff6e7e9bbe8b9f"},{url:"/icons/filled/Home.svg",revision:"82fb8799fe2dffa37a53d14111bded6d"},{url:"/icons/filled/Setting.svg",revision:"0b36ab93aaae4280a8d503b72127f713"},{url:"/icons/filled/Swap.svg",revision:"4f2a68a6faf9f16155c6ce7577d64a91"},{url:"/icons/filled/Vault.svg",revision:"fd5d2674b3d87481897f5c1b90339ba0"},{url:"/icons/home.svg",revision:"931dc607906212d5c50f5f0b2093541c"},{url:"/icons/migrate.svg",revision:"149f735c2e40b229454a21f5f0bd82a8"},{url:"/icons/outlined/Collateralize.svg",revision:"879e353c5d5115cf4ef007179f407a35"},{url:"/icons/outlined/Dividend.svg",revision:"9fdc52c0573aa88c0e976e9426d4f343"},{url:"/icons/outlined/Farm.svg",revision:"41062f9ba2cb36d771cebc26ad0ec654"},{url:"/icons/outlined/Gas.svg",revision:"da6751b3fc02e6422b81ae3ddd94eb73"},{url:"/icons/outlined/Home.svg",revision:"94a7869075eac60bb21d136576bd48f3"},{url:"/icons/outlined/Setting.svg",revision:"61c16b7d14914e0ea3b79c9779765b7c"},{url:"/icons/outlined/Swap.svg",revision:"430791911b7daa6680a0a96e667fc0e2"},{url:"/icons/outlined/Switch.svg",revision:"53ff7a10d5e61c7ee77667599a020b5e"},{url:"/icons/outlined/Vault.svg",revision:"2f1f41b910f98974f834201f3e0da618"},{url:"/icons/pool.svg",revision:"382bef7e20de4af53e02de2d6c845745"},{url:"/icons/router.svg",revision:"4a810e07008075648169c881bdb691e6"},{url:"/icons/swap.svg",revision:"0fd97f2fbd9e46b3372d5e803155ef07"},{url:"/icons/tokens.svg",revision:"46b51f9b94063f686ecbd922f4e67d6b"},{url:"/icons/vault.svg",revision:"7c14e3ff1f1ec20468de28dcdbe825fd"},{url:"/img/Waves3.svg",revision:"7d1294a1f4b37f42a2b5bc9e5672154e"},{url:"/img/bg-bond.png",revision:"6856ef7331e0cd73a5ef4d414ae09e26"},{url:"/img/bond-bg.png",revision:"d2a22aa80690a8eb09503db9867e78fe"},{url:"/img/bridge/anyswap.png",revision:"6fac98e8412da72a9cbb9afcfd05e402"},{url:"/img/bridge/anyswap.svg",revision:"b842c71c4e839494f289670936c1284b"},{url:"/img/bridge/bridge0.png",revision:"15f18439d117087142b523e947201a75"},{url:"/img/bridge/bridge1.png",revision:"d86f9238546f7e1c785a77c5a952fdb3"},{url:"/img/bridge/bridge2.png",revision:"80ea8965da6771335b1a53f4a448bb87"},{url:"/img/bridge/bridge3.png",revision:"6c4e2f99d54384bfacc98372beef66d4"},{url:"/img/bridge/bridge4.png",revision:"0fb618012ae35e49bc010d93292c6e7f"},{url:"/img/bridge/bridge5.png",revision:"16aa64aea41e6f548393d9023a8f389e"},{url:"/img/bridge/bridge6.png",revision:"e40e1597b63826c619073bca6471c33b"},{url:"/img/listings/coinone.svg",revision:"f0645da6bbe9e21a1b332880e1c00df7"},{url:"/img/listings/gate.svg",revision:"034d161896c5e83d7d5437f858023883"},{url:"/img/listings/kucoin.svg",revision:"2b7edbe6b8a2b048891f40da0c478e6d"},{url:"/img/logos/logo.dark.png",revision:"aafed964e75e42145a84a80321e714df"},{url:"/img/logos/logo.light.png",revision:"597504e6313ab8f2d13a61d0162b234f"},{url:"/img/logos/logo.primary.png",revision:"4c810b6c19a3662e3056c2bebd350f87"},{url:"/img/logos/logo.short.dark.png",revision:"28b241ee322bc9c7a618a5eb11155d20"},{url:"/img/logos/logo.short.light.png",revision:"28b241ee322bc9c7a618a5eb11155d20"},{url:"/img/mtr.png",revision:"63e4c35474fad9dfdee264c285cd4b5f"},{url:"/img/networks/arbitrum-network.jpg",revision:"e13d4e3caa3a52004fa676acbacbb6bc"},{url:"/img/networks/avalanche-network.jpg",revision:"f22a74941d24f0c577eb5b013fa5dc54"},{url:"/img/networks/bsc-network.jpg",revision:"c234e4b9693f70ec697713cbafc53c65"},{url:"/img/networks/celo-network.jpg",revision:"b0c2f695de8497f3b331d7e268dd7bef"},{url:"/img/networks/ethereum-net.png",revision:"1630a7dd248a2dad3b89b526734d98cc"},{url:"/img/networks/fantom-network.jpg",revision:"b38c2308780b7cda16b72ad9ab67918a"},{url:"/img/networks/goerli-network.jpg",revision:"bfa3e8c83bbdd0b018a2af55904e85b0"},{url:"/img/networks/harmonyone-network.jpg",revision:"55abcda6471ba41f172a35dd9d65800d"},{url:"/img/networks/heco-network.jpg",revision:"624c6a297d927a977c6e4c8baae35705"},{url:"/img/networks/kovan-network.jpg",revision:"8eeea938b6b6e7740a072be055eb12a9"},{url:"/img/networks/mainnet-network.jpg",revision:"97195efc5b2a70b8c0a8755838f9bb1c"},{url:"/img/networks/matic-network.jpg",revision:"6f2764a8b0d4d876fafc4280852ba685"},{url:"/img/networks/metis-network.jpg",revision:"30970008bdc9b16ef938ec63d8a718c8"},{url:"/img/networks/moonbeam-network.jpg",revision:"18a53ab891fd339e5c0f53cba5ac5db1"},{url:"/img/networks/okex-network.jpg",revision:"ddbf0a958858042a11255cc62929fc37"},{url:"/img/networks/polygon-net.png",revision:"3f9aa7e51824fef67c0d42add1e95408"},{url:"/img/networks/polygon-network.jpg",revision:"f35785eb02bc3ef30f10a5ca88e687a9"},{url:"/img/networks/rinkeby-network.jpg",revision:"d7aecb9c343c81ec5d67ad06296b8d16"},{url:"/img/networks/ropsten-network.jpg",revision:"fc75a1a8c3ff4f9791f20bb05603c445"},{url:"/img/networks/shibuya-network.jpg",revision:"159f8e7a95e6c97bd6f50d47254b5e94"},{url:"/img/networks/shiden-network.jpg",revision:"466c328b0eeb5a78700bea1b2ad51479"},{url:"/img/networks/xdai-network.jpg",revision:"37ebe0774e6ccc2ed55b2ae2e358c02c"},{url:"/img/socials/discord.svg",revision:"faf87a729bb72e4fb2c6ef7aeef2e604"},{url:"/img/socials/medium.svg",revision:"e632870d4eb4f7bfd6d4d58ef22f6e8b"},{url:"/img/socials/telegram.svg",revision:"6787d91cb133a0ed1d5ec104c3ad4b80"},{url:"/img/socials/twitter.svg",revision:"1daaeb4788d9dc5c24b2a0a3f43551e9"},{url:"/img/wallets/bsc.jpg",revision:"c234e4b9693f70ec697713cbafc53c65"},{url:"/img/wallets/clover.svg",revision:"72dcb81a510cb82de452033213833c63"},{url:"/img/wallets/coinbase.svg",revision:"62578f5994645a1825d4829e2c4394b0"},{url:"/img/wallets/fortmatic.png",revision:"11562b35c593bdff062d22994aa93db7"},{url:"/img/wallets/injected.svg",revision:"d285b6cf22b4f1552bb4009333462632"},{url:"/img/wallets/keystone.png",revision:"a422aaf1212f68f2f0273f2bf00c5ca4"},{url:"/img/wallets/lattice.png",revision:"3101eb1ee2d95b6cdc32c6ec960c80e4"},{url:"/img/wallets/metamask.png",revision:"023762b6aec2a2249b8fdfb638f00ef3"},{url:"/img/wallets/portis.png",revision:"b234b2bfa0417c7e8711c3a8d17afeec"},{url:"/img/wallets/torus.png",revision:"9877cd978dfe022be2ffea8dd28f9ee7"},{url:"/img/wallets/wallet-connect.svg",revision:"8215855c185176eb79446ce8cc1f3998"},{url:"/img/waves.png",revision:"89994692bd9c961e3175234fcf03714f"},{url:"/logo.png",revision:"f352e1662738b2a0af2c754f8c310815"},{url:"/manifest.json",revision:"cd9abde91a309fd94641ef0d82d939b7"},{url:"/mstile-150x150.png",revision:"2a3d4ba9395df3e70f329ddd47ec4987"},{url:"/robots.txt",revision:"6fdd2233660143b0afffb6def6e20bef"},{url:"/safari-pinned-tab.svg",revision:"ace5d937716500aa792618ab2b5f4938"},{url:"/site.webmanifest",revision:"b3163846e52556f760e03b240d92589d"},{url:"/sitemap-0.xml",revision:"ffae33729e76da448e864c203bd753ab"},{url:"/sitemap.xml",revision:"4bfb5f25acbde62dfbb291e79aa3a4f5"},{url:"/splashscreens/ipad_splash.png",revision:"d87e45e17332e127588fece76ccef486"},{url:"/splashscreens/ipadpro1_splash.png",revision:"7499ec357761309e132157cb75b93e0b"},{url:"/splashscreens/ipadpro2_splash.png",revision:"c906e774c820bb2c59f266abd47f56a3"},{url:"/splashscreens/ipadpro3_splash.png",revision:"81f894833a69eeb30978ab76befce374"},{url:"/splashscreens/iphone5_splash.png",revision:"acfb3fe53f8e82944a39337125132800"},{url:"/splashscreens/iphone6_splash.png",revision:"426feb14e5aa1d4e9dad7bb1c52a6d96"},{url:"/splashscreens/iphoneplus_splash.png",revision:"c4b9f8b8aa6f59013c2a47d973b2823b"},{url:"/splashscreens/iphonex_splash.png",revision:"89af21b70a1a5a102a6fd01e64bc1fe8"},{url:"/splashscreens/iphonexr_splash.png",revision:"3bb19c58c7e6849356852743282001ad"},{url:"/splashscreens/iphonexsmax_splash.png",revision:"72b42a6c816b295181df2a599167cadd"}],{ignoreURLParametersMatching:[]}),e.cleanupOutdatedCaches(),e.registerRoute("/",new e.NetworkFirst({cacheName:"start-url",plugins:[{cacheWillUpdate:async({request:e,response:s,event:i,state:n})=>s&&"opaqueredirect"===s.type?new Response(s.body,{status:200,statusText:"OK",headers:s.headers}):s}]}),"GET"),e.registerRoute(/^https:\/\/fonts\.(?:gstatic)\.com\/.*/i,new e.CacheFirst({cacheName:"google-fonts-webfonts",plugins:[new e.ExpirationPlugin({maxEntries:4,maxAgeSeconds:31536e3})]}),"GET"),e.registerRoute(/^https:\/\/fonts\.(?:googleapis)\.com\/.*/i,new e.StaleWhileRevalidate({cacheName:"google-fonts-stylesheets",plugins:[new e.ExpirationPlugin({maxEntries:4,maxAgeSeconds:604800})]}),"GET"),e.registerRoute(/\.(?:eot|otf|ttc|ttf|woff|woff2|font.css)$/i,new e.StaleWhileRevalidate({cacheName:"static-font-assets",plugins:[new e.ExpirationPlugin({maxEntries:4,maxAgeSeconds:604800})]}),"GET"),e.registerRoute(/\.(?:jpg|jpeg|gif|png|svg|ico|webp)$/i,new e.StaleWhileRevalidate({cacheName:"static-image-assets",plugins:[new e.ExpirationPlugin({maxEntries:64,maxAgeSeconds:86400})]}),"GET"),e.registerRoute(/\/_next\/image\?url=.+$/i,new e.StaleWhileRevalidate({cacheName:"next-image",plugins:[new e.ExpirationPlugin({maxEntries:64,maxAgeSeconds:86400})]}),"GET"),e.registerRoute(/\.(?:mp3|wav|ogg)$/i,new e.CacheFirst({cacheName:"static-audio-assets",plugins:[new e.RangeRequestsPlugin,new e.ExpirationPlugin({maxEntries:32,maxAgeSeconds:86400})]}),"GET"),e.registerRoute(/\.(?:mp4)$/i,new e.CacheFirst({cacheName:"static-video-assets",plugins:[new e.RangeRequestsPlugin,new e.ExpirationPlugin({maxEntries:32,maxAgeSeconds:86400})]}),"GET"),e.registerRoute(/\.(?:js)$/i,new e.StaleWhileRevalidate({cacheName:"static-js-assets",plugins:[new e.ExpirationPlugin({maxEntries:32,maxAgeSeconds:86400})]}),"GET"),e.registerRoute(/\.(?:css|less)$/i,new e.StaleWhileRevalidate({cacheName:"static-style-assets",plugins:[new e.ExpirationPlugin({maxEntries:32,maxAgeSeconds:86400})]}),"GET"),e.registerRoute(/\/_next\/data\/.+\/.+\.json$/i,new e.StaleWhileRevalidate({cacheName:"next-data",plugins:[new e.ExpirationPlugin({maxEntries:32,maxAgeSeconds:86400})]}),"GET"),e.registerRoute(/\.(?:json|xml|csv)$/i,new e.NetworkFirst({cacheName:"static-data-assets",plugins:[new e.ExpirationPlugin({maxEntries:32,maxAgeSeconds:86400})]}),"GET"),e.registerRoute((({url:e})=>{if(!(self.origin===e.origin))return!1;const s=e.pathname;return!s.startsWith("/api/auth/")&&!!s.startsWith("/api/")}),new e.NetworkFirst({cacheName:"apis",networkTimeoutSeconds:10,plugins:[new e.ExpirationPlugin({maxEntries:16,maxAgeSeconds:86400})]}),"GET"),e.registerRoute((({url:e})=>{if(!(self.origin===e.origin))return!1;return!e.pathname.startsWith("/api/")}),new e.NetworkFirst({cacheName:"others",networkTimeoutSeconds:10,plugins:[new e.ExpirationPlugin({maxEntries:32,maxAgeSeconds:86400})]}),"GET"),e.registerRoute((({url:e})=>!(self.origin===e.origin)),new e.NetworkFirst({cacheName:"cross-origin",networkTimeoutSeconds:10,plugins:[new e.ExpirationPlugin({maxEntries:32,maxAgeSeconds:3600})]}),"GET")}));
