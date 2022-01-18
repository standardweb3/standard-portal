import { Button } from '../../../components-ui/Button';
import { CurrencyLogo } from '../../../components-ui/CurrencyLogo';
import { formatPercent } from '../../../functions';
import Skeleton from 'react-loading-skeleton';
import {
  useSizeMdUp,
  ViewportMediumUp,
  ViewportSmallDown,
} from '../../../components-ui/Responsive';
import { useState } from 'react';
import { Question } from '../../../components-ui/Question';

export function CollateralInfo({ mcr, lfr, sfr, collateral, priceUSD }) {
  const isViewportMediuUp = useSizeMdUp();
  const [expanded, setExpanded] = useState(isViewportMediuUp);

  return (
    <div className="rounded-20 bg-vault-manager-info p-8 relative">
      <div className="flex flex-col lg:flex-row items-start lg:items-end md:space-x-12 lg:space-y-0">
        <div className="flex items-center md:items-end">
          <ViewportSmallDown>
            <div className="absolute top-[24px] right-[24px] z-[0] opacity-25">
              <CurrencyLogo
                currency={collateral}
                size="84px"
                className="rounded-full"
              />
            </div>
          </ViewportSmallDown>
          <ViewportMediumUp>
            <CurrencyLogo
              currency={collateral}
              size="128px"
              className="rounded-full"
            />
          </ViewportMediumUp>
          <div className="space-y-2 flex-col justify-end pb-2 md:ml-8 z-[10]">
            <div className="flex items-center space-x-4 w-full justify-between">
              <div className="text-2xl md:text-4xl font-black md:font-bold flex items-center">
                {collateral.symbol}
              </div>
              <Button
                disabled
                type="bordered"
                color={true ? 'success' : 'danger'}
              >
                Rebase
              </Button>
            </div>
            <div className="flex items-center space-x-4 md:space-x-12">
              <div className="space-y-1">
                <div className="flex justify-center space-x-2">
                  <div className="text-grey md:text-text text-xs md:text-base">
                    Stability Fee Rate
                  </div>
                  <Question
                    text="
              Stability Fee is accruing variable-free interest that is due upon the
              repayment of the borrowed tokens. Stability Fee is redistributed to the STND holders."
                  />
                </div>
                <div className="text-2xl md:text-3xl font-bold">
                  {sfr !== undefined ? (
                    formatPercent(sfr)
                  ) : (
                    <Skeleton count={1} />
                  )}
                </div>
              </div>
              <div className="space-y-1">
                <div className="flex justify-center space-x-2">
                  <div className="text-grey md:text-text text-xs md:text-base">
                    Min. Collateral Ratio
                  </div>
                  <Question
                    text="
                    This is the minimum ratio which the borrowed USM must be secured by. 
                    When collateral ratio falls below this ratio, collaterals will be liquidated."
                  />
                </div>
                <div className="text-2xl md:text-3xl font-bold">
                  {mcr !== undefined ? (
                    formatPercent(mcr)
                  ) : (
                    <Skeleton count={1} />
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>

        {(expanded || isViewportMediuUp) && (
          <div className="flex justify-start flex-wrap pb-2 mt-4">
            <div className="mr-8 mt-4">
              <div className="flex justify-center space-x-2">
                <div className="text-sm lg:text-base">Liquidation Fee Rate</div>
                <Question
                  text="
              Liquidation Fee is paid to the liquidator when the collaterals are liquidated."
                />
              </div>
              <div className="md:text-lg lg:text-2xl font-bold">
                {lfr ? formatPercent(lfr) : <Skeleton count={1} />}
              </div>
            </div>
          </div>
        )}
      </div>
      {!isViewportMediuUp && (
        <div className="flex justify-end mt-4">
          <div
            onClick={() => setExpanded(!expanded)}
            className="flex justify-center
            text-xs text-primary 
            rounded-20 
            inline-flex px-3 py-1 cursor-pointer"
          >
            {expanded ? 'Close' : 'View'} details
          </div>
        </div>
      )}
    </div>
  );
}
