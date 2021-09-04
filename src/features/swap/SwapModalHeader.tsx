import { Currency, Percent, TradeType, Trade as V2Trade } from '@sushiswap/sdk';
import React, { useState } from 'react';
import { isAddress, shortenAddress } from '../../functions';

import { AdvancedSwapDetails } from './AdvancedSwapDetails';
import { CurrencyLogo } from '../../components-ui/CurrencyLogo';
import { TradePrice } from './TradePrice';
import { useUSDCValue } from '../../hooks/useUSDCPrice';
import { warningSeverity } from '../../functions';
import {
  ArrowDownIcon,
  ChevronDoubleDownIcon,
  ExclamationCircleIcon,
  SwitchHorizontalIcon,
} from '@heroicons/react/outline';
import { Alert } from '../../components-ui/Alert';
import { Typographies } from '../../utils/Typography';

export default function SwapModalHeader({
  trade,
  allowedSlippage,
  recipient,
  showAcceptChanges,
  onAcceptChanges,
  minerBribe,
}: {
  trade: V2Trade<Currency, Currency, TradeType>;
  allowedSlippage: Percent;
  recipient: string | null;
  showAcceptChanges: boolean;
  onAcceptChanges: () => void;
  minerBribe?: string;
}) {
  const [showInverted, setShowInverted] = useState<boolean>(false);

  // const fiatValueInput = useUSDCValue(trade.inputAmount);
  // const fiatValueOutput = useUSDCValue(trade.outputAmount);

  const priceImpactSeverity = warningSeverity(trade.priceImpact);

  return (
    <div className="grid gap-4">
      <div className="flex flex-col md:flex-row space-x-4">
        <div className="flex flex-col items-start">
          <div className="flex w-full items-center justify-between">
            <div className="flex items-center space-x-3">
              <CurrencyLogo
                currency={trade.inputAmount.currency}
                size={60}
                className="rounded-full"
              />
              <div className="overflow-ellipsis overflow-hidden font-semibold text-2xl">
                {trade.inputAmount.toSignificant(6)}&nbsp;
                {trade.inputAmount.currency.symbol}
              </div>
            </div>
          </div>
          <div className="flex ml-[60px]">
            <ArrowDownIcon className="w-6 h-6" />
          </div>
          <div className="flex w-full items-center justify-between">
            <div className="flex items-center space-x-3">
              <CurrencyLogo
                currency={trade.outputAmount.currency}
                size={60}
                className="rounded-full"
              />
              <div
                className={`overflow-ellipsis overflow-hidden font-semibold text-2xl ${
                  priceImpactSeverity > 2 ? 'text-red' : 'text-text'
                }`}
              >
                {trade.outputAmount.toSignificant(6)}&nbsp;
                {trade.outputAmount.currency.symbol}
              </div>
            </div>
          </div>
        </div>
        <div
          className="
          flex-1 
          flex items-center justify-end"
        >
          <div
            className="
              bg-opaque-inactive p-4
              rounded-20
            "
          >
            <AdvancedSwapDetails
              trade={trade}
              allowedSlippage={allowedSlippage}
              minerBribe={minerBribe}
            />
          </div>
        </div>
      </div>

      <TradePrice
        price={trade.executionPrice}
        showInverted={showInverted}
        setShowInverted={setShowInverted}
        className="px-0"
        icon={
          <div className="bg-opaque p-2 rounded-full text-text">
            <SwitchHorizontalIcon className="w-4 h-4" />
          </div>
        }
      />

      {showAcceptChanges ? (
        <div
          className="
        flex items-center
        py-2 px-4 
        rounded-20 
        border border-primary"
        >
          <div className="w-full text-primary flex items-center space-x-3">
            <ExclamationCircleIcon className="w-8 h-8" />
            <div>{`Price Updated`}</div>
          </div>
          <div
            className="
              cursor-pointer
              w-full bg-primary 
              py-4 px-4 
              text-text text-lg 
              rounded-20 text-center"
            onClick={onAcceptChanges}
          >
            {`Accept`}
          </div>
        </div>
      ) : null}
      <div className="justify-start text-sm text-warn">
        {trade.tradeType === TradeType.EXACT_INPUT ? (
          <>
            {`Output is estimated. You will receive at least `}
            <b>
              {trade.minimumAmountOut(allowedSlippage).toSignificant(6)}{' '}
              {trade.outputAmount.currency.symbol}
            </b>
            {` or the transaction will revert.`}
          </>
        ) : (
          <>
            {`Input is estimated. You will sell at most `}
            <b>
              {trade.maximumAmountIn(allowedSlippage).toSignificant(6)}{' '}
              {trade.inputAmount.currency.symbol}
            </b>
            {` or the transaction will revert.`}
          </>
        )}
      </div>

      {recipient !== null ? (
        <div className="flex-start">
          <>
            {`Output will be sent to`}
            <b title={recipient}>
              {isAddress(recipient) ? shortenAddress(recipient) : recipient}
            </b>
          </>
        </div>
      ) : null}
    </div>
  );
}
