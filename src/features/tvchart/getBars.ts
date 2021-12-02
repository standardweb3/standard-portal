import { dexCandlesGraphClient } from '../../services/graph/clients/candles';
import { dexCandlesQuery } from '../../services/graph/queries/candles';
import {
  CandlePeriod,
  NumericalCandlestickDatum,
  RawCandlestickDatum,
} from '../../types/Candle';

const fillCandlestickGaps = (
  candleData: NumericalCandlestickDatum[],
  candlePeriod: CandlePeriod,
) => {
  const formattedCandleData: NumericalCandlestickDatum[] =
    candleData.length > 0 ? [candleData[0]] : [];
  if (formattedCandleData.length == 0) return formattedCandleData;
  for (let i = 1; i < candleData.length; i++) {
    const cur = candleData[i];
    const prev = candleData[i - 1];
    const timeGap = cur.time - prev.time;
    if (timeGap === candlePeriod) {
      formattedCandleData.push(cur);
      continue;
    }
    for (let j = 1; j < timeGap / candlePeriod; j++) {
      const emptyCandle = {
        time: prev.time + j * candlePeriod,
        open: prev.close,
        high: prev.close,
        low: prev.close,
        close: prev.close,
      };
      formattedCandleData.push(emptyCandle);
    }
    formattedCandleData.push(cur);
  }

  // We fill remaining gaps until the current time
  const timestampNow = Math.floor(Number(new Date()) / 1000);
  const timestampOfNextCandle =
    timestampNow - (timestampNow % candlePeriod) + candlePeriod;
  const prev = formattedCandleData[formattedCandleData.length - 1];
  const timeGap = timestampOfNextCandle - prev.time;
  for (let j = 1; j <= timeGap / candlePeriod; j++) {
    const emptyCandle = {
      time: prev.time + j * candlePeriod,
      open: prev.close,
      high: prev.close,
      low: prev.close,
      close: prev.close,
    };
    formattedCandleData.push(emptyCandle);
  }
  return formattedCandleData;
};

export const fetchBars = async (symbolInfo, period) => {
  let resultArray: RawCandlestickDatum[] = [];
  const dexCandles = dexCandlesGraphClient(symbolInfo.exchange);

  const { description: pairAddress, exchange: chainId, name } = symbolInfo;

  const [token0Address, token1Address] = name
    .split('/')
    .map((addr) => addr.toLowerCase());
  if (pairAddress == '') {
    return;
  }
  try {
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
    // console.log('resultArray', resultArray);
    const token0 = resultArray[0]?.token0;

    let parsedData = resultArray.map((res: RawCandlestickDatum) => {
      return {
        time: Number(res.time),
        open: Number(res.open),
        high: Number(res.high),
        low: Number(res.low),
        close: Number(res.close),
      };
    });
    // Query takes the tokens in sorted lexicographical order.
    // But if sortedToken0 is actually the output currency and vice versa,
    // then we must invert the prices
    if (token0 == token0Address) {
      parsedData = parsedData.map((res: NumericalCandlestickDatum) => {
        return {
          time: res.time,
          open: 1 / res.open,
          high: 1 / res.high,
          low: 1 / res.low,
          close: 1 / res.close,
        };
      });
    }
    // There is a race condition when you set input and output currencies, goto a different page and come back to
    // swap page again. We force a small pause to ensure the correct input and ouput currencies are showing on the
    // chart
    setTimeout(() => {}, 1000);
    const filled = fillCandlestickGaps(parsedData, period);
    return filled.map((res) => {
      return {
        time: res.time * 1000,
        open: res.open,
        high: res.high,
        low: res.low,
        close: res.close,
      };
    });
    // @ts-ignore
  } catch (e) {
    console.error('[getBars] erorr: ' + e);
  }
};
