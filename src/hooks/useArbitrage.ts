import { usePrices } from '../services/graph/hooks/prices';

export function useArbitrage(dexPrice?: number, symbols?: string[]) {
  const priceData = usePrices(symbols.filter((symbol) => !!symbol));

  const orderMatches = priceData?.[0]?.alias === symbols?.[0];
  const [priceData1, priceData2] = [
    symbols?.[0] && priceData?.find((price) => price.alias === symbols[0]),
    symbols?.[1] && priceData?.find((price) => price.alias === symbols[1]),
  ];
  const price1 = priceData1 && parseFloat(priceData1.price);
  const price2 = priceData2 && parseFloat(priceData2.price);

  const cexPrice = price1 && price2 && price1 / price2;

  return { cexPrice, ctod: cexPrice / dexPrice, dtoc: dexPrice / cexPrice };
}
