import { Currency, CurrencyAmount } from '@digitalnative/standard-protocol-sdk';
import { classNames, formatNumber } from '../../functions';
import { Input as NumericalInput } from '../../components-ui/NumericalInput';
import { Button } from '../../components-ui/Button';
import { CurrencyLogo } from '../../components-ui/CurrencyLogo';
import { ChevronDownIcon } from '@heroicons/react/outline';

export type RouterCurrencyInputPanelTypes = {
  currency: Currency | undefined;
  onAmountChange?: (amount: string) => void;
  max?: CurrencyAmount<Currency>;
  className?: string;
  inputClassName?: string;
  maxClassName?: string;
  amount?: string;
  onCurrencyClick?: () => void;
};

export function RouterCurrencyInputPanel({
  currency,
  onAmountChange,
  amount,
  max,
  className,
  inputClassName,
  maxClassName,
  onCurrencyClick,
}: RouterCurrencyInputPanelTypes) {
  const onMax = () => {
    max && onAmountChange(max.toExact());
  };

  return (
    <div
      className={classNames(
        `flex flex-col sm:flex-row items-end sm:items-center
        bg-background-currency-input-xs
        sm:bg-transparent
        p-4 sm:p-0
        space-y-4 sm:space-y-0
        rounded-20`,
        className,
      )}
    >
      <div
        className="flex items-center space-x-2 cursor-pointer bg-opaque rounded-20 px-2 py-3"
        onClick={onCurrencyClick}
      >
        <CurrencyLogo
          size="36px"
          currency={currency}
          className="rounded-full "
        />
        <div>
          <div className="font-bold">{currency?.symbol}</div>
          {max && (
            <div className="text-xs text-grey">
              {formatNumber(max.toExact())}
            </div>
          )}
        </div>
        <ChevronDownIcon className="w-4 h-4 text-grey" />
      </div>
      <div
        className="
        flex items-center w-full 
        bg-opaque sm:bg-transparent 
        rounded-20
        p-4 sm:p-0"
      >
        <div className="flex-1 px-4">
          <NumericalInput
            className={classNames('w-full text-right', inputClassName)}
            value={amount}
            onUserInput={onAmountChange}
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
    </div>
  );
}
