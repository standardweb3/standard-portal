import useSWR, { SWRConfiguration } from 'swr';
import { useActiveWeb3React } from '../../../hooks';
import {
  getBondedStrategy,
  getBondedStrategyHistories,
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

export function useBondedStrategyHistory(
  variables = undefined,
  swrConfig: SWRConfiguration = undefined,
) {
  const { chainId } = useActiveWeb3React();
  const _variables = { first: 1, ...variables };
  const { data } = useSWR(
    chainId
      ? ['bondedStrategyHistory', chainId, JSON.stringify(_variables)]
      : null,
    () => getBondedStrategyHistories(chainId, _variables),
    swrConfig,
  );
  return data?.[0];
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
