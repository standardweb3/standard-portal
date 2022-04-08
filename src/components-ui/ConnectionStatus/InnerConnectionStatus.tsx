import { useWeb3React } from '@web3-react/core';
import { useMemo } from 'react';
// import { BridgeContextName } from '../../constants';
import { classNames, shortenAddress } from '../../functions';
import { newTransactionsFirst } from '../../functions/transactions';
import useENSName from '../../hooks/useENSName';
import { useWalletModalToggle } from '../../state/application/hooks';
import {
  isTransactionRecent,
  useAllTransactions,
} from '../../state/transactions/hooks';
import { RippleSpinner } from '../Spinner/RippleSpinner';
import { WalletConnector } from '../WalletConnector';
import { StatusIcon } from './StatusIcon';

export type InnerConnectionStatusType = {
  className?: string;
};

export function InnerConnectionStatus({
  className,
}: InnerConnectionStatusType) {
  const { account, connector } = useWeb3React();

  const { ENSName } = useENSName(account ?? undefined);

  const allTransactions = useAllTransactions();

  const sortedRecentTransactions = useMemo(() => {
    const txs = Object.values(allTransactions);
    return txs.filter(isTransactionRecent).sort(newTransactionsFirst);
  }, [allTransactions]);

  const pending = sortedRecentTransactions
    .filter((tx) => {
      if (tx.receipt) {
        return false;
      } else if (tx.archer && tx.archer.deadline * 1000 - Date.now() < 0) {
        return false;
      } else {
        return true;
      }
    })
    .map((tx) => tx.hash);

  const hasPendingTransactions = !!pending.length;

  const toggleWalletModal = useWalletModalToggle();

  // if (bridgeAccount && (route == '/bridgev2' || route == '/bridgev2/history')) {
  //   return (
  //     <div
  //       id="connection-status-connected"
  //       className="
  //       flex items-center
  //       px-3 py-2
  //       text-sm rounded-xl
  //       bg-primary bg-opacity-10
  //       border border-primary
  //       text-text"
  //     >
  //       <div className="mr-2">{shortenAddress(bridgeAccount)}</div>
  //     </div>
  //   );
  // } else
  if (account) {
    return (
      <div
        id="connection-status-connected"
        className={classNames(
          `
        flex items-center 
        px-3 py-2 
        text-sm rounded-xl 
        bg-primary bg-opacity-10
        border border-primary
        text-text 
        cursor-pointer
        `,
          className,
        )}
        onClick={toggleWalletModal}
      >
        {hasPendingTransactions ? (
          <div className="flex items-center justify-between w-full text-warn">
            <div className="pr-2">{pending?.length} Pending</div>
            <RippleSpinner size={16} />
          </div>
        ) : (
          <>
            {connector && (
              <div className="flex items-center mr-3">
                <StatusIcon connector={connector} />
              </div>
            )}
            <div className="mr-2">{ENSName || shortenAddress(account)}</div>
          </>
        )}
      </div>
    );
  } else {
    return <WalletConnector />;
  }
}
