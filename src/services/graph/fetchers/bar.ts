import { ChainId } from '@digitalnative/standard-protocol-sdk';
import { request } from 'graphql-request';
import { GRAPH_HOST } from '../constants';
import { barHistoriesQuery } from '../queries/bar';

const BAR = {
  [ChainId.MAINNET]: 'billjhlee/xstnd',
  [ChainId.SHIDEN]: 'digitalnativeinc/shiden-xstnd',
};

export const bar = async (query, chainId = ChainId.MAINNET, variables) =>
  request(
    `${GRAPH_HOST[chainId]}/subgraphs/name/${BAR[chainId]}`,
    query,
    variables,
  );

export const getBarHistories = async (
  chainId,
  variables,
  query = barHistoriesQuery,
) => {
  const res = await bar(query, chainId, variables);
  return res.histories;
};
