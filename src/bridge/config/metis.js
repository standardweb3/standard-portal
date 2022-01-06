import { formatSwapTokenList } from './methods';
import { tokenListUrl, VERSION, USE_VERSION } from '../constant';
import { ChainId } from '@digitalnative/standard-protocol-sdk';

export const METIS_MAIN_CHAINID = 1088;
export const METIS_MAINNET = 'https://andromeda.metis.io/?owner=1088';
export const METIS_MAIN_EXPLORER = 'https://andromeda-explorer.metis.io';

export const tokenList = [];
export const testTokenList = [];

const symbol = 'METIS';

const bridgeToken = {
  [VERSION.V1]: {
    bridgeInitToken: '',
    bridgeInitChain: '',
  },
  [VERSION.V5]: {
    bridgeInitToken: '0xc12cac7090baa48ec750cceec57c80768f6ee58e',
    bridgeInitChain: '1',
    bridgeInitTokens: {
      [ChainId.MAINNET]: '0xc12cac7090baa48ec750cceec57c80768f6ee58e',
      [ChainId.SHIDEN]: '0xc12cac7090baa48ec750cceec57c80768f6ee58e',
      [ChainId.MATIC]: '0xb44a9b6905af7c801311e8f4e76932ee959c663c',
      [ChainId.BSC]: '0xe3f5a90f9cb311505cd691a46596599aa1a0ad7d',
    },
    nativeToken: '',
    crossBridgeInitChain: '1',
    crossBridgeInitToken: '',
    crossBridgeInitTokens: {
      [ChainId.MAINNET]: '',
      [ChainId.SHIDEN]: '',
      [ChainId.MATIC]: '',
      [ChainId.BSC]: '',
    },
  },
  [VERSION.V7]: {
    bridgeInitToken: '',
    bridgeInitChain: '1',
    nativeToken: '',
    crossBridgeInitToken: '',
  },
};

export default {
  [METIS_MAIN_CHAINID]: {
    tokenListUrl: tokenListUrl + METIS_MAIN_CHAINID,
    tokenList: formatSwapTokenList(symbol, tokenList),
    ...bridgeToken[USE_VERSION],
    swapRouterToken: '',
    swapInitToken: '',
    multicalToken: '0x7C598c96D02398d89FbCb9d41Eab3DF0C16F227D',
    v1FactoryToken: '',
    v2FactoryToken: '',
    timelock: '',
    nodeRpc: METIS_MAINNET,
    nodeRpcList: [METIS_MAINNET],
    chainID: METIS_MAIN_CHAINID,
    lookHash: METIS_MAIN_EXPLORER + '/transaction/',
    lookAddr: METIS_MAIN_EXPLORER + '/address/',
    lookBlock: METIS_MAIN_EXPLORER + '/block/',
    explorer: METIS_MAIN_EXPLORER,
    symbol: symbol,
    name: 'Metis',
    networkName: 'METIS mainnet',
    type: 'main',
    label: METIS_MAIN_CHAINID,
    isSwitch: 1,
    suffix: 'METIS',
    anyToken: '',
  },
};
