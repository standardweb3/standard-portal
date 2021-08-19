import { ChainId } from '@sushiswap/sdk';

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
// const Palm =
// 'https://raw.githubusercontent.com/sushiswap/icons/master/network/palm.jpg';

export const NETWORK_ICON = {
  [ChainId.MAINNET]: Mainnet,
  [ChainId.ROPSTEN]: Ropsten,
  [ChainId.RINKEBY]: Rinkeby,
  [ChainId.GÖRLI]: Goerli,
  [ChainId.KOVAN]: Kovan,
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
