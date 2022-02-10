import { useContract } from '../useContract';
import { Contract } from '@ethersproject/contracts';
import VAULT_MANAGER_ABI from '../../constants/abis/vault-manager.json';
import { useActiveWeb3React } from '..';
import { useProtocol } from '../../state/protocol/hooks';
import { getVaultManagerAddress } from '@digitalnative/standard-protocol-sdk';
import {
  useSingleCallResult,
  useSingleContractMultipleData,
} from '../../state/multicall/hooks';
import { formatBalance } from '../../functions';
import { call } from 'eth-permit/dist/rpc';
import { useCallback, useEffect, useState } from 'react';
import useCurrentBlockTimestamp from '../useCurrentBlockTimestamp';

export function useVaultManagerAddress(): string {
  const { chainId } = useActiveWeb3React();
  const protocol = useProtocol();
  return getVaultManagerAddress(protocol, chainId);
}

export function useVaultMannagerConract(
  withSignerIfPossibe = true,
): Contract | null {
  const vaultManagerAddress = useVaultManagerAddress();
  return useContract(
    vaultManagerAddress,
    VAULT_MANAGER_ABI,
    withSignerIfPossibe,
  );
}

export function useVaultManagerAssetPrice(address) {
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

export function useVaultAddresses(vaultIds) {
  const [vaults, setVaults] = useState(null);
  const contract = useVaultMannagerConract();

  const [addressesPromise, setAddressePromise] = useState(null);
  const [addresses, setAddresses] = useState(null);

  useEffect(() => {
    if (contract !== null && vaultIds) {
      const _addressesPromise = [];
      vaultIds.forEach((id) => {
        _addressesPromise.push(contract.allVaults(id));
      });
      setAddressePromise(_addressesPromise);
    }
  }, [contract, vaultIds]);

  useEffect(() => {
    if (addressesPromise !== null) {
      Promise.all(addressesPromise).then((values) => {
        const _addresses = [];
        for (let i = 0; i < values.length; i++) {
          _addresses.push(values[i]);
        }
        setAddresses(_addresses);
      });
    }
  }, [addressesPromise]);

  return addresses;
}

export function useVaultAddresses2(vaultIds) {
  const contract = useVaultMannagerConract();

  const vaultAddrs = useSingleContractMultipleData(
    vaultIds && contract,
    'allVaults',
    vaultIds.map((id) => [id]),
  )?.map((data) => {
    return data?.result?.[0] ?? undefined;
  });
}

export function useLastRebase() {
  const contract = useVaultMannagerConract();

  const callResult = useSingleCallResult(contract, 'lastRebase', []);

  return callResult?.result?.[0];
}

export function useRebaseCountdown() {
  const lastRebase = useLastRebase();
  const timestamp = useCurrentBlockTimestamp();

  return (
    lastRebase &&
    timestamp &&
    Math.max(3600 - (timestamp.toNumber() - lastRebase.toNumber()), 0)
  );
}
// export function useVaultConfig(collateralAddr) {
//   const contract = useVaultMannagerConract()
//   const
// }
