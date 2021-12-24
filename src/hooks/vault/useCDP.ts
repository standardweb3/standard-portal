import { useCallback } from 'react';
import { useActiveWeb3React, useApproveCallback } from '..';
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
    async (dAmount) => {
      try {
        let tx;
        tx = await vaultManagerContract.createCDPNative(dAmount);
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
