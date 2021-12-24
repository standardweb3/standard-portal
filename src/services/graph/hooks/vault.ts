import { getVaultManagerAddress } from '@digitalnative/standard-protocol-sdk';
import useSWR, { SWRConfiguration } from 'swr';
import { useActiveWeb3React } from '../../../hooks';
import { useProtocol } from '../../../state/protocol/hooks';
import { getVault, getVaultManager, getVaults } from '../fetchers/vault';

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

export function useVault(
  variables = undefined,
  swrConfig: SWRConfiguration = undefined,
) {
  const { chainId } = useActiveWeb3React();
  console.log(variables);
  const { data } = useSWR(
    chainId ? ['vault', chainId, JSON.stringify(variables)] : null,
    () => getVault(chainId, variables),
  );
  return data;
}
