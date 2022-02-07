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

export function VaultDeposit({
  vaultAddress,
  collateral,
  balance,
  amount,
  onAmountChange,
  borrowed,
  mcr,
  collateralPrice,
  currentCollateralized,
  debt,
  fee,
  minCollateralAmount,
  handleWrapUnwrap,
  isCollateralNative,
  isCollateralWnative,
}) {
  const addTransaction = useTransactionAdder();
  const { deposit, depositNative } = useVault(vaultAddress);
  const depositCurrencyAmount = tryParseAmount(amount, collateral);
  const [approvalState, approve] = useApproveCallback(
    depositCurrencyAmount,
    vaultAddress,
  );

  const onClick = async () => {
    if (approvalState == ApprovalState.APPROVED) {
      if (amount) {
        let tx;
        if (collateral.isNative) {
          tx = await depositNative(depositCurrencyAmount.quotient.toString());
        } else if (collateral.isToken) {
          tx = await deposit(depositCurrencyAmount.quotient.toString());
        }
        tx &&
          addTransaction(tx, {
            summary: `Deposit ${formatNumber(
              depositCurrencyAmount.toExact(),
            )} ${collateral.symbol} to vault ${vaultAddress}`,
          });
        tx && onAmountChange('');
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
        return (
          <div className="flex items-center justify-center space-x-3">
            <div>Approving</div>
            <RippleSpinner size={16} />
          </div>
        );
      }
      return 'Deposit';
    } else if (!depositCurrencyAmount) {
      return 'Enter Deposit amount';
    } else {
      return 'Insufficient Balance';
    }
  }, [approvalState, depositable, depositCurrencyAmount]);

  const { newLiquidationPriceUSD, newCollateralRatio } = useNewVaultState(
    debt,
    newCollateralized,
    collateralPrice,
    mcr,
  );

  return (
    <div className="px-0 md:px-8 space-y-8">
      <div className="space-y-4">
        <div className="text-grey font-bold text-lg">
          Enter amount to deposit:
        </div>
        <div className="w-full rounded-20 sm:bg-opaque-secondary sm:px-4 py-1">
          <RouterCurrencyInputPanel
            onAmountChange={onAmountChange}
            currency={collateral}
            max={balance}
            amount={amount}
            hideChevron
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
        <div className="text-grey font-bold">Collateral After Deposit:</div>
        <div className="font-bold text-4xl truncate">
          {collateral && newCollateralized !== undefined ? (
            isNaN(newCollateralized) ? (
              '-'
            ) : (
              <>
                {formatNumber(newCollateralized)}{' '}
                <span className="font-normal">{collateral.symbol}</span>
              </>
            )
          ) : (
            <Skeleton width="50%" />
          )}
        </div>
      </div>
      <div className="grid grid-cols-3 gap-4 mt-4">
        <div className="space-y-1">
          <div className="text-sm text-grey">Min Collateral Amount</div>
          <div className="font-bold text-2xl">
            {collateral && minCollateralAmount !== undefined ? (
              `${formatNumber(minCollateralAmount)} ${collateral?.symbol}`
            ) : (
              <Skeleton />
            )}
          </div>
        </div>
        <div className="space-y-1">
          <div className="text-sm text-grey">
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
        <div className="space-y-1">
          <div className="text-sm text-grey">
            Collateral Ratio After Deposit
          </div>
          <div className="font-bold text-2xl truncate">
            {newCollateralRatio !== undefined ? (
              `${formatNumber(newCollateralRatio)}%`
            ) : (
              <Skeleton />
            )}
          </div>
        </div>
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
