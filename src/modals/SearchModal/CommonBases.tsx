import React from 'react';
import { ChainId, Currency, Token, currencyEquals } from '@sushiswap/sdk';

import { Button } from '../../components-ui/Button';
import { COMMON_BASES } from '../../constants/routing';
import { CurrencyLogo } from '../../components-ui/CurrencyLogo';
import { currencyId } from '../../functions';
import { Question } from '../../components-ui/Question';

export default function CommonBases({
  chainId,
  onSelect,
  selectedCurrency,
}: {
  chainId?: number;
  selectedCurrency?: Currency | null;
  onSelect: (currency: Currency) => void;
}) {
  const bases =
    typeof chainId !== 'undefined' ? COMMON_BASES[chainId] ?? [] : [];

  return (
    <div className="flex flex-col space-y-2">
      <div className="flex items-center space-x-2">
        <div>Common bases</div>
        <Question text="These tokens are commonly paired with other tokens." />
      </div>
      <div className="flex flex-wrap">
        {bases.map((currency: Currency) => {
          const isSelected = selectedCurrency?.equals(currency);
          return (
            <Button
              type="bordered"
              onClick={() => !isSelected && onSelect(currency)}
              disabled={isSelected}
              key={currencyId(currency)}
              className={`
                flex items-center 
                px-2 py-2 m-1 space-x-2
                bg-transparent hover:bg-primary 
                disabled:bg-dark disabled:cursor-not-allowed
                transition duration-200
              `}
            >
              <>
                <CurrencyLogo currency={currency} className="rounded-full" />
                <div className="font-semibold">{currency.symbol}</div>
              </>
            </Button>
          );
        })}
      </div>
    </div>
  );
}
