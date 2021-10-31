import { classNames } from '../../functions';
import { DividendPoolWhitelistTokenBalance } from '../../state/user/hooks';
import { DividendToken } from './DividendToken';

export type DividendTokensProps = {
  tokensWithDividends: any[];
  share: number;
  className?: string;
  claim: (address: string) => void;
};

export function DividendTokens({
  className,
  tokensWithDividends,
  share,
  claim,
}: DividendTokensProps) {
  return (
    <div className={classNames('space-y-4', className)}>
      <div className="grid grid-cols-6 lg:grid-cols-7 font-bold px-8">
        <div className="col-span-2">Token</div>
        <div className="col-span-2">Total Dividend</div>
        <div className="col-span-2">Your Dividend</div>
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
