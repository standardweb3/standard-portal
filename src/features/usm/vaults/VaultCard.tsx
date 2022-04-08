import { CurrencyLogo } from '../../../components-ui/CurrencyLogo';
import { useCurrency } from '../../../hooks/Tokens';
import Skeleton from 'react-loading-skeleton';
import { formatNumber } from '../../../functions';
import styled from '@emotion/styled';
import router from 'next/router';
import { VaultStatusBadge } from './VaultStatusBadge';
import { VaultCondition } from '../../../pages/vaults';
import { useContext, useState } from 'react';
import { VaultProgressBar } from '../vault/VaultProgressBar';
import { useSizeXs } from '../../../components-ui/Responsive';
import { CloseVaultContext } from '../vault/CloseVaultContext';
import { MAX_COLLATERAL_RATIO } from '../constants';

const Radiation = styled.div`
  filter: drop-shadow(0px 4px 10px rgba(195, 159, 159, 0.25));
  border-radius: 50%;
`;

const Radiation2 = styled.div`
  filter: drop-shadow(0px 0px 4px rgba(195, 159, 159, 0.75));
  border-radius: 25%;
`;

const inactiveBg =
  'linear-gradient(180deg, rgba(191, 191, 191, 0.34) 25.52%, rgba(191, 191, 191, 0.0272) 100%)';
const safeBg =
  'linear-gradient(180deg, rgba(0, 143, 58, 0.34) 25.52%, rgba(0, 143, 58, 0.0272) 100%)';
const warningBg =
  'linear-gradient(180deg, rgba(210, 150, 10, 0.34) 25.52%, rgba(249, 212, 124, 0.0136) 100%)';
const dangerBg =
  'linear-gradient(180deg, rgba(201, 77, 77, 0.44) 25.52%, rgba(251, 162, 134, 0) 100%)';

const Background = styled.div<{ condition: VaultCondition }>`
  overflow: hidden;
  &:before {
    content: '';
    position: absolute;
    width: 100%;
    height: 50%;
    z-index: 0;
    top: 0;
    left: 0;
    background: ${(props) =>
      props.condition === VaultCondition.CLOSED ||
      props.condition === VaultCondition.LIQUIDATED
        ? inactiveBg
        : props.condition === VaultCondition.WARNING
        ? warningBg
        : props.condition === VaultCondition.DANGER
        ? dangerBg
        : safeBg};
  }
`;

export function VaultCard({
  address,
  collateralAddress,
  collateralPrice,
  liquidationPrice,
  mcr,
  condition,
  currentBorrowed,
  currentCollateralized,
  id,
  debt,
  fee,
  isWnative,
  isClosed = false,
  isLiquidated = false,
  liquidation = null,
  initialExpand = false,
  ownership = false,
}) {
  const { setOpen } = useContext(CloseVaultContext);
  
  const handleOpen = (e) => {
    e.stopPropagation();
    e.preventDefault();
    setOpen(address);
  };

  const [expand, setExpand] = useState(initialExpand);
  const toggleExpand = () => setExpand(!expand);

  const isViewportXs = useSizeXs();

  const collateral = useCurrency(collateralAddress);

  const collateralValueUSD =
    collateralPrice !== undefined
      ? collateralPrice * parseFloat(currentCollateralized)
      : undefined;

  const collateralRatio = debt ? (collateralValueUSD / debt) * 100 : 0;

  const handleClick = () => {
    router.push(`/vault/${address}`);
  };

  const imageSize = isViewportXs ? '58px' : '72px';

  return (
    <Background
      condition={condition}
      className="
        w-full px-8 py-8 sm:p-8 text-text relative 
        flex flex-col rounded-20 items-center cursor-pointer
        bg-background hover:scale-[1.03] hover:bg-bright
        transition duration-500
        h-[215px] sm:h-[315px] md:h-[315px]"
      onClick={handleClick}
    >
      <div className="z-[1] min-w-full xs:min-w-[75%] sm:min-w-none">
        <div className="flex sm:flex-col space-x-4 justify-between items-center sm:items-start sm:space-x-0">
          <div className="flex space-x-4 items-center justify-between">
            <Radiation>
              {collateral ? (
                <CurrencyLogo
                  currency={collateral}
                  className="rounded-full"
                  size={imageSize}
                />
              ) : (
                <Skeleton circle width={imageSize} height={imageSize} />
              )}
            </Radiation>
            <div className="space-y-1">
              <div className="text-right">
                <div className="text-grey text-xs -mb-1">#{id}</div>

                <div className="font-bold text-xl sm:text-2xl">
                  {collateral ? (
                    isWnative ? (
                      collateral.symbol.substring(1)
                    ) : (
                      collateral.symbol
                    )
                  ) : (
                    <Skeleton count={1} />
                  )}
                </div>
              </div>
              {condition !== VaultCondition.UNKNWON && (
                <Radiation2>
                  <VaultStatusBadge
                    collateralPrice={collateralPrice}
                    liquidationPrice={liquidationPrice}
                    condition={condition}
                  />
                </Radiation2>
              )}
            </div>
          </div>
          <div>
            <div className="flex flex-col w-full sm:mt-4">
              <div className="text-xs sm:text-sm text-grey">Borrowed</div>
              <div className="font-bold text-sm">
                {currentBorrowed !== undefined ? (
                  formatNumber(currentBorrowed, true)
                ) : (
                  <Skeleton count={1} />
                )}
              </div>
            </div>
            {!isLiquidated && (
              <div className="flex flex-col w-full mt-1">
                <div className="text-xs sm:text-sm text-grey">
                  Collateralized
                </div>
                <div className="font-bold text-sm">
                  {collateralValueUSD !== undefined ? (
                    formatNumber(collateralValueUSD, true)
                  ) : (
                    <Skeleton count={1} />
                  )}
                </div>
              </div>
            )}
            {isLiquidated && (
              <div className="flex flex-col w-full mt-1">
                <div className="text-xs sm:text-sm text-grey">Liquidated</div>
                <div className="font-bold text-sm">
                  {liquidation !== null ? (
                    `${formatNumber(liquidation?.liquidationAmount)} ${
                      isWnative
                        ? collateral?.symbol?.substring(1)
                        : collateral?.symbol
                    }`
                  ) : (
                    <Skeleton count={1} />
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
        {isClosed ? (
          <div className='flex items-center justify-center mt-8 text-grey text-sm'>The vault has been closed</div>
        ) : isLiquidated ? (
          <div className='flex items-center justify-center mt-8 text-grey text-sm'>The vault has been liquidated</div>
        ) : (
          <VaultProgressBar
            minRatio={mcr}
            maxRatio={MAX_COLLATERAL_RATIO}
            condition={condition}
            currentRatio={collateralRatio}
          />
        )}
      </div>
      {ownership && !isClosed && !isLiquidated && (
        <div
          className="text-primary text-sm cursor-pointer"
          onClick={handleOpen}
        >
          Close Vault
        </div>
      )}
    </Background>
  );
}
