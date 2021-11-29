import {
  getMasterChefV2Availability,
  getMasterChefV2SushiPerBlock,
  getMasterChefV2TotalAllocPoint,
  getMasterChefV2Farms,
  getMasterChefV2PairAddreses,
} from '../fetchers';
import { useMemo } from 'react';
import useSWR, { SWRConfiguration } from 'swr';
import { Chef } from '../../../features/farm/enum';
import concat from 'lodash/concat';
import useActiveWeb3React from '../../../hooks/useActiveWeb3React';
import { SUPPORTED_NETWORK_IDS } from '../../../constants/networks';

export * from './blocks';
export * from './exchange';

export function useMasterChefV2TotalAllocPoint(swrConfig = undefined) {
  const { chainId } = useActiveWeb3React();
  const shouldFetch = chainId && SUPPORTED_NETWORK_IDS.includes(chainId);
  const { data } = useSWR(
    shouldFetch ? 'masterChefV2TotalAllocPoint' : null,
    () => getMasterChefV2TotalAllocPoint(chainId),
    swrConfig,
  );
  return data;
}

export function useMasterChefV2SushiPerBlock(swrConfig = undefined) {
  const { chainId } = useActiveWeb3React();
  const shouldFetch = chainId && SUPPORTED_NETWORK_IDS.includes(chainId);
  const { data } = useSWR(
    shouldFetch ? ['masterChefV2SushiPerBlock', chainId] : null,
    () => getMasterChefV2SushiPerBlock(chainId),
    swrConfig,
  );
  return data;
}

export function useMasterChefV2Farms(swrConfig: SWRConfiguration = undefined) {
  const { chainId } = useActiveWeb3React();
  const shouldFetch = chainId;
  const { data } = useSWR(
    shouldFetch ? ['masterChefV2Farms', chainId] : null,
    () => getMasterChefV2Farms(chainId),
    swrConfig,
  );
  return useMemo(() => {
    if (!data) return [];
    return data.map((data) => ({ ...data, chef: Chef.MASTERCHEF_V2 }));
  }, [data]);
}

export function useFarms(swrConfig: SWRConfiguration = undefined) {
  const masterChefV2Farms = useMasterChefV2Farms();

  return useMemo(
    () => concat(masterChefV2Farms).filter((pool) => pool && pool.pair),
    [masterChefV2Farms],
  );
}

export function useMasterChefV2PairAddresses() {
  const { chainId } = useActiveWeb3React();
  const shouldFetch = chainId && SUPPORTED_NETWORK_IDS.includes(chainId);
  const { data } = useSWR(
    shouldFetch ? ['masterChefV2PairAddresses', chainId] : null,
    (_) => getMasterChefV2PairAddreses(chainId),
  );
  return useMemo(() => {
    if (!data) return [];
    return data.map((data) => data.pair);
  }, [data]);
}

export function useFarmPairAddresses() {
  const masterChefV2PairAddresses = useMasterChefV2PairAddresses();
  return useMemo(() => concat(masterChefV2PairAddresses), [
    masterChefV2PairAddresses,
  ]);
}

export async function useMasterChefV2Availability(fallbackCb) {
  const { chainId } = useActiveWeb3React();
  useSWR(
    chainId ? ['masterChefAvailability'] : null,
    () => getMasterChefV2Availability(chainId),
    {
      revalidateOnMount: true,
      revalidateOnReconnect: true,
      loadingTimeout: 10000,
      onLoadingSlow: fallbackCb,
    },
  );
}
