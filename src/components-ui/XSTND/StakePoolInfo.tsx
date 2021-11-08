import { CurrencyAmount, Token } from '@digitalnative/standard-protocol-sdk';
import { classNames, formatNumber } from '../../functions';
import { CurrencyLogo } from '../CurrencyLogo';

export type StakePoolInfoTypes = {
  stnd: Token;
  xStndPerDay: number;
  stakePoolStndTotal: CurrencyAmount<Token> | undefined;
  className?: string;
};

export function StakePoolInfo({
  stnd,
  stakePoolStndTotal,
  xStndPerDay,
  className,
}: StakePoolInfoTypes) {
  return (
    <div
      className={classNames(
        'flex flex-col justify-center bg-opaque p-5 rounded-20 space-y-4',
        className,
      )}
    >
      <div className="flex flex-col items-center space-y-2">
        <div className="text-sm">Total staked STND</div>
        <div className="flex items-center space-x-2">
          <CurrencyLogo currency={stnd} size={24} className="rounded-full" />
          <div className="text-xl font-bold text-primary">
            {formatNumber(parseFloat(stakePoolStndTotal?.toExact() ?? '0'))}{' '}
            STND
          </div>
        </div>
      </div>
      <div className="flex flex-col items-center space-y-2">
        <div className="text-sm">Daily minted xSTND</div>

        <div className="flex items-center space-x-2">
          <CurrencyLogo currency={stnd} size={24} className="rounded-full" />
          <div className="text-xl font-bold text-primary">
            {formatNumber(xStndPerDay)} xSTND
          </div>
        </div>
      </div>
    </div>
  );
}
