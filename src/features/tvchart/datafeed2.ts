import { CandlePeriod } from '../../types/Candle';

export const configurationData = {
  supported_resolutions: ['5', '15', '60', '240', '1D', '1W'],
  exchanges: [],
  symbols_types: [],
};

export const resolutionMapping = {
  5: CandlePeriod.FiveMinutes,
  15: CandlePeriod.FifteenMinutes,
  60: CandlePeriod.OneHour,
  240: CandlePeriod.FourHours,
  '1D': CandlePeriod.OneDay,
  '1W': CandlePeriod.OneWeek,
};

export function useDatafeed(allBars, resolution, ticker) {
  return {
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
      const symbolInfo = {
        ticker: ticker,
        name: ticker,
        description: ticker,
        type: 'crypto',
        session: '24x7',
        timezone: 'Etc/UTC',
        exchange: 'Standard Protocol',
        minmov: 1,
        pricescale: 100,
        has_intraday: false,
        has_no_volume: true,
        has_weekly_and_monthly: false,
        supported_resolutions: configurationData.supported_resolutions,
        volume_precision: 2,
        has_empty_bars: true,
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
      const { from, to, countBack, firstDataRequest } = periodParams;
      console.log('[getBars]: Method call', symbolInfo, resolution, from, to);
      const bars = allBars[0]?.data;
      try {
        if ((bars && bars.length === 0) || !firstDataRequest) {
          // "noData" should be set if there is no data in the requested period.
          onHistoryCallback([], {
            noData: true,
          });
          return;
        }
        const parsedBars = bars.map((res) => {
          return {
            time: res.time * 1000,
            open: res.open,
            high: res.high,
            low: res.low,
            close: res.close,
          };
        });
        console.log(`[getBars]: returned ${bars.length} bar(s)`);
        onHistoryCallback(parsedBars, {
          noData: false,
        });
      } catch (error) {
        console.log('[getBars]: Get error', error);
        onErrorCallback(error);
      }
    },
    subscribeBars: async (
      symbolInfo,
      resolution,
      onTick,
      listenerGuid,
      onResetCacheNeededCallback,
    ) => {},
    unsubscribeBars: (listenerGuid: string) => {},
  };
}
