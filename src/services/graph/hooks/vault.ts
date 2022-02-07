import { getVaultManagerAddress } from '@digitalnative/standard-protocol-sdk';
import useSWR, { SWRConfiguration } from 'swr';
import { useActiveWeb3React } from '../../../hooks';
import { useBlockNumber } from '../../../state/application/hooks';
import { useProtocol } from '../../../state/protocol/hooks';
import {
  getCdps,
  getCVault,
  getVault,
  getVaultManager,
  getVaultManagerHistories,
  getVaults,
  getVaultUser,
  getVaultUserHistories,
} from '../fetchers/vault';

export function useVaultManager(
  variables = undefined,
  swrConfig: SWRConfiguration = undefined,
) {
  const { chainId } = useActiveWeb3React();
  const protocol = useProtocol();
  const vaultManagerAddress = getVaultManagerAddress(protocol, chainId);

  const { data } = useSWR(
    chainId ? ['vaultManager', chainId, JSON.stringify(variables)] : null,
    () =>
      getVaultManager(chainId, {
        id: vaultManagerAddress.toLowerCase(),
        ...variables,
      }),
    swrConfig,
  );

  return data;
}

export function useUserVaults(
  variables = undefined,
  swrConfig: SWRConfiguration = undefined,
) {
  const { account, chainId } = useActiveWeb3React();

  const { data } = useSWR(
    account && chainId ? ['vaults', chainId, JSON.stringify(variables)] : null,
    () =>
      getVaults(chainId, {
        user: account.toLowerCase(),
      }),
  );
  return data;
}
export function useVaults(
  variables = undefined,
  swrConfig: SWRConfiguration = undefined,
) {
  const { account, chainId } = useActiveWeb3React();

  const { data } = useSWR(
    chainId ? ['vaults', chainId, JSON.stringify(variables)] : null,
    () => getVaults(chainId, variables),
  );
  return data;
}

export function useUserVault(
  vaultAddress = undefined,
  swrConfig: SWRConfiguration = undefined,
) {
  const { account, chainId } = useActiveWeb3React();
  const { data } = useSWR(
    chainId && vaultAddress ? ['vault', chainId, vaultAddress, account] : null,
    () =>
      getVault(chainId, {
        where: {
          address: vaultAddress?.toLowerCase(),
          user: account?.toLowerCase(),
        },
      }),
  );
  return data;
}

export function useCVault(
  variables = undefined,
  swrConfig: SWRConfiguration = undefined,
) {
  const { chainId } = useActiveWeb3React();
  const { data } = useSWR(
    chainId ? ['cVault', chainId, JSON.stringify(variables)] : null,
    () => getCVault(chainId, variables),
  );
  return data;
}

export function useVaultManagerHistories(
  variables = undefined,
  swrConfig: SWRConfiguration = undefined,
) {
  const { chainId } = useActiveWeb3React();
  const { data } = useSWR(
    chainId
      ? ['vaultManagerHistories', chainId, JSON.stringify(variables)]
      : null,
    () => getVaultManagerHistories(chainId, variables),
  );

  return data;
}

export function useCdps(
  variables = undefined,
  swrConfig: SWRConfiguration = undefined,
) {
  const { chainId } = useActiveWeb3React();
  const { data } = useSWR(
    chainId ? ['cdps', chainId, JSON.stringify(variables)] : null,
    () => getCdps(chainId, variables),
  );

  return data;
}

export function useVaultUser(
  variables = undefined,
  swrConfig: SWRConfiguration = undefined,
) {
  const { account, chainId } = useActiveWeb3React();
  const { data } = useSWR(
    account && chainId
      ? ['vaultUser', account, chainId, JSON.stringify(variables)]
      : null,
    () =>
      getVaultUser(chainId, {
        id: account.toLowerCase(),
        ...variables,
      }),
    swrConfig,
  );
  return data;
}

export function useVaultUserHistories(
  variables = undefined,
  swrConfig: SWRConfiguration = undefined,
) {
  const { account, chainId } = useActiveWeb3React();
  const { data } = useSWR(
    account && chainId
      ? ['vaultUserHistories', account, chainId, JSON.stringify(variables)]
      : null,
    () =>
      getVaultUserHistories(chainId, {
        id: account.toLowerCase(),
        ...variables,
      }),
    swrConfig,
  );
  return data;
}

// export function useCdps(
//   variables = undefined,
//   swrConfig: SWRConfiguration = undefined,
// ) {
//   const { chainId } = useActiveWeb3React();
//   const { data } = useSWR(
//     chainId ? ['cdps', chainId, JSON.stringify(variables)] : null,
//     () => getCdps(chainId, variables),
//   );

//   return data;
// }
