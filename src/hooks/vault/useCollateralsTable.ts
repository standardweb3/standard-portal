import { useMemo, useState } from 'react';

enum SortCollateral {
  StabilityFee = 'sfr',
  CollateralRatio = 'mcr',
  Name = 'name',
}

export function useCollateralsTable() {
  const [sortBy, setSortBy] = useState(SortCollateral.Name);
  const [sortASC, setSortASC] = useState(true);
  const changeSortDirection = () => {
    setSortASC(!sortASC);
  };

  const sortBySfr = () => setSortBy(SortCollateral.StabilityFee);
  const sortByMcr = () => setSortBy(SortCollateral.CollateralRatio);
  const sortByName = () => setSortBy(SortCollateral.Name);

  const sortFns = useMemo(() => {
    return {
      [SortCollateral.StabilityFee]: (a, b) => {
        return sortASC ? a.sfr - b.sfr : b.sfr - a.sfr;
      },
      [SortCollateral.CollateralRatio]: (a, b) => {
        return sortASC ? a.mcr - b.mcr : b.mcr - a.mcr;
      },
      [SortCollateral.Name]: (a, b) => {
        return sortASC ? a.name - b.name : b.name - a.name;
      },
    };
  }, [sortASC]);

  return {
    sortBy,
    sortFns,
    sortBySfr,
    sortByMcr,
    sortByName,
    changeSortDirection,
  };
}
