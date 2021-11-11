import useSWR, { SWRConfiguration } from 'swr';
import { useActiveWeb3React } from '../../../hooks';
import { getBarHistories } from '../fetchers/bar';

export function useBarHistories(
  variables = undefined,
  swrConfig: SWRConfiguration = undefined,
) {
  const { chainId } = useActiveWeb3React();
  const { data } = useSWR(
    chainId ? ['barHistories', chainId, JSON.stringify(variables)] : null,
    () => getBarHistories(chainId, variables),
    swrConfig,
  );
  return data;
}
