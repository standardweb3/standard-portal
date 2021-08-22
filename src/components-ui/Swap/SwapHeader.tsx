import { ChainId, Currency, Percent } from '@sushiswap/sdk';
import React, { FC, useState } from 'react';

// import Gas from './Gas';
// import Settings from './Settings';
import { currencyId } from '../../functions';
import { useActiveWeb3React } from '../../hooks';
import { CalculatorIcon } from '@heroicons/react/solid';

import { useRouter } from 'next/router';
// import MyOrders from '../features/limit-order/MyOrders';
import { NavigationLink } from '../NavigationLink';
import { Gas } from '../Gas';

const getQuery = (input, output) => {
  if (!input && !output) return;

  if (input && !output) {
    return { inputCurrency: input.address || 'ETH' };
  } else if (input && output) {
    return { inputCurrency: input.address, outputCurrency: output.address };
  }
};

interface SwapHeaderProps {
  input?: Currency;
  output?: Currency;
  allowedSlippage?: Percent;
}

export const SwapHeader: FC<SwapHeaderProps> = ({
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
      space-x-3`}
    >
      <div>Swap</div>
      {/* <div
        className={`
        rounded-xl
        bg-swap-inner-background
        grid grid-cols-3
        `}
      >
        <NavigationLink
          activeClassName={`
            bg-primary
          `}
          href={{
            pathname: '/swap',
            query: getQuery(input, output),
          }}
        >
          <a
            className={`
            flex items-center justify-center 
            py-2 px-4
            text-text rounded-xl`}
          >
            {`Swap`}
          </a>
        </NavigationLink>
        <NavigationLink
          activeClassName="font-bold border rounded text-high-emphesis border-dark-800 bg-gradient-to-r from-opaque-blue to-opaque-pink hover:from-blue hover:to-pink"
          href={{
            pathname: '/limit-order',
            query: getQuery(input, output),
          }}
        >
          <a
            className={`
            flex items-center justify-center 
            text-text rounded-xl`}
          >
            {`Limit`}
          </a>
        </NavigationLink>
        <NavigationLink
          activeClassName="font-bold border rounded text-high-emphesis border-dark-800 bg-gradient-to-r from-opaque-blue to-opaque-pink hover:from-blue hover:to-pink"
          href={`/${!isRemove ? 'add' : 'remove'}${
            input ? `/${currencyId(input)}` : ''
          }${output ? `/${currencyId(output)}` : ''}`}
        >
          <a
            className={`
            flex items-center justify-center 
            text-text rounded-xl`}
          >
            {`Liquidity`}
          </a>
        </NavigationLink>
      </div> */}
      <div className="flex items-center text-lg">
        <div className="grid grid-flow-col gap-1">
          {/* {isLimitOrder && (
            <div className="items-center h-full w-full cursor-pointer hover:bg-dark-800 rounded px-3 py-1.5">
              myorders
            </div>
          )
          } */}

          {chainId === ChainId.MAINNET && (
            <div className="flex items-center text-primary space-x-1 font-semibold">
              <CalculatorIcon className="w-5 h-5" />
              <Gas />
            </div>
          )}
          <div className="relative w-full h-full rounded hover:bg-dark-800 flex items-center">
            {/* <Settings placeholderSlippage={allowedSlippage} /> */}
            settings
          </div>
        </div>
      </div>
    </div>
  );
};
