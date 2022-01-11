import { useMemo } from 'react';
import { RouterCurrencyInputPanel } from '../../../bridge/feature/RouterCurrencyInputPanel';
import { Button } from '../../../components-ui/Button';
import { TokenInputPanelV2 } from '../../../components-ui/XSTND/TokenInputPanelV2';
import { formatNumber, tryParseAmount } from '../../../functions';
import { ApprovalState, useApproveCallback } from '../../../hooks';
import { useVault } from '../../../hooks/vault/useVault';
import { DefinedStyles } from '../../../utils/DefinedStyles';

export function VaultPayBack({
  vaultAddress,
  mtr,
  balance,
  amount,
  onAmountChange,
  borrowed,
}) {
  const { payBack } = useVault(vaultAddress);
  const paybackCurrencyAmount = tryParseAmount(amount, mtr);
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
      balance.equalTo(paybackCurrencyAmount));

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
      return 'Pay Back';
    } else if (!paybackCurrencyAmount) {
      return 'Enter Pay Back amount';
    } else {
      return 'Insufficient Mtr Balance';
    }
  }, [balance, paybackCurrencyAmount]);

  const remainingBalance =
    borrowed && parseFloat(borrowed) - (amount !== '' ? parseFloat(amount) : 0);

  return (
    <div className="space-y-4">
      <div className="flex items-end space-x-2">
        <div className="text-grey font-bold">Debt After Payback:</div>
        <div className="font-bold text-2xl">
          {formatNumber(remainingBalance)}{' '}
          <span className="text-base font-normal">MTR</span>
        </div>
      </div>
      <div className="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4 ">
        <div className="w-full rounded-20 sm:bg-opaque-secondary sm:px-4 py-1">
          <RouterCurrencyInputPanel
            onAmountChange={onAmountChange}
            currency={mtr}
            max={balance}
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
