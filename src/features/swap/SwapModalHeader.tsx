import { Currency, Percent, TradeType, Trade as V2Trade } from '@sushiswap/sdk';
import React, { useState } from 'react';
import { isAddress, shortenAddress } from '../../functions';

import { AdvancedSwapDetails } from './AdvancedSwapDetails';
import { CurrencyLogo } from '../../components-ui/CurrencyLogo';
import { TradePrice } from './TradePrice';
import { useUSDCValue } from '../../hooks/useUSDCPrice';
import { warningSeverity } from '../../functions';
import {
  ChevronDoubleDownIcon,
  SwitchHorizontalIcon,
} from '@heroicons/react/outline';
import { Alert } from '../../components-ui/Alert';

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
    <div className="space-y-4">
      <div className="flex flex-col items-start">
        <div className="flex w-full items-center justify-between bg-opaque rounded-xl p-4">
          <div className="flex items-center space-x-3">
            <CurrencyLogo
              currency={trade.inputAmount.currency}
              size={36}
              className="rounded-full"
            />
            <div className="overflow-ellipsis overflow-hidden font-bold text-2xl">
              {trade.inputAmount.toSignificant(6)}
            </div>
          </div>
          <div className="ml-3 text-2xl font-medium">
            {trade.inputAmount.currency.symbol}
          </div>
        </div>
        <div className="flex my-2 p-4">
          <ChevronDoubleDownIcon className="w-5 h-5" />
        </div>
        <div className="flex w-full items-center justify-between bg-opaque rounded-xl p-4">
          <div className="flex items-center space-x-3">
            <CurrencyLogo
              currency={trade.outputAmount.currency}
              size={36}
              className="rounded-full"
            />
            <div
              className={`overflow-ellipsis overflow-hidden font-bold text-2xl ${
                priceImpactSeverity > 2 ? 'text-red' : 'text-text'
              }`}
            >
              {trade.outputAmount.toSignificant(6)}
            </div>
          </div>
          <div className="ml-3 text-2xl font-medium">
            {trade.outputAmount.currency.symbol}
          </div>
        </div>
      </div>

      <TradePrice
        price={trade.executionPrice}
        showInverted={showInverted}
        setShowInverted={setShowInverted}
        className="px-0"
        icon={
          <div className="bg-opaque p-2 rounded-xl text-text">
            <SwitchHorizontalIcon className="w-4 h-4" />
          </div>
        }
      />
      <div className="bg-opaque rounded-xl p-4">
        <AdvancedSwapDetails
          trade={trade}
          allowedSlippage={allowedSlippage}
          minerBribe={minerBribe}
        />
      </div>

      {showAcceptChanges ? (
        <div className="flex items-center justify-start text-sm font-bold uppercase">
          <Alert
            type="error"
            dismissable={false}
            showIcon
            message={
              <div className="flex justify-between items-center w-full">
                <div>{`Price Updated`}</div>
                <div
                  className="text-sm cursor-pointer text-blue"
                  onClick={onAcceptChanges}
                >
                  {`Accept`}
                </div>
              </div>
            }
          />
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
