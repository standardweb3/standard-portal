import { BigNumber } from 'ethers';
import { useCallback } from 'react';
import { useActiveWeb3React, useDividendPoolContract } from '../../hooks';

export default function useDividendPool() {
  const contract = useDividendPoolContract();

  const bond = useCallback(
    async (amount: BigNumber) => {
      try {
        let tx = await contract?.bond(amount);
        return tx;
      } catch (e) {
        console.error(e);
        return e;
      }
    },
    [contract],
  );

  const unbond = useCallback(
    async (amount: BigNumber) => {
      try {
        let tx = await contract?.unbond(amount);
        return tx;
      } catch (e) {
        console.error(e);
        return e;
      }
    },
    [contract],
  );

  const claim = useCallback(
    async (token: string) => {
      try {
        let tx = await contract?.claim(token);
        return tx;
      } catch (e) {
        console.error(e);
        return e;
      }
    },
    [contract],
  );

  return { bond, unbond, claim };
}
