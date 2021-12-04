import { CurrencyLogo } from '../../../components-ui/CurrencyLogo';
import { classNames } from '../../../functions';

export function CurrencyOutputPanel({
  currency,
  amount,
  className = undefined,
}) {
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
        className={classNames(
          'flex items-center space-x-2 cursor-pointer bg-opaque rounded-20 px-2 py-3',
        )}
      >
        <CurrencyLogo currency={currency} size={34} className="rounded-full" />
        <div className="font-bold">{currency?.symbol}</div>
      </div>
      <div
        className="
        flex items-center w-full 
        bg-opaque sm:bg-transparent 
        rounded-20
        p-4 sm:p-0"
      >
        <div className="flex-1 text-right font-bold text-2xl">{amount}</div>
      </div>
    </div>
  );
}
