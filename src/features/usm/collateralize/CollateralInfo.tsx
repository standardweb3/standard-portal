import styled from '@emotion/styled';
import { CurrencyLogo } from '../../../components-ui/CurrencyLogo';
import { formatPercent } from '../../../functions';
import Skeleton from 'react-loading-skeleton';
import {
  useSizeMdUp,
  ViewportLargeDown,
  ViewportXLargeUp,
} from '../../../components-ui/Responsive';
import { useState } from 'react';
import { Question } from '../../../components-ui/Question';
import { ChevronDownIcon, ChevronUpIcon } from '@heroicons/react/outline';

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

export function CollateralInfo({ mcr, lfr, sfr, collateral, collateralPrice }) {
  const isViewportMediuUp = useSizeMdUp();
  const [expanded, setExpanded] = useState(true);

  return (
    <Background className="rounded-20 bg-background p-6 sm:p-8 relative">
      <div className="relative flex flex-col lg:flex-row items-start lg:items-center lg:space-x-12 lg:space-y-0 z-[10]">
        <div className="flex items-center md:items-end">
          <ViewportLargeDown>
            <div className="flex items-center space-x-4">
              <CurrencyLogo
                currency={collateral}
                size="84px"
                className="rounded-full"
              />
              <div className="text-2xl md:text-4xl font-black md:font-bold flex items-center">
                {collateral.symbol}
              </div>
            </div>
          </ViewportLargeDown>
          <ViewportXLargeUp>
            <CurrencyLogo
              currency={collateral}
              size="128px"
              className="rounded-full"
            />
          </ViewportXLargeUp>
        </div>
        <div className="space-y-2 flex-col justify-end xl:ml-8 w-full">
          <ViewportXLargeUp>
            <div className="text-2xl md:text-4xl font-black md:font-bold flex items-center">
              {collateral.symbol}
            </div>
          </ViewportXLargeUp>

          {/* <Button
                disabled
                type="bordered"
                color={true ? 'success' : 'danger'}
              >
                Rebase
              </Button> */}
          {/* </div> */}
          {/* <div className="flex items-center space-x-4 md:space-x-12">
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
            </div> */}

          {(expanded || isViewportMediuUp) && (
            <div className="grid grid-cols-2 xs:grid-cols-3 gap-4 mt-6 w-full">
              <div className="">
                <div className="flex items-center space-x-2">
                  <div className="text-xs sm:text-sm lg:text-base">
                    <span className="whitespace-nowrap">Min. Collateral</span>{' '}
                    Ratio
                  </div>
                  <Question
                    text="
                  This is the minimum ratio which the borrowed USM must be secured by. 
                  When collateral ratio falls below this ratio, collaterals will be liquidated."
                  />
                </div>
                <div className="text-xl sm:text-2xl lg:text-2xl font-bold text-primary">
                  {mcr !== undefined ? (
                    formatPercent(mcr)
                  ) : (
                    <Skeleton count={1} />
                  )}{' '}
                </div>
              </div>
              <div className="">
                <div className="flex items-center space-x-2">
                  <div className="text-xs sm:text-sm lg:text-base">
                    Stability{' '}
                    <span className="whitespace-nowrap">Fee Rate</span>
                  </div>
                  <Question
                    text="
                  Stability Fee is accruing variable-free interest that is due upon the
                  repayment of the borrowed tokens. Stability Fee is redistributed to the STND holders."
                  />
                </div>
                <div className="text-xl sm:text-2xl lg:text-2xl font-bold">
                  {sfr !== undefined ? (
                    formatPercent(sfr)
                  ) : (
                    <Skeleton count={1} />
                  )}{' '}
                </div>
              </div>
              <div className="">
                <div className="flex items-center space-x-2">
                  <div className="text-xs sm:text-sm lg:text-base">
                    Liquidation{' '}
                    <span className="whitespace-nowrap">Fee Rate</span>
                  </div>
                  <Question
                    text="
              Liquidation Fee is paid to the liquidator when the collaterals are liquidated."
                  />
                </div>
                <div className="text-xl sm:text-2xl lg:text-2xl font-bold">
                  {lfr ? formatPercent(lfr) : <Skeleton count={1} />}
                </div>
              </div>
            </div>
          )}
        </div>
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
            )}
          </div>
        )}
      </div>
    </Background>
  );
}
