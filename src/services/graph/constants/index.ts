import { ChainId } from '@digitalnative/standard-protocol-sdk';
const THE_GRAPH = 'https://api.thegraph.com';

export const GRAPH_HOST = {
  [ChainId.MAINNET]: THE_GRAPH,
  [ChainId.KOVAN]: 'http://127.0.0.1:8000',
  [ChainId.SHIBUYA]: 'https://graph.shibuya.standardtech.xyz',
  [ChainId.SHIDEN]: 'https://graph.shiden.standardtech.xyz',
  [ChainId.RINKEBY]: THE_GRAPH,
  [ChainId.XDAI]: THE_GRAPH,
  [ChainId.MATIC]: THE_GRAPH,
  [ChainId.FANTOM]: THE_GRAPH,
  [ChainId.BSC]: THE_GRAPH,
  [ChainId.AVALANCHE]: THE_GRAPH,
  [ChainId.CELO]: THE_GRAPH,
  [ChainId.HARMONY]: 'https://sushi.graph.t.hmny.io',
  [ChainId.OKEX]: 'https://graph.kkt.one/node',
  [ChainId.METIS]: '',
};
