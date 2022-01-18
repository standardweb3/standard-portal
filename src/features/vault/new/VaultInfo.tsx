import { CurrencyLogo } from '../../../components-ui/CurrencyLogo';
import {
  classNames,
  formatBalance,
  formatNumber,
  formatPercent,
} from '../../../functions';
import { DefinedStyles } from '../../../utils/DefinedStyles';
import Skeleton from 'react-loading-skeleton';
import { Button } from '../../../components-ui/Button';
import { useSizeMdUp } from '../../../components-ui/Responsive';
import { useState } from 'react';
import { CDP_DECIMALS } from '../constants';

type VaultInfoType = {
  totalSupply?: number;
  desiredSupply?: number;
};

export function VaultInfo({ mcr, sfr, collateral, collateralPriceUSD }) {
  const isViewportMediuUp = useSizeMdUp();
  const [expanded, setExpanded] = useState(isViewportMediuUp);

  return (
    <div className="rounded-20 bg-vault-manager-info p-8 text-text">
      <div className="flex flex-col 2xl:flex-row items-start 2xl:items-end md:space-x-8 2xl:space-y-0">
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
                <div>Stability Fee</div>
                <div className="text-3xl font-bold">
                  {sfr !== undefined ? (
                    formatPercent(formatBalance(sfr, CDP_DECIMALS))
                  ) : (
                    <Skeleton count={1} />
                  )}
                </div>
              </div>
              <div className="space-y-1">
                <div>Min. Collateral Ratio </div>
                <div className="text-3xl font-bold">
                  {mcr !== undefined ? (
                    formatPercent(formatBalance(mcr, CDP_DECIMALS))
                  ) : (
                    <Skeleton count={1} />
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
        <div>
          <div className="grid grid-cols-1 xs:grid-cols-2 sm:grid-cols-3 justify-start flex-wrap pb-2 mt-4">
            <div className="mr-8 mt-4 col-span-1">
              <div className="text-sm lg:text-sm text-grey">Current Price</div>
              <div className="md:text-lg lg:text-2xl font-bold">
                {collateralPriceUSD !== undefined ? (
                  <>
                    {formatNumber(collateralPriceUSD)}
                    <span className="font-normal text-base"> USD</span>
                  </>
                ) : (
                  <Skeleton count={1} />
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
