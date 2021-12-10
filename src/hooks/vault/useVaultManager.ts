import { useContract } from '../useContract';
import { Contract } from '@ethersproject/contracts';
import VAULT_MANAGER_ABI from '../../constants/abis/vault-manager.json';
import { useActiveWeb3React } from '..';
import { useProtocol } from '../../state/protocol/hooks';
import { getVaultManagerAddress } from '@digitalnative/standard-protocol-sdk';
import { useSingleCallResult } from '../../state/multicall/hooks';
import { useMemo } from 'react';

export function useVaultManagerAddress(): string {
  const { chainId } = useActiveWeb3React();
  const protocol = useProtocol();
  return getVaultManagerAddress(protocol, chainId);
}

export function useVaultMannagerConract(): Contract | null {
  const vaultManagerAddress = useVaultManagerAddress();
  return useContract(vaultManagerAddress, VAULT_MANAGER_ABI, false);
}

export function useVaultManagerAssetPrice(address) {
  const contract = useVaultMannagerConract();

  const args = [address];
  const assetPrice = useSingleCallResult(contract, 'getPriceOf', args);

  console.log(assetPrice);
  return assetPrice;
}
