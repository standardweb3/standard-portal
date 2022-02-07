import { ApolloClient, createHttpLink, InMemoryCache } from '@apollo/client';
import { ChainId } from '@digitalnative/standard-protocol-sdk';
import request from 'graphql-request';
import { GRAPH_HOST } from '../constants';
import {
  cdpsQuery,
  cVaultQuery,
  vaultUserQuery,
  vaultManagerHistoriesQuery,
  vaultManagerQuery,
  vaultQuery,
  vaultsQuery,
  vaultUserHistoriesQuery,
} from '../queries/vault';

export const VAULT = {
  [ChainId.RINKEBY]: 'billjhlee/rinkeby-vault',
};

export const vaultsGraphClient = (chainId) => {
  const uri = vaultUri(chainId);
  return new ApolloClient({
    link: createHttpLink({
      uri,
    }),
    cache: new InMemoryCache(),
  });
};

export const vaultUri = (chainId = ChainId.MAINNET) =>
  `${GRAPH_HOST[chainId]}/subgraphs/name/${VAULT[chainId]}`;

export const vault = async (chainId = ChainId.MAINNET, query, variables) => {
  return request(
    `${GRAPH_HOST[chainId]}/subgraphs/name/${VAULT[chainId]}`,
    query,
    variables,
  );
};

export const getVaultManager = async (chainId = ChainId.MAINNET, variables) => {
  const { vaultManager } = await vault(chainId, vaultManagerQuery, variables);

  return vaultManager;
};

export const getVaults = async (chainId = ChainId.MAINNET, variables) => {
  const { vaults } = await vault(chainId, vaultsQuery, variables);

  return vaults;
};

export const getVault = async (chainId = ChainId.MAINNET, variables) => {
  const { vaults } = await vault(chainId, vaultsQuery, variables);
  return vaults?.[0];
};

export const getCVault = async (chainId = ChainId.MAINNET, variables) => {
  const { collateralVault } = await vault(chainId, cVaultQuery, variables);

  return collateralVault;
};

export const getVaultManagerHistories = async (
  chainId = ChainId.MAINNET,
  variables,
) => {
  const { vaultManagerHistories: result } = await vault(
    chainId,
    vaultManagerHistoriesQuery,
    variables,
  );

  return result;
};

export const getCdps = async (chainId = ChainId.MAINNET, variables) => {
  const { cdps: result } = await vault(chainId, cdpsQuery, variables);

  return result;
};

export const getVaultUser = async (chainId = ChainId.MAINNET, variables) => {
  const { user: result } = await vault(chainId, vaultUserQuery, variables);

  return result;
};

export const getVaultUserHistories = async (
  chainId = ChainId.MAINNET,
  variables,
) => {
  const { userHistories: result } = await vault(
    chainId,
    vaultUserHistoriesQuery,
    variables,
  );

  return result;
};
