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
  balance?: CurrencyAmount<Currency>;
  className?: string;
  inputClassName?: string;
  maxClassName?: string;
  amount?: string;
  onCurrencyClick?: () => void;
  hideChevron?: boolean;
  hideBalance?: boolean;
};

export function RouterCurrencyInputPanel({
  currency,
  onAmountChange,
  amount,
  max,
  balance,
  className,
  inputClassName,
  maxClassName,
  onCurrencyClick,
  hideChevron,
  hideBalance,
}: RouterCurrencyInputPanelTypes) {
  const onMax = () => {
    max !== undefined && onAmountChange(max.toExact());
  };
  return (
    <div
      className={classNames(
        `flex flex-col sm:flex-row items-end sm:items-center
        sm:bg-transparent
        p-0 sm:p-0
        space-y-4 sm:space-y-0
        rounded-20`,
        className,
      )}
    >
      <div
        className="
          flex items-center space-x-2 
          cursor-pointer 
          bg-currency-input-mobile sm:bg-none sm:bg-opaque  
          rounded-lg sm:rounded-20 px-6 sm:-px-2 py-3 w-full sm:w-auto"
        onClick={onCurrencyClick}
      >
        <CurrencyLogo
          size="36px"
          currency={currency}
          className="rounded-full "
        />
        <div>
          <div className="font-bold">{currency?.symbol}</div>
          {!hideBalance &&
            (balance ? (
              <div className="text-xs text-grey">
                {formatNumber(balance.toExact())}
              </div>
            ) : (
              max && (
                <div className="text-xs text-grey">
                  {formatNumber(max.toExact())}
                </div>
              )
            ))}
        </div>
        {!hideChevron && (
          <div className="flex-1 flex justify-end">
            <ChevronDownIcon className="w-4 h-4 text-grey" />
          </div>
        )}
      </div>
      <div
        className="
        flex items-center w-full 
        bg-opaque sm:bg-transparent 
        border border-border-3 sm:border-none rounded-lg sm:rounded-20
        p-4 sm:p-0"
      >
        <div className="flex-1 px-4 ">
          <NumericalInput
            className={classNames('w-full text-right', inputClassName)}
            value={amount ?? ''}
            onUserInput={onAmountChange}
          />
        </div>
        {max !== undefined && (
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
