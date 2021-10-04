import { classNames } from '../../functions';
import { DividendPoolWhitelistPairBalance } from '../../state/user/hooks';
import { DividendPair } from './DividendPair';

export type DividendPairsProps = {
  pairsWithDividends: DividendPoolWhitelistPairBalance[];
  share: number;
  className?: string;
  claim: (address: string) => void;
};

export function DividendPairs({
  className,
  pairsWithDividends,
  share,
  claim,
}: DividendPairsProps) {
  return (
    <div className={classNames('space-y-4', className)}>
      <div className="grid grid-cols-6 lg:grid-cols-7 font-bold px-8">
        <div className="col-span-2">Pair</div>
        <div className="col-span-2">Total Dividend</div>
        <div className="col-span-2">Your Dividend</div>
      </div>
      {pairsWithDividends.map((pair) => {
        return (
          <DividendPair
            key={pair.address}
            claim={claim}
            pairWithDividend={pair}
            share={share}
          />
        );
      })}
    </div>
  );
}
