import {
  ChainId,
  Currency,
  Ether,
  Percent,
  TradeType,
  Trade as V2Trade,
  CurrencyAmount,
} from '@sushiswap/sdk';
import React, { useMemo } from 'react';

// import { ANALYTICS_URL } from '../../constants';
import FormattedPriceImpact from './FormattedPriceImpact';
import { Question } from '../../components-ui/Question';
import SwapRoute from './SwapRoute';
import { computeRealizedLPFeePercent } from '../../functions/prices';
import { useActiveWeb3React } from '../../hooks/useActiveWeb3React';

export interface AdvancedSwapDetailsProps {
  trade?: V2Trade<Currency, Currency, TradeType>;
  allowedSlippage: Percent;
  minerBribe?: string;
}

export function AdvancedSwapDetails({
  trade,
  allowedSlippage,
  minerBribe,
}: AdvancedSwapDetailsProps) {
  const { chainId } = useActiveWeb3React();

  const { realizedLPFee, priceImpact } = useMemo(() => {
    if (!trade) return { realizedLPFee: undefined, priceImpact: undefined };

    const realizedLpFeePercent = computeRealizedLPFeePercent(trade);
    const realizedLPFee = trade.inputAmount.multiply(realizedLpFeePercent);

    const priceImpact = trade.priceImpact.subtract(realizedLpFeePercent);

    return { priceImpact, realizedLPFee };
  }, [trade]);

  return !trade ? null : (
    <div className="flex flex-col space-y-2">
      <div className="flex flex-row items-center justify-between">
        <span className="flex items-center">
          <div className="text-sm text-secondary">{`Route`}</div>
          <Question
            text={`Routing through these tokens resulted in the best price for your trade.`}
          />
        </span>
        <SwapRoute trade={trade} />
      </div>

      <div className="flex justify-center items-center">
        <div>
          <div className="text-sm text-secondary">
            {trade.tradeType === TradeType.EXACT_INPUT
              ? `Minimum received`
              : `Maximum sent`}
          </div>
          <Question
            text={`Your transaction will revert if there is a large, unfavorable price movement before it is confirmed.`}
          />
        </div>
        <div>
          <div className="text-sm font-bold text-high-emphesis">
            {trade.tradeType === TradeType.EXACT_INPUT
              ? `${trade.minimumAmountOut(allowedSlippage).toSignificant(6)} ${
                  trade.outputAmount.currency.symbol
                }`
              : `${trade.maximumAmountIn(allowedSlippage).toSignificant(6)} ${
                  trade.inputAmount.currency.symbol
                }`}
          </div>
        </div>
      </div>
      <div className="flex justify-center items-center">
        <div>
          <div className="text-sm text-secondary">{`Price Impact`}</div>
          <Question
            text={`The difference between the market price and estimated price due to trade size.`}
          />
        </div>
        <FormattedPriceImpact priceImpact={priceImpact} />
      </div>

      <div className="flex justify-center items-center">
        <div>
          <div className="text-sm text-secondary">{`Liquidity Provider Fee`}</div>
          <Question
            text={`A portion of each trade (0.25%) goes to liquidity providers as a protocol incentive.`}
          />
        </div>
        <div className="text-sm font-bold text-high-emphesis">
          {realizedLPFee
            ? `${realizedLPFee
                .divide(6)
                .multiply(5)
                .toSignificant(4)} ${realizedLPFee.currency.symbol}`
            : '-'}
        </div>
      </div>

      <div className="flex justify-center items-center">
        <div>
          <div className="text-sm text-secondary">{`xSUSHI Fee`}</div>
          <Question
            text={`A portion of each trade (0.05%) goes to xSUSHI holders as a protocol incentive.`}
          />
        </div>
        <div className="text-sm font-bold text-high-emphesis">
          {realizedLPFee
            ? `${realizedLPFee.divide(6).toSignificant(4)} ${
                realizedLPFee.currency.symbol
              }`
            : '-'}
        </div>
      </div>

      <div className="flex justify-center items-center">
        <div>
          <div className="text-sm text-secondary">{`Slippage tolerance`}</div>
          <Question text={`Slippage tolerance...`} />
        </div>
        <div className="text-sm font-bold text-high-emphesis">
          {allowedSlippage.toFixed(2)}%
        </div>
      </div>

      {minerBribe && (
        <div className="flex justify-center items-center">
          <div>
            <div className="text-sm text-secondary">{`Miner Tip`}</div>
            <Question
              text={`Tip to encourage miners to select this transaction.`}
            />
          </div>
          <div className="text-sm font-bold text-high-emphesis">
            {CurrencyAmount.fromRawAmount(
              Ether.onChain(ChainId.MAINNET),
              minerBribe,
            ).toFixed(4)}{' '}
            ETH
          </div>
        </div>
      )}
    </div>
  );
}
