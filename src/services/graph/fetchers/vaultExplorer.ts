import { ChainId } from '@digitalnative/standard-protocol-sdk';
import { explorerVaultsQuery } from '../queries/vaultExplorer';
import { vault } from './vault';

export const getExplorerVaults = async (
  chainId = ChainId.MAINNET,
  variables,
) => {
  const { vaults } = await vault(chainId, explorerVaultsQuery, variables);
  return vaults;
};
