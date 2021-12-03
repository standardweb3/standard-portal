import { useRouter } from 'next/router';
import { useMemo, useState } from 'react';
import { formatDecimal } from '../../../bridge/core/Tools';
import Image from '../../../components-ui/Image';
import { Table } from '../../../components-ui/Table/Table';
import { formatBalance, formatPercent } from '../../../functions';
import { getSymbol } from '../../../functions/native';
import { useActiveWeb3React, useFuse } from '../../../hooks';
import { usePagination } from '../../../hooks/usePagination';
import { useCollateralsTable } from '../../../hooks/vault/useCollateralsTable';
import { useCollaterals } from '../../../services/graph/hooks/collaterals';

export function CollateralsTable() {
  const { chainId } = useActiveWeb3React();
  const router = useRouter();

  const {
    sortBy,
    sortFns,
    sortByMcr,
    sortByName,
    sortBySfr,
    changeSortDirection,
  } = useCollateralsTable();

  const collaterals = useCollaterals();
  const sortedCollaterals = useMemo(() => {
    return collaterals
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
          },
          chainId: c.chainId,
        };
      })
      .sort(sortFns[sortBy]);
  }, [collaterals]);

  const columns = useMemo(
    () => [
      {
        Header: 'Collateral',
        accessor: 'info',
        className: 'col-span-2 flex items-center',
        Cell: ({ value }) => {
          return (
            <div className="flex justify-start w-full items-center space-x-2">
              <div>
                <Image
                  className="rounded-full"
                  src={value.logo}
                  width="96px"
                  height="96px"
                  layout="fixed"
                />
                <div className="text-sm md:text-lg font-bold">
                  {value.symbol}
                </div>
                <div>
                  <div>Stability Fee:</div>
                  <div>{value.sfr}</div>
                </div>

                <div>
                  <div>Min Collateral Ratio:</div>
                  <div>{value.mcr}</div>
                </div>
              </div>
            </div>
          );
        },
      },
      // {
      //   Header: 'Min Collateral Ratio',
      //   accessor: 'mcr',
      //   className: 'col-span-2 flex items-center',
      //   Cell: ({ value }) => {
      //     return (
      //       <div className="flex justify-start w-full items-center space-x-2">
      //         <div className="text-sm lg:text-base">{value}</div>
      //       </div>
      //     );
      //   },
      // },
      // {
      //   Header: 'Stability Fee',
      //   accessor: 'sfr',
      //   className: 'col-span-2 flex items-center',
      //   Cell: ({ value }) => {
      //     return (
      //       <div className="flex justify-start w-full items-center space-x-2">
      //         <div className="text-sm lg:text-base">{value}</div>
      //       </div>
      //     );
      //   },
      // },
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
    grid grid-cols-3`;

  const rowClassName = `
    grid grid-cols-8
    bg-opaque px-4 py-4 rounded-20
    cursor-pointer
    hover:bg-bright
    transition duration-500
  `;
  const headerClassName = `
    text-grey text-xs
    mb-2
    grid grid-cols-8
`;

  return collaterals ? (
    <div className="w-full">
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
        controlled
      />
    </div>
  ) : (
    <div>Loading</div>
  );
}
