import React, { useCallback, useEffect } from 'react';
import { useTable, usePagination } from 'react-table';

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
  fetchData?: ({
    pageIndex,
    pageSize,
  }: {
    pageIndex: number;
    pageSize: number;
  }) => void;
  controlled?: boolean;
};
// Let's add a fetchData method to our Table component that will be used to fetch
// new data when pagination state changes
// We can also add a loading state to let our table know it's loading new data
export function Table({
  columns,
  data,
  initialPage = 0,
  rowsPerPage = 10,
  pageCount: controlledPageCount = data.length,
  loading,
  onPrevPage,
  onNextPage,
  onFirstPage,
  onLastPage,
  onToPage,
  fetchData,
  controlled = false,
}: TableProps) {
  const {
    getTableProps,
    getTableBodyProps,
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
    setPageSize(rowsPerPage);
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

  // Render the UI for your table
  return (
    <>
      <pre>
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
      </pre>
      <table {...getTableProps()}>
        <thead>
          {headerGroups.map((headerGroup, i) => (
            <tr {...headerGroup.getHeaderGroupProps()} key={i}>
              {headerGroup.headers.map((column) => (
                <th {...column.getHeaderProps()}>
                  {column.render('Header')}
                  <span>
                    {column.isSorted
                      ? column.isSortedDesc
                        ? ' 🔽'
                        : ' 🔼'
                      : ''}
                  </span>
                </th>
              ))}
            </tr>
          ))}
        </thead>
        <tbody {...getTableBodyProps()}>
          {page.map((row, i) => {
            prepareRow(row);
            return (
              <div {...row.getRowProps()} className="" key={i}>
                {row.cells.map((cell) => {
                  return (
                    <td {...cell.getCellProps()}>{cell.render('Cell')}</td>
                  );
                })}
              </div>
            );
          })}
          <tr>
            {loading ? (
              // Use our custom loading state to show a loading indicator
              <td colSpan={10000}>Loading...</td>
            ) : null}
          </tr>
        </tbody>
      </table>
      {/* 
        Pagination can be built however you'd like. 
        This is just a very basic UI implementation:
      */}
      <div className="pagination">
        <button onClick={handleFirstPage} disabled={!canPreviousPage}>
          {'<<'}
        </button>{' '}
        <button onClick={handlePrevPage} disabled={!canPreviousPage}>
          {'<'}
        </button>{' '}
        <button onClick={handleNextPage} disabled={!canNextPage}>
          {'>'}
        </button>{' '}
        <button onClick={handleLastPage} disabled={!canNextPage}>
          {'>>'}
        </button>{' '}
        <span>
          Page{' '}
          <strong>
            {pageIndex + 1} of {pageOptions.length}
          </strong>{' '}
        </span>
        <span>
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
        </span>{' '}
        <select
          value={pageSize}
          onChange={(e) => {
            setPageSize(Number(e.target.value));
          }}
        >
          {[10, 20, 30, 40, 50].map((pageSize) => (
            <option key={pageSize} value={pageSize}>
              Show {pageSize}
            </option>
          ))}
        </select>
      </div>
    </>
  );
}
