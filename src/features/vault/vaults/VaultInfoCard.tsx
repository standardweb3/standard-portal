import { useState } from 'react';
import { Button } from '../../../components-ui/Button';
import { formatBalance, formatNumber, formatPercent } from '../../../functions';
import Skeleton from 'react-loading-skeleton';
import { CurrencyLogo } from '../../../components-ui/CurrencyLogo';
import {
  useSizeMdUp,
  ViewportMediumUp,
  ViewportSmallDown,
} from '../../../components-ui/Responsive';
import { CDP_DECIMALS } from '../constants';

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
  const isViewportMediuUp = useSizeMdUp();
  const [expanded, setExpanded] = useState(false);

  const NumberSkeleton = <Skeleton count={1} />;

  return (
    <div className="rounded-20 bg-vault-manager-info p-8 relative">
      <div className="flex flex-col 2xl:flex-row items-start 2xl:items-center md:space-x-12 2xl:space-y-0">
        <div className="flex items-center md:items-end">
          <ViewportSmallDown>
            <div className="absolute top-[24px] right-[24px] z-[-10]">
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
          <div className="space-y-2 flex-col justify-end pb-2 md:ml-8">
            <div className="flex items-center space-x-4 w-full justify-between">
              <div className="text-2xl md:text-4xl font-black md:font-bold flex items-center">
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
            <div className="flex items-center space-x-4 md:space-x-12">
              <div className="space-y-1">
                <div className="text-grey md:text-text text-xs md:text-base">
                  Collateral
                </div>
                <div className="text-2xl md:text-3xl font-bold">
                  {currentCollateralized !== undefined
                    ? formatNumber(currentCollateralized)
                    : NumberSkeleton}
                  <span className="text-base font-normal ml-2">
                    {collateral ? collateral.symbol : <Skeleton count={1} />}
                  </span>
                </div>
              </div>
              <div className="space-y-1">
                <div className="text-grey md:text-text text-xs md:text-base">
                  Borrowed
                </div>
                <div className="text-2xl md:text-3xl font-bold">
                  {currentBorrowed !== undefined
                    ? formatNumber(currentBorrowed)
                    : NumberSkeleton}
                  <span className="text-base font-normal ml-2">MTR</span>
                </div>
              </div>
            </div>
          </div>
        </div>
        {(expanded || isViewportMediuUp) && (
          <div className="grid grid-cols-1 xs:grid-cols-2 sm:grid-cols-3 justify-start flex-wrap pb-2 mt-4">
            <div className="mr-8 mt-4 col-span-1">
              <div className="text-grey text-xs md:text-sm lg:text-sm">
                Liquidation Price
              </div>
              <div className="text-lg font-bold">
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
              <div className="text-grey text-xs md:text-sm lg:text-sm">
                Current Collateral Price
              </div>
              <div className="text-lg font-bold">
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
              <div className="text-grey text-xs md:text-sm lg:text-sm">
                Accrued Stability Fee
              </div>
              <div className="text-lg font-bold">
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
              <div className="text-grey text-xs md:text-sm lg:text-sm">
                Liquidation Ratio
              </div>
              <div className="text-lg font-bold">
                {mcr !== undefined ? (
                  <>{formatPercent(formatBalance(mcr, CDP_DECIMALS))}</>
                ) : (
                  NumberSkeleton
                )}
              </div>
            </div>
            <div className="mr-8 mt-4 col-span-1">
              <div className="text-grey text-xs md:text-sm lg:text-sm">
                Current Collateral Ratio
              </div>
              <div className="text-lg font-bold">
                {collateralRatio !== undefined ? (
                  <>{formatPercent(collateralRatio)}</>
                ) : (
                  NumberSkeleton
                )}
              </div>
            </div>
            <div className="mr-8 mt-4 col-span-1">
              <div className="text-grey text-xs md:text-sm lg:text-sm">
                Stability Fee Ratio
              </div>
              <div className="text-lg font-bold">
                {sfr !== undefined ? (
                  <>{formatPercent(formatBalance(sfr, CDP_DECIMALS))}</>
                ) : (
                  NumberSkeleton
                )}
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
