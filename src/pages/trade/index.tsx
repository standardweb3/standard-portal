import { useCallback, useEffect, useMemo, useState } from 'react';
import dynamic from 'next/dynamic';
import ReactGA from 'react-ga';
import Head from 'next/head';
import { useActiveWeb3React, useFuse } from '../../hooks';
import { usePagination } from '../../hooks/usePagination';
import {
  useEthPrice,
  useExchangeAvailability,
  useOneDayEthPrice,
  useOneDayTokens,
  useSevenDayEthPrice,
  useSevenDayTokens,
  useTokens,
} from '../../services/graph';
import { Table } from '../../components-ui/Table/Table';
import { SimpleCurrencyLogo } from '../../components-ui/CurrencyLogo/SimpleCurrencyLogo';
import {
  formatNumber,
  formatNumberScale,
  formatPercent,
} from '../../functions';
import { ViewportMediumUp } from '../../components-ui/Responsive';
import { Page } from '../../components-ui/Page';
import { PageHeader } from '../../components-ui/PageHeader';
import { PageContent } from '../../components-ui/PageContent';

import { DefinedStyles } from '../../utils/DefinedStyles';
import { getSymbol, getTradeAddress } from '../../functions/native';
import { useRouter } from 'next/router';
import { useCurrency } from '../../hooks/Tokens';
import { ChainId, Token } from '@digitalnative/standard-protocol-sdk';
import { SearchV2 } from '../../components-ui/Search/SearchV2';
import { WavySpinner } from '../../components-ui/Spinner/WavySpinner';
const WeekChart = dynamic(() => import('../../features/trade/WeekChart'), {
  ssr: false,
});
import { NetworkGuardWrapper } from '../../guards/Network';
import { NORMAL_GUARDED_CHAINS } from '../../constants/networks';
import { reverseArray } from '../../utils';
import { TRADE_BLACKLIST } from '../../constants/blacklist';

