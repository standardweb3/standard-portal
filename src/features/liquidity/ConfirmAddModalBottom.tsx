import {
  Currency,
  CurrencyAmount,
  Fraction,
  Percent,
} from '@digitalnativeinc/standard-protocol-sdk';

import { Field } from '../../state/mint/actions';
import React from 'react';
import { Button } from '../../components-ui/Button';

export function ConfirmAddModalBottom({
  noLiquidity,
  price,
  currencies,
  parsedAmounts,
  poolTokenPercentage,
  onAdd,
}: {
  noLiquidity?: boolean;
  price?: Fraction;
  currencies: { [field in Field]?: Currency };
  parsedAmounts: { [field in Field]?: CurrencyAmount<Currency> };
  poolTokenPercentage?: Percent;
  onAdd: () => void;
}) {
  return (
    <div className="p-6 mt-0 -m-6 rounded-xl">
      <div className="">
        <div className="flex items-center justify-between">
          <div className="text-sm">{`Rates`}</div>
          <div className="text-sm font-bold justify-center items-center flex right-align pl-1.5">
            {`1 ${
              parsedAmounts[Field.CURRENCY_A]?.currency.symbol
            } = ${price?.toSignificant(4)} ${
              parsedAmounts[Field.CURRENCY_B]?.currency.symbol
            }`}
          </div>
        </div>
        <div className="flex items-center justify-end">
          <div className="text-sm font-bold justify-center items-center flex right-align pl-1.5">
            {`1 ${
              parsedAmounts[Field.CURRENCY_B]?.currency.symbol
            } = ${price?.invert()?.toSignificant(4)} ${
              parsedAmounts[Field.CURRENCY_A]?.currency.symbol
            }`}
          </div>
        </div>
      </div>
      <div className="h-px my-6 bg-gray-700" />
      <div className="pb-6">
        <div className="flex items-center justify-between">
          <div className="text-sm">{`${
            currencies[Field.CURRENCY_A]?.symbol
          } Deposited`}</div>
          <div className="text-sm font-bold justify-center items-center flex right-align pl-1.5">
            <div>{parsedAmounts[Field.CURRENCY_A]?.toSignificant(6)}</div>
            <span className="ml-1">
              {parsedAmounts[Field.CURRENCY_A]?.currency.symbol}
            </span>
          </div>
        </div>
        <div className="flex items-center justify-between">
          <div className="text-sm">{`${
            currencies[Field.CURRENCY_B]?.symbol
          } Deposited`}</div>
          <div className="text-sm font-bold justify-center items-center flex right-align pl-1.5">
            <div>{parsedAmounts[Field.CURRENCY_B]?.toSignificant(6)}</div>
            <span className="ml-1">
              {parsedAmounts[Field.CURRENCY_B]?.currency.symbol}
            </span>
          </div>
        </div>
        <div className="flex items-center justify-between">
          <div className="text-sm">{`Share of Pool:`}</div>
          <div className="text-sm font-bold justify-center items-center flex right-align pl-1.5">
            {noLiquidity ? '100' : poolTokenPercentage?.toSignificant(4)}%
          </div>
        </div>
      </div>

      <Button onClick={onAdd} className="w-full px-4 py-4 text-lg">
        {noLiquidity ? `Create Pool & Supply` : `Confirm Supply`}
      </Button>
    </div>
  );
}

export default ConfirmAddModalBottom;
