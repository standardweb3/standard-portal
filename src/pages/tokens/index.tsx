import { useMemo } from 'react';
import ReactGA from 'react-ga';
import Head from 'next/head';
import { Sparklines, SparklinesLine } from 'react-sparklines';
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
import { Search } from '../../components-ui/Search';
import { TokensTable } from '../../components-ui/Table/TokensTable';
import { SimpleCurrencyLogo } from '../../components-ui/CurrencyLogo/SimpleCurrencyLogo';
import {
  formatNumber,
  formatNumberScale,
  formatPercent,
} from '../../functions';
import { Button } from '../../components-ui/Button';
import {
  useSizeMdDown,
  useSizeXs,
  ViewportMediumUp,
} from '../../components-ui/Responsive';
import { Page } from '../../components-ui/Page';
import { PageHeader } from '../../components-ui/PageHeader';
import { PageContent } from '../../components-ui/PageContent';

import { DefinedStyles } from '../../utils/DefinedStyles';
import { getSymbol, getTradeAddress } from '../../functions/native';
import { useRouter } from 'next/router';
import { useCurrency } from '../../hooks/Tokens';
import { Token } from '@digitalnative/standard-protocol-sdk';

export default function Tokens() {
  const { chainId } = useActiveWeb3React();
  const router = useRouter();
  useExchangeAvailability(() => router.push('/swap'));

  const handleTradeClick = (chainId, address, symbol) => {
    router.push(`/swap?inputCurrency=${getTradeAddress(chainId, address)}`);

    ReactGA.event({
      category: 'Trade',
      action: symbol,
    });
  };
  // const emptyTokens = useEmptyTokens();
  // const count = emptyTokens?.length ?? 0;

  // const [searchKeyword, setSearchKeyword] = useState('');
  // const deboundedKeyword = useDebounce(searchKeyword, 200)

  const ethPrice = parseFloat(useEthPrice() ?? 0);
  // change to text search when graph is ready (?)

  const oneDayTokens = useOneDayTokens({});
  const oneDayEthPrice = parseFloat(useOneDayEthPrice() ?? 0);
  const sevenDayTokens = useSevenDayTokens({});
  const sevenDayEthPrice = parseFloat(useSevenDayEthPrice() ?? 0);

  const tokens =
    useTokens({
      // first: pageSize,
      // skip: current * pageSize,
    })?.map((token) => {
      const oneDayToken = oneDayTokens?.find(({ id }) => token.id === id);
      const priceYesterday = oneDayToken
        ? oneDayToken.derivedETH * oneDayEthPrice
        : 0;

      const oneDayVolume = oneDayToken
        ? token.volumeUSD - oneDayToken.volumeUSD
        : 0;

      const sevenDayToken = sevenDayTokens?.find(({ id }) => token.id === id);
      const priceWeekAgo = sevenDayToken
        ? sevenDayToken.derivedETH * sevenDayEthPrice
        : 0;
      // const volumeWeekAgo = sevenDayToken
      //   ? token.volumeUSD - sevenDayToken.volumeUSD
      //   : 0;

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
        info: { symbol: token.symbol, id: token.id },
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
          data: token.dayData,
        },
      };
    }) ?? [];

  const columns = useMemo(
    () => [
      {
        Header: 'Token',
        accessor: 'info',
        className: 'col-span-2 flex items-center',
        Cell: ({ value }) => {
          return (
            <div className="flex justify-center items-center space-x-2">
              <SimpleCurrencyLogo
                className="rounded-full"
                symbol={value.symbol}
                id={value.id}
              />
              <div className="text-xs lg:text-sm">
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
        Cell: ({ value }) => (
          <div className="text-xs lg:text-sm">
            {value !== null ? formatNumberScale(value, true) : '-'}
          </div>
        ),
      },
      {
        Header: 'Volume (24h)',
        accessor: 'volume',
        className: 'col-span-2 hidden sm:flex justify-center items-center',
        Cell: ({ value }) => (
          <div className="text-xs lg:text-sm">
            {value !== null ? formatNumberScale(value, true) : '-'}
          </div>
        ),
      },
      {
        Header: 'Price',
        accessor: 'price',
        className: 'col-span-2 flex justify-center items-center',
        Cell: ({ value }) => (
          <div className="text-xs lg:text-sm text-primary font-bold">
            {value !== null ? formatNumber(value, true) : '-'}
          </div>
        ),
      },
      {
        Header: '24h',
        accessor: 'oneDayPriceChange',
        className: 'col-span-2 justify-center items-center hidden sm:flex',
        Cell: ({ value }) => (
          <div
            className={`text-xs lg:text-sm ${
              value > 0 ? 'text-green' : value < 0 && 'text-red'
            }`}
          >
            {value !== null ? formatPercent(value) : '-'}
          </div>
        ),
      },
      {
        Header: '7d',
        accessor: 'sevenDayPriceChange',
        className: 'col-span-2 hidden lg:flex justify-center items-center',
        Cell: ({ value }) => (
          <div
            className={`text-xs lg:text-sm ${
              value > 0 ? 'text-green' : value < 0 && 'text-red'
            }`}
          >
            {value !== null ? formatPercent(value) : '-'}
          </div>
        ),
      },
      {
        Header: 'Chart',
        accessor: 'sparklines',
        className:
          'col-span-3 sm:col-span-4 lg:col-span-5 flex justify-center items-center',
        Cell: ({ value }) => {
          const isViewportXs = useSizeXs();
          const isViewportMdDown = useSizeMdDown();
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
              <Sparklines
                data={value.data?.map((d) => d.priceUSD) ?? []}
                limit={7}
                svgWidth={isViewportMdDown ? (isViewportXs ? 100 : 130) : 160}
                svgHeight={30}
              >
                <SparklinesLine
                  style={{
                    strokeWidth: 3,
                    stroke: 'currentColor',
                    fill: 'none',
                  }}
                />
              </Sparklines>
            </div>
          );
        },
      },
      {
        Header: '',
        accessor: 'none',
        className: 'col-span-2 flex justify-center items-center',
        Cell: ({ row }) => {
          return (
            <Button
              onClick={() =>
                handleTradeClick(
                  chainId,
                  row.values.info.id,
                  row.values.info.symbol,
                )
              }
            >
              Trade
            </Button>
          );
        },
      },
    ],
    [],
  );

  const tableClassName = `
  `;

  const rowsClassName = `
    space-y-4
  `;

  const rowClassName = `
    grid grid-cols-9 sm:grid-cols-16 lg:grid-cols-19
    bg-opaque px-4 py-4 rounded-20
  `;

  const headerClassName = `
   text-xs lg:text-sm
  grid grid-cols-9 sm:grid-cols-16 lg:grid-cols-19
  px-4 py-4
  mb-2
  font-bold
`;

  // fuzzy search
  const options = {
    keys: ['info.id', 'info.symbol', 'name'],
    threshold: 0.4,
  };

  const { result, term, search } = useFuse({
    data: tokens,
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
  } = usePagination(0, 20, count);

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
        <title>Tokens | Standard Protocol</title>
        <meta
          key="description"
          name="description"
          content="ERC 20 tokens on Standard Protocol"
        />
      </Head>
      <Page id="tokens-page" className={DefinedStyles.page}>
        <ViewportMediumUp>
          <PageHeader title="tokens" />
        </ViewportMediumUp>
        <PageContent>
          <div className="w-full text-text bg-opaque py-8 px-4 rounded-20">
            <Search
              className="mb-4"
              search={search}
              term={term}
              inputProps={{
                className: `
          relative w-full
          bg-transparent
          bg-opaque 
          rounded-20
          border border-transparent
          focus:border-primary
          font-bold text-sm px-6 py-3.5`,
              }}
            />
            <TokensTable
              columns={columns}
              data={data}
              initialPage={currentPage}
              rowsPerPage={pageSize}
              pageCount={lastPage + 1}
              onNextPage={toNextPage}
              onPrevPage={toPrevPage}
              onFirstPage={toFirstPage}
              onLastPage={toLastPage}
              onToPage={toPage}
              onChangePageSize={changepageSize}
              headerClassName={headerClassName}
              rowClassName={rowClassName}
              rowsClassName={rowsClassName}
              tableClassName={tableClassName}
              searchTerm={term}
              // fetchData={fetchData}
              loading={false}
              controlled
            />
          </div>
        </PageContent>
      </Page>
    </>
  );
}
