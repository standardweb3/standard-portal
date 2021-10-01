import {
  Currency,
  CurrencyAmount,
} from '@digitalnative/standard-protocol-sdk-test';
import { CurrencyLogo } from '../CurrencyLogo';

export function TradeAmountInfo({
  amount,
}: {
  amount?: CurrencyAmount<Currency>;
}) {
  return (
    <div className="flex items-center space-x-3">
      <CurrencyLogo currency={amount?.currency} className="rounded-full" />
      <div>
        {amount?.toSignificant(6)}&nbsp;{amount?.currency?.symbol}
      </div>
    </div>
  );
}
