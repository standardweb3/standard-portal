import AutoSizer from 'react-virtualized-auto-sizer';
import { useCallback, useMemo } from 'react';
import { Modal } from '../../components-ui/Modal';
import { useSizeSmDown } from '../../components-ui/Responsive';
import { isAddress } from '../../functions';
import { useFuse } from '../../hooks';
import { getAnyswapToken } from '../functions/getAnyswapToken';
import AnyswapCurrencyList from './AnyswapCurrencyList';
import { ModalHeader } from '../../components-ui/Modal/ModalHeader';

type RouterCurrencySelectModalTypes = {
  isOpen: boolean;
  onDismiss?: () => void;
  onCurrencySelect?: (currency: any) => void;
  currencyList?: any[];
  includeNativeCurrency?: boolean;
  allowManageTokenList?: boolean;
};

export default function RouterCurrencySelectModal({
  isOpen,
  onDismiss,
  currencyList,
  onCurrencySelect,
}: RouterCurrencySelectModalTypes) {
  // const [searchQuery, setSearchQuery] = useState<string>('');
  // const debouncedQuery = useDebounce(searchQuery, 200);
  // const [invertSearchOrder] = useState<boolean>(false);
  // const isAddressSearch = isAddress(debouncedQuery);

  const options = {
    keys: ['symbol', 'address', 'name'],
    threshold: 0.4,
  };

  const anyswapCurrencies: any[] = useMemo(
    () =>
      currencyList
        .map((currency) => {
          if (!isAddress(currency.address)) return currency;
          return getAnyswapToken(currency);
        })
        .filter((currency) => !!currency),
    [currencyList],
  );

  const { result, term, search } = useFuse({
    data: anyswapCurrencies,
    options,
  });

  const handleSelect = useCallback((inputCurrency) => {
    onCurrencySelect(inputCurrency);
    search('');
    onDismiss();
  }, []);

  const isViewportSmallDown = useSizeSmDown();

  return (
    <>
      <Modal
        isOpen={isOpen}
        onDismiss={onDismiss}
        maxWidth="500px"
        minHeight="88vh"
        maxHeight="80vh"
        minWidth={isViewportSmallDown ? '90vw' : 'none'}
      >
        <div
          className="
          flex flex-col justify-center
          h-full
        "
        >
          {anyswapCurrencies && (
            <>
              <ModalHeader onClose={onDismiss} title="Select A Token" />
              <div
                className={`
          mt-4
          sm:mt-4 
          mb-8
          sm:mb-8
          `}
              >
                <input
                  tabIndex={-1}
                  type="text"
                  id="token-search-input"
                  placeholder={`Search name or token address`}
                  autoComplete="off"
                  value={term}
                  // ref={inputRef as RefObject<HTMLInputElement>}
                  onChange={(e) => search(e.target.value)}
                  // onKeyDown={handleEnter}
                  className={`
              w-full 
              bg-transparent
              border
              border-border-text
              focus:border-primary
              rounded-20 
              placeholder-info
              focus:placeholder-text 
              font-semibold 
              text-text 
              px-6 py-3.5
            `}
                />
              </div>
            </>
          )}
          <div className="text-sm font-bold">All</div>
          <div className="flex-1 rounded-20 h-full bg-opaque-secondary p-3 mt-4">
            <AutoSizer disableWidth>
              {({ height }) => (
                <AnyswapCurrencyList
                  onCurrencySelect={handleSelect}
                  currencies={result}
                  height={height}
                />
              )}
            </AutoSizer>
          </div>
        </div>
      </Modal>
    </>
  );
}
