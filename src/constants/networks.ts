import { ChainId } from '@digitalnative/standard-protocol-sdk';

const Arbitrum = '/img/networks/arbitrum-network.jpg';
const Avalanche = '/img/networks/avalanche-network.jpg';
const Bsc = '/img/networks/bsc-network.jpg';
const Fantom = '/img/networks/fantom-network.jpg';
const Goerli = '/img/networks/goerli-network.jpg';
const Harmony = '/img/networks/harmonyone-network.jpg';
const Heco = '/img/networks/heco-network.jpg';
const Kovan = '/img/networks/kovan-network.jpg';
const Mainnet = '/img/networks/ethereum-net.png';
const Matic = '/img/networks/matic-network.jpg';
const Moonbeam = '/img/networks/moonbeam-network.jpg';
const OKEx = '/img/networks/okex-network.jpg';
const Polygon = '/img/networks/polygon-net.png';
const Rinkeby = '/img/networks/rinkeby-network.jpg';
const Ropsten = '/img/networks/ropsten-network.jpg';
const xDai = '/img/networks/xdai-network.jpg';
const Celo = '/img/networks/celo-network.jpg';
const Shibuya = '/img/networks/shibuya-network.jpg';
const Shiden = '/img/networks/shiden-network.jpg';

// const Palm =
// 'https://raw.githubusercontent.com/sushiswap/icons/master/network/palm.jpg';

export const NETWORK_ICON = {
  [ChainId.MAINNET]: Mainnet,
  [ChainId.ROPSTEN]: Ropsten,
  [ChainId.RINKEBY]: Rinkeby,
  [ChainId.GÖRLI]: Goerli,
  [ChainId.KOVAN]: Kovan,
  [ChainId.SHIBUYA]: Shibuya,
  [ChainId.SHIDEN]: Shiden,
  [ChainId.FANTOM]: Fantom,
  [ChainId.FANTOM_TESTNET]: Fantom,
  [ChainId.BSC]: Bsc,
  [ChainId.BSC_TESTNET]: Bsc,
  [ChainId.MATIC]: Polygon,
  [ChainId.MATIC_TESTNET]: Matic,
  [ChainId.XDAI]: xDai,
  [ChainId.ARBITRUM]: Arbitrum,
  [ChainId.ARBITRUM_TESTNET]: Arbitrum,
  [ChainId.MOONBEAM_TESTNET]: Moonbeam,
  [ChainId.AVALANCHE]: Avalanche,
  [ChainId.AVALANCHE_TESTNET]: Avalanche,
  [ChainId.HECO]: Heco,
  [ChainId.HECO_TESTNET]: Heco,
  [ChainId.HARMONY]: Harmony,
  [ChainId.HARMONY_TESTNET]: Harmony,
  [ChainId.OKEX]: OKEx,
  [ChainId.OKEX_TESTNET]: OKEx,
  [ChainId.CELO]: Celo,
  // [ChainId.PALM]: Palm,
};

export const NETWORK_LABEL: { [chainId in ChainId]?: string } = {
  [ChainId.MAINNET]: 'Ethereum',
  [ChainId.RINKEBY]: 'Rinkeby',
  [ChainId.ROPSTEN]: 'Ropsten',
  [ChainId.GÖRLI]: 'Görli',
  [ChainId.KOVAN]: 'Kovan',
  [ChainId.SHIBUYA]: 'Shibuya',
  [ChainId.SHIDEN]: 'Shiden',
  [ChainId.FANTOM]: 'Fantom',
  [ChainId.FANTOM_TESTNET]: 'Fantom Testnet',
  [ChainId.MATIC]: 'Polygon (Matic)',
  [ChainId.MATIC_TESTNET]: 'Matic Testnet',
  [ChainId.XDAI]: 'xDai',
  [ChainId.ARBITRUM]: 'Arbitrum',
  [ChainId.ARBITRUM_TESTNET]: 'Arbitrum Testnet',
  [ChainId.BSC]: 'BSC',
  [ChainId.BSC_TESTNET]: 'BSC Testnet',
  [ChainId.MOONBEAM_TESTNET]: 'Moonbase',
  [ChainId.AVALANCHE]: 'Avalanche',
  [ChainId.AVALANCHE_TESTNET]: 'Fuji',
  [ChainId.HECO]: 'HECO',
  [ChainId.HECO_TESTNET]: 'HECO Testnet',
  [ChainId.HARMONY]: 'Harmony',
  [ChainId.HARMONY_TESTNET]: 'Harmony Testnet',
  [ChainId.OKEX]: 'OKEx',
  [ChainId.OKEX_TESTNET]: 'OKEx',
  [ChainId.CELO]: 'Celo',
  // [ChainId.PALM]: 'Palm',
};

