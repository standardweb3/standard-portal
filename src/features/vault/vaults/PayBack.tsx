import { useMemo } from 'react';
import Skeleton from 'react-loading-skeleton';
import { RouterCurrencyInputPanel } from '../../../bridge/feature/RouterCurrencyInputPanel';
import { Button } from '../../../components-ui/Button';
import { formatNumber, tryParseAmount } from '../../../functions';
import { ApprovalState, useApproveCallback } from '../../../hooks';
import { useVault } from '../../../hooks/vault/useVault';
import { useNewVaultState } from '../../../state/vault/hooks';
import { DefinedStyles } from '../../../utils/DefinedStyles';

export function VaultPayBack({
  vaultAddress,
  mtr,
  balance,
  amount,
  onAmountChange,
  borrowed,
  currentCollateralized,
  collateralPriceUSD,
  mcr,
}) {
  const { payBack } = useVault(vaultAddress);
  const paybackCurrencyAmount = tryParseAmount(amount, mtr);
  const borrowedCurrencyAmount = tryParseAmount(borrowed, mtr);
  const [approvalState, approve] = useApproveCallback(
    paybackCurrencyAmount,
    vaultAddress,
  );

  const onClick = async () => {
    if (approvalState == ApprovalState.APPROVED) {
      if (amount) {
        await payBack(paybackCurrencyAmount.quotient.toString());
      }
    } else if (approvalState == ApprovalState.NOT_APPROVED) {
      await approve();
    }
  };

  const payable =
    balance &&
    paybackCurrencyAmount &&
    (balance.greaterThan(paybackCurrencyAmount) ||
      balance.equalTo(paybackCurrencyAmount)) &&
    (borrowedCurrencyAmount.greaterThan(paybackCurrencyAmount) ||
      borrowedCurrencyAmount.equalTo(paybackCurrencyAmount));

  const confirmButtonMessage = useMemo(() => {
    if (
      balance &&
      paybackCurrencyAmount &&
      (balance.greaterThan(paybackCurrencyAmount) ||
        balance.equalTo(paybackCurrencyAmount))
    ) {
      if (
        approvalState == ApprovalState.NOT_APPROVED ||
        approvalState == ApprovalState.UNKNOWN
      ) {
        return 'Approve';
      } else if (approvalState == ApprovalState.PENDING) {
        return 'Approving';
      }
      return 'Payback';
    } else if (!paybackCurrencyAmount) {
      return 'Enter Payback amount';
    } else if (
      borrowedCurrencyAmount.greaterThan(paybackCurrencyAmount) ||
      borrowedCurrencyAmount.equalTo(paybackCurrencyAmount)
    ) {
      return 'Payback amount is greater than borrowed amount';
    } else {
      return 'Insufficient Mtr Balance';
    }
  }, [approvalState, balance, paybackCurrencyAmount]);

  const remainingBalance =
    borrowed !== undefined
      ? parseFloat(borrowed) - (amount !== '' ? parseFloat(amount) : 0)
      : undefined;

  const { newLiquidationPriceUSD, newCollateralRatio } = useNewVaultState(
    remainingBalance,
    currentCollateralized,
    collateralPriceUSD,
    mcr,
  );

  return (
    <div className="space-y-4">
      <div className="flex items-end space-x-2">
        <div className="text-grey font-bold">Debt After Payback:</div>
        <div className="font-bold text-2xl">
          {remainingBalance !== undefined ? (
            `${formatNumber(remainingBalance)} MTR`
          ) : (
            <Skeleton />
          )}
        </div>
      </div>
      <div className="flex items-end space-x-2">
        <div className="text-grey font-bold">
          Liquidation Price After Payback
        </div>
        <div className="font-bold text-2xl">
          {newLiquidationPriceUSD !== undefined ? (
            `$${formatNumber(newLiquidationPriceUSD)}`
          ) : (
            <Skeleton />
          )}
        </div>
      </div>
      <div className="flex items-end space-x-2">
        <div className="text-grey font-bold">
          Collateral Ratio After Payback
        </div>
        <div className="font-bold text-2xl">
          {newCollateralRatio !== undefined ? (
            `${formatNumber(newCollateralRatio)}%`
          ) : (
            <Skeleton />
          )}
        </div>
      </div>
      <div className="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4 ">
        <div className="w-full rounded-20 sm:bg-opaque-secondary sm:px-4 py-1">
          <RouterCurrencyInputPanel
            onAmountChange={onAmountChange}
            currency={mtr}
            max={borrowedCurrencyAmount}
            balance={balance}
            amount={amount}
            hideChevron
          />
        </div>
        <Button
          className={DefinedStyles.fullButton}
          onClick={onClick}
          disabled={!payable}
        >
          {confirmButtonMessage}
        </Button>
      </div>
    </div>
  );
}
