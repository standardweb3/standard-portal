import { Contract } from 'ethers';
import { useContract } from '../../hooks';
import RouterAction from '../abis/RouterAction.json';
import RouterSwapAction from '../abis/RouterSwapAction.json';

export function useSwapUnderlyingContract(
  tokenAddress?: string,
  withSignerIfPossible?: boolean,
): Contract | null {
  return useContract(tokenAddress, RouterAction, withSignerIfPossible);
}

export function useBridgeContract(
  routerToken?: any,
  withSignerIfPossible?: boolean,
): Contract | null {
  return useContract(
    routerToken ? routerToken : undefined,
    RouterSwapAction,
    withSignerIfPossible,
  );
}
