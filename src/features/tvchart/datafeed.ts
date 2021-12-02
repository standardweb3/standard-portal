import {
  computePairAddress2,
  Protocol,
  WNATIVE,
} from '@digitalnative/standard-protocol-sdk';
import { getAddress } from '@ethersproject/address';
import { CandlePeriod } from '../../types/Candle';
import { fetchBars } from './getBars';

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

export const getPairInfo = (symbolName) => {
  const split = symbolName.split('/');
  const [chainId, addr1, addr2, sym1, sym2] = split;
  const wethAddr = WNATIVE[parseInt(chainId)]?.address;
  const isWrapped =
    (addr1 === 'ETH' && addr2 === wethAddr) ||
    (addr2 === 'ETH' && addr1 === wethAddr);

  const pairAddress =
    wethAddr && addr1 && addr2 && !isWrapped
      ? computePairAddress2({
          chainId: parseInt(chainId),
          tokenA: addr1 === 'ETH' ? wethAddr : getAddress(addr1),
          tokenB: addr2 === 'ETH' ? wethAddr : getAddress(addr2),
          protocol: Protocol.STANDARD_PROTOCOL,
        }).toLowerCase()
      : '';

  return {
    pairAddress,
    ticker: symbolName,
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
    console.log('symbolName', symbolName);
    const { pairAddress, ticker, name, chainId } = getPairInfo(symbolName);
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

    try {
      const data = await fetchBars(symbolInfo, resolutionMapping[resolution]);

      if ((data && data.length === 0) || !firstDataRequest) {
        // "noData" should be set if there is no data in the requested period.
        onHistoryCallback([], {
          noData: true,
        });
        return;
      }
      console.log(`[getBars]: returned ${data.length} bar(s)`);
      onHistoryCallback(data, {
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
