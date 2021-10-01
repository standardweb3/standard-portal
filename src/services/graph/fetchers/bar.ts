import { ChainId } from '@digitalnative/standard-protocol-sdk-test';
import { GRAPH_HOST } from '../constants';
import { request } from 'graphql-request';

const BAR = {
  [ChainId.MAINNET]: 'matthewlilley/bar',
};

export const bar = async (query, chainId = ChainId.MAINNET) =>
  request(`https://api.thegraph.com/subgraphs/name/${BAR[chainId]}`, query);
