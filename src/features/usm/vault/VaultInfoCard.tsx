import styled from '@emotion/styled';
import { useState } from 'react';
import {
  formatNumber,
  formatPercent,
  shortenAddress,
} from '../../../functions';
import Skeleton from 'react-loading-skeleton';
import { CurrencyLogo } from '../../../components-ui/CurrencyLogo';
import {
  useSizeLgUp,
  ViewportLargeDown,
  ViewportXLargeUp,
} from '../../../components-ui/Responsive';
import { VaultStatusBadge } from '../vaults/VaultStatusBadge';
import { getConditionColor } from '../functions';
import {
  ChevronDownIcon,
  ChevronUpIcon,
  DuplicateIcon,
} from '@heroicons/react/outline';
import Image from '../../../components-ui/Image';
import { ExternalLink } from '../../../components-ui/ExternalLink';
import { useActiveWeb3React } from '../../../hooks';
import { getExplorerLink } from '../../../functions/explorer';
import Copier from '../../../components-ui/Copier';
import { CloseVaultContext, useCloseVaultState } from './CloseVaultContext';
import CloseVaultModal from './CloseVaultModal';
import { Button } from '../../../components-ui/Button';

const Background = styled.div`
  overflow: hidden;
  &:before {
    content: '';
    position: absolute;
    width: 50%;
    height: 100%;
    z-index: 0;
    top: 0%;
    left: 0;
    background: linear-gradient(
      90deg,
      rgba(185, 132, 252, 0.28) 25.52%,
      rgba(251, 162, 134, 0) 100%
    );
  }
`;

