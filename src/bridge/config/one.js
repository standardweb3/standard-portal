import { formatSwapTokenList, getLocalRPC } from './methods';
import { tokenListUrl, VERSION, USE_VERSION } from '../constant';

export const ONE_MAIN_CHAINID = 1666600000;
export const ONE_MAINNET = 'https://api.harmony.one';
export const ONE_MAIN_EXPLORER = 'https://explorer.harmony.one/#';

export const tokenList = [];
export const testTokenList = [];

const symbol = 'ONE';

const bridgeToken = {
  [VERSION.V1]: {
    bridgeInitToken: '',
    bridgeInitChain: '',
  },
  [VERSION.V5]: {
    bridgeInitToken: '',
    bridgeInitChain: '56',
    nativeToken: '',
    crossBridgeInitToken: '0x2bf9b864cdc97b08b6d79ad4663e71b8ab65c45c',
  },
};

export default {
  [ONE_MAIN_CHAINID]: {
    tokenListUrl: tokenListUrl + ONE_MAIN_CHAINID,
    tokenList: formatSwapTokenList(symbol, tokenList),
    ...bridgeToken[USE_VERSION],
    swapRouterToken: '',
    swapInitToken: '',
    // multicalToken: '0xB44a9B6905aF7c801311e8F4E76932ee959c663C',
    multicalToken: '0xdDCbf776dF3dE60163066A5ddDF2277cB445E0F3',
    v1FactoryToken: '',
    v2FactoryToken: '',
    timelock: '',
    nodeRpc: ONE_MAINNET,
    nodeRpcList: [ONE_MAINNET],
    chainID: ONE_MAIN_CHAINID,
    lookHash: ONE_MAIN_EXPLORER + '/tx/',
    lookAddr: ONE_MAIN_EXPLORER + '/address/',
    lookBlock: ONE_MAIN_EXPLORER + '/block/',
    explorer: ONE_MAIN_EXPLORER,
    symbol: symbol,
    name: 'Harmony',
    networkName: 'ONE mainnet',
    type: 'main',
    label: ONE_MAIN_CHAINID,
    isSwitch: 1,
    suffix: '',
    anyToken: '',
  },
};
