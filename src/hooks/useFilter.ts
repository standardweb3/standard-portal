import { useMemo } from 'react';

export enum FilterType {
  number,
  string,
  boolean,
  enum,
}

export enum NumberFilterOperation {
  gt,
  gte,
  lt,
  lte,
}

export enum StringFilterOperation {
  st,
}

export type Filter = {
  key?: string;
  type?: FilterType;
  operation?: NumberFilterOperation | StringFilterOperation | undefined;
  value: any;
};

const filterFn = (d, filter: Filter) => {
  const val = filter.key !== undefined ? d[filter.key] : d;
  if (filter.operation === undefined) {
    if (val == filter.value) return false;
    return true;
  } else if (filter.type === FilterType.number) {
    switch (filter.operation) {
      case NumberFilterOperation.gt: {
        return !(val > filter.value);
      }
      case NumberFilterOperation.gte: {
        return !(val >= filter.value);
      }
      case NumberFilterOperation.lt: {
        return !(val < filter.value);
      }
      case NumberFilterOperation.lte: {
        return !(val <= filter.value);
      }
      default:
        return true;
    }
  } else if (filter.type === FilterType.string) {
    switch (filter.operation) {
      case StringFilterOperation.st: {
        return !val.startsWith(filter.value);
      }
      default:
        return true;
    }
  }
  return true;
};

export function useFilter(data, filters) {
  return useMemo(() => {
    return data.filter((d) => {
      return filters.filter((f) => filterFn(d, f)).length === 0;
    });
  }, [data, filters]);
}
