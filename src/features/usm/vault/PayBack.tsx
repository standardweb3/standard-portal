import { useMemo } from 'react';
import Skeleton from 'react-loading-skeleton';
import { RouterCurrencyInputPanel } from '../../../bridge/feature/RouterCurrencyInputPanel';
import { Button } from '../../../components-ui/Button';
import { RippleSpinner } from '../../../components-ui/Spinner/RippleSpinner';
import { formatNumber, tryParseAmount } from '../../../functions';
import { ApprovalState, useApproveCallback } from '../../../hooks';
import { useVault } from '../../../hooks/vault/useVault';
import { useTransactionAdder } from '../../../state/transactions/hooks';
import { useNewVaultState } from '../../../state/vault/hooks';
import { DefinedStyles } from '../../../utils/DefinedStyles';

export function VaultPayBack({
  vaultAddress,
  usm,
  balance,
  amount,
  onAmountChange,
  borrowed,
  currentCollateralized,
  collateralPrice,
  mcr,
  debt,
}) {
  const addTransaction = useTransactionAdder();
  const { payBack } = useVault(vaultAddress);
  const paybackCurrencyAmount = tryParseAmount(amount, usm);
  const debtCurrencyAmount = tryParseAmount(
    debt !== undefined ? String(debt) : undefined,
    usm,
  );

  // const borrowedCurrencyAmount = tryParseAmount(borrowed, usm);
  const [approvalState, approve] = useApproveCallback(
    paybackCurrencyAmount,
    vaultAddress,
  );

  const onClick = async () => {
    if (approvalState == ApprovalState.APPROVED) {
      if (amount) {
        const tx = await payBack(paybackCurrencyAmount.quotient.toString());
        tx &&
          addTransaction(tx, {
            summary: `Payback ${formatNumber(
              paybackCurrencyAmount.toExact(),
            )} USM to vault ${vaultAddress}`,
          });
        tx && onAmountChange('');
      }
    } else if (approvalState == ApprovalState.NOT_APPROVED) {
      await approve();
    }
  };

  const payable =
    balance &&
    paybackCurrencyAmount &&
    debtCurrencyAmount &&
    (balance.greaterThan(paybackCurrencyAmount) ||
      balance.equalTo(paybackCurrencyAmount)) &&
    (debtCurrencyAmount.greaterThan(paybackCurrencyAmount) ||
      debtCurrencyAmount.equalTo(paybackCurrencyAmount));

  const overflow =
    debtCurrencyAmount &&
    paybackCurrencyAmount &&
    debtCurrencyAmount.lessThan(paybackCurrencyAmount);

  const confirmButtonMessage = useMemo(() => {
    if (payable) {
      if (
        approvalState == ApprovalState.NOT_APPROVED ||
        approvalState == ApprovalState.UNKNOWN
      ) {
        return 'Approve';
      } else if (approvalState == ApprovalState.PENDING) {
        return (
          <div className="flex items-center justify-center space-x-3">
            <div>Approving</div>
            <RippleSpinner size={16} />
          </div>
        );
      }
      return 'Payback';
    } else if (!paybackCurrencyAmount) {
      return 'Enter Payback amount';
    } else if (debtCurrencyAmount.lessThan(paybackCurrencyAmount)) {
      return 'Payback amount is greater than borrowed amount';
    } else {
      return 'Insufficient USM Balance';
    }
  }, [approvalState, balance, paybackCurrencyAmount, debtCurrencyAmount]);

  const remainingBalance =
    debt !== undefined
      ? debt - (amount !== '' ? parseFloat(amount) : 0)
      : undefined;

  const { newLiquidationPriceUSD, newCollateralRatio } = useNewVaultState(
    remainingBalance,
    currentCollateralized,
    collateralPrice,
    mcr,
  );

  const maxBalance =
    balance && debtCurrencyAmount && balance.greaterThan(debtCurrencyAmount)
      ? debtCurrencyAmount
      : balance;

  return (
    <div className="px-0 md:px-8 space-y-8">
      <div className="space-y-4">
        <div className="text-grey font-bold text-lg">
          Enter amount to payback:
        </div>
        <div className="w-full rounded-20 sm:bg-opaque-secondary sm:px-4 py-1">
          <RouterCurrencyInputPanel
            onAmountChange={onAmountChange}
            currency={usm}
            max={maxBalance}
            balance={balance}
            amount={amount}
            hideChevron
          />
        </div>
      </div>

      <div>
        <div className="text-grey font-bold">Debt After Payback:</div>
        <div className="font-bold text-4xl">
          {remainingBalance !== undefined ? (
            overflow ? (
              '0 USM'
            ) : (
              <>
                {formatNumber(remainingBalance)}{' '}
                <span className="font-normal">USM</span>
              </>
            )
          ) : (
            <Skeleton width="50%" />
          )}
        </div>
      </div>
      <div className="grid grid-cols-2 gap-4 mt-4">
        <div className="space-y-1">
          <div className="text-sm text-grey">
            Liquidation Price After Payback
          </div>
          <div className="font-bold text-2xl">
            {newLiquidationPriceUSD !== undefined ? (
              overflow ? (
                '-'
              ) : (
                `$${formatNumber(newLiquidationPriceUSD)}`
              )
            ) : (
              <Skeleton />
            )}
          </div>
        </div>
        <div className="space-y-1">
          <div className="text-sm text-grey">
            Collateral Ratio After Payback
          </div>
          <div className="font-bold text-2xl">
            {newCollateralRatio !== undefined ? (
              overflow ? (
                '-'
              ) : (
                `${formatNumber(newCollateralRatio)}%`
              )
            ) : (
              <Skeleton />
            )}
          </div>
        </div>
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
