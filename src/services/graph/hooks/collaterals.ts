import useSWR, { SWRConfiguration } from 'swr';
import { useActiveWeb3React } from '../../../hooks';
import { getCollaterals } from '../fetchers/collaterals';

export function useCollaterals(
  variables,
  swrConfig: SWRConfiguration = undefined,
) {
  const { chainId } = useActiveWeb3React();
  const { data } = useSWR(
    ['collaterals', chainId],
    () => getCollaterals({ ...variables, chainId }),
    swrConfig,
  );
  //   console.log('collaterals', data);
  return data;
}

export function useCollateral(
  address: string,
  swrConfig: SWRConfiguration = undefined,
) {
  const { chainId } = useActiveWeb3React();
  const { data } = useSWR(
    ['collateral', chainId, address],
    () => getCollaterals({ addresses: [address], chainId }),
    swrConfig,
  );
  return data?.[0];
}
