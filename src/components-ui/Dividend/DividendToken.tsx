import { useCallback } from 'react';
import { formatNumber } from '../../functions';
import { useCurrency } from '../../hooks/Tokens';
import { useRemainingClaimTime } from '../../hooks/useBonded';
import { Button } from '../Button';
import { CurrencyLogo } from '../CurrencyLogo';
import { useSizeXs } from '../Responsive';
import { CountdownTimer } from '../Timer/CountdownTimer';

export type DividendTokenProps = {
  tokenWithDividend: any;
  share: number;
  claim: (address: string) => void;
};

export function DividendToken({
  tokenWithDividend,
  share,
  claim,
}: DividendTokenProps) {
  const {
    address,
    totalDividendUSD,
    rewardUSD,
    amount,
    reward,
  } = tokenWithDividend;

  const remainingSeconds = useRemainingClaimTime(address);
  const remaining = remainingSeconds !== null && remainingSeconds > 0;

  const token = useCurrency(address);
  const isViewportXs = useSizeXs();

  const handleClaim = useCallback(() => {
    claim(address);
  }, [address]);

  return (
    <div
      className="
        min-h-[72px]
        bg-opaque rounded-20 px-2 py-2
        grid grid-cols-7 lg:grid-cols-7
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
        <CurrencyLogo
          currency={token}
          className="rounded-full"
          size={isViewportXs ? 26 : 38}
        />
        <div>{token.symbol}</div>
      </div>

      <div className="col-span-2 text-sm sm:text-base">
        <div className="font-bold truncate">
          {formatNumber(rewardUSD, true, true, 0.00001)} USD
        </div>
        {!!amount && (
          <div className="text-grey text-xs truncate">
            {formatNumber(reward, false, true, 0.00001)} {token.symbol}
          </div>
        )}
      </div>

      <div className="col-span-2 text-sm sm:text-base">
        <div className="font-bold text-primary truncate">
          {formatNumber(totalDividendUSD, true, true, 0.00001)} USD
        </div>
        {!!amount && (
          <div className="text-grey text-xs truncate">
            {formatNumber(amount, false, true, 0.00001)} {token.symbol}
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
