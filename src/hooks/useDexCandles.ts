import { useCallback, useEffect, useState } from 'react';
import { useActiveWeb3React } from './index';
import {
  CandlePeriod,
  NumericalCandlestickDatum,
  RawCandlestickDatum,
} from '../types/Candle';
import { dexCandlesGraphClient } from '../services/graph/clients/candles';
import { dexCandlesQuery } from '../services/graph/queries/candles';

const useDexCandles = (
  token0Address: string,
  token1Address: string,
  pairAddress: string,
  period: CandlePeriod,
) => {
  const { chainId } = useActiveWeb3React();
  const dexCandles = dexCandlesGraphClient(chainId);
  const [isLoading, setLoading] = useState(false);

  let resultArray: RawCandlestickDatum[] = [];

  const [candleData, setCandleData] = useState<NumericalCandlestickDatum[]>([]);
  
  const fetchDexCandles = useCallback(async () => {
    if (pairAddress == '') {
      return;
    }
    try {
      setLoading(true);
      let skip = 0;
      let results = await dexCandles.query({
        query: dexCandlesQuery,
        variables: { pair: pairAddress, period, skip },
      });

      while (results.data.candles.length === 1000) {
        skip += 1000;
        resultArray = resultArray.concat(results.data.candles);
        results = await dexCandles.query({
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
      const token1 = resultArray[0]?.token1;

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
      setTimeout(() => {}, 1000);
      // @ts-ignore
      setCandleData(parsedData);
      setLoading(false);
    } catch (e) {
      console.error('[useDexCandles] erorr: ' + e);
      setCandleData([]);
    }
  }, [pairAddress, period, token0Address, token1Address]);

  useEffect(() => {
    fetchDexCandles();
  }, [fetchDexCandles, pairAddress, token0Address, token1Address, period]);

  return {
    isLoading,
    candleData,
  };
};

export default useDexCandles;
