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
  claim: (address: string, name: string) => void;
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
    claim(address, `${token0.symbol}/${token1.symbol}`);
  }, [address]);

  return (
    <div
      className="
        bg-opaque rounded-20 px-2 py-2
        grid grid-cols-7 lg:grid-cols-7
        lg:space-y-0 items-center"
    >
      <div
        className="
        col-span-2 
        flex flex-col 
        md:flex-row 
        items-center 
        text-sm
        md:text-base
        font-bold 
        space-y-2
        md:space-y-0
        md:space-x-3"
      >
        <DoubleCurrencyLogo
          currency0={token0}
          currency1={token1}
          currencyClassName="rounded-full"
          size={isViewportXs ? 26 : 38}
        />
        <div>
          {token0?.symbol}-{token1?.symbol}
        </div>
      </div>

      <div className="col-span-2 text-sm sm:text-base">
        <div className="font-bold truncate">
          {formatNumber(reward, true, true, 0.00001)} USD
        </div>
        {!!rewardToken0Amount && !!rewardToken0Amount && (
          <div className="text-grey text-xs">
            <div className="truncate">
              {formatNumber(rewardToken0Amount, false, true, 0.00001)}{' '}
              {token0?.symbol}
            </div>
            <div className="truncate">
              {formatNumber(rewardToken1Amount, false, true, 0.00001)}{' '}
              {token1?.symbol}
            </div>
          </div>
        )}
      </div>

      <div className="col-span-2 text-sm sm:text-base">
        <div className="font-bold text-primary truncate">
          {formatNumber(totalDividendUSD, true, true, 0.00001)} USD
        </div>
        {!!token0Amount && !!token1Amount && (
          <div className="text-grey text-xs">
            <div className="truncate">
              {formatNumber(token0Amount, false, true, 0.00001)} {token0.symbol}
            </div>
            <div className="truncate">
              {formatNumber(token1Amount, false, true, 0.00001)} {token1.symbol}
            </div>
          </div>
        )}
      </div>

      <div className="flex flex-col mt-4 lg:mt-0 lg:items-center col-span-1 items-center lg:col-span-1 space-y-2">
        <Button
          onClick={handleClaim}
          disabled={share === null || share === 0 || remaining}
          className="!font-bold px-4 py-2 text-base"
        >
          {remaining ? <CountdownTimer time={remainingSeconds} /> : 'Claim'}
        </Button>
      </div>
    </div>
  );
}
