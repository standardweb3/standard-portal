import { useEffect, useState } from 'react';
import { useExplorerVaults } from '../../services/graph/hooks/vaultExplorer';
import { usePagination } from '../usePagination';

export function useExplorerVaultsPagination(initPageSize) {
  const lastVault = useExplorerVaults({
    first: 1,
  })?.[0];

  const [vaultCount, setVaultCount] = useState(0);
  useEffect(() => {
    if (vaultCount === 0 && lastVault) {
      setVaultCount(Number(lastVault?.id));
    }
  }, [lastVault]);

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
  } = usePagination(0, initPageSize, vaultCount);

  return {
    currentPage,
    toNextPage,
    toPrevPage,
    toFirstPage,
    toLastPage,
    toPage,
    lastPage,
    pageSize,
    lastVaultId: lastVault?.id ?? 0,
  };
}
