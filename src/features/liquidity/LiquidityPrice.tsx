import {
  Currency,
  Percent,
  Price,
} from '@digitalnative/standard-protocol-sdk-test';

import { Field } from '../../state/mint/actions';
import { ONE_BIPS } from '../../constants';
import React, { useState } from 'react';
import { classNames } from '../../functions';
import { SwitchHorizontalIcon } from '@heroicons/react/outline';
import { useCallback } from 'react';

function TradePrice({ price, currencies }) {
  const [showInverted, setShowInverted] = useState(false);

  const handleInvert = () => setShowInverted(!showInverted);

  return (
    <div
      className="
        flex items-center justify-end
        space-x-3
        w-full cursor-pointer"
      onClick={handleInvert}
    >
      {showInverted ? (
        <div className="select-none">
          {`${price?.invert()?.toSignificant(6) ?? '-'} ${
            currencies[Field.CURRENCY_A]?.symbol
          } per ${currencies[Field.CURRENCY_B]?.symbol}`}
        </div>
      ) : (
        <div className="select-none">
          {`${price?.toSignificant(6) ?? '-'} ${
            currencies[Field.CURRENCY_B]?.symbol
          } per ${currencies[Field.CURRENCY_A]?.symbol}`}
        </div>
      )}
      <div className="bg-opaque-secondary p-2 rounded-20 text-text">
        <SwitchHorizontalIcon className="w-4 h-4" />
      </div>
    </div>
  );
}

export default function LiquidityPrice({
  currencies,
  price,
  noLiquidity,
  poolTokenPercentage,
  className,
}: {
  currencies: { [field in Field]?: Currency };
  price?: Price<Currency, Currency>;
  noLiquidity?: boolean;
  poolTokenPercentage?: Percent;
  className?: string;
}): JSX.Element {
  return (
    <div className={classNames('flex items-center rounded', className)}>
      <div className="flex items-center w-full text-sm">
        <div className="select-none">Share of Pool:&nbsp;</div>
        <div className="select-none font-bold">
          {noLiquidity && price
            ? '100'
            : (poolTokenPercentage?.lessThan(ONE_BIPS)
                ? '<0.01'
                : poolTokenPercentage?.toFixed(2)) ?? '0'}
          %
        </div>
      </div>

      <TradePrice price={price} currencies={currencies} />
    </div>
  );
}
