import React from 'react';
import { useMemo, useState } from 'react';
import { Table } from '../../../components-ui/Table/Table';
import { formatBalance, formatPercent } from '../../../functions';
import { useFuse } from '../../../hooks';
import { usePagination } from '../../../hooks/usePagination';
import { useCollateralsTable } from '../../../hooks/vault/useCollateralsTable';
import { useCollaterals } from '../../../services/graph/hooks/collaterals';
import { PromotedCollaterals } from '../new/PromotedCollaterals';
import { CollateralCard } from '../CollateralCard';
import { CollateralsTableFilters } from './TableFilters';
import { SearchV2 } from '../../../components-ui/Search/SearchV2';
import { ViewSwitcher } from './ViewSwitcher';
import { useViewSwitcher, View } from '../../../hooks/useViewSwitcher';
import { CollateralListItem } from '../CollateralListItem';
import { useCdps } from '../../../services/graph/hooks/vault';

export enum CollateralTableFilter {
  none = 'none',
  popular = 'popular',
  native = 'native',
  stablecoin = 'stablecoin',
}

const MemoPromotedCollaterals = React.memo(PromotedCollaterals);

function ListViewHeader() {
  return (
    <div className="p-2 grid grid-cols-4 text-xs md:text-sm">
      <div className="flex justify-center items-center text-grey font-bold">
        Asset
      </div>
      <div className="flex justify-center items-center text-grey font-bold">
        Stability Fee
      </div>
      <div className="flex justify-center items-center text-grey font-bold">
        Min. Collateral Ratio
      </div>
      <div className="flex justify-center items-center text-grey font-bold">
        Price
      </div>
    </div>
  );
}

export function CollateralsTable() {
  const { view, setListView, setCardView } = useViewSwitcher();

  const [filter, setFilter] = useState(CollateralTableFilter.popular);

  const setFilterNone = () => setFilter(CollateralTableFilter.none);
  const setFilterPopular = () => setFilter(CollateralTableFilter.popular);
  const setFilterNative = () => setFilter(CollateralTableFilter.native);
  const setFilterStablecoin = () => setFilter(CollateralTableFilter.stablecoin);

  const filters = {
    [CollateralTableFilter.none]: (c) => c,
    [CollateralTableFilter.popular]: (c) => c.popular,
    [CollateralTableFilter.native]: (c) => c.native,
    [CollateralTableFilter.stablecoin]: (c) => c.type === 3,
  };

  const {
    sortBy,
    sortFns,
    // sortByMcr,
    // sortByName,
    // sortBySfr,
    // changeSortDirection,
  } = useCollateralsTable();

  const collaterals = useCollaterals({ show: true });
  console.log(collaterals);
  const cdps = useCdps();
  console.log(cdps);

  const promotedCollaterals = useMemo(() => {
    return collaterals
      ?.filter((c) => c.promote)
      .map((c) => {
        return {
          ...c,
          lfr: formatPercent(formatBalance(c.lfr, 5)),
          sfr: formatPercent(formatBalance(c.sfr, 5)),
          mcr: formatPercent(formatBalance(c.mcr, 5)),
        };
      });
  }, [collaterals]);

  const listColumnClassName = `w-full flex items-center`;
  const cardColumnClassName = `col-span-8 flex items-center`;

  const columnClassName =
    view === View.List ? listColumnClassName : cardColumnClassName;

  const sortedCollaterals = useMemo(() => {
    return collaterals
      ?.filter(filters[filter])
      ?.map((c) => {
        return {
          info: {
            symbol: c.symbol,
            alias: c.alias,
            name: c.name,
            description: c.description,
            logo: c.logo,
            address: c.address,
            priceAddress: c.priceAddress,
            lfr: formatPercent(formatBalance(c.lfr, 5)),
            sfr: formatPercent(formatBalance(c.sfr, 5)),
            mcr: formatPercent(formatBalance(c.mcr, 5)),
            chainId: c.chainid,
            color: c.color,
          },
          chainId: c.chainId,
        };
      })
      .sort(sortFns[sortBy]);
  }, [collaterals, filter, sortBy]);

  const columns = useMemo(
    () => [
      {
        Header: 'Collateral',
        accessor: 'info',
        className: columnClassName,
        Cell:
          view === View.List
            ? ({ value }) => {
                return <CollateralListItem collateral={value} />;
              }
            : ({ value }) => {
                return <CollateralCard collateral={value} />;
              },
      },
    ],
    [view],
  );

  const options = {
    keys: ['info.address', 'info.symbol', 'info.name'],
    threshold: 0.4,
  };

  const { result, term, search } = useFuse({
    data: sortedCollaterals,
    options,
  });

  const count = result?.length ?? 0;

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
  const data = useMemo(() => result?.slice(start, end) ?? [], [
    start,
    end,
    result,
  ]);

  const tableClassName = ``;

  const listRowsClassName = `
    grid grid-cols-1 gap-4`;
  const cardRowsClassName = `grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-4 2xl:grid-cols-5 `;

  const rowsClassName =
    view === View.List ? listRowsClassName : cardRowsClassName;

  const listRowClassName = `
    col-span-1
    cursor-pointer
    transition duration-500
  `;

  const cardRowClassName = `
    col-span-1
    grid grid-cols-8
    cursor-pointer
    transition duration-500
  `;

  const rowClassName = view === View.List ? listRowClassName : cardRowClassName;

  const headerClassName = `
    text-grey text-xs
    mb-2
    grid grid-cols-8
`;

  return collaterals ? (
    <div className="w-full">
      <MemoPromotedCollaterals collaterals={promotedCollaterals} />
      <div className="!mt-[72px]">
        <div
          className="mb-[36px] 
          flex flex-col sm:flex-row 
          sm:space-x-12
          space-y-4 sm:space-y-0 
          items-end sm:items-center
          justify-between"
        >
          <CollateralsTableFilters
            filter={filter}
            setFilterNative={setFilterNative}
            setFilterNone={setFilterNone}
            setFilterPopular={setFilterPopular}
            setFilterStablecoin={setFilterStablecoin}
          />
          <SearchV2
            iconRight
            className="flex-1 rounded-20 bg-dark-3 p-2 md:max-w-[400px] w-full"
            search={search}
            term={term}
            inputProps={{
              className: `
                  relative w-full
                  bg-transparent
                  font-bold  text-xs md:text-sm`,
              placeholder: 'Search by name, symbol or address',
            }}
          />
        </div>
        <div className="flex justify-center mb-4">
          <ViewSwitcher
            view={view}
            handleListView={setListView}
            handleCardView={setCardView}
          />
        </div>
        {view === View.List && <ListViewHeader />}
        <Table
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
          // onRowClick={handleRowClick}
          headerClassName={headerClassName}
          rowClassName={rowClassName}
          rowsClassName={rowsClassName}
          tableClassName={tableClassName}
          searchTerm={term}
          // fetchData={fetchData}
          loading={false}
          hideHeaders
          controlled
        />
      </div>
    </div>
  ) : (
    <div>Loading</div>
  );
}
