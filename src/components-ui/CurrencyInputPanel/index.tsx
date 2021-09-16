import {
  Currency,
  CurrencyAmount,
  Pair,
  Percent,
  Token,
} from '@digitalnativeinc/standard-protocol-sdk';
import React, { ReactNode, useCallback, useState } from 'react';
import { classNames, formatCurrencyAmount } from '../../functions';

import { Button } from '../Button';
import { ChevronDownIcon } from '@heroicons/react/outline';
import { CurrencyLogo } from '../CurrencyLogo';
import CurrencySearchModal from '../../modals/SearchModal/CurrencySearchModal';
import { DoubleCurrencyLogo } from '../CurrencyLogo/DoubleCurrencyLogo';
import { FiatValue } from '../FiatValue';
// import Lottie from 'lottie-react'
import { Input as NumericalInput } from '../NumericalInput';
// import selectCoinAnimation from '../../animation/select-coin.json'
import { useActiveWeb3React } from '../../hooks/useActiveWeb3React';
import { useCurrencyBalance } from '../../state/wallet/hooks';
import { BoxSpinner } from '../Spinner/BoxSpinner';

interface CurrencyInputPanelProps {
  value?: string;
  onUserInput?: (value: string) => void;
  onMax?: () => void;
  showMaxButton: boolean;
  label?: string;
  onCurrencySelect?: (currency: Currency) => void;
  currency?: Currency | null;
  disableCurrencySelect?: boolean;
  hideBalance?: boolean;
  pair?: Pair | null;
  hideInput?: boolean;
  otherCurrency?: Currency | null;
  fiatValue?: CurrencyAmount<Token> | null;
  priceImpact?: Percent;
  id: string;
  showCommonBases?: boolean;
  renderBalance?: (amount: CurrencyAmount<Currency>) => ReactNode;
  locked?: boolean;
  customBalanceText?: string;
}

export function CurrencyInputPanel({
  value,
  onUserInput,
  onMax,
  showMaxButton,
  label = 'Input',
  onCurrencySelect,
  currency,
  disableCurrencySelect = false,
  otherCurrency,
  id,
  showCommonBases,
  renderBalance,
  fiatValue,
  priceImpact,
  hideBalance = false,
  pair = null, // used for double token logo
  hideInput = false,
  locked = false,
  customBalanceText,
}: CurrencyInputPanelProps) {
  const [modalOpen, setModalOpen] = useState(false);
  const { account } = useActiveWeb3React();
  const selectedCurrencyBalance = useCurrencyBalance(
    account ?? undefined,
    currency ?? undefined,
  );

  const handleDismissSearch = useCallback(() => {
    setModalOpen(false);
  }, [setModalOpen]);

  const renderConditionalBalance = () => {
    return !hideBalance && currency && selectedCurrencyBalance ? (
      <div className="flex flex-col items-start">
        <div
          // onClick={onMax}
          className="text-xs text-grey font-medium"
        >
          {renderBalance ? (
            renderBalance(selectedCurrencyBalance)
          ) : (
            <>{formatCurrencyAmount(selectedCurrencyBalance, 4)}</>
          )}
        </div>
      </div>
    ) : null;
  };

  const renderConditionalFiatValue = () => {
    return !hideBalance && currency && selectedCurrencyBalance ? (
      <FiatValue
        fiatValue={fiatValue}
        priceImpact={priceImpact}
        className="text-grey flex-col text-right"
      />
    ) : null;
  };

  return (
    <div>
      <div
        id={id}
        className={classNames('px-4 py-1', 'rounded-20 bg-opaque-secondary')}
      >
        <div className="flex flex-col justify-between space-y-3 sm:space-y-0 sm:flex-row">
          <div>
            <button
              type="button"
              className={classNames(
                !!currency ? 'text-primary' : '',
                `h-full 
              outline-none select-none 
              cursor-pointer 
              border-none text-xl 
              font-medium`,
              )}
              onClick={() => {
                if (onCurrencySelect) {
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
                {pair ? (
                  <DoubleCurrencyLogo
                    currency0={pair.token0}
                    currency1={pair.token1}
                    size={34}
                    margin={true}
                  />
                ) : currency ? (
                  <CurrencyLogo
                    currency={currency}
                    size={'34px'}
                    className="rounded-full"
                  />
                ) : (
                  <BoxSpinner size="34px" />
                )}
                {pair ? (
                  <span
                    className={classNames(
                      'pair-name-container',
                      Boolean(currency && currency.symbol)
                        ? 'text-sm'
                        : 'text-sm',
                    )}
                  >
                    {pair?.token0.symbol}:{pair?.token1.symbol}
                  </span>
                ) : (
                  <div className="flex flex-1 flex-col items-start justify-center ml-3">
                    <div className="flex items-center text-text">
                      <div>
                        <div className="text-base">
                          {(currency &&
                          currency.symbol &&
                          currency.symbol.length > 20
                            ? currency.symbol.slice(0, 4) +
                              '...' +
                              currency.symbol.slice(
                                currency.symbol.length - 5,
                                currency.symbol.length,
                              )
                            : currency?.symbol) || 'Select'}
                        </div>

                        {renderConditionalBalance()}
                      </div>

                      {!disableCurrencySelect && (
                        <ChevronDownIcon
                          width={16}
                          height={16}
                          className="stroke-current text-text ml-4"
                        />
                      )}
                    </div>
                  </div>
                )}
              </div>
            </button>
          </div>
          {!hideInput && (
            <div
              className={classNames(
                `flex items-center 
               w-full space-x-3 
               rounded-20
            `,
                // showMaxButton && selectedCurrencyBalance && 'px-3'
              )}
            >
              <div className="w-full">
                <NumericalInput
                  className={`
                  w-full
                  text-right
                  text-xl
                  focus:text-text 
                  text-text 
                  placeholder-info 
                  focus:placeholder-text`}
                  id="token-amount-input"
                  value={value}
                  onUserInput={(val) => {
                    onUserInput(val);
                  }}
                />
                {renderConditionalFiatValue()}
              </div>

              {showMaxButton && selectedCurrencyBalance && (
                <Button
                  type="bordered"
                  onClick={onMax}
                  className={`
                    text-xs border 
                    rounded-full 
                    hover:bg-primary 
                    transition duration-200
                    whitespace-nowrap`}
                >
                  {`Max`}
                </Button>
              )}
            </div>
          )}
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
    </div>
  );
}
