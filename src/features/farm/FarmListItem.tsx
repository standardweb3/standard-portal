import {
  classNames,
  formatNumber,
  formatNumberScale,
  formatPercent,
} from '../../functions';

import { Disclosure } from '@headlessui/react';
import { Image } from '../../components-ui/Image';
import React from 'react';
import { useCurrency } from '../../hooks/Tokens';
import { DoubleCurrencyLogo } from '../../components-ui/CurrencyLogo/DoubleCurrencyLogo';
import {
  useSizeMdDown,
  ViewportLargeUp,
  ViewportSmallUp,
  ViewportXSmall,
} from '../../components-ui/Responsive';
import dynamic from 'next/dynamic';

const FarmListItemDetails = dynamic(() => import('./FarmListItemDetails'), {
  ssr: false,
});

const FarmListItem = ({ farm, ...rest }) => {
  const token0 = useCurrency(farm.pair.token0.id);
  const token1 = useCurrency(farm.pair.token1.id);
  const amountDecimals = farm.amount ? farm.amount / 1e18 : undefined;

  const totalSupply = parseFloat(farm.pair.totalSupply ?? '0');
  const userShare = amountDecimals ? amountDecimals / totalSupply : 0;

  const isViewportMediumDown = useSizeMdDown();
  return (
    <Disclosure {...rest}>
      {({ open }) => (
        <div>
          <Disclosure.Button
            className={classNames(
              open && 'rounded-b-none',
              `w-full px-4 py-6 
              text-left 
              rounded-20
              cursor-pointer 
              select-none 
              bg-opaque-4
              hover:bg-bright
              transition
              duration-500
              text-sm md:text-lg`,
            )}
          >
            <div className="grid grid-cols-12 sm:grid-cols-15">
              <div className="col-span-3 lg:col-span-3 flex items-center">
                <div
                  className="
                inline-flex flex-col 2xl:flex-row items-center 
                2xl:space-x-4 2xl:space-y-0 space-y-2"
                >
                  <DoubleCurrencyLogo
                    currencyClassName="rounded-full"
                    currency0={token0}
                    currency1={token1}
                    size={isViewportMediumDown ? 20 : 40}
                  />
                  <div
                    className="
                    flex flex-col justify-center 
                    text-sm 2xl:text-base"
                  >
                    <div>
                      <span className="font-bold">
                        {farm?.pair?.token0?.symbol}
                      </span>
                      /
                      <span className="font-bold">
                        {farm?.pair?.token1?.symbol}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
              <div
                className="
                flex items-center
                space-y-2 
                lg:space-y-0 lg:space-x-2 lg:flex 
                col-span-3 lg:col-span-3"
              >
                <ViewportLargeUp>
                  <div className="flex items-center space-x-2">
                    {farm?.rewards?.map((reward, i) => (
                      <div key={i} className="flex items-center">
                        <Image
                          src={reward.icon}
                          width="30px"
                          height="30px"
                          className="rounded-full"
                          layout="fixed"
                          alt={reward.token}
                        />
                      </div>
                    ))}
                  </div>
                </ViewportLargeUp>
                <div className="space-y-2">
                  {farm?.rewards?.map((reward, i) => (
                    <div
                      key={i}
                      className="flex flex-col lg:flex-row items-center space-y-2 lg:space-y-0 lg:space-x-2"
                    >
                      <div
                        className="text-xs md:text-sm whitespace-nowrap
                        rounded-20 bg-background-farm-list px-3 py-2 font-bold"
                      >
                        {formatNumber(reward.rewardPerDay)}
                      </div>
                      <div className="text-xs md:text-sm text-grey">
                        {reward.token}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
              <div className="flex items-center col-span-3 lg:col-span-3">
                <div className="flex items-end justify-center space-x-2">
                  <ViewportXSmall>
                    <div className="font-bold text-right text-sm lg:text-base">
                      {formatPercent(farm?.roiPerYear * 100)}
                    </div>
                  </ViewportXSmall>
                  <ViewportSmallUp>
                    <div className="space-y-1">
                      <div className="font-bold text-right text-base">
                        {formatPercent(farm?.roiPerYear * 100)}
                      </div>
                      <div className="text-xs">
                        {formatPercent(farm?.roiPerMonth * 100)}
                      </div>
                      <div className="text-xs">
                        {formatPercent(farm?.roiPerDay * 100)}
                      </div>

                      {/* {farm?.roiPerYear > 100 ? '10000%+' : formatPercent(farm?.roiPerYear * 100)} */}
                    </div>
                    <div className="text-xs text-left space-y-1">
                      <div className="ml-1 text-grey">/year</div>
                      <div className="ml-1 text-grey">/month</div>
                      <div className="ml-1 text-grey">/day</div>
                      {/* {farm?.roiPerYear > 100 ? '10000%+' : formatPercent(farm?.roiPerYear * 100)} */}
                    </div>
                  </ViewportSmallUp>
                </div>
              </div>
              <div
                className="
                hidden
                sm:flex
                col-span-3 lg:col-span-3
                space-y-1
                lg:flex-col 
                items-center
                justify-center
                lg:items-start
                "
              >
                <div className="text-primary font-bold text-sm sm:text-lg lg:text-xl">
                  {isViewportMediumDown
                    ? formatNumberScale(userShare * farm.pair.reserveUSD, true)
                    : formatNumber(userShare * farm.pair.reserveUSD, true)}
                </div>

                <ViewportLargeUp>
                  <div className="flex items-center space-x-1 text-xs">
                    <div>
                      <div>
                        {formatNumber(Number(farm.pair.reserve0) * userShare)}
                      </div>
                      <div>
                        {' '}
                        {formatNumber(Number(farm.pair.reserve1) * userShare)}
                      </div>
                    </div>
                    <div className="text-grey">
                      <div>{farm.pair.token0.symbol}</div>
                      <div> {farm.pair.token1.symbol}</div>
                    </div>
                  </div>
                </ViewportLargeUp>
              </div>
              <div
                className="
                col-span-3 lg:col-span-3
                space-y-1
                flex lg:flex-col 
                items-center
                justify-center
                lg:items-start
                "
              >
                <div className="text-primary font-bold text-sm sm:text-lg lg:text-xl">
                  {isViewportMediumDown
                    ? formatNumberScale(farm.tvl, true)
                    : formatNumber(farm.tvl, true)}
                </div>
                <ViewportLargeUp>
                  <div className="flex items-center space-x-1 text-xs">
                    <div>
                      <div>
                        {Number(farm.pair.reserve0 * farm.share).toFixed(4)}
                      </div>
                      <div>
                        {' '}
                        {Number(farm.pair.reserve1 * farm.share).toFixed(4)}
                      </div>
                    </div>
                    <div className="text-grey">
                      <div>{farm.pair.token0.symbol}</div>
                      <div> {farm.pair.token1.symbol}</div>
                    </div>
                  </div>
                </ViewportLargeUp>
              </div>
            </div>
          </Disclosure.Button>

          {open && <FarmListItemDetails farm={farm} />}
        </div>
      )}
    </Disclosure>
  );
};

export default FarmListItem;
