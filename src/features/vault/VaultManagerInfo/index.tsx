import { useState } from 'react';
import Image from '../../../components-ui/Image';
import { formatNumber, formatNumberScale } from '../../../functions';
import { useVaultManager } from '../../../services/graph/hooks/vault';
import Skeleton from 'react-loading-skeleton';
import {
  useSizeMdUp,
  useSizeXs,
  ViewportMediumUp,
} from '../../../components-ui/Responsive';
import styled from '@emotion/styled';

const VaultManagerInfoBg = styled.div`
  position: relative;
  overflow: hidden;

  &:before {
    @media only screen and (max-width: 908px) {
      content: '';
      position: absolute;
      width: 128px;
      height: 128px;
      z-index: -1;
      top: 5px;
      right: 5px;
      background-repeat: no-repeat;
      background-image: url('/img/mtr.png');
      background-size: contain;
    }
  }
`;

export function VaultManagerInfo() {
  const vaultManager = useVaultManager();
  const isViewportMediuUp = useSizeMdUp();
  const [expanded, setExpanded] = useState(isViewportMediuUp);

  const { runningStat, liquidation } = vaultManager ?? {
    runningStat: undefined,
    liquidation: undefined,
  };

  const NumberSkeleton = <Skeleton count={1} />;
  const logoSize = isViewportMediuUp ? '128px' : '78px';

  return (
    <>
      <VaultManagerInfoBg className="rounded-20 bg-vault-manager-info p-8">
        <div className="flex flex-col 2xl:flex-row items-start 2xl:items-end md:space-x-12 2xl:space-y-0">
          <div className="flex items-center md:items-end space-x-8">
            <ViewportMediumUp>
              <Image
                src="https://raw.githubusercontent.com/digitalnativeinc/icons/master/token/stnd.jpg"
                width={logoSize}
                height={logoSize}
                layout="fixed"
                className="rounded-full"
              />
            </ViewportMediumUp>
            <div className="space-y-2 flex-col justify-end pb-2">
              <div className="text-2xl md:text-4xl font-black md:font-bold flex items-center">
                <span>MTR</span>
              </div>
              <div className="flex items-center space-x-4 md:space-x-12">
                <div className="space-y-1">
                  <div className="text-grey md:text-text text-xs md:text-base">
                    Total Supply
                  </div>
                  <div className="text-2xl md:text-3xl font-bold">
                    {vaultManager
                      ? formatNumberScale(vaultManager.currentBorrowed)
                      : NumberSkeleton}
                  </div>
                </div>
                <div className="space-y-1">
                  <div className="text-grey md:text-text text-xs md:text-base">
                    Desired Supply
                  </div>
                  <div className="text-2xl md:text-3xl font-bold">
                    {vaultManager
                      ? formatNumberScale(vaultManager.desiredSupply)
                      : NumberSkeleton}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {(expanded || isViewportMediuUp) && (
            <div className="flex justify-start flex-wrap pb-2 mt-4">
              <div className="mr-8 mt-4">
                <div className="text-grey text-xs md:text-sm lg:text-sm">
                  AMM Reserve
                </div>
                <div className="text-lg font-bold">
                  {runningStat ? (
                    <>
                      {formatNumber(runningStat.currentCollateralizedUSD)}
                      <span className="font-normal text-base"> USD</span>
                    </>
                  ) : (
                    NumberSkeleton
                  )}
                </div>
              </div>
              <div className="mr-8 mt-4">
                <div className="text-grey text-xs md:text-sm lg:text-sm">
                  Collaterals
                </div>
                <div className="text-lg font-bold">
                  {runningStat ? (
                    <>
                      {formatNumber(runningStat.currentCollateralizedUSD)}
                      <span className="font-normal text-base"> USD</span>
                    </>
                  ) : (
                    NumberSkeleton
                  )}
                </div>
              </div>
              <div className="mr-8 mt-4">
                <div className="text-grey text-xs md:text-sm lg:text-sm">
                  Liq. Collaterals
                </div>
                <div className="text-lg font-bold">
                  {liquidation ? (
                    <>
                      {formatNumber(liquidation.liquidationAMMUSD)}
                      <span className="font-normal text-base"> USD</span>
                    </>
                  ) : (
                    NumberSkeleton
                  )}
                </div>
              </div>
              <div className="mr-8 mt-4">
                <div className="text-grey text-xs md:text-sm lg:text-sm">
                  Liq. Fees
                </div>
                <div className="text-lg font-bold">
                  {liquidation ? (
                    <>
                      {formatNumber(liquidation.liquidationFeeUSD)}
                      <span className="font-normal text-base"> USD</span>
                    </>
                  ) : (
                    NumberSkeleton
                  )}
                </div>
              </div>
              <div className="mt-4">
                <div className="text-grey text-xs md:text-sm lg:text-sm">
                  Active Vaults
                </div>
                <div className="text-lg font-bold">
                  {vaultManager
                    ? formatNumberScale(vaultManager.activeVaultCount)
                    : NumberSkeleton}
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
      </VaultManagerInfoBg>
    </>
  );
}
