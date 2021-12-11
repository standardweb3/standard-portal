import { useContract } from '../useContract';
import { Contract } from '@ethersproject/contracts';
import VAULT_MANAGER_ABI from '../../constants/abis/vault-manager.json';
import { useActiveWeb3React } from '..';
import { useProtocol } from '../../state/protocol/hooks';
import { getVaultManagerAddress } from '@digitalnative/standard-protocol-sdk';
import { useSingleCallResult } from '../../state/multicall/hooks';
import { formatBalance } from '../../functions';
import { call } from 'eth-permit/dist/rpc';

export function useVaultManagerAddress(): string {
  const { chainId } = useActiveWeb3React();
  const protocol = useProtocol();
  return getVaultManagerAddress(protocol, chainId);
}

export function useVaultMannagerConract(
  withSignerIfPossibe = true,
): Contract | null {
  const vaultManagerAddress = useVaultManagerAddress();
  console.log(vaultManagerAddress)
  return useContract(
    vaultManagerAddress,
    VAULT_MANAGER_ABI,
    withSignerIfPossibe,
  );
}

export function useVaultManagerAssetPrice(address) {
  console.log('vault manager asset price addr', address);
  const contract = useVaultMannagerConract();

  const args = [address];
  const callResult = useSingleCallResult(
    address && contract,
    'getAssetPrice',
    args,
  );
  const assetPrice = callResult?.result?.[0];

  return assetPrice ? parseFloat(formatBalance(assetPrice, 8)) : undefined;
}

export function useVaultManagerIsValidCDP(collateral, debt, cAmount, dAmount) {
  const contract = useVaultMannagerConract();

  const args = [collateral, debt, cAmount, dAmount];
  const callResult = useSingleCallResult(
    collateral && cAmount && dAmount && contract,
    'isValidCDP',
    args,
  );
  const assetPrice = callResult?.result?.[0];

  return assetPrice ? parseFloat(formatBalance(assetPrice, 8)) : undefined;
}
