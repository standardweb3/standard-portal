import Skeleton from 'react-loading-skeleton';
import { Question } from '../../../components-ui/Question';
import { formatPercent } from '../../../functions';

export function VaultFees({ sfr, mcr, lfr }) {
  return (
    <div className="w-full rounded-20 bg-background p-8 space-y-6">
      <div className="flex justify-between">
        <div className="text-grey flex items-center space-x-2">
          <div className="text-sm">Min. Collateral Ratio</div>
          <Question
            text="Min. Collateral Ratio is the ratio of the collateral to the borrowed
              USM that will trigger the collateral to be liquidated"
          />
        </div>
        <div className="font-bold">
          {mcr ? formatPercent(mcr) : <Skeleton />}
        </div>
      </div>

      <div className="flex justify-between">
        <div className="text-grey flex items-center space-x-2">
          <div className="text-sm">Stability Fee Ratio </div>
          <Question
            text="Stability Fee is the continuously accruing interest that is due upon
              the repayment of the borrowed tokens"
          />
        </div>
        <div className="font-bold">
          {sfr ? formatPercent(sfr) : <Skeleton />}
        </div>
      </div>

      <div className="flex justify-between">
        <div className="text-grey flex items-center space-x-2">
          <div className="text-sm">Liquidation Fee Ratio</div>
          <Question
            text="
            Liquidation Fee is the fee paid to the liquidator and the protocol
            when the collaterals are liquidated"
          />
        </div>
        <div className="font-bold">
          {lfr ? formatPercent(lfr) : <Skeleton />}
        </div>
      </div>
    </div>
  );
}
