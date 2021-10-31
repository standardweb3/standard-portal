import { useCallback } from 'react';
import { formatNumber } from '../../functions';
import { useRemainingClaimTime } from '../../hooks/useBonded';
import { DividendPoolWhitelistTokenBalance } from '../../state/user/hooks';
import { Button } from '../Button';
import { CurrencyLogo } from '../CurrencyLogo';
import { useSizeXs } from '../Responsive';
import { CountdownTimer } from '../Timer/CountdownTimer';

export type DividendTokenProps = {
  tokenWithDividend: DividendPoolWhitelistTokenBalance;
  share: number;
  claim: (address: string) => void;
};

export function DividendToken({
  tokenWithDividend,
  share,
  claim,
}: DividendTokenProps) {
  const { token, amount } = tokenWithDividend;

  const remainingSeconds = useRemainingClaimTime(token.address);
  const remaining = remainingSeconds !== null && remainingSeconds > 0;
  // const totalPoolTokens = useTotalSupply(amount?.currency);

  // const _reserve0 =
  //   !!_token0 && CurrencyAmount.fromRawAmount(_token0, reserve0.toString());
  // const _reserve1 =
  //   !!_token1 && CurrencyAmount.fromRawAmount(_token1, reserve1.toString());
  const isViewportXs = useSizeXs();

  const reward = Number(amount.toExact()) * share;

  const handleClaim = useCallback(() => {
    claim(token.address);
  }, [token]);

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
        <CurrencyLogo
          currency={token}
          className="rounded-full"
          size={isViewportXs ? 26 : 34}
        />
        <div>{token.symbol}</div>
      </div>

      <div className="col-span-2 text-sm sm:text-base">
        <div>
          {formatNumber(amount.toExact(), false, true, 0.00001)} {token.symbol}
        </div>
      </div>

      <div className="col-span-2 text-sm sm:text-base">
        <div>
          {formatNumber(reward, false, true, 0.00001)} {token.symbol}
        </div>
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
