import {
  getFactoryAddress,
  getRouterAddress,
  ChainId,
  getDividendPoolAddress,
  MASTERCHEF_V2_ADDRESS,
} from '@digitalnative/standard-protocol-sdk';
import { useActiveWeb3React } from '.';
import { ARCHER_ROUTER_ADDRESS } from '../constants';
import { useProtocol } from '../state/protocol/hooks';

export function useMasterPoolAddress(): string {
  const { chainId } = useActiveWeb3React();
  return MASTERCHEF_V2_ADDRESS[chainId];
}

export function useFactoryAddress(): string {
  const { chainId } = useActiveWeb3React();
  const protocol = useProtocol();
  return getFactoryAddress(protocol, chainId);
}

export function useDividendPoolAddress(): string {
  const { chainId } = useActiveWeb3React();
  const protocol = useProtocol();
  return getDividendPoolAddress(protocol, chainId);
}
export function useFactoryAddressWithChainId(chainId: ChainId): string {
  const protocol = useProtocol();
  return getFactoryAddress(protocol, chainId);
}

export function useRouterAddress(archer?: boolean): string {
  const { chainId } = useActiveWeb3React();
  const protocol = useProtocol();
  return !archer
    ? getRouterAddress(protocol, chainId)
    : ARCHER_ROUTER_ADDRESS[chainId];
}

export function useRouterAddressWithChainId(
  chainId: ChainId,
  archer?: boolean,
): string {
  const protocol = useProtocol();
  return !archer
    ? getRouterAddress(protocol, chainId)
    : ARCHER_ROUTER_ADDRESS[chainId];
}

// export function useInitCodeHash(): string {
//   const protocol = useProtocol();
//   return getInitCodeHash(protocol);
// }