export const NORMAL_GUARDED_CHAINS = [ChainId.MAINNET, ChainId.SHIDEN];

export const SUPPORTED_NETWORKS: {
  [chainId in ChainId]?: {
    chainId: string;
    chainName: string;
    nativeCurrency: {
      name: string;
      symbol: string;
      decimals: number;
    };
    rpcUrls: string[];
    blockExplorerUrls: string[];
  };
} = {
  [ChainId.MAINNET]: {
    chainId: '0x1',
    chainName: 'Ethereum',
    nativeCurrency: {
      name: 'Ethereum',
      symbol: 'ETH',
      decimals: 18,
    },
    rpcUrls: ['https://mainnet.infura.io/v3'],
    blockExplorerUrls: ['https://etherscan.com'],
  },
  [ChainId.SHIDEN]: {
    chainId: '0x150',
    chainName: 'Shiden',
    nativeCurrency: {
      name: 'Shiden',
      symbol: 'SDN',
      decimals: 18,
    },
    rpcUrls: ['https://rpc.shiden.astar.network:8545'],
    blockExplorerUrls: ['https://blockscout.com/shiden'],
  },
  // [ChainId.RINKEBY]: {
  //   chainId: '0x4',
  //   chainName: 'Rinkeby',
  //   nativeCurrency: {
  //     name: 'Ethereum',
  //     symbol: 'ETH',
  //     decimals: 18,
  //   },
  //   rpcUrls: ['https://rinkeby.infura.io/v3'],
  //   blockExplorerUrls: ['https://rinkeby.etherscan.io'],
  // },
  // [ChainId.SHIBUYA]: {
  //   chainId: '0x51',
  //   chainName: 'Shibuya',
  //   nativeCurrency: {
  //     name: 'Shibuya',
  //     symbol: 'SBY',
  //     decimals: 18,
  //   },
  //   rpcUrls: ['https://rpc.shibuya.astar.network:8545'],
  //   blockExplorerUrls: ['https://shibuya.subscan.io'],
  // },
  // [ChainId.FANTOM]: {
  //   chainId: '0xfa',
  //   chainName: 'Fantom',
  //   nativeCurrency: {
  //     name: 'Fantom',
  //     symbol: 'FTM',
  //     decimals: 18,
  //   },
  //   rpcUrls: ['https://rpcapi.fantom.network'],
  //   blockExplorerUrls: ['https://ftmscan.com'],
  // },
  // [ChainId.BSC]: {
  //   chainId: '0x38',
  //   chainName: 'Binance Smart Chain',
  //   nativeCurrency: {
  //     name: 'Binance Coin',
  //     symbol: 'BNB',
  //     decimals: 18,
  //   },
  //   rpcUrls: ['https://bsc-dataseed.binance.org'],
  //   blockExplorerUrls: ['https://bscscan.com'],
  // },
  // [ChainId.MATIC]: {
  //   chainId: '0x89',
  //   chainName: 'Matic',
  //   nativeCurrency: {
  //     name: 'Matic',
  //     symbol: 'MATIC',
  //     decimals: 18,
  //   },
  //   rpcUrls: ['https://rpc-mainnet.maticvigil.com'], // ['https://matic-mainnet.chainstacklabs.com/'],
  //   blockExplorerUrls: ['https://explorer-mainnet.maticvigil.com'],
  // },
  // [ChainId.HECO]: {
  //   chainId: '0x80',
  //   chainName: 'Heco',
  //   nativeCurrency: {
  //     name: 'Heco Token',
  //     symbol: 'HT',
  //     decimals: 18,
  //   },
  //   rpcUrls: ['https://http-mainnet.hecochain.com'],
  //   blockExplorerUrls: ['https://hecoinfo.com'],
  // },
  // [ChainId.XDAI]: {
  //   chainId: '0x64',
  //   chainName: 'xDai',
  //   nativeCurrency: {
  //     name: 'xDai Token',
  //     symbol: 'xDai',
  //     decimals: 18,
  //   },
  //   rpcUrls: ['https://rpc.xdaichain.com'],
  //   blockExplorerUrls: ['https://blockscout.com/poa/xdai'],
  // },
  // [ChainId.HARMONY]: {
  //   chainId: '0x63564C40',
  //   chainName: 'Harmony',
  //   nativeCurrency: {
  //     name: 'One Token',
  //     symbol: 'ONE',
  //     decimals: 18,
  //   },
  //   rpcUrls: [
  //     'https://api.harmony.one',
  //     'https://s1.api.harmony.one',
  //     'https://s2.api.harmony.one',
  //     'https://s3.api.harmony.one',
  //   ],
  //   blockExplorerUrls: ['https://explorer.harmony.one/'],
  // },
  // [ChainId.AVALANCHE]: {
  //   chainId: '0xA86A',
  //   chainName: 'Avalanche',
  //   nativeCurrency: {
  //     name: 'Avalanche Token',
  //     symbol: 'AVAX',
  //     decimals: 18,
  //   },
  //   rpcUrls: ['https://api.avax.network/ext/bc/C/rpc'],
  //   blockExplorerUrls: ['https://cchain.explorer.avax.network'],
  // },
  // [ChainId.OKEX]: {
  //   chainId: '0x42',
  //   chainName: 'OKEx',
  //   nativeCurrency: {
  //     name: 'OKEx Token',
  //     symbol: 'OKT',
  //     decimals: 18,
  //   },
  //   rpcUrls: ['https://exchainrpc.okex.org'],
  //   blockExplorerUrls: ['https://www.oklink.com/okexchain'],
  // },
  // [ChainId.ARBITRUM]: {
  //   chainId: '0xA4B1',
  //   chainName: 'Arbitrum',
  //   nativeCurrency: {
  //     name: 'Ethereum',
  //     symbol: 'ETH',
  //     decimals: 18,
  //   },
  //   rpcUrls: ['https://arb1.arbitrum.io/rpc'],
  //   blockExplorerUrls: ['https://mainnet-arb-explorer.netlify.app'],
  // },
  // [ChainId.CELO]: {
  //   chainId: '0xA4EC',
  //   chainName: 'Celo',
  //   nativeCurrency: {
  //     name: 'Celo',
  //     symbol: 'CELO',
  //     decimals: 18,
  //   },
  //   rpcUrls: ['https://forno.celo.org'],
  //   blockExplorerUrls: ['https://explorer.celo.org'],
  // },
  // [ChainId.PALM]: {
  //   chainId: '0x2A15C308D',
  //   chainName: 'Palm',
  //   nativeCurrency: {
  //     name: 'Palm',
  //     symbol: 'PALM',
  //     decimals: 18,
  //   },
  //   rpcUrls: [
  //     'https://palm-mainnet.infura.io/v3/da5fbfafcca14b109e2665290681e267',
  //   ],
  //   blockExplorerUrls: ['https://explorer.palm.io'],
  // },
};

export const SUPPORTED_NETWORK_IDS = Object.keys(
  SUPPORTED_NETWORKS,
).map((key) => parseInt(key));
