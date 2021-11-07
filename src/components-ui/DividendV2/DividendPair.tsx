import { CurrencyAmount, JSBI } from '@digitalnative/standard-protocol-sdk';
import { useCallback } from 'react';
import { formatNumber } from '../../functions';
import { useCurrency } from '../../hooks/Tokens';
import { useRemainingClaimTime } from '../../hooks/useBonded';
import { useTotalSupply } from '../../hooks/useTotalSupply';
import { DividendPoolWhitelistPairBalance } from '../../hooks/dividend/useDividendV2';
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
  const {
    token0,
    token1,
    amount,
    reserve0,
    reserve1,
    address,
  } = pairWithDividend;

  const remainingSeconds = useRemainingClaimTime(address);
  const remaining = remainingSeconds !== null && remainingSeconds > 0;
  const totalPoolTokens = useTotalSupply(amount?.currency);

  const _token0 = useCurrency(token0);
  const _token1 = useCurrency(token1);
  const _reserve0 =
    !!_token0 && CurrencyAmount.fromRawAmount(_token0, reserve0.toString());
  const _reserve1 =
    !!_token1 && CurrencyAmount.fromRawAmount(_token1, reserve1.toString());
  const isViewportXs = useSizeXs();

  const [token0Amount, token1Amount] =
    !!amount && !!_reserve0 && !!_reserve1 && !!totalPoolTokens
      ? [
          CurrencyAmount.fromRawAmount(
            _token0,
            JSBI.divide(
              JSBI.multiply(amount.quotient, _reserve0.quotient),
              totalPoolTokens.quotient,
            ),
          ),
          CurrencyAmount.fromRawAmount(
            _token1,
            JSBI.divide(
              JSBI.multiply(amount.quotient, _reserve1.quotient),
              totalPoolTokens.quotient,
            ),
          ),
        ]
      : [undefined, undefined];

  const [rewardToken0Amount, rewardToken1Amount] =
    !!token0Amount && !!token1Amount
      ? [
          Number(token0Amount.toExact()) * share,
          Number(token1Amount.toExact()) * share,
        ]
      : [undefined, undefined];

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
        <div>{formatNumber(amount.toExact(), false, true, 0.00001)} LTR</div>
        {!!token0Amount && !!token1Amount && (
          <div className="text-grey text-xs">
            <div>
              {formatNumber(token0Amount.toExact(), false, true, 0.00001)}{' '}
              {_token0.symbol}
            </div>
            <div>
              {formatNumber(token1Amount.toExact(), false, true, 0.00001)}{' '}
              {_token1.symbol}
            </div>
          </div>
        )}
      </div>

      <div className="col-span-2 text-sm sm:text-base">
        <div>{formatNumber(reward, false, true, 0.00001)} LTR</div>
        {!!rewardToken0Amount && !!rewardToken0Amount && (
          <div className="text-grey text-xs">
            <div>
              {formatNumber(rewardToken0Amount, false, true, 0.00001)}{' '}
              {_token0.symbol}
            </div>
            <div>
              {formatNumber(rewardToken1Amount, false, true, 0.00001)}{' '}
              {_token1.symbol}
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
