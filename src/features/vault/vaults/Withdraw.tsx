import Skeleton from 'react-loading-skeleton';
import { useMemo } from 'react';
import { RouterCurrencyInputPanel } from '../../../bridge/feature/RouterCurrencyInputPanel';
import { Button } from '../../../components-ui/Button';
import { formatNumber, tryParseAmount } from '../../../functions';
import {
  ApprovalState,
  useActiveWeb3React,
  useApproveCallback,
} from '../../../hooks';
import { useVault } from '../../../hooks/vault/useVault';
import { useNewVaultState } from '../../../state/vault/hooks';
import { DefinedStyles } from '../../../utils/DefinedStyles';

export function VaultWithdraw({
  onAmountChange,
  vaultAddress,
  collateral,
  balance,
  amount,
  borrowed,
  mcr,
  collateralPriceUSD,
  currentCollateralized,
  minCollateralAmount,
}) {
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
  const newCollateralized =
    currentCollateralized !== undefined
      ? parseFloat(currentCollateralized) -
        (amount !== '' ? parseFloat(amount) : 0)
      : undefined;

  const { newLiquidationPriceUSD, newCollateralRatio } = useNewVaultState(
    borrowed,
    newCollateralized,
    collateralPriceUSD,
    mcr,
  );

  const withdrawable =
    balance &&
    withdrawCurrencyAmount &&
    (balance.greaterThan(withdrawCurrencyAmount) ||
      balance.equalTo(withdrawCurrencyAmount));

  const confirmButtonMessage = useMemo(() => {
    if (withdrawable) {
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
  }, [approvalState, withdrawCurrencyAmount, withdrawable]);
  return (
    <div className="space-y-4">
      <div className="flex items-end space-x-2">
        <div className="text-grey font-bold">Min Collateral Amount</div>
        <div className="font-bold text-2xl">
          {minCollateralAmount !== undefined ? (
            `${formatNumber(minCollateralAmount)} ${collateral.symbol}`
          ) : (
            <Skeleton />
          )}
        </div>
      </div>
      <div className="flex items-end space-x-2">
        <div className="text-grey font-bold">Collateral After Withdrawal:</div>
        <div className="font-bold text-2xl">
          {newCollateralized !== undefined ? (
            `${formatNumber(newCollateralized)} ${collateral.symbol}`
          ) : (
            <Skeleton />
          )}
        </div>
      </div>
      <div className="flex items-end space-x-2">
        <div className="text-grey font-bold">
          Liquidation Price After Withdrawal
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
          Collateral Ratio After Withdrawal
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
            currency={collateral}
            max={balance}
            amount={amount}
            hideChevron
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
    </div>
  );
}
