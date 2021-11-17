import { CurrencyAmount, Token } from '@digitalnative/standard-protocol-sdk';
import { useEffect, useState } from 'react';
import { classNames, formatNumber } from '../../functions';
import { Button } from '../Button';
import { CurrencyLogo } from '../CurrencyLogo';
import { Input as NumericalInput } from '../NumericalInput';

export type TokenInputPanelV2Types = {
  token: Token;
  onAmountChange?: (amount: string) => void;
  balance?: CurrencyAmount<Token>;
  max?: CurrencyAmount<Token>;
  className?: string;
  inputClassName?: string;
  maxClassName?: string;
  amount?: string;
};

export function TokenInputPanelV2({
  token,
  onAmountChange,
  balance,
  max,
  className,
  inputClassName,
  maxClassName,
  amount: propAmount,
}: TokenInputPanelV2Types) {
  const [amount, setAmount] = useState('');

  const inputAmount = propAmount !== undefined ? propAmount : amount;
  const setInputAmount = propAmount !== undefined ? onAmountChange : setAmount;

  const onMax = () => {
    max && setInputAmount(max.toExact());
  };

  useEffect(() => {
    propAmount === undefined && onAmountChange && onAmountChange(amount);
  }, [amount, onAmountChange]);

  return (
    <div className={classNames('flex items-center', className)}>
      <div className="flex items-center space-x-2 font-bold">
        <CurrencyLogo currency={token} size={34} className="rounded-full" />
        <div className="space-y-0">
          {/* <div>{token.symbol}</div> */}
          {/* {balance && (
            <div className="text-xs font-normal">
              {formatNumber(balance.toExact())}
            </div>
          )} */}
        </div>
      </div>
      <div className="flex-1 px-4">
        <NumericalInput
          className={classNames('w-full text-right', inputClassName)}
          value={inputAmount}
          onUserInput={setInputAmount}
        />
      </div>
      {max && (
        <Button
          onClick={onMax}
          type="bordered"
          className={classNames('text-sm', maxClassName)}
        >
          Max
        </Button>
      )}
    </div>
  );
}
