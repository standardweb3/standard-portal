import React from 'react';
import { useRouter } from 'next/router';
import { useMemo, useState } from 'react';
import Image from '../../../components-ui/Image';
import { Table } from '../../../components-ui/Table/Table';
import { formatBalance, formatPercent } from '../../../functions';
import { useActiveWeb3React, useFuse } from '../../../hooks';
import { usePagination } from '../../../hooks/usePagination';
import { useCollateralsTable } from '../../../hooks/vault/useCollateralsTable';
import { useCollaterals } from '../../../services/graph/hooks/collaterals';
import { PromotedCollaterals } from './PromotedCollaterals';
import { CollateralCard } from './CollateralCard';
import { CollateralsTableFilters } from './CollateralsTableFilters';

export enum CollateralTableFilter {
  none = 'none',
  popular = 'popular',
  native = 'native',
  stablecoin = 'stablecoin',
}

const MemoPromotedCollaterals = React.memo(PromotedCollaterals);

export function CollateralsTable() {
  const { chainId } = useActiveWeb3React();
  const router = useRouter();
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
    sortByMcr,
    sortByName,
    sortBySfr,
    changeSortDirection,
  } = useCollateralsTable();

  const collaterals = useCollaterals();

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
        className: 'col-span-8 flex items-center',
        Cell: ({ value }) => {
          return <CollateralCard collateral={value} />;
        },
      },
    ],
    [],
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

  const rowsClassName = `
    grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-4 2xl:grid-cols-5 gap-4`;

  const rowClassName = `
    col-span-1
    grid grid-cols-8
    cursor-pointer
    transition duration-500
  `;
  const headerClassName = `
    text-grey text-xs
    mb-2
    grid grid-cols-8
`;

  return collaterals ? (
    <div className="w-full">
      <MemoPromotedCollaterals collaterals={promotedCollaterals} />
      <div className="!mt-[72px]">
        <div className="mb-[36px]">
          <CollateralsTableFilters
            filter={filter}
            setFilterNative={setFilterNative}
            setFilterNone={setFilterNone}
            setFilterPopular={setFilterPopular}
            setFilterStablecoin={setFilterStablecoin}
          />
        </div>
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
