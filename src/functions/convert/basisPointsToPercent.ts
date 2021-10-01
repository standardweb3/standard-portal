import { JSBI, Percent } from '@digitalnative/standard-protocol-sdk-test';

// converts a basis points value to a sdk percent
export function basisPointsToPercent(num: number): Percent {
  return new Percent(JSBI.BigInt(num), JSBI.BigInt(10000));
}
