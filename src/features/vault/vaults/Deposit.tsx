import { useMemo } from 'react';
import Skeleton from 'react-loading-skeleton';
import { RouterCurrencyInputPanel } from '../../../bridge/feature/RouterCurrencyInputPanel';
import { Button } from '../../../components-ui/Button';
import { formatNumber, tryParseAmount } from '../../../functions';
import { ApprovalState, useApproveCallback } from '../../../hooks';
import { useVault } from '../../../hooks/vault/useVault';
import { useNewVaultState } from '../../../state/vault/hooks';
import { DefinedStyles } from '../../../utils/DefinedStyles';

export function VaultDeposit({
  vaultAddress,
  collateral,
  balance,
  amount,
  onAmountChange,
  borrowed,
  mcr,
  collateralPriceUSD,
  currentCollateralized,
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

  const newCollateralized =
    currentCollateralized !== undefined
      ? parseFloat(currentCollateralized) +
        (amount !== '' ? parseFloat(amount) : 0)
      : undefined;

  const confirmButtonMessage = useMemo(() => {
    if (depositable) {
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
  }, [approvalState, depositable, depositCurrencyAmount]);

  const { newLiquidationPriceUSD, newCollateralRatio } = useNewVaultState(
    borrowed,
    newCollateralized,
    collateralPriceUSD,
    mcr,
  );

  return (
    <div className="space-y-4">
      <div className="flex items-end space-x-2">
        <div className="text-grey font-bold">Collateral After Deposit:</div>
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
          Liquidation Price After Deposit
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
          Collateral Ratio After Deposit
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
          disabled={!depositable}
          onClick={onClick}
        >
          {confirmButtonMessage}
        </Button>
      </div>
    </div>
  );
}
