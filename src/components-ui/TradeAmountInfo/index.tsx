import {
  Currency,
  CurrencyAmount,
} from '@digitalnativeinc/standard-protocol-sdk';
import { CurrencyLogo } from '../CurrencyLogo';

export function TradeAmountInfo({
  amount,
}: {
  amount?: CurrencyAmount<Currency>;
}) {
  console.log(amount, amount?.toSignificant(6));
  return (
    <div className="flex items-center space-x-3">
      <CurrencyLogo currency={amount?.currency} className="rounded-full" />
      <div>
        {amount?.toSignificant(6)}&nbsp;{amount?.currency?.symbol}
      </div>
    </div>
  );
}
