import { VaultCondition } from '../../pages/vaults';

export function calculateFee(
  currentBlockTimestamp,
  createdAt,
  sfr,
  borrowedValue,
) {
  // const borrowedValueBN = BigNumber.from(String(borrowedValue));
  // const sfrBN = BigNumber.from(String(sfr));
  // const sfrTimeVBN = borrowedValueBN.times;
  const sfrTimesV = Math.floor(borrowedValue * sfr);
  const duration = Math.floor(
    Math.floor(
      Math.floor(Math.floor((currentBlockTimestamp - createdAt) / 60) / 60) /
        24,
    ) / 30,
  );
  // (currentBlockTimestamp - createdAt) / 60 / 60 / 24 / 30;

  // round down
  return Math.floor(sfrTimesV / 100) * duration;
}

export function getConditionColor(condition) {
  return condition === VaultCondition.DANGER
    ? 'text-danger'
    : condition === VaultCondition.WARNING
    ? 'text-warn'
    : condition === VaultCondition.SAFE
    ? 'text-safe'
    : 'text-grey';
}
