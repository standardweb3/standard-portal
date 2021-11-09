import {
  CurrencyAmount,
  STND_ADDRESS,
  Token,
} from '@digitalnative/standard-protocol-sdk';
import { useState } from 'react';
import { classNames, formatNumber } from '../../functions';
import { DefinedStyles } from '../../utils/DefinedStyles';
import { Button } from '../Button';
import { EstimatedXStnd } from './EstimatedXStnd';
import { TokenInputPanelV2 } from './TokenInputPanelV2';

export type UnstakeStndTypes = {
  xStndPerDay: number;
  stnd: Token;
  balance: CurrencyAmount<Token> | undefined;
  stakedBalance: CurrencyAmount<Token> | undefined;
  stakePoolStndTotal: CurrencyAmount<Token> | undefined;
};

export function UnstakeStnd({
  xStndPerDay,
  stnd,
  balance,
  stakedBalance,
  stakePoolStndTotal,
}: UnstakeStndTypes) {
  const [unstakeAmount, setUntakeAmount] = useState('0');

  const stakePoolStndTotalDecimals =
    stakePoolStndTotal && parseFloat(stakePoolStndTotal.toExact());

  // const balanceDecimals = balance && parseFloat(balance.toExact());

  const stakedBalanceDecimals =
    stakedBalance && parseFloat(stakedBalance.toExact());

  // const stakeCurrencyAmount = tryParseAmount(stakeAmount, stnd)

  const unstakeAmountDecimals = !!unstakeAmount ? parseFloat(unstakeAmount) : 0;
  const newStakeBalance =
    stakedBalanceDecimals !== undefined
      ? Math.max(stakedBalanceDecimals - unstakeAmountDecimals, 0)
      : undefined;

  const newStakeShare =
    newStakeBalance !== undefined && stakePoolStndTotalDecimals !== undefined
      ? newStakeBalance / (stakePoolStndTotalDecimals - unstakeAmountDecimals)
      : undefined;

  const estimatedXStndPerDay =
    newStakeShare !== undefined && xStndPerDay * newStakeShare;

  return (
    <div className="text-text">
      <div className="my-4">
        <EstimatedXStnd
          estimate={estimatedXStndPerDay ?? 0}
          stnd={stnd}
          currentStaked={stakedBalanceDecimals ?? 0}
          newStaked={newStakeBalance ?? 0}
        />
      </div>
      <div className="grid grid-cols-2 gap-x-4">
        <div className="col-span-2 grid grid-cols-2 gap-x-4 text-sm">
          <div
            className="
            col-span-2
            md:col-span-1
            text-xs text-primary text-right mb-2
            pr-2"
          >
            Staked: {formatNumber(stakedBalance?.toSignificant(6) ?? 0)}
          </div>
        </div>
        <div className="col-span-2 md:col-span-1">
          <TokenInputPanelV2
            token={stnd}
            max={stakedBalance}
            onAmountChange={setUntakeAmount}
            className="
            rounded-20 py-3 px-4
            bg-opaque
            text-text
        "
            inputClassName="
            !text-base
            !font-normal
        "
          />
        </div>
        <Button
          className={classNames(
            DefinedStyles.fullButton,
            'col-span-2 md:col-span-1',
          )}
        >
          Unstake
        </Button>
      </div>
    </div>
  );
}
