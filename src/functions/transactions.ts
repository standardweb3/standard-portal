import { TransactionDetails } from '../state/transactions/reducer';
import { TransactionDetails as BridgeTransactionDetails } from '../state/bridgeTransactions/reducer';

// we want the latest one to come first, so return negative if a is after b
export function newTransactionsFirst(
  a: TransactionDetails,
  b: TransactionDetails,
) {
  return b.addedTime - a.addedTime;
}

// we want the latest one to come first, so return negative if a is after b
export function newBridgeTransactionsFirst(
  a: BridgeTransactionDetails,
  b: BridgeTransactionDetails,
) {
  return b.addedTime - a.addedTime;
}
