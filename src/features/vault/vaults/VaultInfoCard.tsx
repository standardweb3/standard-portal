import { useState } from 'react';
import { Button } from '../../../components-ui/Button';
import Image from '../../../components-ui/Image';
import {
  formatNumber,
  formatNumberScale,
  formatPercent,
} from '../../../functions';
import Skeleton from 'react-loading-skeleton';
import { CurrencyLogo } from '../../../components-ui/CurrencyLogo';

export function VaultInfoCard({
  collateral,
  collateralPriceUSD,
  liquidationPriceUSD,
  currentBorrowed,
  currentCollateralized,
  currentCollateralizedUSD,
  accruedStabilityFee,
  mcr,
  sfr,
  collateralRatio,
}) {
  const [expanded, setExpanded] = useState(false);

  const NumberSkeleton = <Skeleton count={1} />;

  return (
    <div className="rounded-20 bg-vault-manager-info p-8 text-text">
      <div className="flex flex-col 2xl: justify-between 2xl:flex-row items-start 2xl:items-end space-x-8 2xl:space-y-0">
        <div className="flex items-end space-x-8">
          <CurrencyLogo
            size="128px"
            currency={collateral}
            className="rounded-full"
          />
          <div className="space-y-2 flex-col justify-end pb-2">
            <div className="flex items-center space-x-4 w-full justify-between">
              <div className="text-4xl font-bold">
                {collateral ? collateral.symbol : <Skeleton count={1} />}
              </div>
              <Button
                disabled
                type="bordered"
                color={true ? 'success' : 'danger'}
              >
                Rebase
              </Button>
            </div>
            <div className="flex items-center space-x-12">
              <div className="space-y-1">
                <div>Collateral</div>
                <div className="text-3xl font-bold">
                  {currentCollateralized !== undefined
                    ? formatNumber(currentCollateralized)
                    : NumberSkeleton}
                </div>
              </div>
              <div className="space-y-1">
                <div>Borrowed </div>
                <div className="text-3xl font-bold">
                  {currentBorrowed !== undefined
                    ? formatNumber(currentBorrowed)
                    : NumberSkeleton}
                </div>
              </div>
            </div>
          </div>
        </div>
        <div>
          <div className="grid grid-cols-1 xs:grid-cols-2 sm:grid-cols-3 justify-start flex-wrap pb-2 mt-4">
            <div className="mr-8 mt-4 col-span-1">
              <div className="text-sm lg:text-sm text-grey">
                Liquidation Price
              </div>
              <div className="md:text-lg lg:text-2xl font-bold">
                {liquidationPriceUSD !== undefined ? (
                  <>
                    {formatNumber(liquidationPriceUSD)}
                    <span className="font-normal text-base"> USD</span>
                  </>
                ) : (
                  NumberSkeleton
                )}
              </div>
            </div>
            <div className="mr-8 mt-4 col-span-1">
              <div className="text-sm lg:text-sm text-grey">
                Current Collateral Price
              </div>
              <div className="md:text-lg lg:text-2xl font-bold">
                {collateralPriceUSD !== undefined ? (
                  <>
                    {formatNumber(collateralPriceUSD)}
                    <span className="font-normal text-base"> USD</span>
                  </>
                ) : (
                  NumberSkeleton
                )}
              </div>
            </div>
            <div className="mr-8 mt-4 col-span-1">
              <div className="text-sm lg:text-sm text-grey">
                Accrued Stability Fee
              </div>
              <div className="md:text-lg lg:text-2xl font-bold">
                {accruedStabilityFee !== undefined ? (
                  <>
                    {formatNumber(accruedStabilityFee)}
                    <span className="font-normal text-base"> USD</span>
                  </>
                ) : (
                  NumberSkeleton
                )}
              </div>
            </div>
            <div className="mr-8 mt-4 col-span-1">
              <div className="text-sm lg:text-sm text-grey">
                Liquidation Ratio
              </div>
              <div className="md:text-lg lg:text-2xl font-bold">
                {mcr !== undefined ? <>{formatPercent(mcr)}</> : NumberSkeleton}
              </div>
            </div>
            <div className="mr-8 mt-4 col-span-1">
              <div className="text-sm lg:text-sm text-grey">
                Current Collateral Ratio
              </div>
              <div className="md:text-lg lg:text-2xl font-bold">
                {collateralRatio !== undefined ? (
                  <>{formatPercent(collateralRatio)}</>
                ) : (
                  NumberSkeleton
                )}
              </div>
            </div>
            <div className="mr-8 mt-4 col-span-1">
              <div className="text-sm lg:text-sm text-grey">
                Stability Fee Ratio
              </div>
              <div className="md:text-lg lg:text-2xl font-bold">
                {sfr !== undefined ? <>{formatPercent(sfr)}</> : NumberSkeleton}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
