import { useMemo } from 'react';
import { Button } from '../../../components-ui/Button';
import { TokenInputPanelV2 } from '../../../components-ui/XSTND/TokenInputPanelV2';
import { tryParseAmount } from '../../../functions';
import { ApprovalState, useApproveCallback } from '../../../hooks';
import { useVault } from '../../../hooks/vault/useVault';
import { DefinedStyles } from '../../../utils/DefinedStyles';

export function VaultPayBack({
  vaultAddress,
  mtr,
  balance,
  amount,
  onAmountChange,
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

  return (
    <div className={DefinedStyles.vaultPanel}>
      Payback
      <div>
        <TokenInputPanelV2
          onAmountChange={onAmountChange}
          token={mtr}
          max={balance}
          balance={balance}
          amount={amount}
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
  );
}
