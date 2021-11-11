import { useState } from 'react';
import { StakeStnd } from './StakeStnd';
import { UnstakeStnd } from './UnstakeStnd';
import { StndStakerHeader } from './StndStakerHeader';
import { CurrencyAmount, Token } from '@digitalnative/standard-protocol-sdk';
import { useStndStakerContract } from '../../hooks';
import useStndStaker from '../../hooks/stake';

export type StndStakerProps = {
  xStnd: Token;
  stnd: Token;
  stndBalance: CurrencyAmount<Token> | undefined;
  xStndBalance: CurrencyAmount<Token> | undefined;
  stndPrice: CurrencyAmount<Token> | undefined;
};

export default function StndStaker({
  xStnd,
  stnd,
  stndBalance,
  xStndBalance,
  stndPrice,
}: StndStakerProps) {
  const [stake, setStake] = useState(true);
  //   const stakePoolStndTotalDecimals = parseFloat(
  //     stakePoolStndTotal?.toExact() ?? '0',
  //   );

  const onStake = () => setStake(true);
  const onUnstake = () => setStake(false);

  const { enter, leave } = useStndStaker();

  return (
    <div className="bg-opaque p-5 rounded-20 h-full">
      <StndStakerHeader stake={stake} onStake={onStake} onUnstake={onUnstake} />
      {stake ? (
        <StakeStnd
          onStake={enter}
          xStnd={xStnd}
          stnd={stnd}
          stndBalance={stndBalance}
          xStndBalance={xStndBalance}
          stndPrice={stndPrice}
        />
      ) : (
        <UnstakeStnd
          onUnstake={leave}
          xStnd={xStnd}
          stnd={stnd}
          stndBalance={stndBalance}
          xStndBalance={xStndBalance}
          stndPrice={stndPrice}
        />
      )}
    </div>
  );
}
