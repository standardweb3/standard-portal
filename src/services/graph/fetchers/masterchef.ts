import {
  masterChefV1PairAddressesQuery,
  masterChefV2SushiPerBlockQuery,
  masterChefV2TotalAllocPointQuery,
  masterChefV2PairAddressesQuery,
  miniChefPairAddressesQuery,
  miniChefPoolsQuery,
  poolsQuery,
  poolsV2Query,
} from '../queries';

import { getTokenSubset } from './exchange';

import {
  ChainId,
  MASTERCHEF_V2_ADDRESS,
} from '@digitalnative/standard-protocol-sdk';
import { GRAPH_HOST } from '../constants';
import { request } from 'graphql-request';

export const MINICHEF = {
  [ChainId.MATIC]: 'sushiswap/matic-minichef',
  [ChainId.XDAI]: 'matthewlilley/xdai-minichef',
  [ChainId.HARMONY]: 'sushiswap/harmony-minichef',
};

export const miniChef = async (query, chainId = ChainId.MAINNET) =>
  request(`${GRAPH_HOST[chainId]}/subgraphs/name/${MINICHEF[chainId]}`, query);

export const MASTERCHEF_V2 = {
  [ChainId.MAINNET]: 'sushiswap/master-chefv2',
  [ChainId.RINKEBY]: 'billjhlee/rinkeby-master-pool',
  [ChainId.SHIBUYA]: 'digitalnativeinc/shibuya-master-pool',
  [ChainId.SHIDEN]: 'digitalnativeinc/shiden-master-pool',
};

export const masterChefV2 = async (query, chainId = ChainId.MAINNET) =>
  request(
    `${GRAPH_HOST[chainId]}/subgraphs/name/${MASTERCHEF_V2[chainId]}`,
    query,
    {
      id: MASTERCHEF_V2_ADDRESS[chainId].toLowerCase(),
    },
  );

export const MASTERCHEF_V1 = {
  [ChainId.MAINNET]: 'sushiswap/master-chef',
};

export const masterChefV1 = async (query, chainId = ChainId.MAINNET) =>
  request(
    `${GRAPH_HOST[chainId]}/subgraphs/name/${MASTERCHEF_V1[chainId]}`,
    query,
  );

export const getMasterChefV2TotalAllocPoint = async (chainId: ChainId) => {
  const {
    masterChef: { totalAllocPoint },
  } = await masterChefV2(masterChefV2TotalAllocPointQuery, chainId);
  return totalAllocPoint;
};

export const getMasterChefV2SushiPerBlock = async (chainId: ChainId) => {
  const {
    masterChef: { sushiPerBlock },
  } = await masterChefV2(masterChefV2SushiPerBlockQuery, chainId);
  return sushiPerBlock / 1e18;
};

export const getMasterChefV1Farms = async () => {
  const { pools } = await masterChefV1(poolsQuery);
  return pools;
};

export const getMasterChefV1PairAddreses = async () => {
  const { pools } = await masterChefV1(masterChefV1PairAddressesQuery);
  return pools;
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

export const getMiniChefFarms = async (chainId = ChainId.MAINNET) => {
  const { pools } = await miniChef(miniChefPoolsQuery, chainId);
  return pools;
};

export const getMiniChefPairAddreses = async (chainId = ChainId.MAINNET) => {
  console.debug('getMiniChefPairAddreses');
  const { pools } = await miniChef(miniChefPairAddressesQuery, chainId);
  return pools;
};
