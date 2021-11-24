import { Currency, Token } from '@digitalnative/standard-protocol-sdk';
import dynamic from 'next/dynamic';
import React, { useCallback, useEffect, useState } from 'react';

import CurrencyModalView from './CurrencyModalView';
// import ImportList from './ImportList';
import { ImportToken } from './ImportToken';
// import Manage from './Manage';
import { Modal } from '../../components-ui/Modal';
import { TokenList } from '@uniswap/token-lists';
import { WrappedTokenInfo } from '../../state/lists/wrappedTokenInfo';
import useLast from '../../hooks/useLast';
import usePrevious from '../../hooks/usePrevious';
import ImportList from './ImportList';
import Manage from './Manage';
import { useSizeSmDown } from '../../components-ui/Responsive';
const CurrencySearch = dynamic(() => import('./CurrencySearch'), {
  ssr: false,
});
// import CurrencySearch from './CurrencySearch';

interface CurrencySearchModalProps {
  isOpen: boolean;
  onDismiss: () => void;
  selectedCurrency?: Currency | null;
  onCurrencySelect: (currency: Currency) => void;
  otherSelectedCurrency?: Currency | null;
  showCommonBases?: boolean;
  currencyList?: string[];
  includeNativeCurrency?: boolean;
  allowManageTokenList?: boolean;
}

function CurrencySearchModal({
  isOpen,
  onDismiss,
  onCurrencySelect,
  selectedCurrency,
  otherSelectedCurrency,
  currencyList,
  showCommonBases = false,
  includeNativeCurrency = true,
  allowManageTokenList = true,
}: CurrencySearchModalProps) {
  const [modalView, setModalView] = useState<CurrencyModalView>(
    CurrencyModalView.manage,
  );
  const lastOpen = useLast(isOpen);

  useEffect(() => {
    if (isOpen && !lastOpen) {
      setModalView(CurrencyModalView.search);
    }
  }, [isOpen, lastOpen]);

  const handleCurrencySelect = useCallback(
    (currency: Currency) => {
      onCurrencySelect(currency);
      onDismiss();
    },
    [onDismiss, onCurrencySelect],
  );

  // for token import view
  const prevView = usePrevious(modalView);

  // used for import token flow
  const [importToken, setImportToken] = useState<Token | undefined>();

  // used for import list
  const [importList, setImportList] = useState<TokenList | undefined>();
  const [listURL, setListUrl] = useState<string | undefined>();

  // change min height if not searching
  const minHeight =
    modalView === CurrencyModalView.importToken ||
    modalView === CurrencyModalView.importList
      ? undefined
      : '88vh';

  const isViewportSmallDown = useSizeSmDown();

  return (
    <Modal
      isOpen={isOpen}
      onDismiss={onDismiss}
      maxWidth="500px"
      minHeight={minHeight}
      maxHeight="80vh"
      minWidth={isViewportSmallDown ? '90vw' : 'none'}
    >
      {modalView === CurrencyModalView.search ? (
        <CurrencySearch
          isOpen={isOpen}
          onDismiss={onDismiss}
          onCurrencySelect={handleCurrencySelect}
          selectedCurrency={selectedCurrency}
          otherSelectedCurrency={otherSelectedCurrency}
          showCommonBases={showCommonBases}
          showImportView={() => setModalView(CurrencyModalView.importToken)}
          setImportToken={setImportToken}
          showManageView={() => setModalView(CurrencyModalView.manage)}
          currencyList={currencyList}
          includeNativeCurrency={includeNativeCurrency}
          allowManageTokenList={allowManageTokenList}
        />
      ) : modalView === CurrencyModalView.importToken && importToken ? (
        <ImportToken
          tokens={[importToken]}
          onDismiss={onDismiss}
          list={
            importToken instanceof WrappedTokenInfo
              ? importToken.list
              : undefined
          }
          onBack={() =>
            setModalView(
              prevView && prevView !== CurrencyModalView.importToken
                ? prevView
                : CurrencyModalView.search,
            )
          }
          handleCurrencySelect={handleCurrencySelect}
        />
      ) : modalView === CurrencyModalView.importList &&
        importList &&
        listURL ? (
        <ImportList
          list={importList}
          listURL={listURL}
          onDismiss={onDismiss}
          setModalView={setModalView}
        />
      ) : modalView === CurrencyModalView.manage ? (
        <Manage
          onDismiss={onDismiss}
          setModalView={setModalView}
          setImportToken={setImportToken}
          setImportList={setImportList}
          setListUrl={setListUrl}
        />
      ) : (
        ''
      )}
    </Modal>
  );
}

CurrencySearchModal.whyDidYouRender = true;

export default CurrencySearchModal;
