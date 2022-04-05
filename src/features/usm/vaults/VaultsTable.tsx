import { useMemo, useState } from 'react';
import { Dropdown } from '../../../components-ui/Dropdown';
import { Sorter } from '../../../components-ui/Sorter';
import { Table } from '../../../components-ui/Table/Table';
import { classNames } from '../../../functions';
import { useFuse } from '../../../hooks';
import { useFilter } from '../../../hooks/useFilter';
import { usePagination } from '../../../hooks/usePagination';
import { SortDirection, useSort } from '../../../hooks/useSort';
import { VaultCondition } from '../../../pages/vaults';
import { VaultCard } from './VaultCard';

function ConditionFilters({ changeConditionFilter, activeCondition }) {
  const baseStyle =
    'text-grey font-bold cursor-pointer hover:text-primary transition duration-500';
  const activeStyle = '!text-primary';

  return (
    <div className="flex items-center space-x-4">
      <div
        className={classNames(
          baseStyle,
          activeCondition === undefined && activeStyle,
        )}
        onClick={() => changeConditionFilter(undefined)}
      >
        All
      </div>
      <div
        className={classNames(
          baseStyle,
          activeCondition == VaultCondition.SAFE && activeStyle,
        )}
        onClick={() => changeConditionFilter(VaultCondition.SAFE)}
      >
        Safe
      </div>
      <div
        className={classNames(
          baseStyle,
          activeCondition == VaultCondition.WARNING && activeStyle,
        )}
        onClick={() => changeConditionFilter(VaultCondition.WARNING)}
      >
        Warning
      </div>
      <div
        className={classNames(
          baseStyle,
          activeCondition == VaultCondition.DANGER && activeStyle,
        )}
        onClick={() => changeConditionFilter(VaultCondition.DANGER)}
      >
        Danger
      </div>

      <div
        className={classNames(
          baseStyle,
          activeCondition == VaultCondition.LIQUIDATED && activeStyle,
        )}
        onClick={() => changeConditionFilter(VaultCondition.LIQUIDATED)}
      >
        Liquidated
      </div>
    </div>
  );
}
export function VaultsTable({ vaults, hideFilter = undefined }) {
  const [filters, setFilters] = useState<any>({});
  const [sortAsc, setSortAsc] = useState(false);
  const [sortKey, setSortKey] = useState('currentBorrowed');

  const filtersArray = useMemo(() => Object.values(filters), [filters]);
  const activeCondition = filters['condition']?.value;
  const filteredVaults = useFilter(vaults, filtersArray);

  const sortedVaults = useSort(filteredVaults, {
    key: sortKey,
    dir: sortAsc ? SortDirection.asc : SortDirection.desc,
  });

  const changeSortDiredtion = () => {
    setSortAsc(!sortAsc);
  };

  const sortDropDownOptions = [
    {
      key: 'currentBorrowed',
      value: 'Borrowed',
      onSelect: () => {
        setSortKey('currentBorrowed');
      },
    },
    {
      key: 'collateralValue',
      value: 'Collateralized',
      onSelect: () => {
        setSortKey('collateralValue');
      },
    },
  ];

  const changeConditionFilter = (condition) => {
    if (condition) {
      setFilters({
        ...filters,
        condition: {
          key: 'condition',
          value: condition,
        },
      });
    } else {
      const { condition, ...rest } = filters;
      setFilters(rest);
    }
  };

  const columnClassName = `col-span-8 flex items-center`;
  const rowsClassName = `grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-4 2xl:grid-cols-4 `;
  const rowClassName = `
  col-span-1
  grid grid-cols-8
  cursor-pointer
  transition duration-500
`;
  const columns = useMemo(
    () => [
      {
        Header: 'Collateral',
        accessor: 'address',
        className: columnClassName,
        Cell: ({ row }) => {
          const {
            id,
            address,
            mcr,
            currentBorrowed,
            currentCollateralized,
            collateralAddress,
            liquidationPrice,
            collateralPrice,
            condition,
            debt,
            fee,
            isLiquidated,
            liquidation,
            isWnative,
          } = row.original;
          return (
            <VaultCard
              isWnative={isWnative}
              key={address}
              id={id}
              address={address}
              condition={condition}
              collateralAddress={collateralAddress}
              collateralPrice={collateralPrice}
              liquidationPrice={liquidationPrice}
              mcr={mcr}
              currentBorrowed={currentBorrowed}
              currentCollateralized={currentCollateralized}
              isLiquidated={isLiquidated}
              debt={debt}
              fee={fee}
              liquidation={liquidation}
              ownership
            />
          );
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
    data: sortedVaults,
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
  } = usePagination(0, 12, count);

  const start = currentPage * pageSize;
  const end = start + pageSize;

  const _result = result.concat();

  // data for table
  const data = useMemo(() => _result?.slice(start, end) ?? [], [
    start,
    end,
    _result,
  ]);

  return (
    <div>
      <div
        className="
        flex flex-col items-end space-y-4
        sm:flex-row sm:items-center sm:space-y-0
        justify-between mb-4"
      >
        <ConditionFilters
          activeCondition={activeCondition}
          changeConditionFilter={changeConditionFilter}
        />
        <div>
          <div className="flex items-center space-x-2">
            <div
              className="cursor-pointer text-text hover:text-primary font-sm font-bold transition duration-500"
              onClick={changeSortDiredtion}
            >
              <Sorter asc={sortAsc} />
            </div>
            <Dropdown selected={sortKey} options={sortDropDownOptions} />
          </div>
        </div>
      </div>
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
        // onRowClick={handleRowClick}
        // headerClassName={headerClassName}
        rowClassName={rowClassName}
        rowsClassName={rowsClassName}
        // tableClassName={tableClassName}
        searchTerm={term}
        // fetchData={fetchData}
        loading={false}
        hideHeaders
        controlled
      />
    </div>
  );
}
