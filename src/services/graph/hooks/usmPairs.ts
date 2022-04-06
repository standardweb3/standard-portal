import useSWR, { SWRConfiguration } from 'swr';
import { useActiveWeb3React } from '../../../hooks';
import { getUsmPairs } from '../fetchers/usmPairs';

export function useUsmPairs(
  variables = undefined,
  swrConfig: SWRConfiguration = undefined,
) {
  const { chainId } = useActiveWeb3React();

  const { data } = useSWR(
    chainId ? ['usmPairs', chainId, JSON.stringify(variables)] : null,
    () => getUsmPairs(chainId),
  );
  return data;
}
