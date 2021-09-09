import React, { ReactNode, useCallback } from 'react';

import { Currency, Price } from '@digitalnativeinc/standard-protocol-sdk';
import { classNames } from '../../functions';
interface TradePriceProps {
  price: Price<Currency, Currency>;
  showInverted: boolean;
  setShowInverted: (showInverted: boolean) => void;
  className?: string;
  icon?: ReactNode;
}

export function TradePrice({
  price,
  showInverted,
  setShowInverted,
  className,
  icon,
}: TradePriceProps) {
  let formattedPrice: string;

  try {
    formattedPrice = showInverted
      ? price.toSignificant(4)
      : price.invert()?.toSignificant(4);
  } catch (error) {
    formattedPrice = '0';
  }

  const label = showInverted
    ? `${price.quoteCurrency?.symbol}`
    : `${price.baseCurrency?.symbol} `;

  const labelInverted = showInverted
    ? `${price.baseCurrency?.symbol} `
    : `${price.quoteCurrency?.symbol}`;

  const flipPrice = useCallback(() => setShowInverted(!showInverted), [
    setShowInverted,
    showInverted,
  ]);

  const text = `${'1 ' + labelInverted + ' = ' + formattedPrice ??
    '-'} ${label}`;

  return (
    <div
      onClick={flipPrice}
      title={text}
      className={classNames(
        'flex items-center justify-end w-full py-1 cursor-pointer',
        className,
      )}
    >
      <div className="flex items-center space-x-4">
        <div className="select-none">{text}</div>
        {icon && icon}
      </div>
    </div>
  );
}