export function VaultInfoCard({
  collateral,
  currentCollateralRatio,
  collateralPrice,
  liquidationPrice,
  currentBorrowed,
  currentCollateralized,
  currentCollateralizedValue,
  fee,
  mcr,
  sfr,
  condition,
  address,
  hideCloseVault = false,
  isClosed,
  isLiquidated,
}) {
  const { chainId } = useActiveWeb3React();
  const isViewportLargUp = useSizeLgUp();
  const [expanded, setExpanded] = useState(true);

  const NumberSkeleton = <Skeleton count={1} />;

  const conditionColor = getConditionColor(condition);
  const closeVaultState = useCloseVaultState();

  const handleOpen = () => {
    closeVaultState.setOpen(address);
  };

  let shortenedAddress;
  try {
    shortenedAddress = address && shortenAddress(address);
  } catch (err) {}

  return (
    <>
      <Background
        className="
    w-full rounded-20 bg-background pt-8 pr-8 pl-8 pb-4 xl:pb-8 relative
    flex flex-col items-center cursor-pointer"
      >
        <div className="relative z-[10] w-full">
          <div className="flex justify-start md:justify-end items-center space-x-4 mb-4 md:mb-2">
            <div className="font-semibold text-primary">{shortenedAddress}</div>
            <div className="flex items-center space-x-2">
              <Copier toCopy={address} hideIcon className="!text-primary">
                <DuplicateIcon className="cursor-pointer w-6 h-6 text-primary" />
              </Copier>
              <ExternalLink href={getExplorerLink(chainId, address, 'address')}>
                <Image
                  src="/icons/etherscan.png"
                  width="16px"
                  height="16px"
                  alt={'View on explorer'}
                />
              </ExternalLink>
            </div>
          </div>
          <div className="flex flex-col xl:flex-row items-start xl:items-end xl:space-x-12">
            <ViewportLargeDown>
              <div className="flex items-center space-x-4">
                <CurrencyLogo
                  currency={collateral}
                  size="84px"
                  className="rounded-full"
                />
                <div className="space-y-2">
                  <div className="text-2xl md:text-4xl font-black md:font-bold flex items-center">
                    {collateral && currentCollateralized !== undefined ? (
                      `${formatNumber(currentCollateralized)} ${
                        collateral.symbol
                      }`
                    ) : (
                      <Skeleton count={1} />
                    )}
                  </div>
                  <VaultStatusBadge condition={condition} disableShow />
                </div>
              </div>
            </ViewportLargeDown>
            <div className="flex items-center">
              <ViewportXLargeUp>
                <CurrencyLogo
                  currency={collateral}
                  size="128px"
                  className="rounded-full"
                />
              </ViewportXLargeUp>
              <div className="space-y-2 flex-col justify-end pb-2 xl:ml-8">
                <ViewportXLargeUp>
                  <div className="flex items-center space-x-4 w-full">
                    <div className="text-2xl md:text-4xl font-black md:font-bold flex items-center">
                      {collateral && currentCollateralized !== undefined ? (
                        `${formatNumber(currentCollateralized)} ${
                          collateral.symbol
                        }`
                      ) : (
                        <Skeleton count={1} />
                      )}
                    </div>
                    <VaultStatusBadge condition={condition} disableShow />
                  </div>
                </ViewportXLargeUp>

                <div className="flex items-center flex-wrap">
                  {(expanded || isViewportLargUp) && (
                    <>
                      <div className="mr-12 mt-4">
                        <div className="text-grey text-xs md:text-sm font-bold">
                          Asset Price
                        </div>
                        <div className="text-lg md:text-2xl font-bold">
                          {collateralPrice !== undefined ? (
                            <>${formatNumber(collateralPrice)}</>
                          ) : (
                            NumberSkeleton
                          )}
                        </div>
                      </div>
                      <div className="mr-12 mt-4">
                        <div
                          className={`text-xs md:text-sm font-bold text-grey`}
                        >
                          Liquidation Price
                        </div>
                        <div
                          className={`text-lg md:text-2xl font-bold ${conditionColor}`}
                        >
                          {liquidationPrice !== undefined ? (
                            <>${formatNumber(liquidationPrice)}</>
                          ) : (
                            NumberSkeleton
                          )}
                        </div>
                      </div>
                      <div className="mr-12 mt-4">
                        <div className="text-grey text-xs md:text-sm font-bold">
                          Asset Value
                        </div>
                        <div className="text-lg md:text-2xl font-bold">
                          {currentCollateralizedValue !== undefined ? (
                            <>${formatNumber(currentCollateralizedValue)}</>
                          ) : (
                            NumberSkeleton
                          )}
                        </div>
                      </div>
                      <div className="mr-12 mt-4">
                        <div
                          className={`text-xs md:text-sm font-bold text-grey`}
                        >
                          Collateral Ratio
                        </div>
                        <div className="text-lg md:text-2xl font-bold text-primary">
                          {currentCollateralRatio !== undefined ? (
                            <>{formatPercent(currentCollateralRatio)}</>
                          ) : (
                            NumberSkeleton
                          )}
                        </div>
                      </div>
                      <div className="mr-12 mt-4">
                        <div className="text-grey text-xs md:text-sm font-bold">
                          Min Collateral Ratio
                        </div>
                        <div className="text-lg md:text-2xl font-bold">
                          {mcr !== undefined ? (
                            <>{formatPercent(mcr)}</>
                          ) : (
                            NumberSkeleton
                          )}
                        </div>
                      </div>
                    </>
                  )}
                </div>
              </div>
            </div>
          </div>
          {!isClosed && !isLiquidated && (
            <div className="mt-4 flex justify-end">
              <Button
                type="bordered"
                className="!border !border-4 md:text-lg border-primary !bg-transparent font-bold"
                onClick={handleOpen}
              >
                Close Vault
              </Button>
            </div>
          )}
          {!isViewportLargUp && (
            <div
              onClick={() => setExpanded(!expanded)}
              className="flex justify-center w-full
            rounded-20 
            inline-flex px-3 py-1 cursor-pointer"
            >
              {expanded ? (
                <ChevronUpIcon className="w-5 h-5" />
              ) : (
                <ChevronDownIcon className="w-5 h-5" />
              )}
            </div>
          )}
        </div>
        <CloseVaultContext.Provider value={closeVaultState}>
          <CloseVaultModal
            isOpen={closeVaultState.isOpen}
            onDismiss={closeVaultState.dismiss}
            onConfirm={undefined}
          />
        </CloseVaultContext.Provider>
      </Background>
    </>
  );
}
