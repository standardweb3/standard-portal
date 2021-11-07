import { useEffect, useMemo, useState } from 'react';

export function usePagination(start = 0, initialPageSize = 10, size = 0) {
  const [pageSize, setPageSize] = useState(initialPageSize);
  const [page, setPage] = useState(start);
  const lastPage = useMemo(() => Math.floor(size / pageSize), [pageSize, size]);

  const toNextPage = () => {
    page < lastPage && setPage(page + 1);
  };

  const toPrevPage = () => {
    page > 0 && setPage(page - 1);
  };

  const toPage = (newPage) => {
    newPage >= 0 && newPage <= lastPage && setPage(newPage);
  };

  const toLastPage = () => {
    setPage(lastPage);
  };

  const toFirstPage = () => setPage(0);

  const changepageSize = (pageSize) => {
    setPageSize(pageSize);
  };

  return {
    currentPage: page,
    toNextPage,
    toPrevPage,
    toFirstPage,
    toLastPage,
    toPage,
    changepageSize,
    lastPage,
    pageSize,
  };
}
