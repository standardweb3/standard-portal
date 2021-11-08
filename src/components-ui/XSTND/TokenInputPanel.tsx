import { Token } from '@digitalnative/standard-protocol-sdk';
import { useEffect, useState } from 'react';
import { classNames } from '../../functions';
import { useActiveWeb3React } from '../../hooks';
import { useTokenBalance } from '../../state/wallet/hooks';
import { Button } from '../Button';
import { CurrencyLogo } from '../CurrencyLogo';
import { Input as NumericalInput } from '../NumericalInput';

export type TokenInputPanelTypes = {
  token: Token;
  onAmountChange?: (amount: string) => void;
  showMax?: boolean;
  className?: string;
  inputClassName?: string;
  maxClassName?: string;
};

export function TokenInputPanel({
  token,
  onAmountChange,
  showMax,
  className,
  inputClassName,
  maxClassName,
}: TokenInputPanelTypes) {
  const [amount, setAmount] = useState('0');
  const { account } = useActiveWeb3React();

  const balance = useTokenBalance(account, token);

  const onMax = () => {
    setAmount(balance.toFixed(token.decimals));
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
      {showMax && (
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
