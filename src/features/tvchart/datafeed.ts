import {
  computePairAddress,
  getFactoryAddress,
  Protocol,
  WNATIVE,
} from '@digitalnative/standard-protocol-sdk';
import { dexCandlesGraphClient } from '../../services/graph/clients/candles';
import { dexCandlesQuery } from '../../services/graph/queries/candles';

export const configurationData = {
  supported_resolutions: ['5', '15', '60', '240', 'D'],
  exchanges: [],
  symbols_types: [],
};

async function asynfetchDexCandles(
  chainId,
  pairAddress,
  addr1,
  addr2,
  resolution,
  period,
) {
  const dexCandles = dexCandlesGraphClient(chainId);
  let resultArray = [];

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
}

export const getPairInfo = (symbolName) => {
  const split = symbolName.split('/');
  const [chainId, addr1, addr2, sym1, sym2] = split;
  const wethAddr = WNATIVE[chainId].address;
  const isWrapped =
    (addr1 === 'ETH' && addr2 === wethAddr) ||
    (addr2 === 'ETH' && addr1 === wethAddr);

  const pairAddress =
    addr1 && addr2 && !isWrapped
      ? computePairAddress({
          factoryAddress: getFactoryAddress(
            Protocol.STANDARD_PROTOCOL,
            chainId,
          ),
          tokenA: addr1 === 'ETH' ? wethAddr : addr1,
          tokenB: addr2 === 'ETH' ? wethAddr : addr2,
          protocol: Protocol.STANDARD_PROTOCOL,
        }).toLowerCase()
      : '';

  return {
    pairAddress,
    ticker: `${sym1}/${sym2}`,
    name: `${addr1}/${addr2}`,
    chainId,
  };
};

export default {
  onReady: (callback) => {
    console.log('[onReady]: Method call');
    setTimeout(() => callback(configurationData));
  },
  searchSymbols: async (
    userInput,
    exchange,
    symbolType,
    onResultReadyCallback,
  ) => {
    console.log('[searchSymbols]: Method call');
    // const symbols = await getAllSymbols();
    // const newSymbols = symbols.filter(symbol => {
    // 	const isExchangeValid = exchange === '' || symbol.exchange === exchange;
    // 	const isFullSymbolContainsInput = symbol.full_name
    // 		.toLowerCase()
    // 		.indexOf(userInput.toLowerCase()) !== -1;
    // 	return isExchangeValid && isFullSymbolContainsInput;
    // });
    // onResultReadyCallback(newSymbols);
  },
  resolveSymbol: async (
    symbolName,
    onSymbolResolvedCallback,
    onResolveErrorCallback,
  ) => {
    const { pairAddress, ticker, name, chainId } = symbolName(symbolName);
    if (pairAddress === '') {
      return onResolveErrorCallback();
    }
    console.log('[resolveSymbol]: Method call', symbolName);
    const symbolInfo = {
      ticker: ticker,
      name: name,
      description: pairAddress,
      type: 'crypto',
      session: '24x7',
      timezone: 'Etc/UTC',
      exchange: chainId,
      minmov: 1,
      pricescale: 100,
      has_intraday: false,
      has_no_volume: true,
      has_weekly_and_monthly: false,
      supported_resolutions: configurationData.supported_resolutions,
      volume_precision: 2,
      data_status: 'streaming',
    };

    console.log('[resolveSymbol]: Symbol resolved', symbolName);
    onSymbolResolvedCallback(symbolInfo);
  },
  getBars: async (
    symbolInfo,
    resolution,
    periodParams,
    onHistoryCallback,
    onErrorCallback,
  ) => {
    const { from, to, firstDataRequest } = periodParams;
    console.log('[getBars]: Method call', symbolInfo, resolution, from, to);
    const dexCandles = dexCandlesGraphClient(symbolInfo.exchange);

    const query = Object.keys(urlParameters)
      .map((name) => `${name}=${encodeURIComponent(urlParameters[name])}`)
      .join('&');
    try {
      const data = await makeApiRequest(`data/histoday?${query}`);
      if (
        (data.Response && data.Response === 'Error') ||
        data.Data.length === 0
      ) {
        // "noData" should be set if there is no data in the requested period.
        onHistoryCallback([], {
          noData: true,
        });
        return;
      }
      let bars = [];
      data.Data.forEach((bar) => {
        if (bar.time >= from && bar.time < to) {
          bars = [
            ...bars,
            {
              time: bar.time * 1000,
              low: bar.low,
              high: bar.high,
              open: bar.open,
              close: bar.close,
            },
          ];
        }
      });
      if (firstDataRequest) {
        lastBarsCache.set(symbolInfo.full_name, {
          ...bars[bars.length - 1],
        });
      }
      console.log(`[getBars]: returned ${bars.length} bar(s)`);
      onHistoryCallback(bars, {
        noData: false,
      });
    } catch (error) {
      console.log('[getBars]: Get error', error);
      onErrorCallback(error);
    }
  },
};
