import { useState } from 'react';

export function usePagination(start = 0, pageSize = 10, last = 0) {
  const [page, setPage] = useState(start);

  const nextPage = () => page < last && setPage(page + 1);

  return { current: page, next: nextPage, last };
}
