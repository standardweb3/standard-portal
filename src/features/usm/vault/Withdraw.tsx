import Skeleton from 'react-loading-skeleton';
import { useMemo } from 'react';
import { RouterCurrencyInputPanel } from '../../../bridge/feature/RouterCurrencyInputPanel';
import { Button } from '../../../components-ui/Button';
import { formatNumber, tryParseAmount } from '../../../functions';
import { ApprovalState, useApproveCallback } from '../../../hooks';
import { useVault } from '../../../hooks/vault/useVault';
import { useNewVaultState } from '../../../state/vault/hooks';
import { DefinedStyles } from '../../../utils/DefinedStyles';
import { RippleSpinner } from '../../../components-ui/Spinner/RippleSpinner';
import { useTransactionAdder } from '../../../state/transactions/hooks';

export function VaultWithdraw({
  onAmountChange,
  vaultAddress,
  collateral,
  balance,
  amount,
  borrowed,
  mcr,
  collateralPrice,
  currentCollateralized,
  minCollateralAmount,
  debt,
  fee,
  collateralBalance,
  handleWrapUnwrap,
  isCollateralNative,
  isCollateralWnative,
}) {
  const addTransaction = useTransactionAdder();
  const { withdraw, withdrawNative } = useVault(vaultAddress);

  const withdrawCurrencyAmount = tryParseAmount(amount, collateral);
  const [approvalState, approve] = useApproveCallback(
    withdrawCurrencyAmount,
    vaultAddress,
  );

  const onClick = async () => {
    if (approvalState == ApprovalState.APPROVED) {
      if (amount) {
        let tx;
        if (collateral.isNative) {
          tx = await withdrawNative(withdrawCurrencyAmount.quotient.toString());
        } else if (collateral.isToken) {
          tx = await withdraw(withdrawCurrencyAmount.quotient.toString());
        }
        tx &&
          addTransaction(tx, {
            summary: `Withdraw ${formatNumber(
              withdrawCurrencyAmount.toExact(),
            )} ${collateral.symbol} from vault ${vaultAddress}`,
          });
        tx && onAmountChange('');
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
    debt,
    newCollateralized,
    collateralPrice,
    mcr,
  );

  const withdrawable =
    balance &&
    withdrawCurrencyAmount &&
    (balance.greaterThan(withdrawCurrencyAmount) ||
      balance.equalTo(withdrawCurrencyAmount));

  const overflow =
    balance &&
    withdrawCurrencyAmount &&
    balance.lessThan(withdrawCurrencyAmount);

  const confirmButtonMessage = useMemo(() => {
    if (withdrawable) {
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
      return 'Withdraw';
    } else if (!withdrawCurrencyAmount) {
      return 'Enter Withdraw amount';
    } else {
      return 'Insufficient Collateralized Balance';
    }
  }, [approvalState, withdrawCurrencyAmount, withdrawable]);

  return (
    <div className="px-0 md:px-8 space-y-8">
      <div className="space-y-4">
        <div className="text-grey font-bold text-lg">
          Enter amount to withdraw:
        </div>
        <div className="w-full rounded-20 sm:bg-opaque-secondary sm:px-4 py-1">
          <RouterCurrencyInputPanel
            onAmountChange={onAmountChange}
            currency={collateral}
            max={balance}
            balance={collateralBalance}
            amount={amount}
            hideChevron
            hideBalance
          />
        </div>

        {isCollateralNative && (
          <div
            className="cursor-pointer text-blue text-sm"
            onClick={handleWrapUnwrap}
          >
            Use W{collateral.symbol}
          </div>
        )}
        {isCollateralWnative && (
          <div
            className="cursor-pointer text-blue text-sm"
            onClick={handleWrapUnwrap}
          >
            Use {collateral.symbol.substring(1)}
          </div>
        )}
      </div>
      <div>
        <div className="text-sm text-grey">Withdrawable Balance:</div>
        <div className="font-bold text-4xl">
          <>
            {collateral && balance ? (
              <>
                {formatNumber(balance.toExact())}{' '}
                <span className="font-normal">{collateral.symbol}</span>
              </>
            ) : (
              <Skeleton width="50%" />
            )}
          </>
        </div>
      </div>
      <div>
        <div className="text-sm text-grey">Collateral After Withdrawal:</div>
        <div className="font-bold text-4xl">
          {collateral && newCollateralized !== undefined ? (
            overflow ? (
              '-'
            ) : (
              <>
                {formatNumber(newCollateralized)}{' '}
                <span className="font-normal">{collateral.symbol}</span>
              </>
            )
          ) : (
            <Skeleton />
          )}
        </div>
      </div>
      <div className="grid grid-cols-3 gap-4 mt-4">
        <div className="space-y-1">
          <div className="text-sm text-grey">Min Collateral Amount</div>
          <div className="font-bold text-2xl truncate">
            {collateral && minCollateralAmount !== undefined ? (
              `${formatNumber(minCollateralAmount)} ${collateral?.symbol}`
            ) : (
              <Skeleton />
            )}
          </div>
        </div>
        <div className="space-y-1">
          <div className="text-sm text-grey">
            Liquidation Price After Withdrawal
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
            Collateral Ratio After Withdrawal
          </div>
          <div className="font-bold text-2xl truncate">
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
        disabled={!withdrawable}
      >
        {confirmButtonMessage}
      </Button>
    </div>
  );
}
