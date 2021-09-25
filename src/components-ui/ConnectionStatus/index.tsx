import { useMemo } from 'react';
import { useWeb3React } from '@web3-react/core';
import { NetworkContextName } from '../../constants';
import WalletModal from '../../modals/WalletModal';
import {
  isTransactionRecent,
  useAllTransactions,
} from '../../state/transactions/hooks';
import useENSName from '../../hooks/useENSName';
import { newTransactionsFirst } from '../../functions/transactions';
import { InnerConnectionStatus } from './InnerConnectionStatus';

export type ConnectionStatusType = {
  className?: string;
};

export function ConnectionStatus({ className }: ConnectionStatusType) {
  const { active, account } = useWeb3React();
  const contextNetwork = useWeb3React(NetworkContextName);

  const allTransactions = useAllTransactions();

  const sortedRecentTransactions = useMemo(() => {
    const txs = Object.values(allTransactions);
    return txs.filter(isTransactionRecent).sort(newTransactionsFirst);
  }, [allTransactions]);

  const pending = sortedRecentTransactions
    .filter((tx) => !tx.receipt)
    .map((tx) => tx.hash);
  const confirmed = sortedRecentTransactions
    .filter((tx) => tx.receipt)
    .map((tx) => tx.hash);

  if (!contextNetwork.active && !active) {
    return null;
  }

  return (
    <>
      <InnerConnectionStatus className={className} />
      <WalletModal
        pendingTransactions={pending}
        confirmedTransactions={confirmed}
      />
    </>
  );
}
