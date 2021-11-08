import { CurrencyAmount, Token } from '@digitalnative/standard-protocol-sdk';
import { useState } from 'react';
import { classNames, formatNumber } from '../../functions';
import { DefinedStyles } from '../../utils/DefinedStyles';
import { Button } from '../Button';
import { EstimatedXStnd } from './EstimatedXStnd';
import { TokenInputPanelV2 } from './TokenInputPanelV2';

export type StakeStndTypes = {
  xStndPerDay: number;
  stnd: Token;
  balance: CurrencyAmount<Token> | undefined;
  stakedBalance: CurrencyAmount<Token> | undefined;
  stakePoolStndTotal: CurrencyAmount<Token> | undefined;
};
export function StakeStnd({
  xStndPerDay,
  stnd,
  balance,
  stakedBalance,
  stakePoolStndTotal,
}: StakeStndTypes) {
  const [stakeAmount, setStakeAmount] = useState('0');

  const stakePoolStndTotalDecimals =
    stakePoolStndTotal && parseFloat(stakePoolStndTotal.toExact());

  // const balanceDecimals = balance && parseFloat(balance.toExact());

  const stakedBalanceDecimals =
    stakedBalance && parseFloat(stakedBalance.toExact());

  // const stakeCurrencyAmount = tryParseAmount(stakeAmount, stnd)

  const stakeAmountDecimals = !!stakeAmount ? parseFloat(stakeAmount) : 0;
  const newStakeBalance =
    stakedBalanceDecimals !== undefined
      ? stakeAmountDecimals + stakedBalanceDecimals
      : undefined;

  const newStakeShare =
    newStakeBalance !== undefined && stakePoolStndTotalDecimals !== undefined
      ? newStakeBalance / (stakePoolStndTotalDecimals + stakeAmountDecimals)
      : undefined;
  const estimatedXStndPerDay =
    newStakeShare !== undefined ? xStndPerDay * newStakeShare : undefined;

  // const estimatedXStndReward = (
  //   parseFloat(stakeCurrencyAmount.add(stakedBalance).toExact()) /

  return (
    <div className="text-text">
      <div className="text-right text-sm mb-2">
        Balance: {formatNumber(balance?.toSignificant(6) ?? 0)}
      </div>
      <TokenInputPanelV2
        token={stnd}
        max={balance}
        onAmountChange={setStakeAmount}
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

      <div className="my-4">
        <EstimatedXStnd
          estimate={estimatedXStndPerDay ?? 0}
          stnd={stnd}
          currentStaked={stakedBalanceDecimals ?? 0}
          newStaked={newStakeBalance ?? 0}
        />
      </div>
      <Button className={classNames(DefinedStyles.fullButton, 'mt-4')}>
        Stake
      </Button>
    </div>
  );
}
