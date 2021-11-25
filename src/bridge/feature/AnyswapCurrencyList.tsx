import {
  AnyswapCurrency,
  AnyswapCurrencyAmount,
  AnyswapToken,
  Currency,
  CurrencyAmount,
} from '@digitalnative/standard-protocol-sdk';
import React, {
  CSSProperties,
  MutableRefObject,
  useCallback,
  useMemo,
} from 'react';

import { CurrencyLogo } from '../../components-ui/CurrencyLogo';
import { FixedSizeList } from 'react-window';
// import Loader from '../../components/Loader';
//   import { MenuItem } from './styleds';
import { MouseoverTooltip } from '../../components-ui/Tooltip';
// import div from '../../components/div'
import { WrappedTokenInfo } from '../../state/lists/wrappedTokenInfo';
import { isTokenOnList } from '../../functions/validate';
import styled from '@emotion/styled';
import { useActiveWeb3React } from '../../hooks/useActiveWeb3React';
import { useCombinedActiveList } from '../../state/lists/hooks';
import { useCurrencyBalance } from '../../state/wallet/hooks';
import { useIsUserAddedToken } from '../../hooks/Tokens';
import { Question } from '../../components-ui/Question';
import { RippleSpinner } from '../../components-ui/Spinner/RippleSpinner';
import { DefinedStyles } from '../../utils/DefinedStyles';
import useAddTokenToMetaMask from '../../hooks/useAddTokenToMetaMask';
import { PlusCircleIcon } from '@heroicons/react/outline';
import { MenuItem2 } from '../../modals/SearchModal/styleds';
import { toNormalCurrency } from '../functions/toNormalToken';

function currencyKey(currency: AnyswapCurrency): string {
  return currency ? currency.address : 'ETHER';
}

const Tag = styled.div`
  font-size: 14px;
  border-radius: 4px;
  padding: 0.25rem 0.3rem 0.25rem 0.3rem;
  max-width: 6rem;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  justify-self: flex-end;
  margin-right: 4px;
`;

function Balance({ balance }: { balance: CurrencyAmount<Currency> }) {
  return (
    <div
      className="whitespace-nowrap overflow-hidden max-w-[5rem] overflow-ellipsis"
      title={balance.toExact()}
    >
      {balance.toSignificant(4)}
    </div>
  );
}

const TagContainer = styled.div`
  display: flex;
  justify-content: flex-end;
`;

function CurrencyRow({
  currency,
  onSelect,
  isSelected,
  otherSelected,
  style,
}: // style,
{
  currency: any;
  onSelect: () => void;
  isSelected: boolean;
  otherSelected: boolean;
  style: CSSProperties;
}) {
  const { chainId, account } = useActiveWeb3React();
  const key = currencyKey(currency);
  const normalCurrency = toNormalCurrency(currency, chainId);
  const balance = useCurrencyBalance(account ?? undefined, normalCurrency);
  const { addToken, success } = useAddTokenToMetaMask(normalCurrency);
  // only show add or remove buttons if not on selected list
  return (
    <MenuItem2
      className="pl-1 pr-3 sm:pl-4 sm:pr-4 py-1 cursor-pointer"
      id={`anyswap-token-item-${key}`}
      style={style}
      onClick={() => (isSelected ? null : onSelect())}
      disabled={isSelected}
      selected={otherSelected}
    >
      <div className="flex items-center">
        <CurrencyLogo
          currency={normalCurrency}
          size={32}
          className="rounded-full"
        />
      </div>
      <div className="flex flex-col justify-center">
        <div title={currency.name} className="text-sm font-medium">
          {currency.symbol}
        </div>
        <div className="text-sm font-thin">{currency.name} </div>
      </div>
      <div className="flex items-center justify-end space-x-2">
        {balance ? (
          <Balance balance={balance} />
        ) : account ? (
          <RippleSpinner size={16} />
        ) : null}
        {!success && currency && (
          <div onClick={addToken} className="cursor-pointer">
            <PlusCircleIcon className="w-4 h-4 text-primary" />
          </div>
        )}
      </div>
    </MenuItem2>
  );
}

export default function AnyswapCurrencyList({
  height,
  currencies,
  otherListTokens,
  selectedCurrency,
  onCurrencySelect,
  otherCurrency,
  fixedListRef,
}: {
  height: number;
  currencies: any[];
  otherListTokens?: any[];
  selectedCurrency?: any | null;
  onCurrencySelect?: (currency: any) => void;
  otherCurrency?: any | null;
  fixedListRef?: MutableRefObject<FixedSizeList | undefined>;
}) {
  const itemData: any[] = useMemo(() => {
    if (otherListTokens && otherListTokens?.length > 0) {
      return [...currencies, ...otherListTokens];
    }
    return currencies;
  }, [currencies, otherListTokens]);

  const Row = useCallback(
    function TokenRow({ data, index, style }) {
      const row = data[index];
      const currency = row;

      const isSelected = Boolean(
        currency &&
          selectedCurrency &&
          selectedCurrency.address === currency.address,
      );
      const otherSelected = Boolean(
        currency && otherCurrency && otherCurrency.address === currency.address,
      );
      const handleSelect = () => currency && onCurrencySelect(currency);

      const token = !!currency;

      const showImport = index > currencies.length;

      if (currency) {
        return (
          <CurrencyRow
            style={style}
            currency={currency}
            isSelected={isSelected}
            onSelect={handleSelect}
            otherSelected={otherSelected}
          />
        );
      } else {
        return null;
      }
    },
    [currencies.length, onCurrencySelect, otherCurrency, selectedCurrency],
  );

  const itemKey = useCallback((index: number, data: typeof itemData) => {
    const currency = data[index];
    return currencyKey(currency);
  }, []);

  return (
    <FixedSizeList
      className={DefinedStyles.scrollPrimary}
      height={height}
      ref={fixedListRef as any}
      width="100%"
      itemData={itemData}
      itemCount={itemData.length}
      itemSize={56}
      itemKey={itemKey}
    >
      {Row}
    </FixedSizeList>
  );
}
