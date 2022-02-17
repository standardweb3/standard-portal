import { useMemo } from 'react';
import Skeleton from 'react-loading-skeleton';
import { RouterCurrencyInputPanel } from '../../../bridge/feature/RouterCurrencyInputPanel';
import { Button } from '../../../components-ui/Button';
import { classNames, formatNumber, tryParseAmount } from '../../../functions';
import { ApprovalState, useApproveCallback } from '../../../hooks';
import { useVault } from '../../../hooks/vault/useVault';
import { useNewVaultState } from '../../../state/vault/hooks';
import { DefinedStyles } from '../../../utils/DefinedStyles';
import { CollateralRatioProgressBar } from '../../../components-ui/ProgressBar/CollateralRatioProgressBar';
import { Input as NumericalInput } from '../../../components-ui/NumericalInput';
import { useTransactionAdder } from '../../../state/transactions/hooks';
import { MAX_COLLATERAL_RATIO } from '../constants';
import { useTransactionSubmission } from '../../../hooks/useTransactionSubmission';
import TransactionConfirmationModal from '../../../modals/TransactionConfirmationModal';
import { BIG_INT_ZERO } from '../../../constants';
import { RippleSpinner } from '../../../components-ui/Spinner/RippleSpinner';

export function VaultMint({
  vaultAddress,
  usm,
  collateral,
  collateralBalance,
  depositAmount,
  borrowMoreAmount,
  onBorrowMoreAmountChange,
  onDepositAmountChange,
  borrowed,
  currentCollateralized,
  collateralPrice,
  mcr,
  minCollateralAmount,
  debt,
  stabilityFee,
  collateralRatio,
  setCollateralRatio,
  maxCollateralRatio,
  setCollateralRatioPercentage,
  collateralRatioPercentage,
  setToMinCollataralRatio,
  setToSafeCollateralRatio,
  handleWrapUnwrap,
  isCollateralNative,
  isCollateralWnative,
  loading,
  mintableSupply,
  isMintable,
}) {
  const addTransaction = useTransactionAdder();

  const {
    showConfirm,
    attemptingTxn,
    setAttemptingTxn,
    txHash,
    handleSubmission,
    handleDismissConfirmation,
  } = useTransactionSubmission();

  const { borrowMore, borrowMoreNative } = useVault(vaultAddress);
  const borrowMoreCurrencyAmount = tryParseAmount(borrowMoreAmount, usm);
  const depositCurrencyAmount = tryParseAmount(depositAmount, collateral);

  const [mtrApprovalState, approveMtr] = useApproveCallback(
    borrowMoreCurrencyAmount,
    vaultAddress,
  );
  const [collateralApprovalState, approveCollateral] = useApproveCallback(
    depositCurrencyAmount,
    vaultAddress,
  );

  const newDebt =
    debt !== undefined
      ? debt + (borrowMoreAmount !== '' ? parseFloat(borrowMoreAmount) : 0)
      : undefined;

  const newCollateralized =
    currentCollateralized !== undefined
      ? parseFloat(currentCollateralized) +
        (depositAmount !== '' ? parseFloat(depositAmount) : 0)
      : undefined;

  // const handleBorrowMoreAmountChange = (bmAmt) => {
  //   if (bmAmt !== '') {
  //     const newMinCollateralAmount =
  //       ((parseFloat(bmAmt) + parseFloat(borrowed)) * mcr) /
  //       100 /
  //       collateralPrice;
  //     const diff = newMinCollateralAmount - parseFloat(currentCollateralized);
  //     if (diff > 0) {
  //       onDepositAmountChange(diff);
  //     } else {
  //       onDepositAmountChange('');
  //     }
  //   }
  //   onBorrowMoreAmountChange(bmAmt);
  // };

  const {
    newLiquidationPriceUSD,
    newMinCollateralAmount,
    newCollateralRatio,
  } = useNewVaultState(newDebt, newCollateralized, collateralPrice, mcr);

  const borrowable =
    isMintable &&
    borrowMoreCurrencyAmount &&
    (!depositCurrencyAmount ||
      (depositCurrencyAmount &&
        collateralBalance &&
        (collateralBalance.greaterThan(depositCurrencyAmount) ||
          collateralBalance.equalTo(depositCurrencyAmount)) &&
        (depositCurrencyAmount.equalTo(0) ||
          depositCurrencyAmount.greaterThan(0)))) && newCollateralRatio !== undefined && newCollateralRatio >= mcr;

  const onClick = async () => {
    if (depositCurrencyAmount) {
      if (collateralApprovalState == ApprovalState.APPROVED) {
        if (mtrApprovalState == ApprovalState.APPROVED) {
          if (borrowMoreCurrencyAmount) {
            const tx = isCollateralNative
              ? await borrowMoreNative(
                  depositCurrencyAmount.quotient.toString(),
                  borrowMoreCurrencyAmount.quotient.toString(),
                )
              : await borrowMore(
                  depositCurrencyAmount.quotient.toString(),
                  borrowMoreCurrencyAmount.quotient.toString(),
                );
            tx &&
              addTransaction(tx, {
                summary: `Borrow ${formatNumber(
                  borrowMoreCurrencyAmount.toExact(),
                )} USM and deposit ${formatNumber(
                  depositCurrencyAmount.toExact(),
                )} ${collateral.symbol} to vault ${vaultAddress}`,
              });
            tx && handleSubmission(tx.hash);
          }
        } else if (mtrApprovalState == ApprovalState.NOT_APPROVED) {
          await approveMtr();
        }
      } else if (collateralApprovalState == ApprovalState.NOT_APPROVED) {
        await approveCollateral();
      }
    } else {
      if (mtrApprovalState == ApprovalState.APPROVED) {
        if (borrowMoreCurrencyAmount) {
          const tx = isCollateralNative
            ? await borrowMoreNative(
                depositCurrencyAmount
                  ? depositCurrencyAmount.quotient.toString()
                  : '0',
                borrowMoreCurrencyAmount.quotient.toString(),
              )
            : await borrowMore(
                depositCurrencyAmount
                  ? depositCurrencyAmount.quotient.toString()
                  : '0',
                borrowMoreCurrencyAmount.quotient.toString(),
              );
          tx &&
            addTransaction(tx, {
              summary: `Borrow ${formatNumber(
                borrowMoreCurrencyAmount.toExact(),
              )} USM from vault ${vaultAddress}`,
            });
          tx && handleSubmission(tx.hash);
        }
      } else if (mtrApprovalState == ApprovalState.NOT_APPROVED) {
        await approveMtr();
      }
    }
  };

  const confirmButtonMessage = useMemo(() => {
    if (!isMintable) return 'USM is not borrowable';
    if (borrowMoreCurrencyAmount) {
      if (!depositCurrencyAmount) {
        if (
          mtrApprovalState == ApprovalState.NOT_APPROVED ||
          mtrApprovalState == ApprovalState.UNKNOWN
        ) {
          return 'Approve USM';
        } else if (mtrApprovalState == ApprovalState.PENDING) {
          return (
            <div className="flex items-center justify-center space-x-3">
              <div>Approving</div>
              <RippleSpinner size={16} />
            </div>
          );
        }
        if (newCollateralRatio !== undefined && newCollateralRatio < mcr) {
          return 'Min. Collateral Ratio not met';
        }
        return 'Borrow More';
      } else if (depositCurrencyAmount && collateralBalance) {
        if (
          collateralBalance.greaterThan(depositCurrencyAmount) ||
          collateralBalance.equalTo(depositCurrencyAmount)
        ) {
          if (
            (mtrApprovalState == ApprovalState.NOT_APPROVED ||
              mtrApprovalState == ApprovalState.UNKNOWN) &&
            (collateralApprovalState == ApprovalState.NOT_APPROVED ||
              collateralApprovalState == ApprovalState.UNKNOWN)
          ) {
            return 'Approve USM & Collateral';
          } else if (
            mtrApprovalState == ApprovalState.NOT_APPROVED ||
            mtrApprovalState == ApprovalState.UNKNOWN
          ) {
            return 'Approve USM';
          } else if (
            collateralApprovalState == ApprovalState.NOT_APPROVED ||
            collateralApprovalState == ApprovalState.UNKNOWN
          ) {
            return 'Approve collateral';
          } else if (
            collateralApprovalState == ApprovalState.PENDING ||
            mtrApprovalState == ApprovalState.PENDING
          ) {
            return (
              <div className="flex items-center justify-center space-x-3">
                <div>Approving</div>
                <RippleSpinner size={16} />
              </div>
            );
          }

          if (newCollateralRatio !== undefined && newCollateralRatio < mcr) {
            return 'Min. Collateral Ratio not met';
          }
          if (depositCurrencyAmount.lessThan(BIG_INT_ZERO)) {
            return 'Deposit amount must be greater than 0';
          }
          return 'Deposit and Borrow More';
        } else {
          if (newCollateralRatio !== undefined && newCollateralRatio < mcr) {
            return 'Min. Collateral Ratio not met';
          }
          return 'Insufficient Collateral Balance';
        }
      }
    } else if (!borrowMoreCurrencyAmount) {
      return 'Enter Borrow More Amount';
    } else {
      return 'Insufficient Mtr Balance';
    }
  }, [
    mtrApprovalState,
    collateralApprovalState,
    borrowMoreCurrencyAmount,
    depositCurrencyAmount,
  ]);

  return (
    <div
      className={classNames(
        'px-0 md:px-8 space-y-8',
        !isMintable && 'is-disabled',
      )}
    >
      <div className="space-y-4">
        <div className="font-bold text-lg">Enter amount to borrow</div>
        <div className="w-full rounded-20 sm:bg-opaque-secondary sm:px-4 py-1">
          <RouterCurrencyInputPanel
            onAmountChange={onBorrowMoreAmountChange}
            currency={usm}
            // max={collateralBalance}
            amount={borrowMoreAmount}
            hideChevron
            hideBalance
          />
        </div>

        {mintableSupply !== undefined && (
          <div>
            <div className="text-sm">Borrowable USM Supply:</div>
            <div className="text-primary font-bold">
              {formatNumber(mintableSupply)} USM
            </div>
          </div>
        )}
      </div>

      <div className="space-y-4">
        <div className="font-bold text-lg">Enter amount to deposit</div>
        <div className="w-full rounded-20 sm:bg-opaque-secondary sm:px-4 py-1">
          <RouterCurrencyInputPanel
            onAmountChange={onDepositAmountChange}
            currency={collateral}
            max={collateralBalance}
            amount={depositAmount}
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
      <div
        className="
        rounded-20 bg-transparent sm:bg-opaque 
        px-0 py-0 sm:py-2 sm:px-4
        flex flex-col-reverse sm:flex-row 
        items-center
        w-full space-x-4"
      >
        <div className="flex flex-1 w-full">
          <CollateralRatioProgressBar
            collateralRatioPercentage={collateralRatioPercentage}
            setCollateralRatioPercentage={setCollateralRatioPercentage}
            maxCollateralRatio={MAX_COLLATERAL_RATIO}
            setCollateralRatio={setCollateralRatio}
            collateralRatio={collateralRatio}
            setToMinCollataralRatio={setToMinCollataralRatio}
            setToSafeCollateralRatio={setToSafeCollateralRatio}
          />
        </div>
        <div className="flex items-center space-x-2 bg-opaque rounded-20 px-4 py-4 mb-4 sm:mb-0">
          <NumericalInput
            className={classNames('text-right max-w-[110px]')}
            value={collateralRatio}
            onUserInput={setCollateralRatio}
          />
          <div>%</div>
        </div>
      </div>
      <div>
        <div className="text-grey font-bold">Collateral ratio after borrow</div>
        <div className="font-bold text-4xl">
          {newCollateralRatio !== undefined ? (
            <>
              {formatNumber(newCollateralRatio)}{' '}
              <span className="font-normal">%</span>
            </>
          ) : (
            <Skeleton width="50%" />
          )}
        </div>
      </div>
      <div className="grid grid-cols-2 gap-4 mt-4">
        <div className="space-y-1">
          <div className="text-grey font-bold">
            Liquidation Price After Borrow
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
          <div className="text-grey font-bold">
            Min collateral amount after borrow
          </div>
          <div className="font-bold text-2xl">
            {collateral && newMinCollateralAmount !== undefined ? (
              `${formatNumber(newMinCollateralAmount)} ${collateral.symbol}`
            ) : (
              <Skeleton />
            )}
          </div>
        </div>
      </div>

      <Button
        className={DefinedStyles.fullButton}
        onClick={onClick}
        disabled={!borrowable}
      >
        {confirmButtonMessage}
      </Button>
      <TransactionConfirmationModal
        isOpen={showConfirm}
        onDismiss={handleDismissConfirmation}
        attemptingTxn={attemptingTxn}
        currencyToAdd={usm}
        hash={txHash ? txHash : ''}
        content={() => {
          return <></>;
        }}
        pendingText={''}
      />
    </div>
  );
}
