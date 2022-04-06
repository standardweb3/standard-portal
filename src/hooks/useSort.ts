import { useMemo } from 'react';

export enum SortDirection {
  asc,
  desc,
}

export type Sort = {
  key?: string;
  dir: SortDirection;
};

const sortFn = (sort: Sort) => {
  if (sort.dir == SortDirection.asc) {
    if (sort.key === undefined) {
      return (a, b) => a - b;
    }
    return (a, b) => a[sort.key] - b[sort.key];
  }

  if (sort.key === undefined) {
    return (a, b) => b - a;
  }
  return (a, b) => b[sort.key] - a[sort.key];
};

export function useSort(data, sort) {
  return useMemo(() => {
    if (sort === undefined) return data;
    return data.sort(sortFn(sort));
  }, [data, sort]);
}

// export function useSortOptions(keys) {
//   return keys.reduce((acc, key) => {
//     acc[key] = {
//       { key, dir: SortDirection.asc },
//       { key, dir: SortDirection.desc },
//     };
//   }, {});
// }
