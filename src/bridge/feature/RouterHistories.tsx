// import { EyeIcon } from '@heroicons/react/outline';
import {
  CheckCircleIcon,
  MinusCircleIcon,
  XCircleIcon,
} from '@heroicons/react/outline';
import { useMemo, useState } from 'react';
import useSWR, { SWRResponse } from 'swr';
import { ExternalLink } from '../../components-ui/ExternalLink';
import { RippleSpinner } from '../../components-ui/Spinner/RippleSpinner';
// import Copier from '../../components-ui/Copier';
// import { ExternalLink } from '../../components-ui/ExternalLink';
import { classNames } from '../../functions';
import { getExplorerLink } from '../../functions/explorer';
// import { getExplorerLink } from '../../functions/explorer';
import { newBridgeTransactionsFirst } from '../../functions/transactions';
import { useActiveWeb3React } from '../../hooks';
import {
  isTransactionOneWeek,
  useAllTransactions,
} from '../../state/bridgeTransactions/hooks';
// import { useActiveWeb3React } from '../../hooks';

function RouterTransaction({ tx }) {
  const { chainId } = useActiveWeb3React();
  const [status, setStatus] = useState(null);
  const { hash, summary, receipt } = tx;

  const pending = !receipt;
  const success =
    !pending &&
    (receipt?.status === 1 || typeof receipt?.status === 'undefined');
  //   const archer = tx?.archer;
  //   const secondsUntilDeadline = useMemo(
  //     () => calculateSecondsUntilDeadline(tx),
  //     [tx],
  //   );
  //   const mined = tx?.receipt && tx.receipt.status !== 1337;
  const cancelled = receipt && receipt.status === 1337;

  const url = `https://bridgeapi.anyswap.exchange/v2/history/details?params=${hash}`;

  const { data: anyswapInfo, error }: SWRResponse<any, Error> = useSWR(
    url,
    (url) =>
      fetch(url)
        .then((result) => result.json())
        .then((data) => {
          if (data && data.msg == 'Success') {
            let resultStatus = data?.info?.status || 8;
            try {
              setStatus(resultStatus);
            } catch (err) {}
          }
        }),
  );

  return (
    <ExternalLink
      color={
        status === null
          ? pending
            ? 'warn'
            : success
            ? 'success'
            : 'danger'
          : status == 0
          ? 'warn'
          : status == 8
          ? 'warn'
          : status == 9
          ? 'warn'
          : status == 10
          ? 'success'
          : 'warn'
      }
      href={getExplorerLink(chainId, hash, 'transaction')}
    >
      {status === null ? (
        <div className="flex items-center text-sm space-x-2">
          <div className="flex items-center hover:underline py-0.5 truncate">
            Submit - {summary ?? hash} ↗
          </div>
          <div
            className={classNames(
              pending
                ? 'text-warn'
                : success
                ? 'text-success'
                : cancelled
                ? 'text-danger'
                : 'text-danger',
            )}
          >
            {pending ? (
              <RippleSpinner size={16} />
            ) : success ? (
              <CheckCircleIcon className="w-4 h-4" />
            ) : false ? (
              <MinusCircleIcon width={16} height={16} />
            ) : (
              <XCircleIcon width={16} height={16} />
            )}
          </div>
        </div>
      ) : (
        <div className="flex items-center text-sm space-x-2">
          <div className="flex items-center hover:underline py-0.5 truncate">
            Execute - {summary ?? hash} ↗
          </div>
          {status == 0 ? (
            <div className="flex items-center space-x-2">
              <RippleSpinner size={16} />
              <div>(Pending)</div>
            </div>
          ) : status == 8 ? (
            <div className="flex items-center space-x-2">
              <RippleSpinner size={16} />
              <div>(Processing)</div>
            </div>
          ) : status == 9 ? (
            <div className="flex items-center space-x-2">
              <RippleSpinner size={16} />
              <div>(Minting)</div>
            </div>
          ) : status == 10 ? (
            <CheckCircleIcon className="w-4 h-4" />
          ) : (
            <div className="flex items-center space-x-1">
              <div>Pending</div>
              <RippleSpinner size={16} />
            </div>
          )}
        </div>
      )}
    </ExternalLink>
  );
}

export function RouterHistories() {
  const allTransactions = useAllTransactions();

  const sortedRecentTransactions = useMemo(() => {
    const txs = Object.values(allTransactions);
    return txs.filter(isTransactionOneWeek).sort(newBridgeTransactionsFirst);
  }, [allTransactions]);

  const pending = sortedRecentTransactions
    .filter((tx) => !tx.receipt)
    .map((tx) => tx.hash);
  const confirmed = sortedRecentTransactions
    .filter((tx) => tx.receipt)
    .map((tx) => tx.hash);

  function renderTransactions(transactions: string[]) {
    return (
      <div className="flex flex-col flex-nowrap space-y-2">
        {transactions.map((hash, i) => {
          return <RouterTransaction key={hash} tx={allTransactions[hash]} />;
        })}
      </div>
    );
  }

  return (
    <div className="bg-opaque rounded-20 py-2 px-3 max-h-[50vh] overflow-y-auto">
      {sortedRecentTransactions?.length === 0 && (
        <div className="text-grey text-sm">
          There are no recent transactions
        </div>
      )}
      {renderTransactions(pending)}
      {renderTransactions(confirmed)}
    </div>
  );
}
