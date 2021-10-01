import React, { FC, useCallback, useMemo } from 'react';
import {
  ChainId,
  CurrencyAmount,
  Ether,
} from '@digitalnative/standard-protocol-sdk-test';
import {
  XCircleIcon,
  MinusCircleIcon,
  CheckCircleIcon,
} from '@heroicons/react/outline';

// dispatch - archer
// import { useDispatch } from 'react-redux';
// import { AppDispatch } from '../../state';
// web3
import { useActiveWeb3React } from '../../hooks/useActiveWeb3React';
// transactions
// import { TransactionDetails } from '../../state/transactions/reducer';
// import { finalizeTransaction } from '../../state/transactions/actions';
import { useAllTransactions } from '../../state/transactions/hooks';
// explorer
import { getExplorerLink } from '../../functions/explorer';
// ui
import { ExternalLink } from '../ExternalLink';
import { RippleSpinner } from '../Spinner/RippleSpinner';

import { classNames } from '../../functions';

// constants
// import { ARCHER_RELAY_URI } from '../../constants';

// const calculateSecondsUntilDeadline = (tx: TransactionDetails): number => {
//   if (tx?.archer?.deadline && tx?.addedTime) {
//     const millisecondsUntilUntilDeadline =
//       tx.archer.deadline * 1000 - Date.now();
//     return millisecondsUntilUntilDeadline < 0
//       ? -1
//       : Math.ceil(millisecondsUntilUntilDeadline / 1000);
//   }
//   return -1;
// };

const Transaction: FC<{ hash: string }> = ({ hash }) => {
  const { chainId } = useActiveWeb3React();
  const allTransactions = useAllTransactions();
  //   const dispatch = useDispatch<AppDispatch>();

  const tx = allTransactions?.[hash];
  const summary = tx?.summary;
  const pending = !tx?.receipt;
  const success =
    !pending &&
    tx &&
    (tx.receipt?.status === 1 || typeof tx.receipt?.status === 'undefined');
  //   const archer = tx?.archer;
  //   const secondsUntilDeadline = useMemo(
  //     () => calculateSecondsUntilDeadline(tx),
  //     [tx],
  //   );
  //   const mined = tx?.receipt && tx.receipt.status !== 1337;
  const cancelled = tx?.receipt && tx.receipt.status === 1337;
  //   const expired = secondsUntilDeadline === -1;

  //   const cancelPending = useCallback(() => {
  //     const relayURI = ARCHER_RELAY_URI[chainId];
  //     if (!relayURI) return;

  //     const body = JSON.stringify({
  //       method: 'archer_cancelTx',
  //       tx: archer?.rawTransaction,
  //     });
  //     fetch(relayURI, {
  //       method: 'POST',
  //       body,
  //       headers: {
  //         Authorization: process.env.NEXT_PUBLIC_ARCHER_API_KEY ?? '',
  //         'Content-Type': 'application/json',
  //       },
  //     })
  //       .then(() => {
  //         dispatch(
  //           finalizeTransaction({
  //             chainId,
  //             hash,
  //             receipt: {
  //               blockHash: '',
  //               blockNumber: 0,
  //               contractAddress: '',
  //               from: '',
  //               status: 1337,
  //               to: '',
  //               transactionHash: '',
  //               transactionIndex: 0,
  //             },
  //           }),
  //         );
  //       })
  //       .catch((err) => console.error(err));
  //   }, [dispatch, chainId, archer, hash]);

  if (!chainId) return null;

  return (
    <div className="flex flex-col space-x-2 rounded py-1.5 w-full">
      <ExternalLink
        color={pending ? 'warn' : success ? 'success' : 'danger'}
        href={getExplorerLink(chainId, hash, 'transaction')}
        className="flex items-center text-sm space-x-2"
      >
        <div className="flex items-center hover:underline py-0.5 truncate">
          {summary ?? hash} ↗
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
      </ExternalLink>
      {/* {archer && (
        <div className="flex justify-between items-center text-decoration-none pb-1">
          {`#${archer.nonce} - Tip ${CurrencyAmount.fromRawAmount(
            Ether.onChain(ChainId.MAINNET),
            archer.ethTip,
          ).toSignificant(6)} ETH`}
          {pending ? (
            <>
              {secondsUntilDeadline >= 60 ? (
                <span className="text-high-emphesis">
                  &#128337; {`${Math.ceil(secondsUntilDeadline / 60)} mins`}{' '}
                </span>
              ) : (
                <span className="text-high-emphesis">
                  &#128337; {`<1 min`}{' '}
                </span>
              )}
              <div
                className="cursor-pointer flex items-center"
                onClick={cancelPending}
              >
                {`Cancel`}
              </div>
            </>
          ) : cancelled ? (
            <span className="text-red">{`Cancelled`}</span>
          ) : (
            !mined && expired && <span className="text-red">{`Expired`}</span>
          )}
        </div>
      )} */}
    </div>
  );
};

export default Transaction;
