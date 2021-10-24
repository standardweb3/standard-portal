import { ChainId } from '@digitalnative/standard-protocol-sdk';
import { request } from 'http';
import { GRAPH_HOST } from '../constants';

export const CANDLES = {
  //   [ChainId.MAINNET]: 'sushiswap/exchange',
  //   [ChainId.KOVAN]: 'digitalnative/standardprotocol',
  [ChainId.RINKEBY]: 'billjhlee/rinkeby-exchange-candles',
  [ChainId.SHIBUYA]: 'digitalnativeinc/shibuya-exchange',
  //   [ChainId.XDAI]: 'sushiswap/xdai-exchange',
  //   [ChainId.MATIC]: 'sushiswap/matic-exchange',
  //   [ChainId.FANTOM]: 'sushiswap/fantom-exchange',
  //   [ChainId.BSC]: 'sushiswap/bsc-exchange',
  //   [ChainId.HARMONY]: 'sushiswap/harmony-exchange',
  //   [ChainId.OKEX]: 'sushiswap/okex-exchange',
  //   [ChainId.AVALANCHE]: 'sushiswap/avalanche-exchange',
  //   [ChainId.CELO]: 'sushiswap/celo-exchange',
};

export const candles = async (chainId = ChainId.MAINNET, query, variables) => {
  request(
    `${GRAPH_HOST[chainId]}/subgraphs/name/${CANDLES[chainId]}`,
    query,
    variables,
  );
};
