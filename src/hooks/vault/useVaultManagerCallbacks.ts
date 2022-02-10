import { t } from '@lingui/macro';
import { BigNumber } from 'ethers';
import { useCallback } from 'react';
import { useActiveWeb3React, useApproveCallback } from '..';
import { calculateGasMargin } from '../../functions';
import { useVaultMannagerConract } from './useVaultManager';

export default function useVaultManagerCallbacks() {
  const { account } = useActiveWeb3React();

  const vaultManagerContract = useVaultMannagerConract();

  const triggerRebase = useCallback(async () => {
    try {
      let tx;
      tx = await vaultManagerContract.rebase();
      return tx;
    } catch (e) {
      console.error(e);
    }
  }, []);

  const createCDP = useCallback(
    async (collateral, usm, cAmount, dAmount) => {
      try {
        let tx;
        tx = await vaultManagerContract.createCDP(collateral, cAmount, dAmount);
        return tx;
      } catch (e) {
        console.error(e);
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
      }
    },
    [account, vaultManagerContract],
  );

  return { triggerRebase, createCDP, createCDPNative };
}
