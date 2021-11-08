import { useState } from 'react';
import { StakeStnd } from './StakeStnd';
import { UnstakeStnd } from './UnstakeStnd';
import { StndStakerHeader } from './StndStakerHeader';
import { useActiveWeb3React } from '../../hooks';
import { CurrencyAmount, Token } from '@digitalnative/standard-protocol-sdk';

export type StndStakerProps = {
  xStndPerDay: number;
  stnd: Token;
  balance: CurrencyAmount<Token> | undefined;
  stakedBalance: CurrencyAmount<Token> | undefined;
  stakePoolStndTotal: CurrencyAmount<Token> | undefined;
};

export default function StndStaker({
  stnd,
  balance,
  stakedBalance,
  stakePoolStndTotal,
  xStndPerDay,
}: StndStakerProps) {
  const { account, chainId } = useActiveWeb3React();
  const [stake, setStake] = useState(true);
  //   const stakePoolStndTotalDecimals = parseFloat(
  //     stakePoolStndTotal?.toExact() ?? '0',
  //   );

  const onStake = () => setStake(true);
  const onUnstake = () => setStake(false);
  return (
    <div className="bg-opaque p-5 rounded-20">
      <StndStakerHeader stake={stake} onStake={onStake} onUnstake={onUnstake} />
      {stake ? (
        <StakeStnd
          stnd={stnd}
          balance={balance}
          stakedBalance={stakedBalance}
          xStndPerDay={xStndPerDay}
          stakePoolStndTotal={stakePoolStndTotal}
        />
      ) : (
        <UnstakeStnd
          stnd={stnd}
          balance={balance}
          stakedBalance={stakedBalance}
          xStndPerDay={xStndPerDay}
          stakePoolStndTotal={stakePoolStndTotal}
        />
      )}
    </div>
  );
}
