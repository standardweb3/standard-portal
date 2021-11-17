import { CurrencyAmount, JSBI } from '@digitalnative/standard-protocol-sdk';
import { BigNumber } from 'ethers';
import { useMemo } from 'react';
import { useActiveWeb3React, useStakePoolContract } from '../../hooks';
import { useStnd } from '../../hooks/Tokens';
import { useSingleCallResult } from '../../state/multicall/hooks';

export function useStakeInfo(token) {
  const { account } = useActiveWeb3React();

  const contract = useStakePoolContract();

  const args = useMemo(() => {
    if (!account) {
      return;
    }
    return ['0', String(account)];
  }, [account]);

  const result = useSingleCallResult(args ? contract : null, 'userInfo', args)
    ?.result;

  const value = result?.[0];

  const amount = value ? JSBI.BigInt(value.toString()) : undefined;

  return amount ? CurrencyAmount.fromRawAmount(token, amount) : undefined;
}

export function useStakePoolSushiPerBlock(): BigNumber | null {
  const contract = useStakePoolContract();

  const sushiPerBlock = useSingleCallResult(contract, 'sushiPerBlock')
    .result?.[0];

  return sushiPerBlock;
}

export function usePendingXStnd() {
  const { account } = useActiveWeb3React();
  // change to xSTND
  const stnd = useStnd();

  const contract = useStakePoolContract();

  // change to 0 later
  const args = useMemo(() => {
    if (!account) {
      return;
    }
    return ['7', String(account)];
  }, [account]);

  const result = useSingleCallResult(
    args ? contract : null,
    'pendingSushi',
    args,
  )?.result;

  const value = result?.[0];

  const amount = value ? JSBI.BigInt(value.toString()) : undefined;

  return amount ? CurrencyAmount.fromRawAmount(stnd, amount) : undefined;
}
