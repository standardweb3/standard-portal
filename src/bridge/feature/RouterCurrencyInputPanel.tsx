import { AnyswapCurrency, Token } from '@digitalnative/standard-protocol-sdk';
import { useEffect, useState } from 'react';
import { classNames } from '../../functions';
import { useActiveWeb3React } from '../../hooks';
import { useTokenBalance } from '../../state/wallet/hooks';
import { Input as NumericalInput } from '../../components-ui/NumericalInput';
import { Button } from '../../components-ui/Button';
import { CurrencyLogo } from '../../components-ui/CurrencyLogo';

export type RouterCurrencyInputPanelTypes = {
  token: AnyswapCurrency | undefined;
  onAmountChange?: (amount: string) => void;
  showMax?: boolean;
  className?: string;
  inputClassName?: string;
  maxClassName?: string;
};

export function RouterCurrencyInputPanel({
  token,
  onAmountChange,
  showMax,
  className,
  inputClassName,
  maxClassName,
}: RouterCurrencyInputPanelTypes) {
  const [amount, setAmount] = useState('0');
  const { account } = useActiveWeb3React();

  const balance = useTokenBalance(account, token?.toCurrency());

  const onMax = () => {
    balance && setAmount(balance.toFixed(token?.decimals));
  };

  useEffect(() => {
    onAmountChange && onAmountChange(amount);
  }, [amount, onAmountChange]);

  return (
    <div className={classNames('flex items-center', className)}>
      <div className="flex items-center space-x-2 font-bold">
        <CurrencyLogo currency={token?.toCurrency()} className="rounded-full" />
        <div>{token?.symbol}</div>
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
