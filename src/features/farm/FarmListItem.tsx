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
import { useActiveWeb3React } from '../../hooks';
import {
  ChainId,
  CurrencyAmount,
  JSBI,
} from '@digitalnative/standard-protocol-sdk';
import { useEthPrice } from '../../services/graph';
import { useTotalSupply } from '../../hooks/useTotalSupply';

const FarmListItemDetails = dynamic(() => import('./FarmListItemDetails'), {
  ssr: false,
});

const FarmListItem = ({ farm, ...rest }) => {
  const { chainId } = useActiveWeb3React();
  const token0 = useCurrency(farm.pair.token0.id);
  const token1 = useCurrency(farm.pair.token1.id);
  const amountDecimals = farm.amount ? farm.amount / 1e18 : undefined;

  const totalSupply = farm.pair.totalSupply;
  const userShare = amountDecimals ? amountDecimals / totalSupply : 0;
  const ethPrice = useEthPrice();
  const token0price =
    farm.pair && parseFloat(farm.pair.token0.derivedETH) * parseFloat(ethPrice);
  const token1price =
    farm.pair && parseFloat(farm.pair.token1.derivedETH) * parseFloat(ethPrice);

  const totalPoolTokens = useTotalSupply(
    chainId === ChainId.METIS ? farm.farmAlt?.amount?.currency : undefined,
  );

  const _reserve0alt =
    farm.farmAlt &&
    !!token0 &&
    CurrencyAmount.fromRawAmount(token0, farm.farmAlt.reserve0?.toString());
  const _reserve1alt =
    farm.farmAlt &&
    !!token1 &&
    CurrencyAmount.fromRawAmount(token1, farm.farmAlt.reserve1?.toString());
  const [token0Amount, token1Amount] =
    farm.farmAlt && _reserve0alt && _reserve1alt && totalPoolTokens
      ? [
          CurrencyAmount.fromRawAmount(
            token0,
            JSBI.divide(
              JSBI.multiply(
                farm.farmAlt.amount.quotient,
                _reserve0alt.quotient,
              ),
              totalPoolTokens.quotient,
            ),
          ),
          CurrencyAmount.fromRawAmount(
            token1,
            JSBI.divide(
              JSBI.multiply(
                farm.farmAlt.amount.quotient,
                _reserve1alt.quotient,
              ),
              totalPoolTokens.quotient,
            ),
          ),
        ]
      : [undefined, undefined];

  const token0decimals =
    token0Amount && parseFloat(token0Amount.toExact()) * token0price;

  const token1decimals =
    token0Amount && parseFloat(token1Amount.toExact()) * token1price;

  const altTVL =
    token0decimals && token1decimals && token0decimals + token1decimals;

  let altRoiB =
    chainId === ChainId.METIS &&
    altTVL &&
    farm.rewards.reduce((previousValue, currentValue) => {
      return (
        previousValue + currentValue.rewardPerBlock * currentValue.rewardPrice
      );
    }, 0) / (altTVL > 0 ? altTVL : 1);
  let altRoiH = altRoiB && altRoiB * farm.averageBlockTime;
  let altRoiD = altRoiB && altRoiH * 24;
  let altRoiM = altRoiB && altRoiD * 30;
  let altRoiY = altRoiB && altRoiM * 12;

  // const [token0Amount, token1Amount] =
  // !!_reserve0alt && !!_reserve1alt &&
  //   ? [
  //       CurrencyAmount.fromRawAmount(
  //         token0,
  //         JSBI.divide(
  //           JSBI.multiply(amount.quotient, _reserve0.quotient),
  //           totalPoolTokens.quotient,
  //         ),
  //       ),
  //       CurrencyAmount.fromRawAmount(
  //         token1,
  //         JSBI.divide(
  //           JSBI.multiply(amount.quotient, _reserve1.quotient),
  //           totalPoolTokens.quotient,
  //         ),
  //       ),
  //     ]
  //   : [undefined, undefined];
  // const _reserve0altDec =
  //   _reserve0alt && parseFloat(_reserve0alt.toExact()) * token0price;

  // const _reserve1altDec =
  //   _reserve1alt && parseFloat(_reserve1alt.toExact()) * token1price;

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
              bg-opaque-farm-list
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
                {chainId !== ChainId.METIS ? (
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
                ) : altRoiB ? (
                  <div className="flex items-end justify-center space-x-2">
                    <ViewportXSmall>
                      <div className="font-bold text-right text-sm lg:text-base">
                        {formatPercent(altRoiY * 100)}
                      </div>
                    </ViewportXSmall>
                    <ViewportSmallUp>
                      <div className="space-y-1">
                        <div className="font-bold text-right text-base">
                          {formatPercent(altRoiY * 100)}
                        </div>
                        <div className="text-xs">
                          {formatPercent(altRoiM * 100)}
                        </div>
                        <div className="text-xs">
                          {formatPercent(altRoiD * 100)}
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
                ) : null}
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
                {chainId !== ChainId.METIS ? (
                  <div className="text-primary font-bold text-sm sm:text-lg lg:text-xl">
                    {isViewportMediumDown
                      ? formatNumberScale(
                          userShare * farm.pair.reserveUSD,
                          true,
                        )
                      : formatNumber(userShare * farm.pair.reserveUSD, true)}
                  </div>
                ) : (
                  <div className="text-primary font-bold text-sm sm:text-lg lg:text-xl">
                    {isViewportMediumDown
                      ? formatNumberScale(
                          Number(farm.pair.reserve0) * userShare * token0price +
                            Number(farm.pair.reserve1) *
                              userShare *
                              token1price,
                          true,
                        )
                      : formatNumberScale(
                          Number(farm.pair.reserve0) * userShare * token0price +
                            Number(farm.pair.reserve1) *
                              userShare *
                              token1price,
                          true,
                        )}
                  </div>
                )}
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
                {chainId !== ChainId.METIS ? (
                  <div className="text-primary font-bold text-sm sm:text-lg lg:text-xl">
                    {isViewportMediumDown
                      ? formatNumberScale(farm.tvl, true)
                      : formatNumber(farm.tvl, true)}
                  </div>
                ) : altTVL ? (
                  <div className="text-primary font-bold text-sm sm:text-lg lg:text-xl">
                    {isViewportMediumDown
                      ? formatNumberScale(altTVL, true)
                      : formatNumber(altTVL, true)}
                  </div>
                ) : null}
                {chainId !== ChainId.METIS && (
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
                )}
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
