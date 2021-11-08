import { CurrencyAmount, Token } from '@digitalnative/standard-protocol-sdk';
import { useEffect, useState } from 'react';
import { classNames } from '../../functions';
import { Button } from '../Button';
import { CurrencyLogo } from '../CurrencyLogo';
import { Input as NumericalInput } from '../NumericalInput';

export type TokenInputPanelV2Types = {
  token: Token;
  onAmountChange?: (amount: string) => void;
  max?: CurrencyAmount<Token>;
  className?: string;
  inputClassName?: string;
  maxClassName?: string;
};

export function TokenInputPanelV2({
  token,
  onAmountChange,
  max,
  className,
  inputClassName,
  maxClassName,
}: TokenInputPanelV2Types) {
  const [amount, setAmount] = useState('0');

  const onMax = () => {
    max && setAmount(max.toFixed(token.decimals));
  };

  useEffect(() => {
    onAmountChange && onAmountChange(amount);
  }, [amount, onAmountChange]);

  return (
    <div className={classNames('flex items-center', className)}>
      <div className="flex items-center space-x-2 font-bold">
        <CurrencyLogo currency={token} className="rounded-full" />
        <div>{token.symbol}</div>
      </div>
      <div className="flex-1 px-4">
        <NumericalInput
          className={classNames('w-full text-right', inputClassName)}
          value={amount}
          onUserInput={setAmount}
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
