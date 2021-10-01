import { Currency } from '@digitalnative/standard-protocol-sdk-test';
import { useCallback } from 'react';
import { classNames } from '../../functions';
import { useActiveWeb3React } from '../../hooks';
import useAddTokenToMetaMask from '../../hooks/useAddTokenToMetaMask';
import { useCurrencyBalance } from '../../state/wallet/hooks';
import { CurrencyLogo } from '../CurrencyLogo';

export type TokenAdderProps = {
  currency: Currency | undefined;
};

export function TokenAdder({ currency }: TokenAdderProps) {
  const { account } = useActiveWeb3React();

  const { addToken, success } = useAddTokenToMetaMask(currency);
  const balance = useCurrencyBalance(account ?? undefined, currency);

  return currency ? (
    <div
      onClick={addToken}
      className={classNames(
        `cursor-pointer
        outline-none
        select-none
        bg-opaque-secondary
        rounded-20
        px-3 py-2
        flex items-center space-x-1 
        text-sm 
        font-base font-medium`,
      )}
    >
      <CurrencyLogo currency={currency} size={24} className="rounded-full" />
      {balance && (
        <div className="max-w-[3rem] truncate overflow-ellipsis">
          {balance.toSignificant(4)}
        </div>
      )}
      <div>{currency.symbol}</div>
    </div>
  ) : null;
}
