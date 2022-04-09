import styled from '@emotion/styled';
import { useMemo, useState } from 'react';
import { formatNumber, formatNumberScale } from '../../../functions';
import {
  useVaultManager,
  useVaultCollateralReserves,
  useCdpPrices,
} from '../../../services/graph/hooks';
import Skeleton from 'react-loading-skeleton';
import {
  useSizeMdUp,
  ViewportLargeUp,
  ViewportMediumDown,
} from '../../../components-ui/Responsive';
import { SimpleCurrencyLogo } from '../../../components-ui/CurrencyLogo/SimpleCurrencyLogo';
import { ChevronDownIcon, ChevronUpIcon } from '@heroicons/react/outline';
import { Alert } from '../../../components-ui/Alert';

// const VaultManagerInfoBg = styled.div`
//   position: relative;
//   overflow: hidden;

//   &:before {
//     @media only screen and (max-width: 908px) {
//       content: '';
//       position: absolute;
//       width: 128px;
//       height: 128px;
//       z-index: -1;
//       top: 5px;
//       right: 5px;
//       background-repeat: no-repeat;
//       background-image: url('/img/mtr.png');
//       background-size: contain;
//     }
//   }
// `;

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

export function VaultManagerInfo() {
  const vaultManager = useVaultManager();
  const cdpPrices = useCdpPrices();
  const collateralReserves = useVaultCollateralReserves();

  const totalCollateralizedUSD = useMemo(() => {
    return collateralReserves?.reduce((sum, item) => {
      return (
        sum +
          cdpPrices[item.collateral]?.price *
            parseFloat(item.currentCollateralized) ?? 0
      );
    }, 0);
  }, [cdpPrices, collateralReserves]);

  // const renderReserves = () => {
  //   return collateralReserves?.map((reserve, index) => {
  //     return (
  //       <div className="mr-8 mt-4" key={index}>
  //         <div className="text-grey text-xs md:text-sm lg:text-sm">
  //           Collateralized {reserve.cdp.symbol}
  //         </div>
  //         <div className="text-lg font-bold">
  //           {runningStat ? (
  //             <>
  //               {formatNumber(reserve.currentCollateralized)}
  //               <span className="font-normal text-base">
  //                 {' '}
  //                 {reserve.cdp.symbol}
  //               </span>
  //             </>
  //           ) : (
  //             NumberSkeleton
  //           )}
  //         </div>
  //       </div>
  //     );
  //   });
  // };

  const isMintable =
    vaultManager && vaultManager.rebaseActive
      ? parseFloat(vaultManager.currentBorrowed) <
        parseFloat(vaultManager.desiredSupply)
      : true;

  const mintableSupply =
    vaultManager && vaultManager.rebaseActive
      ? isMintable
        ? Math.max(
            parseFloat(vaultManager.desiredSupply) -
              parseFloat(vaultManager.currentBorrowed),
            0,
          )
        : 0
      : undefined;

  const isViewportMediuUp = useSizeMdUp();
  const [expanded, setExpanded] = useState(true);

  const { runningStat, liquidation } = vaultManager ?? {
    runningStat: undefined,
    liquidation: undefined,
  };

  const NumberSkeleton = <Skeleton count={1} />;

  return (
    <>
      <Background className="rounded-20 bg-background p-8 relative">
        <div className="flex flex-col lg:flex-col items-start z-[10] relative">
          <div className="flex items-center md:items-end">
            {/* <ViewportSmallDown>
              <div className="absolute top-[24px] right-[24px] z-[0] opacity-25">
                <SimpleCurrencyLogo
                  symbol="mtr"
                  size="84px"
                  className="rounded-full"
                />
              </div>
            </ViewportSmallDown> */}
            <ViewportLargeUp>
              <SimpleCurrencyLogo
                symbol="mtr"
                size="128px"
                className="rounded-full"
              />
            </ViewportLargeUp>
            <div className="space-y-2 flex-col justify-end pb-2 lg:ml-8">
              <div className="text-2xl !mb-4 md:mb-0 md:text-4xl font-black md:font-bold flex items-center">
                <ViewportMediumDown>
                  <div className="mr-2">
                    <SimpleCurrencyLogo
                      symbol="mtr"
                      size="84px"
                      className="rounded-full"
                    />
                  </div>
                </ViewportMediumDown>
                <span>USM</span>
              </div>
              <div className="flex flex-wrap items-center gap-x-12 gap-y-4">
                <div className="space-y-1">
                  <div className="text-grey md:text-text text-xs md:text-base whitespace-nowrap">
                    Total Supply
                  </div>
                  <div className="text-2xl md:text-3xl font-bold">
                    {vaultManager
                      ? formatNumberScale(vaultManager.currentBorrowed)
                      : NumberSkeleton}
                  </div>
                </div>
                {vaultManager?.rebaseActive ? (
                  <>
                    <div className="space-y-1">
                      <div className="text-grey md:text-text text-xs md:text-base whitespace-nowrap">
                        Desired Supply
                      </div>
                      <div className="text-2xl md:text-3xl font-bold">
                        {vaultManager
                          ? formatNumberScale(vaultManager.desiredSupply)
                          : NumberSkeleton}
                      </div>
                    </div>
                    <div className="space-y-1">
                      <div className="text-grey md:text-text text-xs md:text-base whitespace-nowrap">
                        Mintable USM
                      </div>
                      <div className="text-2xl md:text-3xl font-bold text-primary">
                        {mintableSupply !== undefined
                          ? formatNumberScale(mintableSupply)
                          : NumberSkeleton}
                      </div>
                    </div>
                  </>
                ) : (
                  <div className="space-y-1">
                    <div className="text-grey md:text-text text-xs md:text-base whitespace-nowrap">
                      Desired Supply Rebase
                    </div>
                    <div className="text-2xl md:text-3xl font-bold text-grey">
                      Inactive
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>

          {(expanded || isViewportMediuUp) && (
            <div className="flex justify-start flex-wrap pb-2 mt-4">
              <div className="mr-8 mt-4">
                <div className="text-grey text-xs md:text-sm lg:text-sm">
                  Total Collateralized (Vaults)
                </div>
                <div className="text-lg font-bold">
                  {totalCollateralizedUSD ? (
                    <>
                      {formatNumber(totalCollateralizedUSD)}
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
          {!isViewportMediuUp && (
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
              )}{' '}
            </div>
          )}
        </div>
      </Background>
      {!isMintable && (
        <Alert
          className="mt-4"
          type="error"
          dismissable={false}
          message={
            <div className="p-0 md:p-4">
              <div className="text-xl font-bold">Borrowing Disabled</div>
              <div>
                Supply limit of USM has been reached and borrowing USM is
                restricted.
              </div>
            </div>
          }
        />
      )}
    </>
  );
}
