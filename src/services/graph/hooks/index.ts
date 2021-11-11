import {
  getMasterChefV1Farms,
  getMasterChefV1PairAddreses,
  getMasterChefV2Availability,
  getMasterChefV2SushiPerBlock,
  getMasterChefV2TotalAllocPoint,
  getMasterChefV2Farms,
  getMasterChefV2PairAddreses,
  getMiniChefFarms,
  getMiniChefPairAddreses,
} from '../fetchers';
import { useMemo } from 'react';
import useSWR, { SWRConfiguration } from 'swr';

import { ChainId } from '@digitalnative/standard-protocol-sdk';
import { Chef } from '../../../features/farm/enum';
import concat from 'lodash/concat';
import useActiveWeb3React from '../../../hooks/useActiveWeb3React';
import { SUPPORTED_NETWORK_IDS } from '../../../constants/networks';

export * from './bentobox';
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
    shouldFetch ? 'masterChefV2SushiPerBlock' : null,
    () => getMasterChefV2SushiPerBlock(chainId),
    swrConfig,
  );
  return data;
}

export function useMasterChefV1Farms(swrConfig = undefined) {
  const { chainId } = useActiveWeb3React();
  const shouldFetch = chainId && chainId === ChainId.MAINNET;
  const { data } = useSWR(
    shouldFetch ? 'masterChefV1Farms' : null,
    () => getMasterChefV1Farms(),
    swrConfig,
  );
  return useMemo(() => {
    if (!data) return [];
    return data.map((data) => ({ ...data, chef: Chef.MASTERCHEF }));
  }, [data]);
}

export function useMasterChefV2Farms(swrConfig: SWRConfiguration = undefined) {
  const { chainId } = useActiveWeb3React();
  const shouldFetch = chainId;
  const { data } = useSWR(
    shouldFetch ? 'masterChefV2Farms' : null,
    () => getMasterChefV2Farms(chainId),
    swrConfig,
  );
  return useMemo(() => {
    if (!data) return [];
    return data.map((data) => ({ ...data, chef: Chef.MASTERCHEF_V2 }));
  }, [data]);
}

export function useMiniChefFarms(swrConfig: SWRConfiguration = undefined) {
  const { chainId } = useActiveWeb3React();
  const shouldFetch =
    chainId && [ChainId.MATIC, ChainId.XDAI, ChainId.HARMONY].includes(chainId);
  const { data } = useSWR(
    shouldFetch ? ['miniChefFarms', chainId] : null,
    (_, chainId) => getMiniChefFarms(chainId),
    swrConfig,
  );
  return useMemo(() => {
    if (!data) return [];
    return data.map((data) => ({ ...data, chef: Chef.MINICHEF }));
  }, [data]);
}

export function useFarms(swrConfig: SWRConfiguration = undefined) {
  // const masterChefV1Farms = useMasterChefV1Farms();
  const masterChefV2Farms = useMasterChefV2Farms();
  // const miniChefFarms = useMiniChefFarms();
  // useEffect(() => {
  //   console.log('debug', { masterChefV1Farms, masterChefV2Farms, miniChefFarms })
  // }, [masterChefV1Farms, masterChefV2Farms, miniChefFarms])
  return useMemo(
    () => concat(masterChefV2Farms).filter((pool) => pool && pool.pair),
    [masterChefV2Farms],
  );
}

export function useMasterChefV1PairAddresses() {
  const { chainId } = useActiveWeb3React();
  const shouldFetch = chainId && chainId === ChainId.MAINNET;
  const { data } = useSWR(
    shouldFetch ? ['masterChefV1PairAddresses', chainId] : null,
    (_) => getMasterChefV1PairAddreses(),
  );
  return useMemo(() => {
    if (!data) return [];
    return data.map((data) => data.pair);
  }, [data]);
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

export function useMiniChefPairAddresses() {
  const { chainId } = useActiveWeb3React();
  const shouldFetch =
    chainId && [ChainId.MATIC, ChainId.XDAI, ChainId.HARMONY].includes(chainId);
  const { data } = useSWR(
    shouldFetch ? ['miniChefPairAddresses', chainId] : null,
    (_, chainId) => getMiniChefPairAddreses(chainId),
  );
  return useMemo(() => {
    if (!data) return [];
    return data.map((data) => data.pair);
  }, [data]);
}

export function useFarmPairAddresses() {
  // const masterChefV1PairAddresses = useMasterChefV1PairAddresses();
  const masterChefV2PairAddresses = useMasterChefV2PairAddresses();
  // const miniChefPairAddresses = useMiniChefPairAddresses();
  return useMemo(
    () =>
      concat(
        // masterChefV1PairAddresses,
        masterChefV2PairAddresses,
        // miniChefPairAddresses,
      ),
    [
      // masterChefV1PairAddresses,
      masterChefV2PairAddresses,
      // miniChefPairAddresses,
    ],
  );
}

export async function useMasterChefV2Availability(fallbackCb) {
  const { chainId } = useActiveWeb3React();
  try {
    const data = await getMasterChefV2Availability(chainId);
    (data === undefined || data.masterChef === null) && fallbackCb();
  } catch (err) {
    fallbackCb();
  }
}
