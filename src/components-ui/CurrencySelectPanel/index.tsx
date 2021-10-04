import React, { useCallback, useState } from 'react';

import { ChevronDownIcon } from '@heroicons/react/outline';
import { Currency } from '@digitalnative/standard-protocol-sdk';
import { CurrencyLogo } from '../CurrencyLogo';
import CurrencySearchModal from '../../modals/SearchModal/CurrencySearchModal';
import styled from '@emotion/styled';
import { useActiveWeb3React } from '../../hooks/useActiveWeb3React';
import { BoxSpinner } from '../Spinner/BoxSpinner';

const CurrencySelect = styled.button<{ selected: boolean }>`
  align-items: center;
  height: 100%;
  font-size: 20px;
  font-weight: 500;
  outline: none;
  cursor: pointer;
  user-select: none;
  border: none;
`;

interface CurrencySelectPanelProps {
  onClick?: () => void;
  onCurrencySelect?: (currency: Currency) => void;
  currency?: Currency | null;
  disableCurrencySelect?: boolean;
  otherCurrency?: Currency | null;
  id: string;
  showCommonBases?: boolean;
}

export function CurrencySelectPanel({
  onClick,
  onCurrencySelect,
  currency,
  disableCurrencySelect = false,
  otherCurrency,
  id,
  showCommonBases,
}: CurrencySelectPanelProps) {
  const [modalOpen, setModalOpen] = useState(false);
  const { chainId } = useActiveWeb3React();

  const handleDismissSearch = useCallback(() => {
    setModalOpen(false);
  }, [setModalOpen]);

  return (
    <div id={id} className="px-4 py-1 rounded-20 bg-opaque-secondary">
      <div className="flex flex-col justify-between space-y-3 sm:space-y-0 sm:flex-row">
        <div className="w-full" onClick={onClick}>
          <CurrencySelect
            selected={!!currency}
            className="open-currency-select-button"
            onClick={() => {
              if (!disableCurrencySelect) {
                setModalOpen(true);
              }
            }}
          >
            <div
              className={`
            flex 
            rounded-20
            bg-opaque-inactive
            items-center
            px-3 py-3
            `}
            >
              {' '}
              {currency ? (
                <CurrencyLogo
                  currency={currency}
                  size={'36px'}
                  className="rounded-full"
                />
              ) : (
                <BoxSpinner size={36} />
              )}
              <div className="flex flex-1 flex-col items-start justify-center ml-3">
                <div className="flex items-center text-text">
                  <div className="text-base">
                    {(currency && currency.symbol && currency.symbol.length > 20
                      ? currency.symbol.slice(0, 4) +
                        '...' +
                        currency.symbol.slice(
                          currency.symbol.length - 5,
                          currency.symbol.length,
                        )
                      : currency?.symbol) || 'Select'}
                  </div>
                  {!disableCurrencySelect && (
                    <ChevronDownIcon
                      className="stroke-current text-text ml-4"
                      width={16}
                      height={16}
                    />
                  )}
                </div>
              </div>
            </div>
          </CurrencySelect>
        </div>
      </div>
      {!disableCurrencySelect && onCurrencySelect && (
        <CurrencySearchModal
          isOpen={modalOpen}
          onDismiss={handleDismissSearch}
          onCurrencySelect={onCurrencySelect}
          selectedCurrency={currency}
          otherSelectedCurrency={otherCurrency}
          showCommonBases={showCommonBases}
        />
      )}
    </div>
  );
}
