import { VaultCondition } from '../../pages/vaults';

export function calculateFee(
  currentBlockTimestamp,
  createdAt,
  lastPaidBack,
  sfr,
  initSfr,
  expiary,
  borrowedValue,
) {
  const vaultLife = currentBlockTimestamp - createdAt;

  const expired = vaultLife > expiary;

  const sfrForCalculation = expired ? sfr / 100 : initSfr / 100;

  const duration = (currentBlockTimestamp - lastPaidBack) / 2592000
  const durationV = (duration + 3600/1e18) * borrowedValue
  const fee = durationV * sfrForCalculation

  return fee
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
