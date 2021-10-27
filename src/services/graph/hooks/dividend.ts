import useSWR, { SWRConfiguration } from 'swr';
import { useActiveWeb3React } from '../../../hooks';
import {
  getBondedStrategy,
  getBondedStrategyPairs,
} from '../fetchers/dividend';

export function useBondedStrategy(
  variables = undefined,
  swrConfig: SWRConfiguration = undefined,
) {
  const { chainId } = useActiveWeb3React();
  const { data } = useSWR(
    chainId ? ['bondedStrategy', chainId, JSON.stringify(variables)] : null,
    () => getBondedStrategy(chainId, variables),
    swrConfig,
  );
  return data;
}

export function useBondedStrategyPairs(
  variables = undefined,
  swrConfig: SWRConfiguration = undefined,
) {
  const { chainId } = useActiveWeb3React();
  const { data } = useSWR(
    chainId
      ? ['bondedStrategyPairs', chainId, JSON.stringify(variables)]
      : null,
    () => getBondedStrategyPairs(chainId, variables),
    swrConfig,
  );
  return data;
}
