import {
  ChainId,
  Currency,
  Percent,
} from '@digitalnativeinc/standard-protocol-sdk';
import React, { FC, useState } from 'react';

import { Gas } from '../Gas';
// import Settings from './Settings';
import { currencyId } from '../../functions';
import { useActiveWeb3React } from '../../hooks';
import { CalculatorIcon } from '@heroicons/react/solid';

import { useRouter } from 'next/router';
// import MyOrders from '../features/limit-order/MyOrders';
import { NavigationLink } from '../NavigationLink';
import { default as GasIcon } from '../../../public/icons/outlined/gas.svg';
import Settings from '../Settings';

const getQuery = (input, output) => {
  if (!input && !output) return;

  if (input && !output) {
    return { inputCurrency: input.address || 'ETH' };
  } else if (input && output) {
    return { inputCurrency: input.address, outputCurrency: output.address };
  }
};

interface ExchangeHeaderProps {
  input?: Currency;
  output?: Currency;
  allowedSlippage?: Percent;
}

export const ExchangeHeader: FC<ExchangeHeaderProps> = ({
  input,
  output,
  allowedSlippage,
}) => {
  const { chainId } = useActiveWeb3React();
  const router = useRouter();
  //   const [animateWallet, setAnimateWallet] = useState(false);
  const isRemove = router.asPath.startsWith('/remove');
  const isLimitOrder = router.asPath.startsWith('/limit-order');

  return (
    <div
      className={`
      text-text
      flex justify-between items-center
      w-full
      mb-6`}
    >
      <div
        className={`
        rounded-full
        text-grey
        flex items-center
        bg-opaque-inactive
        `}
      >
        <NavigationLink
          activeClassName={`
            bg-opaque
            border
            border-opaque-border
            text-text
            font-bold
          `}
          href={{
            pathname: '/swap',
            query: getQuery(input, output),
          }}
        >
          <a
            className={`
            flex items-center justify-center 
            px-4 py-2
            rounded-full`}
          >
            {`Swap`}
          </a>
        </NavigationLink>
        <NavigationLink
          activeClassName={`
          bg-opaque 
          border 
          border-opaque-border
          text-text
          font-bold
          `}
          href={`/${!isRemove ? 'add' : 'remove'}${
            input ? `/${currencyId(input)}` : ''
          }${output ? `/${currencyId(output)}` : ''}`}
        >
          <a
            className={`
            flex items-center justify-center 
            px-4 py-2
            rounded-full`}
          >
            {`Liquidity`}
          </a>
        </NavigationLink>
      </div>
      <div className="flex items-center text-lg">
        <div className="grid grid-flow-col gap-1">
          {/* {isLimitOrder && (
            <div className="items-center h-full w-full cursor-pointer hover:bg-dark-800 rounded px-3 py-1.5">
              myorders
            </div>
          )
          } */}

          {chainId === ChainId.MAINNET && (
            <div className="flex items-center text-green space-x-1 font-semibold">
              <GasIcon className="fill-current stroke-current text-green" />
              <Gas />
            </div>
          )}
          <div className="relative w-full h-full rounded flex items-center">
            <Settings placeholderSlippage={allowedSlippage} />
          </div>
        </div>
      </div>
    </div>
  );
};
