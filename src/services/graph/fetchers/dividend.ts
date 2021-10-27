import {
  getDividendPoolAddress,
  Protocol,
} from '@digitalnative/standard-protocol-sdk';
import { exchange } from '.';
import {
  bondedStrategyQuery,
  bondedStrategyPairsQuery,
  bondedStrategyHistoriesQuery,
} from '../queries/dividend';

export const getBondedStrategy = async (
  chainId,
  query = bondedStrategyQuery,
) => {
  const { bondedStrategy } = await exchange(chainId, query, {
    id: getDividendPoolAddress(
      Protocol.STANDARD_PROTOCOL,
      chainId,
    ).toLowerCase(),
  });
  return bondedStrategy;
};

export const getBondedStrategyPairs = async (
  chainId,
  variables,
  query = bondedStrategyPairsQuery,
) => {
  const { bondedStrategyPairs } = await exchange(chainId, query, variables);
  return bondedStrategyPairs;
};

export const getBondedStrategyHistories = async (
  chainId,
  variables,
  query = bondedStrategyHistoriesQuery,
) => {
  const { bondedStrategyHistories } = await exchange(chainId, query, variables);
  return bondedStrategyHistories;
};
