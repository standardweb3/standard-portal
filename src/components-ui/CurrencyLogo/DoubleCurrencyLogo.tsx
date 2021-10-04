import { Currency } from '@digitalnative/standard-protocol-sdk';
import { CurrencyLogo } from '../CurrencyLogo';
import React from 'react';
import { classNames } from '../../functions';

interface DoubleCurrencyLogoProps {
  margin?: boolean;
  size?: number;
  currency0?: Currency;
  currency1?: Currency;
  currencyClassName?: string;
}

export function DoubleCurrencyLogo({
  currency0,
  currency1,
  size = 16,
  currencyClassName,
}: DoubleCurrencyLogoProps) {
  return (
    <div className="flex items-center">
      <div className="z-10">
        <CurrencyLogo
          currency={currency0}
          size={size.toString() + 'px'}
          className={currencyClassName}
        />
      </div>
      <div className="-ml-2">
        <CurrencyLogo
          currency={currency1}
          size={size.toString() + 'px'}
          className={currencyClassName}
        />
      </div>
    </div>
  );
}
