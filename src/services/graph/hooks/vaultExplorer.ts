import useSWR, { SWRConfiguration } from 'swr';
import { useActiveWeb3React } from '../../../hooks';
import { getExplorerVaults } from '../fetchers/vaultExplorer';

export function useExplorerVaults(
  variables = undefined,
  swrConfig: SWRConfiguration = undefined,
) {
  const { chainId } = useActiveWeb3React();

  const { data } = useSWR(
    chainId ? ['explorerVaults', chainId, JSON.stringify(variables)] : null,
    () => getExplorerVaults(chainId, variables),
  );

  return data;
}
