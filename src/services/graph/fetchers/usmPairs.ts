import { ChainId } from '@digitalnative/standard-protocol-sdk';
import { usmPairsQuery } from '../queries/usmPairs';
import { vault } from './vault';

export const getUsmPairs = async (
  chainId = ChainId.MAINNET,
  variables = undefined,
) => {
  const { pairs } = await vault(chainId, usmPairsQuery, variables);

  return pairs;
};
