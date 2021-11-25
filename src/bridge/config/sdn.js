import { formatSwapTokenList } from './methods';
import { tokenListUrl, VERSION, USE_VERSION } from '../constant';
import { ChainId } from '@digitalnative/standard-protocol-sdk';

export const SDN_MAIN_CHAINID = 336;
export const SDN_MAINNET = 'https://rpc.shiden.astar.network:8545';
export const SDN_MAIN_EXPLORER = 'https://shiden.subscan.io';

export const tokenList = [];
export const testTokenList = [];

const symbol = 'SDN';

const bridgeToken = {
  [VERSION.V1]: {
    bridgeInitToken: '',
    bridgeInitChain: '',
  },
  [VERSION.V5]: {
    bridgeInitToken: '0x722377a047e89ca735f09eb7cccab780943c4cb4',
    bridgeInitChain: '1',
    bridgeInitTokens: {
      [ChainId.BSC]: '',
      [ChainId.MAINNET]: '0x722377a047e89ca735f09eb7cccab780943c4cb4',
      [ChainId.MATIC]: '',
    },
    nativeToken: '',
    crossBridgeInitToken: '',
    crossBridgeInitChain: '56',
    crossBridgeInitTokens: {
      [ChainId.BSC]: 'BNB',
      [ChainId.MAINNET]: 'SDN',
      [ChainId.MATIC]: '',
    },
  },
};

export default {
  [SDN_MAIN_CHAINID]: {
    tokenListUrl: tokenListUrl + SDN_MAIN_CHAINID,
    tokenList: formatSwapTokenList(symbol, tokenList),
    ...bridgeToken[USE_VERSION],
    swapRouterToken: '',
    swapInitToken: '',
    multicalToken: '0xEba098A16d6092B66608A14A3f53A984186266e7',
    v1FactoryToken: '',
    v2FactoryToken: '',
    timelock: '',
    nodeRpc: SDN_MAINNET,
    nodeRpcList: [
      SDN_MAINNET,
      'https://shiden.api.onfinality.io/rpc?apikey=d5da52f9-c548-4d48-8a7b-2ebb4d5d8959',
    ],
    chainID: SDN_MAIN_CHAINID,
    lookHash: SDN_MAIN_EXPLORER + '/tx/',
    lookAddr: SDN_MAIN_EXPLORER + '/address/',
    lookBlock: SDN_MAIN_EXPLORER + '/block/',
    explorer: SDN_MAIN_EXPLORER,
    symbol: symbol,
    name: 'Shiden Network',
    networkName: 'SDN mainnet',
    type: 'main',
    label: SDN_MAIN_CHAINID,
    isSwitch: 1,
    suffix: 'SDN',
    anyToken: '',
  },
};
