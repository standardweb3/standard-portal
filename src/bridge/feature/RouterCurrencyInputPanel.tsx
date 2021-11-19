import { AnyswapCurrency, Token } from '@digitalnative/standard-protocol-sdk';
import { useEffect, useMemo, useState } from 'react';
import { classNames, formatNumber } from '../../functions';
import { useActiveWeb3React } from '../../hooks';
import { useTokenBalance } from '../../state/wallet/hooks';
import { Input as NumericalInput } from '../../components-ui/NumericalInput';
import { Button } from '../../components-ui/Button';
import { CurrencyLogo } from '../../components-ui/CurrencyLogo';
import { NATIVE } from '@sushiswap/sdk';
import { getAnyswapToken } from '../functions/getAnyswapToken';
import { ChevronDownIcon } from '@heroicons/react/outline';

export type RouterCurrencyInputPanelTypes = {
  token: any | undefined;
  onAmountChange?: (amount: string) => void;
  showMax?: boolean;
  className?: string;
  inputClassName?: string;
  maxClassName?: string;
  onCurrencyClick?: () => void;
};

export function RouterCurrencyInputPanel({
  token,
  onAmountChange,
  showMax,
  className,
  inputClassName,
  maxClassName,
  onCurrencyClick,
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
      <div
        className="flex items-center space-x-2 cursor-pointer bg-opaque rounded-20 px-2 py-3"
        onClick={onCurrencyClick}
      >
        <CurrencyLogo
          size="36px"
          currency={normalToken}
          className="rounded-full "
        />
        <div>
          <div className="font-bold">{token?.symbol}</div>
          {balance && (
            <div className="text-xs text-grey">
              {formatNumber(balance.toExact())}
            </div>
          )}
        </div>
        <ChevronDownIcon className="w-4 h-4 text-grey" />
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
