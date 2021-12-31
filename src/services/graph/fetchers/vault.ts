import { ChainId } from '@digitalnative/standard-protocol-sdk';
import request from 'graphql-request';
import { useActiveWeb3React } from '../../../hooks';
import { GRAPH_HOST } from '../constants';
import {
  cVaultQuery,
  vaultManagerQuery,
  vaultQuery,
  vaultsQuery,
} from '../queries/vault';

export const VAULT = {
  [ChainId.RINKEBY]: 'digitalnative/standardprotocol-vault',
};

export const vaultUri = (chainId = ChainId.MAINNET) =>
  `${'http://127.0.0.1:8000'}/subgraphs/name/${VAULT[chainId]}`;

export const vault = async (chainId = ChainId.MAINNET, query, variables) => {
  return request(
    `${'http://127.0.0.1:8000'}/subgraphs/name/${VAULT[chainId]}`,
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
  const { vault: result } = await vault(chainId, vaultQuery, variables);

  return result;
};

export const getCVault = async (chainId = ChainId.MAINNET, variables) => {
  const { collateralVault } = await vault(chainId, cVaultQuery, variables);

  return collateralVault;
};
