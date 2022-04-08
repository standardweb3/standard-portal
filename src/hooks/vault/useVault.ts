import VAULT_ABI from '../../constants/abis/vault.json';
import { Contract } from '@ethersproject/contracts';
import { useActiveWeb3React, useContract, useTokenContract } from '..';
import { useSingleCallResult } from '../../state/multicall/hooks';
import { useCallback } from 'react';
import { calculateGasMargin } from '../../functions';

export function useVaultContract(
  address,
  withSIgnerIfPossible = true,
): Contract | null {
  return useContract(address, VAULT_ABI, withSIgnerIfPossible);
}

export function useVaultDebt(address) {
  const contract = useVaultContract(address);

  const callResult = useSingleCallResult(contract, 'outstandingPayment');

  const debt = callResult?.result?.[0];

  return debt !== undefined ? debt / 1e18 : undefined;
}

export function useVaultBorrowed(address) {
  const contract = useVaultContract(address);

  const callResult = useSingleCallResult(contract, 'borrow', []);

  const borrowed = callResult?.result?.[0];

  return borrowed ? borrowed / 1e18 : undefined;
}

export function useVaultCollateralized(
  collateralAddress,
  vaultAddress,
  decimals,
) {
  const collateral = useTokenContract(collateralAddress);
  const callResult = useSingleCallResult(collateral, 'balanceOf', [
    vaultAddress,
  ]);

  const collateralized = callResult?.result?.[0];
  return collateralized && decimals !== undefined
    ? collateralized / decimals
    : undefined;
}

export function useVault(address) {
  const { account } = useActiveWeb3React();

  const contract = useVaultContract(address);

  const closeVault = useCallback(
    async (amount) => {
      try {
        let tx;
        tx = await contract.closeVault(amount);
        return tx;
      } catch (e) {
        console.error(e);
        // return e;
      }
    },
    [account, contract],
  );

  const borrowMore = useCallback(
    async (cAmount, dAmount) => {
      try {
        let tx;
        tx = await contract.borrowMore(cAmount, dAmount);

        return tx;
      } catch (e) {
        console.error(e);
        // return e;
      }
    },
    [account, contract],
  );

  const borrowMoreNative = useCallback(
    async (cAmount, dAmount) => {
      try {
        const estimate = contract.estimateGas.borrowMoreNative;
        const method = contract.borrowMoreNative;
        const args = [dAmount];
        const value = cAmount;

        let tx;
        tx = await estimate(...args, { value }).then((estimatedGasLimit) =>
          method(...args, {
            value,
            gasLimit: calculateGasMargin(estimatedGasLimit),
          }),
        );
        return tx;
      } catch (e) {
        console.error(e);
        // return e;
      }
    },
    [account, contract],
  );

  const payBack = useCallback(
    async (amount) => {
      try {
        let tx;
        tx = await contract.payDebt(amount);

        return tx;
      } catch (e) {
        console.error(e);
        // return e;
      }
    },
    [account, contract],
  );

  const deposit = useCallback(
    async (amount) => {
      try {
        let tx;
        tx = await contract.depositCollateral(amount);

        return tx;
      } catch (e) {
        console.error(e);
        // return e;
      }
    },
    [account, contract],
  );

  const depositNative = useCallback(
    async (amount) => {
      try {
        const estimate = contract.estimateGas.depositCollateralNative;
        const method = contract.depositCollateralNative;
        const args = [];
        const value = amount;

        let tx;
        tx = await estimate(...args, { value }).then((estimatedGasLimit) =>
          method(...args, {
            value,
            gasLimit: calculateGasMargin(estimatedGasLimit),
          }),
        );

        return tx;
      } catch (e) {
        console.error(e);
        // return e;
      }
    },
    [account, contract],
  );

  const withdraw = useCallback(
    async (amount) => {
      try {
        let tx;
        tx = await contract.withdrawCollateral(amount);

        return tx;
      } catch (e) {
        console.error(e);
        // return e;
      }
    },
    [account, contract],
  );

  const withdrawNative = useCallback(
    async (amount) => {
      try {
        let tx;
        tx = await contract.withdrawCollateralNative(amount);

        return tx;
      } catch (e) {
        console.error(e);
        // return e;
      }
    },
    [account, contract],
  );

  return {
    closeVault,
    borrowMore,
    borrowMoreNative,
    payBack,
    withdraw,
    withdrawNative,
    deposit,
    depositNative,
  };
}
