import {
  ChainId,
  Currency,
  Percent,
} from '@digitalnative/standard-protocol-sdk';
import React, { FC, useState } from 'react';
import { useRouter } from 'next/router';
// import MyOrders from '../features/limit-order/MyOrders';
import { ExchangeNavigation } from './ExchangeNavigation';
import { TransactionSettingsWithGas } from './TransactionSettingsWithGas';

import { AnalyticsLink } from '../AnalyticsLink';

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
  pair?: string;
  allowedSlippage?: Percent;
}

export const ExchangeHeader: FC<ExchangeHeaderProps> = ({
  input,
  output,
  pair,
  allowedSlippage,
}) => {
  const router = useRouter();
  //   const [animateWallet, setAnimateWallet] = useState(false);
  const isSwap = router.asPath.startsWith('/swap');
  return (
    <div
      className={`
      text-text
      flex justify-between items-center
      w-full
      mb-6`}
    >
      <ExchangeNavigation input={input} output={output} />
      <div className="space-x-2 flex items-center">
        <TransactionSettingsWithGas allowedSlippage={allowedSlippage} />
        <AnalyticsLink
          path={isSwap ? 'tokens' : pair ? `pairs/${pair}` : 'pairs'}
        />
      </div>
    </div>
  );
};
