import { Currency, CurrencyAmount, Pair, Percent, Token } from '@sushiswap/sdk';
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

  return (
    <div
      id={id}
      className={classNames(
        hideInput ? 'px-3 py-3' : 'px-3 py-3',
        'rounded-xl bg-swap-inner-background',
      )}
    >
      <div className="flex flex-col justify-between space-y-3 sm:space-y-0 sm:flex-row">
        {!hideInput && (
          <div
            className={classNames(
              `flex items-center 
               w-full space-x-3 
               rounded-xl 
            `,
              // showMaxButton && selectedCurrencyBalance && 'px-3'
            )}
          >
            <>
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
              <NumericalInput
                className={`
                  text-lg 
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
              {!hideBalance && currency && selectedCurrencyBalance ? (
                <div className="flex flex-col px-3">
                  <div
                    // onClick={onMax}
                    className="text-xs font-medium text-right"
                  >
                    {renderBalance ? (
                      renderBalance(selectedCurrencyBalance)
                    ) : (
                      <>
                        {`Balance:`}{' '}
                        {formatCurrencyAmount(selectedCurrencyBalance, 4)}{' '}
                        {currency.symbol}
                      </>
                    )}
                  </div>
                  <FiatValue
                    fiatValue={fiatValue}
                    priceImpact={priceImpact}
                    className="text-primary text-shadow-white"
                  />
                </div>
              ) : null}
            </>
          </div>
        )}
        <div>
          <button
            type="button"
            className={classNames(
              !!currency ? 'text-primary' : 'text-high-emphesis',
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
            rounded-xl
            bg-opaque
            items-center
            px-3 py-2
            `}
            >
              {pair ? (
                <DoubleCurrencyLogo
                  currency0={pair.token0}
                  currency1={pair.token1}
                  size={24}
                  margin={true}
                />
              ) : currency ? (
                <CurrencyLogo
                  currency={currency}
                  size={'24px'}
                  className="rounded-full"
                />
              ) : (
                <BoxSpinner size="24px" />
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
                <div className="flex flex-1 flex-col items-start justify-center ml-2">
                  {/* {label && (
                    <div className="text-sm font-medium text-text whitespace-nowrap">
                      {label}
                    </div>
                  )} */}
                  <div className="flex items-center text-text">
                    <div className="text-sm md:text-sm">
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

                    {!disableCurrencySelect && (
                      <ChevronDownIcon
                        width={16}
                        height={16}
                        className="stroke-current text-text ml-1"
                      />
                    )}
                  </div>
                </div>
              )}
            </div>
          </button>
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
