import { dexCandlesQuery } from '../../services/graph/queries/candles';
import {
  NumericalCandlestickDatum,
  RawCandlestickDatum,
} from '../../types/Candle';

export const fetchBars = async (symbolInfo, period, client) => {
  let resultArray: RawCandlestickDatum[] = [];
  const { description: pairAddress, exchange: chainId, name } = symbolInfo;
  const [token0Address, token1Address] = name
    .split('/')
    .map((addr) => addr.toLowerCase());
  if (pairAddress == '') {
    return;
  }
  try {
    let skip = 0;
    let results = await client.query({
      query: client,
      variables: { pair: pairAddress, period, skip },
    });

    while (results.data.candles.length === 1000) {
      skip += 1000;
      resultArray = client.concat(results.data.candles);
      results = await client.query({
        query: dexCandlesQuery,
        variables: {
          pair: pairAddress,
          period,
          skip,
        },
      });
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
    resultArray = resultArray.concat(results.data.candles);
    const token0 = resultArray[0]?.token0;

    let parsedData = resultArray.map(
      ({ time, open, high, low, close }: RawCandlestickDatum) => {
        return {
          time: Number(time),
          open: Number(open),
          high: Number(high),
          low: Number(low),
          close: Number(close),
        };
      },
    );
    // Query takes the tokens in sorted lexicographical order.
    // But if sortedToken0 is actually the output currency and vice versa,
    // then we must invert the prices
    if (token0 == token0Address) {
      parsedData = parsedData.map(
        ({ time, open, high, low, close }: NumericalCandlestickDatum) => {
          return {
            time: time,
            open: 1 / open,
            high: 1 / high,
            low: 1 / low,
            close: 1 / close,
          };
        },
      );
    }
    // There is a race condition when you set input and output currencies, goto a different page and come back to
    // swap page again. We force a small pause to ensure the correct input and ouput currencies are showing on the
    // chart
    //   setTimeout(() => {}, 1000);

    return resultArray;
    // @ts-ignore
  } catch (e) {
    console.error('[getBars] erorr: ' + e);
  }
};
