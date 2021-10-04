import { useCallback } from 'react';
import { formatNumber } from '../../functions';
import { useToken } from '../../hooks/Tokens';
import { useRemainingClaimTime } from '../../hooks/useBonded';
import { DividendPoolWhitelistPairBalance } from '../../state/user/hooks';
import { Button } from '../Button';
import { DoubleCurrencyLogo } from '../CurrencyLogo/DoubleCurrencyLogo';
import { useSizeXs } from '../Responsive';
import { CountdownTimer } from '../Timer/CountdownTimer';

export type DividendPairProps = {
  pairWithDividend: DividendPoolWhitelistPairBalance;
  share: number;
  claim: (address: string) => void;
};

export function DividendPair({
  pairWithDividend,
  share,
  claim,
}: DividendPairProps) {
  const { token0, token1, amount, address } = pairWithDividend;

  const remainingSeconds = useRemainingClaimTime(address);
  const remaining = remainingSeconds !== null && remainingSeconds > 0;

  const _token0 = useToken(token0);
  const _token1 = useToken(token1);
  const isViewportXs = useSizeXs();

  const reward = Number(amount.toExact()) * share;

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
          currency0={_token0}
          currency1={_token1}
          currencyClassName="rounded-full"
          size={isViewportXs ? 26 : 34}
        />
        <div>
          {_token0.symbol}-{_token1.symbol}
        </div>
      </div>

      <div className="col-span-2 text-sm sm:text-base">
        {formatNumber(amount.toExact(), false, true, 0.00001)} LTR
      </div>

      <div className="col-span-2 text-sm sm:text-base">
        {formatNumber(reward, false, true, 0.00001)} LTR
      </div>
      <div className="flex flex-col mt-4 lg:mt-0 lg:items-end col-span-6 items-center lg:col-span-1 space-y-2">
        <Button
          onClick={handleClaim}
          disabled={share === 0 || remaining}
          className="!font-bold px-8 text-lg"
        >
          {remaining ? <CountdownTimer time={remainingSeconds} /> : 'Claim'}
        </Button>
      </div>
    </div>
  );
}
