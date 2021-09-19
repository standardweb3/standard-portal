import {
  Currency,
  CurrencyAmount,
  Token,
} from '@digitalnative/standard-protocol-sdk';
import React, {
  CSSProperties,
  MutableRefObject,
  useCallback,
  useMemo,
} from 'react';

import { CurrencyLogo } from '../../components-ui/CurrencyLogo';
import { FixedSizeList } from 'react-window';
import ImportRow from './ImportRow';
// import Loader from '../../components/Loader';
import { MenuItem } from './styleds';
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
import { Typographies } from '../../utils/Typography';

function currencyKey(currency: Currency): string {
  return currency.isToken ? currency.address : 'ETHER';
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

const FixedContentRow = styled.div`
  padding: 4px 20px;
  height: 56px;
  display: grid;
  grid-gap: 16px;
  align-items: center;
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

const TokenListLogoWrapper = styled.img`
  height: 20px;
`;

function TokenTags({ currency }: { currency: Currency }) {
  if (!(currency instanceof WrappedTokenInfo)) {
    return <span />;
  }

  const tags = currency.tags;
  if (!tags || tags.length === 0) return <span />;

  const tag = tags[0];

  return (
    <TagContainer>
      <MouseoverTooltip text={tag.description}>
        <Tag key={tag.id}>{tag.name}</Tag>
      </MouseoverTooltip>
      {tags.length > 1 ? (
        <MouseoverTooltip
          text={tags
            .slice(1)
            .map(({ name, description }) => `${name}: ${description}`)
            .join('; \n')}
        >
          <Tag>...</Tag>
        </MouseoverTooltip>
      ) : null}
    </TagContainer>
  );
}

function CurrencyRow({
  currency,
  onSelect,
  isSelected,
  otherSelected,
  style,
}: {
  currency: Currency;
  onSelect: () => void;
  isSelected: boolean;
  otherSelected: boolean;
  style: CSSProperties;
}) {
  const { account, chainId } = useActiveWeb3React();
  const key = currencyKey(currency);
  const selectedTokenList = useCombinedActiveList();
  const isOnSelectedList = isTokenOnList(
    selectedTokenList,
    currency.isToken ? currency : undefined,
  );
  const customAdded = useIsUserAddedToken(currency);
  const balance = useCurrencyBalance(account ?? undefined, currency);

  // only show add or remove buttons if not on selected list
  return (
    <MenuItem
      id={`token-item-${key}`}
      style={style}
      className={`hover:bg-dark-800 rounded`}
      onClick={() => (isSelected ? null : onSelect())}
      disabled={isSelected}
      selected={otherSelected}
    >
      <div className="flex items-center">
        <CurrencyLogo currency={currency} size={32} className="rounded-full" />
      </div>
      <div className="flex flex-col justify-center">
        <div title={currency.name} className="text-sm font-medium">
          {currency.symbol}
        </div>
        <div className="text-sm font-thin">
          {currency.name}{' '}
          {!isOnSelectedList && customAdded && '• Added by user'}
        </div>
      </div>
      <TokenTags currency={currency} />
      <div className="flex items-center justify-end">
        {balance ? (
          <Balance balance={balance} />
        ) : account ? (
          <RippleSpinner size={16} />
        ) : null}
      </div>
    </MenuItem>
  );
}

const BREAK_LINE = 'BREAK';
type BreakLine = typeof BREAK_LINE;
function isBreakLine(x: unknown): x is BreakLine {
  return x === BREAK_LINE;
}

function BreakLineComponent({ style }: { style?: CSSProperties }) {
  return (
    <div
      className="
      flex justify-center items-center 
      space-x-3 
      p-3 text-sm"
    >
      <div>{`Expanded results from inactive Token Lists`}</div>
      <Question
        text={`Tokens from inactive lists. Import specific tokens below or
            click Manage to activate more lists.`}
      />
    </div>
  );
}

export default function CurrencyList({
  height,
  currencies,
  otherListTokens,
  selectedCurrency,
  onCurrencySelect,
  otherCurrency,
  fixedListRef,
  showImportView,
  setImportToken,
}: {
  height: number;
  currencies: Currency[];
  otherListTokens?: WrappedTokenInfo[];
  selectedCurrency?: Currency | null;
  onCurrencySelect: (currency: Currency) => void;
  otherCurrency?: Currency | null;
  fixedListRef?: MutableRefObject<FixedSizeList | undefined>;
  showImportView: () => void;
  setImportToken: (token: Token) => void;
}) {
  const itemData: (Currency | BreakLine)[] = useMemo(() => {
    if (otherListTokens && otherListTokens?.length > 0) {
      return [...currencies, BREAK_LINE, ...otherListTokens];
    }
    return currencies;
  }, [currencies, otherListTokens]);

  const Row = useCallback(
    function TokenRow({ data, index, style }) {
      const row: Currency | BreakLine = data[index];

      if (isBreakLine(row)) {
        return <BreakLineComponent />;
      }

      const currency = row;

      const isSelected = Boolean(
        currency && selectedCurrency && selectedCurrency.equals(currency),
      );
      const otherSelected = Boolean(
        currency && otherCurrency && otherCurrency.equals(currency),
      );
      const handleSelect = () => currency && onCurrencySelect(currency);

      const token = currency?.wrapped;

      const showImport = index > currencies.length;

      if (showImport && token) {
        return (
          <ImportRow
            style={style}
            token={token}
            showImportView={showImportView}
            setImportToken={setImportToken}
            transparent
          />
        );
      } else if (currency) {
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
    [
      currencies.length,
      onCurrencySelect,
      otherCurrency,
      selectedCurrency,
      setImportToken,
      showImportView,
    ],
  );

  const itemKey = useCallback((index: number, data: typeof itemData) => {
    const currency = data[index];
    if (isBreakLine(currency)) return BREAK_LINE;
    return currencyKey(currency);
  }, []);

  return (
    <FixedSizeList
      className={Typographies.scrollPrimary}
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
