import { CurrencyAmount, Token } from '@digitalnative/standard-protocol-sdk';

import { useCallback } from 'react';
import { useStndStakerContract } from '..';
import { useTransactionAdder } from '../../state/transactions/hooks';

const useStndStaker = () => {
  const addTransaction = useTransactionAdder();
  const barContract = useStndStakerContract();

  const enter = useCallback(
    async (amount: CurrencyAmount<Token> | undefined) => {
      if (amount?.quotient) {
        try {
          const tx = await barContract?.enter(amount?.quotient.toString());
          return addTransaction(tx, { summary: 'Stake STND for dSTND' });
        } catch (e) {
          return e;
        }
      }
    },
    [addTransaction, barContract],
  );

  const leave = useCallback(
    async (amount: CurrencyAmount<Token> | undefined) => {
      if (amount?.quotient) {
        try {
          const tx = await barContract?.leave(amount?.quotient.toString());
          return addTransaction(tx, { summary: 'Claim STND with dSTND' });
        } catch (e) {
          return e;
        }
      }
    },
    [addTransaction, barContract],
  );

  return { enter, leave };
};

export default useStndStaker;
