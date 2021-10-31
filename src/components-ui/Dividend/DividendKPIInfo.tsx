import { formatPercent } from '../../functions';
import { useBondedStrategy } from '../../services/graph/hooks/dividend';

export type DividendKPIInfoProps = {
  apr: number | null;
  apy: number | null;
  totalRewardUSD: number | null;
  claimedRewardUSD: number | null;
  remainingRewardUSD: number | null;
};

export function DividendKPIInfo({
  apr,
  apy,
  totalRewardUSD,
  claimedRewardUSD,
  remainingRewardUSD,
}: DividendKPIInfoProps) {
  return (
    <div className="grid grid-cols-6 bg-opaque px-8 py-4 rounded-20 space-y-4 lg:space-y-0">
      <div className="flex space-x-12 justify-center lg:justify-start items-center col-span-6 lg:col-span-2">
        <div className="">
          <div className="font-bold text-xl">APR</div>
          <div className="font-bold text-2xl text-green">
            {apr.toFixed(2)}
            <span className="text-xl">%</span>
          </div>
        </div>
        <div className="">
          <div className="font-bold text-xl">APY</div>
          <div className="font-bold text-2xl text-green">
            {apy.toFixed(2)}
            <span className="text-xl">%</span>
          </div>
        </div>
      </div>
      <div className="flex items-center space-x-4 justify-center lg:justify-end col-span-6 lg:col-span-4">
        <div className="">
          <div className="text-sm">Total Reward</div>
          <div className="font-bold text-xl">
            {totalRewardUSD.toFixed(2)}{' '}
            <span className="text-sm font-normal">USD</span>
          </div>
        </div>
        <div className="">
          <div className="text-sm">Claimed Reward</div>
          <div className="font-bold text-xl">
            {claimedRewardUSD.toFixed(2)}{' '}
            <span className="text-sm font-normal">USD</span>
          </div>
        </div>
        <div className="">
          <div className="text-sm">Remaining Reward</div>
          <div className="font-bold text-xl">
            {remainingRewardUSD.toFixed(2)}{' '}
            <span className="text-sm font-normal">USD</span>
          </div>
        </div>
      </div>
    </div>
  );
}
