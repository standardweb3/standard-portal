import {
  AnyswapCurrency,
  AnyswapCurrencyAmount,
  AnyswapToken,
  AnyswapTokenAmount,
  JSBI,
} from '@digitalnative/standard-protocol-sdk';
import { parseUnits } from '@ethersproject/units';

// try to parse a user entered amount for a given token
export function tryParseAmount(
  value?: string,
  currency?: AnyswapCurrency,
): AnyswapCurrencyAmount | undefined {
  if (!value || !currency) {
    return undefined;
  }
  try {
    const typedValueParsed = parseUnits(value, currency.decimals).toString();
    if (typedValueParsed !== '0') {
      return currency instanceof AnyswapToken
        ? new AnyswapTokenAmount(currency, JSBI.BigInt(typedValueParsed))
        : AnyswapCurrencyAmount.ether(JSBI.BigInt(typedValueParsed));
    }
  } catch (error) {
    // should fail if the user specifies too many decimal places of precision (or maybe exceed max uint?)
    console.debug(`Failed to parse input amount: "${value}"`, error);
  }
  // necessary for all paths to return a value
  return undefined;
}

// try to parse a user entered amount for a given token
export function tryParseAmount1(
  value?: string,
  decimals?: number,
): AnyswapCurrencyAmount | undefined {
  if (!value || !decimals) {
    return undefined;
  }
  try {
    const typedValueParsed = parseUnits(value, decimals).toString();
    if (typedValueParsed !== '0') {
      return AnyswapCurrencyAmount.ether(JSBI.BigInt(typedValueParsed));
    }
  } catch (error) {
    // should fail if the user specifies too many decimal places of precision (or maybe exceed max uint?)
    console.debug(`Failed to parse input amount: "${value}"`, error);
  }
  // necessary for all paths to return a value
  return undefined;
}
