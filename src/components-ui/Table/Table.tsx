import { ChevronLeftIcon, ChevronRightIcon } from '@heroicons/react/outline';
import React, { useCallback, useEffect } from 'react';
import { useTable, usePagination } from 'react-table';
import { classNames } from '../../functions';

export type TableProps = {
  initialPage: number;
  rowsPerPage: number;
  pageCount?: number;
  data: any[];
  columns: any[];
  loading: boolean;
  onNextPage?: () => void;
  onPrevPage?: () => void;
  onLastPage?: () => void;
  onFirstPage?: () => void;
  onToPage?: (pageIndex: number) => void;
  onChangePageSize?: (pageSize: number) => void;
  fetchData?: ({
    pageIndex,
    pageSize,
  }: {
    pageIndex: number;
    pageSize: number;
  }) => void;
  onRowClick?: (row: any) => void;
  controlled?: boolean;
  headerClassName?: string;
  rowClassName?: string;
  rowsClassName?: string;
  tableClassName?: string;
  hideHeaders?: boolean;
  searchTerm?: string;
  disablePageSize?: boolean;
  initialPageSize?: number;
};
// Let's add a fetchData method to our Table component that will be used to fetch
// new data when pagination state changes
// We can also add a loading state to let our table know it's loading new data
export function Table({
  columns,
  data,
  initialPage = 0,
  initialPageSize,
  rowsPerPage = 10,
  pageCount: controlledPageCount = data.length,
  loading,
  onPrevPage,
  onNextPage,
  onFirstPage,
  onLastPage,
  onToPage,
  onChangePageSize,
  fetchData,
  onRowClick,
  controlled = false,
  headerClassName,
  rowClassName,
  rowsClassName,
  tableClassName,
  hideHeaders,
  searchTerm,
  disablePageSize,
}: TableProps) {
  const {
    // getTableProps,
    // getTableBodyProps,
    headerGroups,
    prepareRow,
    page,
    canPreviousPage,
    canNextPage,
    pageOptions,
    pageCount,
    gotoPage,
    nextPage,
    previousPage,
    setPageSize,
    // Get the state from the instance
    state: { pageIndex, pageSize },
  } = useTable(
    {
      columns,
      data,
      initialState: { pageIndex: initialPage ?? 0 },
      pageSize: rowsPerPage ?? 10, // Pass our hoisted table state
      manualPagination: true, // Tell the usePagination
      // hook that we'll handle our own data fetching
      // This means we'll also have to provide our own
      // pageCount.
      pageCount: controlled ? controlledPageCount : undefined,
    },
    usePagination,
  );

  useEffect(() => {
    handleFirstPage();
  }, [searchTerm]);

  useEffect(() => {
    setPageSize(rowsPerPage);
    handleFirstPage();
  }, [rowsPerPage, setPageSize]);

  // Listen for changes in pagination and use the state to fetch our new data
  useEffect(() => {
    fetchData && fetchData({ pageIndex, pageSize });
  }, [fetchData, pageIndex, pageSize]);

  const handlePrevPage = useCallback(() => {
    onPrevPage && onPrevPage();
    previousPage();
  }, [onNextPage, nextPage]);

  const handleNextPage = useCallback(() => {
    onNextPage && onNextPage();
    nextPage();
  }, [onNextPage, nextPage]);

  const handleFirstPage = useCallback(() => {
    onFirstPage && onFirstPage();
    gotoPage(0);
  }, [onFirstPage, gotoPage]);

  const handleLastPage = useCallback(() => {
    onLastPage && onLastPage();
    gotoPage(pageCount - 1);
  }, [onLastPage, gotoPage]);

  const handleToPage = useCallback(
    (pageIndex) => {
      onToPage && onToPage(pageIndex);
      gotoPage(pageIndex);
    },
    [gotoPage, onToPage],
  );

  const handleChangePageSize = useCallback(
    (newPageSize) => {
      onChangePageSize && onChangePageSize(newPageSize);
    },
    [onChangePageSize],
  );

  const handleRowClick = (row) => {
    onRowClick && onRowClick(row);
  };

  // Render the UI for your table
  return (
    <>
      {/* <pre>
        <code>
          {JSON.stringify(
            {
              pageIndex,
              pageSize,
              pageCount,
              canNextPage,
              canPreviousPage,
            },
            null,
            2,
          )}
        </code>
      </pre> */}
      <div className={tableClassName}>
        {!hideHeaders && (
          <div>
            {headerGroups.map((headerGroup, i) => {
              return (
                <div className={headerClassName} key={i}>
                  {headerGroup.headers.map((column, i) => (
                    <div className={column.className} key={i}>
                      {column.render('Header')}
                      <span>
                        {column.isSorted
                          ? column.isSortedDesc
                            ? ' 🔽'
                            : ' 🔼'
                          : ''}
                      </span>
                    </div>
                  ))}
                </div>
              );
            })}
          </div>
        )}
        <div className={rowsClassName}>
          {page.map((row, i) => {
            prepareRow(row);
            return (
              <div
                className={rowClassName}
                onClick={() => handleRowClick(row)}
                key={i}
              >
                {row.cells.map((cell, i) => {
                  return (
                    <div className={cell.column.className} key={i}>
                      {cell.render('Cell')}
                    </div>
                  );
                })}
              </div>
            );
          })}
          {/* <div>
            {loading ? (
              // Use our custom loading state to show a loading indicator
              <div>Loading...</div>
            ) : (
              <div className="text-right text-sm text-primary">
                {page.length} / {controlledPageCount * pageSize}
              </div>
            )}
          </div> */}
        </div>

        <div className="flex justify-end items-center space-x-8 text-sm mt-8">
          <div className="flex items-center space-x-4">
            <div>Rows per page:</div>
            <select
              className="bg-dark-3 outline-none rounded-lg text-center px-2 py-1 cursor-pointer appearance-none"
              value={pageSize}
              disabled={disablePageSize}
              onChange={(e) => {
                handleChangePageSize(Number(e.target.value));
              }}
            >
              {[
                initialPageSize,
                2 * initialPageSize,
                3 * initialPageSize,
                4 * initialPageSize,
                5 * initialPageSize,
              ].map((pageSize) => (
                <option key={pageSize} value={pageSize}>
                  {pageSize}
                </option>
              ))}
            </select>
          </div>

          <span>
            Page{' '}
            <span>
              {pageIndex + 1} of {pageOptions.length}
            </span>{' '}
          </span>

          <div className="flex items-center space-x-4">
            {/* <button onClick={handleFirstPage} disabled={!canPreviousPage}>
              <ChevronDoubleLeftIcon className="w-5 h-5" />
            </button>{' '} */}
            <button
              onClick={handlePrevPage}
              disabled={!canPreviousPage}
              className={classNames(pageIndex === 0 && 'text-grey')}
            >
              <ChevronLeftIcon className="w-5 h-5" />
            </button>{' '}
            <button
              onClick={handleNextPage}
              disabled={!canNextPage}
              className={classNames(pageIndex === pageCount - 1 && 'text-grey')}
            >
              <ChevronRightIcon className="w-5 h-5" />
            </button>{' '}
            {/* <button onClick={handleLastPage} disabled={!canNextPage}>
              <ChevronDoubleRightIcon className="w-5 h-5" />
            </button>{' '} */}
          </div>
          {/* <span>
          | Go to page:{' '}
          <input
            type="number"
            defaultValue={pageIndex + 1}
            onChange={(e) => {
              const page = e.target.value ? Number(e.target.value) - 1 : 0;
              gotoPage(page);
            }}
            style={{ width: '100px' }}
          />
        </span>{' '} */}
        </div>
      </div>
      {/* 
        Pagination can be built however you'd like. 
        This is just a very basic UI implementation:
      */}
    </>
  );
}
