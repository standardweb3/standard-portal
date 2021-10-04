import {
  ChainId,
  Currency,
  Percent,
} from '@digitalnative/standard-protocol-sdk';
import React, { FC, useState } from 'react';

import { Gas } from '../Gas';
// import Settings from './Settings';
import { currencyId } from '../../functions';
import { useActiveWeb3React } from '../../hooks';
import { CalculatorIcon } from '@heroicons/react/solid';

import { useRouter } from 'next/router';
// import MyOrders from '../features/limit-order/MyOrders';
import { NavigationLink } from '../NavigationLink';
import { default as GasIcon } from '../../../public/icons/outlined/Gas.svg';
import Settings from '../Settings';
import { ExchangeNavigation } from './ExchangeNavigation';
import { TransactionSettingsWithGas } from './TransactionSettingsWithGas';

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
      <ExchangeNavigation input={input} output={output} />
      <TransactionSettingsWithGas allowedSlippage={allowedSlippage} />
    </div>
  );
};
