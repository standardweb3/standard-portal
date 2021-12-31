import { getAddress } from 'ethers/lib/utils';
import { useCallback, useMemo } from 'react';
import { Button } from '../../../components-ui/Button';
import { TokenInputPanelV2 } from '../../../components-ui/XSTND/TokenInputPanelV2';
import { tryParseAmount } from '../../../functions';
import {
  ApprovalState,
  useActiveWeb3React,
  useApproveCallback,
} from '../../../hooks';
import { useVault } from '../../../hooks/vault/useVault';
import { DefinedStyles } from '../../../utils/DefinedStyles';

export function VaultWithdraw({
  onAmountChange,
  vaultAddress,
  collateral,
  balance,
  amount,
}) {
  const { account } = useActiveWeb3React();
  const { withdraw, withdrawNative } = useVault(vaultAddress);

  const withdrawCurrencyAmount = tryParseAmount(amount, collateral);
  const [approvalState, approve] = useApproveCallback(
    withdrawCurrencyAmount,
    vaultAddress,
  );

  const onClick = async () => {
    if (approvalState == ApprovalState.APPROVED) {
      if (amount) {
        if (collateral.isNative) {
          await withdrawNative(withdrawCurrencyAmount.quotient.toString());
        } else if (collateral.isToken) {
          await withdraw(withdrawCurrencyAmount.quotient.toString());
        }
      }
    } else if (approvalState == ApprovalState.NOT_APPROVED) {
      await approve();
    }
  };

  const withdrawable =
    balance &&
    withdrawCurrencyAmount &&
    (balance.greaterThan(withdrawCurrencyAmount) ||
      balance.equalTo(withdrawCurrencyAmount));

  const confirmButtonMessage = useMemo(() => {
    if (
      balance &&
      withdrawCurrencyAmount &&
      (balance.greaterThan(withdrawCurrencyAmount) ||
        balance.equalTo(withdrawCurrencyAmount))
    ) {
      if (
        approvalState == ApprovalState.NOT_APPROVED ||
        approvalState == ApprovalState.UNKNOWN
      ) {
        return 'Approve';
      } else if (approvalState == ApprovalState.PENDING) {
        return 'Approving';
      }
      return 'Withdraw';
    } else if (!withdrawCurrencyAmount) {
      return 'Enter Withdraw amount';
    } else {
      return 'Insufficient Collateral Balance';
    }
  }, [balance, withdrawCurrencyAmount]);

  return (
    <div className={DefinedStyles.vaultPanel}>
      Withdraw
      <div>
        <TokenInputPanelV2
          onAmountChange={onAmountChange}
          token={collateral}
          max={balance}
          balance={balance}
          amount={amount}
        />
      </div>
      <Button
        className={DefinedStyles.fullButton}
        onClick={onClick}
        disabled={!withdrawable}
      >
        {confirmButtonMessage}
      </Button>
    </div>
  );
}
