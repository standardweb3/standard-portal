import {
  classNames,
  formatCurrencyAmount,
  formatNumber,
  formatNumberScale,
  formatPercent,
} from '../../functions';

import { Disclosure } from '@headlessui/react';
import { Image } from '../../components-ui/Image';
import React from 'react';
import { useCurrency } from '../../hooks/Tokens';
import { DoubleCurrencyLogo } from '../../components-ui/CurrencyLogo/DoubleCurrencyLogo';
import { useSizeMdDown, ViewportLargeUp } from '../../components-ui/Responsive';
import { CurrencyAmount, JSBI } from '@digitalnative/standard-protocol-sdk';
import { useTotalSupply } from '../../hooks/useTotalSupply';
import FarmListItemDetailsV2 from './FarmListItemDetailsV2';

const FarmListItemV2 = ({ farm, ...rest }) => {
  const { token0, token1, reserve0, reserve1, amount } = farm;
  const _token0 = useCurrency(farm.token0);
  const _token1 = useCurrency(farm.token1);
  const totalPoolTokens = useTotalSupply(amount?.currency);

  const _reserve0 =
    !!_token0 && CurrencyAmount.fromRawAmount(_token0, reserve0.toString());
  const _reserve1 =
    !!_token1 && CurrencyAmount.fromRawAmount(_token1, reserve1.toString());

  const [token0Amount, token1Amount] =
    !!amount && !!_reserve0 && !!_reserve1 && !!totalPoolTokens
      ? [
          CurrencyAmount.fromRawAmount(
            _token0,
            JSBI.divide(
              JSBI.multiply(amount.quotient, _reserve0.quotient),
              totalPoolTokens.quotient,
            ),
          ),
          CurrencyAmount.fromRawAmount(
            _token1,
            JSBI.divide(
              JSBI.multiply(amount.quotient, _reserve1.quotient),
              totalPoolTokens.quotient,
            ),
          ),
        ]
      : [undefined, undefined];

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
                text-sm md:text-lg`,
            )}
          >
            <div className="grid grid-cols-12 lg:grid-cols-12">
              <div className="col-span-3 lg:col-span-3 flex items-center">
                <div
                  className="
                  inline-flex flex-col lg:flex-row items-center 
                  lg:space-x-4 lg:space-y-0 space-y-2"
                >
                  <DoubleCurrencyLogo
                    currencyClassName="rounded-full"
                    currency0={_token0}
                    currency1={_token1}
                    size={isViewportMediumDown ? 20 : 40}
                  />
                  <div
                    className="
                      flex flex-col justify-center 
                      text-sm lg:text-base"
                  >
                    <div>
                      <span className="font-bold">{_token0?.symbol}</span>/
                      <span className="font-bold">{_token1?.symbol}</span>
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
                        {formatNumber(reward.rewardPerBlock)}
                      </div>
                      <div className="text-xs md:text-sm text-grey">
                        {reward.token}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div
                className="
                  col-span-3 lg:col-span-3
                  space-y-1
                  flex lg:flex-col 
                  items-center
                  lg:items-start
                  "
              >
                <div>
                  <div className="text-sm">
                    {formatNumber(
                      amount ? amount.toExact() : 0,
                      false,
                      true,
                      0.00001,
                    )}{' '}
                    LTR
                  </div>
                  <div className="text-grey text-xs">
                    <div>
                      {!!token0Amount
                        ? formatNumber(
                            token0Amount.toExact(),
                            false,
                            true,
                            0.00001,
                          )
                        : 0}{' '}
                      {_token0?.symbol}
                    </div>
                    <div>
                      {!!token1Amount
                        ? formatNumber(
                            token1Amount.toExact(),
                            false,
                            true,
                            0.00001,
                          )
                        : 0}{' '}
                      {_token1?.symbol}
                    </div>
                  </div>

                  <div className="text-grey">
                    <div>{token0?.symbol}</div>
                    <div> {token1?.symbol}</div>
                  </div>
                </div>
              </div>
              <div
                className="
                  col-span-3 lg:col-span-3
                  space-y-1
                  flex lg:flex-col 
                  items-center
                  lg:items-start
                  "
              >
                <div>
                  <div className="text-sm">
                    {formatNumber(
                      totalPoolTokens ? totalPoolTokens.toExact() : 0,
                      false,
                      true,
                      0.00001,
                    )}{' '}
                    LTR
                  </div>
                  <div className="text-grey text-xs">
                    <div>
                      {!!_reserve0
                        ? formatNumber(
                            _reserve0.toExact(),
                            false,
                            true,
                            0.00001,
                          )
                        : 0}{' '}
                      {_token0?.symbol}
                    </div>
                    <div>
                      {!!_reserve1
                        ? formatNumber(
                            _reserve1.toExact(),
                            false,
                            true,
                            0.00001,
                          )
                        : 0}{' '}
                      {_token1?.symbol}
                    </div>
                  </div>

                  <div className="text-grey">
                    <div>{token0?.symbol}</div>
                    <div> {token1?.symbol}</div>
                  </div>
                </div>
              </div>
            </div>
          </Disclosure.Button>

          {open && (
            <FarmListItemDetailsV2
              farm={farm}
              token0={_token0}
              token1={_token1}
            />
          )}
        </div>
      )}
    </Disclosure>
  );
};

export default FarmListItemV2;
