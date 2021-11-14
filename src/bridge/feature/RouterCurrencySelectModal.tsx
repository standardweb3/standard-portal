import { AnyswapCurrency } from '@digitalnative/standard-protocol-sdk';
import { useCallback, useMemo } from 'react';
import { Modal } from '../../components-ui/Modal';
import { getAnyswapToken } from '../functions/getAnyswapToken';
import AnyswapCurrencyList from './AnyswapCurrencyList';

type RouterCurrencySelectModalTypes = {
  isOpen: boolean;
  onDismiss?: () => void;
  onCurrencySelect?: (currency: AnyswapCurrency) => void;
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
  const anyswapCurrencies = useMemo(
    () =>
      currencyList
        .map((currency) => {
          if (currency.name === 'BASECURRENCY') return currency;
          return getAnyswapToken(currency);
        })
        .filter((currency) => !!currency),
    [currencyList],
  );

  const handleSelect = useCallback((inputCurrency) => {
    onCurrencySelect(inputCurrency);
    onDismiss();
  }, []);

  return (
    <>
      <Modal
        isOpen={isOpen}
        onDismiss={onDismiss}
        maxWidth="500px"
        maxHeight="80vh"
        minWidth={'80vw'}
      >
        <AnyswapCurrencyList
          onCurrencySelect={handleSelect}
          currencies={anyswapCurrencies}
          height={500}
        />
      </Modal>
    </>
  );
}
