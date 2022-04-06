import { useActiveWeb3React } from ".";
import { tryParseAmount } from "../functions";
import { useUserSingleHopOnly } from "../state/user/hooks";
import { useV2TradeExactIn } from "./useV2Trades";

export function useTradePrice(inputCurrency, outputCurrency, typedValue) {
  const [singleHopOnly] = useUserSingleHopOnly();

  const parsedAmount = tryParseAmount(
    typedValue,
    inputCurrency ?? undefined,
  );

  const bestTradeExactIn = useV2TradeExactIn(
    parsedAmount,
    outputCurrency ?? undefined,
    {
      maxHops: singleHopOnly ? 1 : undefined,
    },
  );

  return bestTradeExactIn
}