import { useMemo } from 'react';
import { RouterCurrencyInputPanel } from '../../../bridge/feature/RouterCurrencyInputPanel';
import { Button } from '../../../components-ui/Button';
import { TokenInputPanelV2 } from '../../../components-ui/XSTND/TokenInputPanelV2';
import { tryParseAmount } from '../../../functions';
import { ApprovalState, useApproveCallback } from '../../../hooks';
import { useVault } from '../../../hooks/vault/useVault';
import { DefinedStyles } from '../../../utils/DefinedStyles';

export function VaultDeposit({
  vaultAddress,
  collateral,
  balance,
  amount,
  onAmountChange,
}) {
  const { deposit, depositNative } = useVault(vaultAddress);
  const depositCurrencyAmount = tryParseAmount(amount, collateral);
  const [approvalState, approve] = useApproveCallback(
    depositCurrencyAmount,
    vaultAddress,
  );

  const onClick = async () => {
    if (approvalState == ApprovalState.APPROVED) {
      if (amount) {
        if (collateral.isNative) {
          await depositNative(depositCurrencyAmount.quotient.toString());
        } else if (collateral.isToken) {
          await deposit(depositCurrencyAmount.quotient.toString());
        }
      }
    } else if (approvalState == ApprovalState.NOT_APPROVED) {
      await approve();
    }
  };

  const depositable =
    balance &&
    depositCurrencyAmount &&
    (balance.greaterThan(depositCurrencyAmount) ||
      balance.equalTo(depositCurrencyAmount));

  const confirmButtonMessage = useMemo(() => {
    if (
      balance &&
      depositCurrencyAmount &&
      (balance.greaterThan(depositCurrencyAmount) ||
        balance.equalTo(depositCurrencyAmount))
    ) {
      if (
        approvalState == ApprovalState.NOT_APPROVED ||
        approvalState == ApprovalState.UNKNOWN
      ) {
        return 'Approve';
      } else if (approvalState == ApprovalState.PENDING) {
        return 'Approving';
      }
      return 'Deposit';
    } else if (!depositCurrencyAmount) {
      return 'Enter Deposit amount';
    } else {
      return 'Insufficient Balance';
    }
  }, [balance, depositCurrencyAmount]);

  return (
    <div className="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4 ">
      <div className="w-full rounded-20 sm:bg-opaque-secondary sm:px-4 py-1">
        <RouterCurrencyInputPanel
          onAmountChange={onAmountChange}
          currency={collateral}
          max={balance}
          amount={amount}
          hideChevron
        />
      </div>
      <Button
        className={DefinedStyles.fullButton}
        disabled={!depositable}
        onClick={onClick}
      >
        {confirmButtonMessage}
      </Button>
    </div>
  );
}
