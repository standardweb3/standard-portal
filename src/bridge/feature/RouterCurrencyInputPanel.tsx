import { AnyswapCurrency, Token } from '@digitalnative/standard-protocol-sdk';
import { useEffect, useMemo, useState } from 'react';
import { classNames } from '../../functions';
import { useActiveWeb3React } from '../../hooks';
import { useTokenBalance } from '../../state/wallet/hooks';
import { Input as NumericalInput } from '../../components-ui/NumericalInput';
import { Button } from '../../components-ui/Button';
import { CurrencyLogo } from '../../components-ui/CurrencyLogo';
import { NATIVE } from '@sushiswap/sdk';
import { getAnyswapToken } from '../functions/getAnyswapToken';

export type RouterCurrencyInputPanelTypes = {
  token: any | undefined;
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
  const { account, chainId } = useActiveWeb3React();

  const normalToken = useMemo(() => {
    if (token) {
      if (token.name === 'BASECURRENCY') return NATIVE[chainId];
      return getAnyswapToken(token).toCurrency();
    }
    return token;
  }, [token]);

  const balance = useTokenBalance(account, normalToken);

  const onMax = () => {
    balance && setAmount(balance.toFixed(token?.decimals));
  };

  useEffect(() => {
    onAmountChange && onAmountChange(amount);
  }, [amount, onAmountChange]);

  return (
    <div className={classNames('flex items-center', className)}>
      <div className="flex items-center space-x-2 font-bold">
        <CurrencyLogo currency={normalToken} className="rounded-full" />
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
