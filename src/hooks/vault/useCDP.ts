import { BigNumber } from 'ethers';
import { useCallback } from 'react';
import { useActiveWeb3React, useApproveCallback } from '..';
import { calculateGasMargin } from '../../functions';
import { useVaultMannagerConract } from './useVaultManager';

export default function useCDP() {
  const { account } = useActiveWeb3React();

  const vaultManagerContract = useVaultMannagerConract();

  const createCDP = useCallback(
    async (collateral, mtr, cAmount, dAmount) => {
      console.log('vault: createCDP', collateral, cAmount, dAmount);
      try {
        let tx;
        tx = await vaultManagerContract.createCDP(collateral, cAmount, dAmount);
        return tx;
      } catch (e) {
        console.error(e);
        return e;
      }
    },
    [account, vaultManagerContract],
  );

  const createCDPNative = useCallback(
    async (cAmount, dAmount) => {
      try {
        const estimate = vaultManagerContract.estimateGas.createCDPNative;
        const method = vaultManagerContract.createCDPNative;
        const args = [dAmount];
        const value = BigNumber.from(cAmount);
        console.log('value', value.toString());

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
        return e;
      }
    },
    [account, vaultManagerContract],
  );

  return { createCDP, createCDPNative };
}
