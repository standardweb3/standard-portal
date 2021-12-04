import { formatSwapTokenList, getLocalRPC } from './methods';
import { tokenListUrl, VERSION, USE_VERSION } from '../constant';
import { ChainId } from '@digitalnative/standard-protocol-sdk';

export const AVAX_MAIN_CHAINID = 43114;
export const AVAX_MAINNET = 'https://api.avax.network/ext/bc/C/rpc';
export const AVAX_MAIN_EXPLORER = 'https://avascan.info/blockchain/c';

export const tokenList = [];

const symbol = 'AVAX';

const bridgeToken = {
  [VERSION.V1]: {
    bridgeInitToken: '',
    bridgeInitChain: '',
  },
  [VERSION.V1_1]: {
    bridgeInitToken: '0x165dbb08de0476271714952c3c1f068693bd60d7',
    bridgeInitChain: '56',
    nativeToken: '',
  },
  [VERSION.V5]: {
    bridgeInitToken: '0xa7d7079b0fead91f3e65f86e8915cb59c1a4c664',
    bridgeInitChain: '56',
    bridgeInitTokens: {
      [ChainId.BSC]: '0xa7d7079b0fead91f3e65f86e8915cb59c1a4c664',
      [ChainId.MAINNET]: '0xa7d7079b0fead91f3e65f86e8915cb59c1a4c664',
      [ChainId.MATIC]: '0xa7d7079b0fead91f3e65f86e8915cb59c1a4c664',
      [ChainId.SHIDEN]: '',
    },
    nativeToken: '',
    crossBridgeInitChain: '56',
    crossBridgeInitToken: '0xb44a9b6905af7c801311e8f4e76932ee959c663c',
    crossBridgeInitTokens: {
      [ChainId.MAINNET]: '0xfa9343c3897324496a05fc75abed6bac29f8a40f',
      [ChainId.BSC]: '0x264c1383ea520f73dd837f915ef3a732e204a493',
      [ChainId.MATIC]: '',
      [ChainId.SHIDEN]: '',
    },
  },
};

export default {
  [AVAX_MAIN_CHAINID]: {
    tokenListUrl: tokenListUrl + AVAX_MAIN_CHAINID,
    tokenList: formatSwapTokenList(symbol, tokenList),
    ...bridgeToken[USE_VERSION],
    swapRouterToken: '',
    swapInitToken: '',
    multicalToken: '0xd8e95abcce8901cc2640d2ff4444c85506fb829d',
    v1FactoryToken: '',
    v2FactoryToken: '',
    timelock: '',
    nodeRpc: AVAX_MAINNET,
    nodeRpcList: [AVAX_MAINNET],
    chainID: AVAX_MAIN_CHAINID,
    lookHash: AVAX_MAIN_EXPLORER + '/tx/',
    lookAddr: AVAX_MAIN_EXPLORER + '/address/',
    lookBlock: AVAX_MAIN_EXPLORER + '/block/',
    explorer: AVAX_MAIN_EXPLORER,
    symbol: symbol,
    name: 'Avalanche',
    networkName: 'AVAX mainnet',
    type: 'main',
    label: AVAX_MAIN_CHAINID,
    isSwitch: 1,
    suffix: 'AVAX',
    anyToken: '0xb44a9b6905af7c801311e8f4e76932ee959c663c',
  },
};
