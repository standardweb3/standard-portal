import { classNames } from '../../functions';
import { DividendToken } from './DividendToken';

export type DividendTokensProps = {
  tokensWithDividends: any[];
  share: number;
  className?: string;
  claim: (address: string, name: string) => void;
};

export function DividendTokens({
  className,
  tokensWithDividends,
  share,
  claim,
}: DividendTokensProps) {
  return (
    <div
      className={classNames(
        'space-y-2 bg-transparent md:bg-opaque md:p-5 rounded-20',
        className,
      )}
    >
      <div className="grid grid-cols-7 lg:grid-cols-7 text-sm text-grey">
        <div className="col-span-2 flex md:justify-start justify-center">
          Token
        </div>
        <div className="col-span-2">Your Dividend</div>
        <div className="col-span-2">Total Dividend</div>
      </div>
      {tokensWithDividends.map((token) => {
        return (
          <DividendToken
            key={token.address}
            claim={claim}
            tokenWithDividend={token}
            share={share}
          />
        );
      })}
    </div>
  );
}
