import { TransactionDetails } from '../state/transactions/reducer';

// we want the latest one to come first, so return negative if a is after b
export function newTransactionsFirst(
  a: TransactionDetails,
  b: TransactionDetails,
) {
  return b.addedTime - a.addedTime;
}
