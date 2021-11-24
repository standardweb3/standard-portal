import {
  masterChefV2SushiPerBlockQuery,
  masterChefV2TotalAllocPointQuery,
  masterChefV2PairAddressesQuery,
  poolsV2Query,
  masterChefV2Query,
} from '../queries';

import { getTokenSubset } from './exchange';

import {
  ChainId,
  MASTERCHEF_V2_ADDRESS,
} from '@digitalnative/standard-protocol-sdk';
import { GRAPH_HOST } from '../constants';
import { request } from 'graphql-request';

export const MASTERCHEF_V2 = {
  [ChainId.MAINNET]: 'billjhlee/ethereum-master-pool',
  [ChainId.RINKEBY]: 'billjhlee/rinkeby-master-pool',
  [ChainId.SHIBUYA]: 'digitalnativeinc/shibuya-master-pool',
  [ChainId.SHIDEN]: 'digitalnativeinc/shiden-master-pool',
  [ChainId.METIS]: '',
};

export const masterChefV2 = async (query, chainId = ChainId.MAINNET) =>
  request(
    `${GRAPH_HOST[chainId]}/subgraphs/name/${MASTERCHEF_V2[chainId]}`,
    query,
    {
      id: MASTERCHEF_V2_ADDRESS[chainId].toLowerCase(),
    },
  );

export const getMasterChefV2TotalAllocPoint = async (chainId: ChainId) => {
  const {
    masterChef: { totalAllocPoint },
  } = await masterChefV2(masterChefV2TotalAllocPointQuery, chainId);
  return totalAllocPoint;
};

export const getMasterChefV2Availability = async (chainId: ChainId) => {
  const data = await masterChefV2(masterChefV2Query, chainId);
  return data;
};

export const getMasterChefV2SushiPerBlock = async (chainId: ChainId) => {
  const {
    masterChef: { sushiPerBlock },
  } = await masterChefV2(masterChefV2SushiPerBlockQuery, chainId);
  return sushiPerBlock / 1e18;
};

export const getMasterChefV2Farms = async (
  chainId: ChainId = ChainId.MAINNET,
) => {
  const { pools } = await masterChefV2(poolsV2Query, chainId);

  const tokens = await getTokenSubset(chainId, {
    tokenAddresses: Array.from(pools.map((pool) => pool.rewarder.rewardToken)),
  });

  return pools.map((pool) => ({
    ...pool,
    rewardToken: {
      ...tokens.find((token) => token.id === pool.rewarder.rewardToken),
    },
  }));
};

export const getMasterChefV2PairAddreses = async (
  chainId = ChainId.MAINNET,
) => {
  const { pools } = await masterChefV2(masterChefV2PairAddressesQuery, chainId);
  return pools;
};