function Tokens() {
  const { chainId } = useActiveWeb3React();
  const router = useRouter();
  useExchangeAvailability(() => router.push('/trade/buy'));
  const [sortBy, setSortBy] = useState('top trading');

  const sortOptions = useMemo(() => {
    return {
      'top trading': (a, b) => {
        return b.volume - a.volume;
      },
      'top gainers': (a, b) => {
        return b.oneDayPriceChange - a.oneDayPriceChange;
      },
      'top losers': (a, b) => {
        return a.oneDayPriceChange - b.oneDayPriceChange;
      },
    };
  }, []);

  const handleRowClick = useCallback(
    (row: any) => {
      ReactGA.event({
        category: 'Trade',
        action: row.values.info.symbol,
      });
      router.push(
        `/trade/buy?outputCurrency=${getTradeAddress(
          chainId,
          row.values.info.id,
        )}`,
      );
    },
    [chainId, router],
  );

  // const emptyTokens = useEmptyTokens();
  // const count = emptyTokens?.length ?? 0;

  // const [searchKeyword, setSearchKeyword] = useState('');
  // const deboundedKeyword = useDebounce(searchKeyword, 200)

  const _ethPrice = useEthPrice();
  const ethPrice = parseFloat(_ethPrice ?? '0');
  // change to text search when graph is ready (?)

  const oneDayTokens = useOneDayTokens({});
  const _oneDayEthPrice = useOneDayEthPrice();
  const oneDayEthPrice = parseFloat(_oneDayEthPrice ?? '0');
  const sevenDayTokens = useSevenDayTokens({});
  const _sevenDayEthPrice = useSevenDayEthPrice();
  const sevenDayEthPrice = parseFloat(_sevenDayEthPrice ?? '0');

  const tokens = useTokens({});

  useEffect(() => {
    if (tokens !== undefined && tokens.length === 0) {
      router.push('/trade/buy');
    }
  }, [tokens, router]);

  const sortedTokens = useMemo(() => {
    return (
      tokens
        ?.filter((token) => {
          return !TRADE_BLACKLIST[chainId][token.id];
        })
        ?.map((token) => {
          const oneDayToken = oneDayTokens?.find(({ id }) => token.id === id);
          const priceYesterday = oneDayToken
            ? oneDayToken.derivedETH * oneDayEthPrice
            : 0;

          const oneDayVolume = oneDayToken
            ? token.volumeUSD - oneDayToken.volumeUSD
            : 0;

          const sevenDayToken = sevenDayTokens?.find(
            ({ id }) => token.id === id,
          );

          const priceWeekAgo = sevenDayToken
            ? sevenDayToken.derivedETH * sevenDayEthPrice
            : 0;

          const price = parseFloat(token.derivedETH) * ethPrice;

          const sevenDayPriceChange = priceWeekAgo
            ? ((price - priceWeekAgo) / priceWeekAgo) * 100
            : 0;

          const oneDayPriceChange = priceYesterday
            ? ((price - priceYesterday) / priceYesterday) * 100
            : 0;
          // const oneDayVolume =
          //   parseFloat(token.volumeUSD) - token.dayData && token.dayData.length > 0
          //     ? token.dayData[token.dayData.length - 1].volumeUSD
          //     : 0;
          return {
            name: token.name,
            info: {
              symbol: token.symbol,
              id: token.id,
              status:
                oneDayPriceChange > 0 ? 1 : oneDayPriceChange === 0 ? 0 : -1,
            },
            volume: oneDayVolume,
            liquidity: token.liquidity * token.derivedETH * ethPrice,
            price: token.derivedETH * ethPrice,
            sevenDayPriceChange,
            oneDayPriceChange,
            sparklines: {
              status: sevenDayPriceChange
                ? sevenDayPriceChange > 0
                  ? 1
                  : sevenDayPriceChange === 0
                  ? 0
                  : -1
                : oneDayPriceChange
                ? oneDayPriceChange > 0
                  ? 1
                  : oneDayPriceChange === 0
                  ? 0
                  : -1
                : 0,
              data: reverseArray(token.dayData),
            },
          };
        })
        .sort(sortOptions[sortBy]) ?? []
    );
  }, [
    tokens,
    ethPrice,
    oneDayEthPrice,
    sevenDayEthPrice,
    oneDayTokens,
    sevenDayTokens,
    sortOptions,
    sortBy,
  ]);

  const columns = useMemo(
    () => [
      {
        Header: 'Token',
        accessor: 'info',
        className: 'col-span-2 flex justify-center items-center',
        Cell: ({ value }) => {
          return (
            <div className="flex justify-start w-full items-center space-x-2">
              <SimpleCurrencyLogo
                className={`rounded-full`}
                symbol={value.symbol}
                id={value.id}
              />
              <div
                className={`text-xs lg:text-sm font-bold ${
                  value.status > 0
                    ? 'text-green'
                    : value.status === 0
                    ? 'text-grey'
                    : 'text-red'
                }`}
              >
                {getSymbol(chainId, value.symbol)}
              </div>
            </div>
          );
        },
      },
      {
        Header: 'Liquidity',
        accessor: 'liquidity',
        className: 'col-span-2 hidden sm:flex justify-center items-center',
        Cell: ({ value }) => {
          return (
            <div className="text-xs lg:text-sm">
              {value !== null ? formatNumberScale(value, true) : '-'}
            </div>
          );
        },
      },
      {
        Header: 'Volume (24h)',
        accessor: 'volume',
        className: 'col-span-2 hidden sm:flex justify-center items-center',
        Cell: ({ value }) => {
          const { chainId } = useActiveWeb3React();
          return (
            <div className="text-xs lg:text-sm">
              {value !== null ? formatNumberScale(value, true) : '-'}
            </div>
          );
        },
      },
      {
        Header: 'Price',
        accessor: 'price',
        className: 'col-span-2 flex justify-center items-center',
        Cell: ({ row, value }) => {
          return (
            <div className="text-xs lg:text-sm text-primary font-bold">
              <div>{value !== null ? formatNumber(value, true) : '-'}</div>
            </div>
          );
        },
      },
      {
        Header: '24h',
        accessor: 'oneDayPriceChange',
        className: 'col-span-2 justify-center items-center flex',
        Cell: ({ value }) => {
          const { chainId } = useActiveWeb3React();
          return (
            <div
              className={`text-xs lg:text-sm ${
                value > 0 ? 'text-green' : value < 0 && 'text-red'
              }`}
            >
              {value !== null ? formatPercent(value) : '-'}
            </div>
          );
        },
      },
      {
        Header: '7d',
        accessor: 'sevenDayPriceChange',
        className: 'col-span-2 hidden lg:flex justify-center items-center',
        Cell: ({ value }) => {
          const { chainId } = useActiveWeb3React();
          if (chainId === ChainId.METIS) return '-';
          return (
            <div
              className={`text-xs lg:text-sm ${
                value > 0 ? 'text-green' : value < 0 && 'text-red'
              }`}
            >
              {value !== null ? formatPercent(value) : '-'}
            </div>
          );
        },
      },
      {
        Header: 'Chart (7d)',
        accessor: 'sparklines',
        className:
          'col-span-2 sm:col-span-4 lg:col-span-4 flex justify-center items-center',
        Cell: (cell) => {
          const { value } = cell;

          const { chainId } = useActiveWeb3React();
          if (chainId === ChainId.METIS) return '-';

          return (
            <div
              className={`${
                value.status > 0
                  ? 'text-green'
                  : value.status === 0
                  ? 'text-grey'
                  : 'text-red'
              }
              flex justify-center align-center`}
            >
              <WeekChart value={value} />
            </div>
          );
        },
      },
    ],
    [chainId],
  );

  const tableClassName = `
  `;

  const rowsClassName = `
    space-y-2
  `;

  const rowClassName = `
    grid grid-cols-8 sm:grid-cols-14 lg:grid-cols-16
    bg-opaque px-4 py-4 rounded-20
    cursor-pointer
    hover:bg-bright
    transition duration-500
  `;

  const headerClassName = `
  text-grey text-xs
  mb-2
  grid grid-cols-8 sm:grid-cols-14 lg:grid-cols-16
`;

  // fuzzy search
  const options = {
    keys: ['info.id', 'info.symbol', 'name'],
    threshold: 0.4,
  };

  const { result, term, search } = useFuse({
    data: sortedTokens,
    options,
  });

  const count = result?.length ?? 0;

  const searchToken = useCurrency(term);

  const searchTokenIsInList =
    searchToken?.isToken &&
    result.findIndex((token) => {
      return (
        token.info.id.toLowerCase() ===
          (searchToken as Token).address.toLowerCase() ||
        token.info.symbol.toLowerCase() === searchToken.symbol?.toLowerCase()
      );
    }) !== -1;

  const resultWithSearchToken = useMemo(() => {
    if (searchToken?.isToken && !searchTokenIsInList)
      return result.concat([
        {
          name: searchToken.name,
          info: { symbol: searchToken.symbol, id: searchToken.address },
          volume: null,
          liquidity: null,
          sevenDayPriceChange: null,
          oneDayPriceChange: null,
          price: null,
          sparklines: [],
          status: null,
        },
      ]);
    return result;
  }, [result, searchToken, searchTokenIsInList]);
  // pagination
  const {
    currentPage,
    toNextPage,
    toPrevPage,
    toFirstPage,
    toLastPage,
    toPage,
    changepageSize,
    lastPage,
    pageSize,
  } = usePagination(0, 12, count);

  const start = currentPage * pageSize;
  const end = start + pageSize;

  // data for table
  const data = useMemo(() => resultWithSearchToken?.slice(start, end) ?? [], [
    start,
    end,
    resultWithSearchToken,
  ]);

  return (
    <>
      <Head>
        <title>Trade | Standard Protocol</title>
        <meta
          key="description"
          name="description"
          content="Trade ERC 20 tokens on Standard Protocol"
        />
      </Head>
      <Page id="trade-page" className={DefinedStyles.page}>
        <ViewportMediumUp>
          <PageHeader title="Trade" />
        </ViewportMediumUp>
        <PageContent>
          <div className="w-full text-text bg-transparent md:bg-background md:py-5 md:px-4 rounded-20">
            <div className="rounded-20 bg-opaque px-4 py-4 flex items-center">
              <SearchV2
                className="flex-1"
                search={search}
                term={term}
                inputProps={{
                  className: `
                  relative w-full
                  bg-transparent
                  font-bold text-sm`,
                }}
              />
              <select
                className="text-primary font-bold text-sm bg-transparent outline-none text-right pr-2"
                value={sortBy}
                onChange={(e) => {
                  setSortBy(e.target.value);
                }}
              >
                {['top trading', 'top gainers', 'top losers'].map(
                  (sortOption) => (
                    <option key={sortOption} value={sortOption}>
                      {sortOption}
                    </option>
                  ),
                )}
              </select>
            </div>
            <div className="text-xs text-grey pl-2 mt-2 mb-6">
              * Search by name, symbol, address
            </div>
            {!tokens ? (
              <div className="text-center space-y-2">
                <WavySpinner className="bg-text" />
                <div className="text-sm">Loading Tokens...</div>
              </div>
            ) : (
              <Table
                columns={columns}
                data={data}
                initialPage={currentPage}
                rowsPerPage={pageSize}
                initialPageSize={12}
                pageCount={lastPage + 1}
                onNextPage={toNextPage}
                onPrevPage={toPrevPage}
                onFirstPage={toFirstPage}
                onLastPage={toLastPage}
                onToPage={toPage}
                onChangePageSize={changepageSize}
                onRowClick={handleRowClick}
                headerClassName={headerClassName}
                rowClassName={rowClassName}
                rowsClassName={rowsClassName}
                tableClassName={tableClassName}
                searchTerm={term}
                // fetchData={fetchData}
                loading={false}
                controlled
              />
            )}
          </div>
        </PageContent>
      </Page>
    </>
  );
}

Tokens.Guard = NetworkGuardWrapper(NORMAL_GUARDED_CHAINS);
export default Tokens;
