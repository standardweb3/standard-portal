import { useState } from 'react';
import { StakeStnd } from './StakeStnd';
import { UnstakeStnd } from './UnstakeStnd';
import { StndStakerHeader } from './StndStakerHeader';
import { CurrencyAmount, Token } from '@digitalnative/standard-protocol-sdk';
import useStndStaker from '../../hooks/stake';
import { useXStndInfo } from '../../hooks/stake/useXStndInfo';
import { CurrencyLogo } from '../CurrencyLogo';
import { ViewportSmallDown } from '../Responsive';
import { formatNumber } from '../../functions';

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
  const { stndBalance: stndTotalStaked, xStndTotalSupply } = useXStndInfo();
  const stndBalanceDecimals = parseFloat(stndTotalStaked?.toExact() ?? '0');
  const xStndTotalSupplyDecimals = parseFloat(
    xStndTotalSupply?.toExact() ?? '0',
  );
  const ratio =
    xStndTotalSupplyDecimals === 0
      ? 1
      : stndBalanceDecimals / xStndTotalSupplyDecimals;
  const onStake = () => setStake(true);
  const onUnstake = () => setStake(false);

  const { enter, leave } = useStndStaker();

  return (
    <div className="md:bg-opaque p-0 md:p-5 rounded-20 w-full h-full">
      <StndStakerHeader stake={stake} onStake={onStake} onUnstake={onUnstake} />
      <ViewportSmallDown>
        <div className="w-full flex justify-center my-4">
          <div
            className="
          bg-opaque-inactive rounded-20
        inline-flex items-center 
        space-x-2 
        rounded-20 px-4 py-2"
          >
            <div className="flex items-center space-x-2">
              <CurrencyLogo
                currency={xStnd}
                className="rounded-full"
                size={24}
              />
              <div className="font-bold">
                1{' '}
                <span className="bg-xstnd bg-clip-text text-transparent">
                  dSTND
                </span>
              </div>
            </div>
            <div>=</div>
            <div className="flex items-center space-x-2">
              <CurrencyLogo
                currency={stnd}
                className="rounded-full"
                size={24}
              />
              <div className="font-bold">
                {formatNumber(ratio)} <span className="text-primary">STND</span>
              </div>
            </div>
          </div>
        </div>
      </ViewportSmallDown>
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
