import { useCallback } from 'react';
import { formatNumber } from '../../functions';
import { useCurrency } from '../../hooks/Tokens';
import { useRemainingClaimTime } from '../../hooks/useBonded';
import { Button } from '../Button';
import { DoubleCurrencyLogo } from '../CurrencyLogo/DoubleCurrencyLogo';
import { useSizeXs } from '../Responsive';
import { CountdownTimer } from '../Timer/CountdownTimer';

export type DividendPairProps = {
  pairWithDividend: any;
  share: number;
  claim: (address: string) => void;
};

export function DividendPair({
  pairWithDividend,
  share,
  claim,
}: DividendPairProps) {
  const {
    address,
    token0Address,
    token1Address,
    token0Amount,
    token1Amount,
    rewardToken0Amount,
    rewardToken1Amount,
    totalDividendUSD,
    // amount,
  } = pairWithDividend;

  const remainingSeconds = useRemainingClaimTime(address);
  const remaining = remainingSeconds !== null && remainingSeconds > 0;

  const token0 = useCurrency(token0Address);
  const token1 = useCurrency(token1Address);

  const isViewportXs = useSizeXs();

  const reward = totalDividendUSD * share;

  const handleClaim = useCallback(() => {
    claim(address);
  }, [address]);

  return (
    <div
      className="
        bg-opaque-secondary rounded-20 p-8 
        grid grid-cols-6 lg:grid-cols-7
        lg:space-y-0 items-center"
    >
      <div
        className="
        col-span-2 
        flex flex-col 
        sm:flex-row 
        items-center 
        text-sm
        sm:text-base
        font-bold 
        space-y-2
        sm:space-y-0
        sm:space-x-3"
      >
        <DoubleCurrencyLogo
          currency0={token0}
          currency1={token1}
          currencyClassName="rounded-full"
          size={isViewportXs ? 26 : 34}
        />
        <div>
          {token0?.symbol}-{token1?.symbol}
        </div>
      </div>

      <div className="col-span-2 text-sm sm:text-base">
        <div>{formatNumber(totalDividendUSD, true, true, 0.00001)} USD</div>
        {!!token0Amount && !!token1Amount && (
          <div className="text-grey text-xs">
            <div>
              {formatNumber(token0Amount, false, true, 0.00001)} {token0.symbol}
            </div>
            <div>
              {formatNumber(token1Amount, false, true, 0.00001)} {token1.symbol}
            </div>
          </div>
        )}
      </div>

      <div className="col-span-2 text-sm sm:text-base">
        <div>{formatNumber(reward, true, true, 0.00001)} USD</div>
        {!!rewardToken0Amount && !!rewardToken0Amount && (
          <div className="text-grey text-xs">
            <div>
              {formatNumber(rewardToken0Amount, false, true, 0.00001)}{' '}
              {token0?.symbol}
            </div>
            <div>
              {formatNumber(rewardToken1Amount, false, true, 0.00001)}{' '}
              {token1?.symbol}
            </div>
          </div>
        )}
      </div>
      <div className="flex flex-col mt-4 lg:mt-0 lg:items-end col-span-6 items-center lg:col-span-1 space-y-2">
        <Button
          onClick={handleClaim}
          disabled={share === null || share === 0 || remaining}
          className="!font-bold px-8 text-lg"
        >
          {remaining ? <CountdownTimer time={remainingSeconds} /> : 'Claim'}
        </Button>
      </div>
    </div>
  );
}
