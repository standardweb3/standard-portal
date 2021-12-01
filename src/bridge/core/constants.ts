import { ChainId } from '@digitalnative/standard-protocol-sdk';
export const baseURL = 'https://bridgeapi.anyswap.exchange';
export const chainToChainUrl = baseURL + '/v2/allserverinfo';
export const toChainUrl = baseURL + '/v2/tokenlist';
export const dislineUrl = baseURL + '/v2/disline';
export const swapinStatusUrl = baseURL + '/v2/getHashStatus';
export const swapoutStatusUrl = baseURL + '/v2/getWithdrawHashStatus';
export const bridgeInfoUrl = baseURL + '/v2/serverInfo';
export const chainInfoUrl = baseURL + '/data/bridgeChainInfo';
export const routerInfoUrl = baseURL + '/v3/serverinfoV4';
export const recordsTxnsUrl = baseURL + '/v3/records';

export const routerVersion = 'STABLEV3';

export const timeout = 1000 * 60 * 30;

export const LOCAL_DATA_LABEL = 'ANYSWAP-BRIDGE-SDK-V1-';

export const specSymbol = ['BTC', 'LTC', 'BLOCK', 'COLX', 'TRX', 'TERRA'];
// 2 choices:
// bridge with new connection like solarbeam
// bridge with integrated connection

export const BRIDGE_RPCS = {
  [ChainId.MAINNET]: 'https://ethmainnet.anyswap.exchange',
  [ChainId.BSC]: 'https://bsc-dataseed1.ninicoin.io/',
  [ChainId.OKEX]: 'https://exchainrpc.okex.org',
  [ChainId.XDAI]: 'https://rpc.xdaichain.com',
  [ChainId.HECO]: 'https://http-mainnet.hecochain.com',
  [ChainId.MATIC]: 'https://rpc-mainnet.maticvigil.com',
  [ChainId.FANTOM]: 'https://rpcapi.fantom.network',
  // [ChainId.KCC]: 'https://rpc-mainnet.kcc.network',
  // [ChainId.FSNMAIN]: 'https://mainnet.anyswap.exchange',
  [ChainId.AVALANCHE]: 'https://api.avax.network/ext/bc/C/rpc',
  [ChainId.HARMONY]: 'https://api.harmony.one',
  // [ChainId.BTC]: '',
  // [ChainId.LTC]: '',
  // [ChainId.BLOCK]: '',
  // [ChainId.TRX]: '',
  // [ChainId.COLX]: '',
  [ChainId.RINKEBY]:
    'https://rinkeby.infura.io/v3/0e40cfd5e7a64b2d9aea8427e4bd52a0',
  // [ChainId.BNBTEST]: 'https://data-seed-prebsc-1-s1.binance.org:8545',
  // [ChainId.HTTEST]: 'https://http-testnet.hecochain.com',
  // [ChainId.FSNTEST]: 'https://testnet.fsn.dev/api',
};

export enum Status {
  Success = 'Success',
  Pending = 'Pending',
  Error = 'Error',
  Failure = 'Failure',
  Confirming = 'Confirming',
  Minting = 'Minting',
  Timeout = 'Timeout',
}

export enum VERSION {
  V1 = 'UNDERLYING',
  V1_1 = 'UNDERLYINGV2',
  V2 = 'STABLE',
  V2_1 = 'STABLEV2',
  V2_2 = 'STABLEV3',
  V2_T1 = 'STABLE_TEST',
  V2_T2 = 'TEST',
  V2_T3 = 'TESTV2',
  V3 = 'ARB_DEV',
  V3_1 = 'ARB',
  V4 = 'BRIDGE',
  V4_OKT = 'BRIDGE_OKT',
  V4_MOVR = 'BRIDGE_MOVR',
  V5 = 'ALL',
  V6 = 'NFT_TEST',
  V6_1 = 'NFT',
  V7 = 'SOURCE_CHAIN',
}

export const ROUTER_VERSION = 'all';

export function getRouterUrl(chainId: ChainId) {
  return `${routerInfoUrl}?chainId=${chainId}&version=${ROUTER_VERSION}`;
}
