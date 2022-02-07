import { Currency } from '@digitalnative/standard-protocol-sdk';
import { ReactNode } from 'react';
import { classNames, formatNumber } from '../../functions';
import { useActiveWeb3React } from '../../hooks';
import useAddTokenToMetaMask from '../../hooks/useAddTokenToMetaMask';
import { useStandardPrice } from '../../services/graph';
import { useCurrencyBalance } from '../../state/wallet/hooks';
import { CurrencyLogo } from '../CurrencyLogo';

export type TokenAdderProps = {
  currency: Currency | undefined;
  rightComponent?: ReactNode;
};

export function TokenAdder({
  currency,
  rightComponent = undefined,
}: TokenAdderProps) {
  const { account } = useActiveWeb3React();

  const { addToken } = useAddTokenToMetaMask(currency);
  const balance = useCurrencyBalance(account ?? undefined, currency);
  const stndPrice = useStandardPrice();

  return currency ? (
    <div
      onClick={addToken}
      className={classNames(
        `cursor-pointer
        outline-none
        select-none
        bg-opaque md:bg-background
        rounded-20
        px-3 py-2
        flex items-center space-x-1 t
        text-sm 
        font-base font-medium`,
      )}
    >
      {!Number.isNaN(parseFloat(stndPrice ?? '0')) && stndPrice && (
        <div>{formatNumber(stndPrice, true)}</div>
      )}
      <CurrencyLogo currency={currency} size={24} className="rounded-full" />
      {balance && (
        <div className="max-w-[3rem] truncate overflow-ellipsis">
          {balance.toSignificant(4)}
        </div>
      )}
      <div>{currency.symbol}</div>
      {rightComponent}
    </div>
  ) : null;
}
