import { classNames } from '../../functions';
import { DividendPair } from './DividendPair';

export type DividendPairsProps = {
  pairsWithDividends: any[];
  share: number;
  className?: string;
  claim: (address: string, name: string) => void;
  ethPrice: any;
};

export function DividendPairs({
  className,
  pairsWithDividends,
  share,
  claim,
}: DividendPairsProps) {
  return (
    <div
      className={classNames(
        'space-y-2 bg-transparent md:bg-opaque md:p-5 rounded-20',
        className,
      )}
    >
      <div className="grid grid-cols-7 lg:grid-cols-7 text-sm text-grey">
        <div className="col-span-2 flex md:justify-start justify-center">
          Pair
        </div>
        <div className="col-span-2">Your Dividend</div>
        <div className="col-span-2">Total Dividend</div>
      </div>
      {pairsWithDividends.map((pair, i) => {
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
