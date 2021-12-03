import useSWR, { SWRConfiguration } from 'swr';
import { useActiveWeb3React } from '../../../hooks';
import { getCollaterals } from '../fetchers/collaterals';

export function useCollaterals(swrConfig: SWRConfiguration = undefined) {
  const { chainId } = useActiveWeb3React();
  const { data } = useSWR(
    ['collaterals', chainId],
    () => getCollaterals({ chainId }),
    swrConfig,
  );
  //   console.log('collaterals', data);
  return data;
}

export function useCollateral(
  alias: string,
  swrConfig: SWRConfiguration = undefined,
) {
  const { chainId } = useActiveWeb3React();
  const { data } = useSWR(
    ['collateral', chainId, alias],
    () => getCollaterals({ aliases: [alias], chainId }),
    swrConfig,
  );
  return data?.[0];
}
