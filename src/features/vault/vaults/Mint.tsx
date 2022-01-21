import { useMemo } from 'react';
import Skeleton from 'react-loading-skeleton';
import { RouterCurrencyInputPanel } from '../../../bridge/feature/RouterCurrencyInputPanel';
import { Button } from '../../../components-ui/Button';
import { formatNumber, tryParseAmount } from '../../../functions';
import { ApprovalState, useApproveCallback } from '../../../hooks';
import { useVault } from '../../../hooks/vault/useVault';
import { useNewVaultState } from '../../../state/vault/hooks';
import { DefinedStyles } from '../../../utils/DefinedStyles';

export function VaultMint({
  vaultAddress,
  mtr,
  collateral,
  collateralBalance,
  depositAmount,
  borrowMoreAmount,
  onBorrowMoreAmountChange,
  onDepositAmountChange,
  borrowed,
  currentCollateralized,
  collateralPriceUSD,
  mcr,
  minCollateralAmount,
}) {
  const { borrowMore } = useVault(vaultAddress);
  const borrowMoreCurrencyAmount = tryParseAmount(borrowMoreAmount, mtr);
  const depositCurrencyAmount = tryParseAmount(depositAmount, collateral);
  const [mtrApprovalState, approveMtr] = useApproveCallback(
    borrowMoreCurrencyAmount,
    vaultAddress,
  );
  const [collateralApprovalState, approveCollateral] = useApproveCallback(
    depositCurrencyAmount,
    vaultAddress,
  );

  const newMtrBalance =
    borrowed !== undefined
      ? parseFloat(borrowed) +
        (borrowMoreAmount !== '' ? parseFloat(borrowMoreAmount) : 0)
      : undefined;

  const newCollateralized =
    currentCollateralized !== undefined
      ? parseFloat(currentCollateralized) +
        (depositAmount !== '' ? parseFloat(depositAmount) : 0)
      : undefined;

  const handleBorrowMoreAmountChange = (bmAmt) => {
    if (bmAmt !== '') {
      const newMinCollateralAmount =
        ((parseFloat(bmAmt) + parseFloat(borrowed)) * mcr) /
        100 /
        collateralPriceUSD;
      const diff = newMinCollateralAmount - parseFloat(currentCollateralized);
      if (diff > 0) {
        onDepositAmountChange(diff);
      } else {
        onDepositAmountChange('');
      }
    }
    onBorrowMoreAmountChange(bmAmt);
  };

  const {
    newLiquidationPriceUSD,
    newMinCollateralAmount,
    newCollateralRatio,
  } = useNewVaultState(
    newMtrBalance,
    newCollateralized,
    collateralPriceUSD,
    mcr,
  );

  const borrowable =
    borrowMoreCurrencyAmount &&
    (!depositCurrencyAmount ||
      (depositCurrencyAmount &&
        collateralBalance &&
        (collateralBalance.greaterThan(depositCurrencyAmount) ||
          collateralBalance.equalTo(depositCurrencyAmount))));

  const onClick = async () => {
    if (depositCurrencyAmount) {
      if (collateralApprovalState == ApprovalState.APPROVED) {
        if (mtrApprovalState == ApprovalState.APPROVED) {
          if (borrowMoreCurrencyAmount) {
            await borrowMore(
              depositCurrencyAmount.quotient.toString(),
              borrowMoreCurrencyAmount.quotient.toString(),
            );
          }
        } else if (mtrApprovalState == ApprovalState.NOT_APPROVED) {
          await approveMtr();
        }
      } else if (collateralApprovalState == ApprovalState.NOT_APPROVED) {
        await approveMtr();
      }
    } else {
      if (mtrApprovalState == ApprovalState.APPROVED) {
        if (borrowMoreCurrencyAmount) {
          await borrowMore(
            depositCurrencyAmount
              ? depositCurrencyAmount.quotient.toString()
              : '0',
            borrowMoreCurrencyAmount.quotient.toString(),
          );
        }
      } else if (mtrApprovalState == ApprovalState.NOT_APPROVED) {
        await approveMtr();
      }
    }
  };

  const confirmButtonMessage = useMemo(() => {
    if (borrowMoreCurrencyAmount) {
      if (!depositCurrencyAmount) {
        if (
          mtrApprovalState == ApprovalState.NOT_APPROVED ||
          mtrApprovalState == ApprovalState.UNKNOWN
        ) {
          return 'Approve USM';
        } else if (mtrApprovalState == ApprovalState.PENDING) {
          return 'Approving';
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
            return 'Approving';
          }
          return 'Deposit and Borrow More';
        } else {
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
    <div className="space-y-4">
      <div className="flex items-end space-x-2">
        <div className="text-grey font-bold">Min Collateral after borrow</div>
        <div className="font-bold text-2xl">
          {newMinCollateralAmount !== undefined ? (
            `${formatNumber(newMinCollateralAmount)} ${collateral.symbol}`
          ) : (
            <Skeleton />
          )}
        </div>
      </div>
      <div className="flex items-end space-x-2">
        <div className="text-grey font-bold">
          New Collateral Amount after borrow:
        </div>
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

      <div className="flex flex-col space-y-4 ">
        <div className="w-full rounded-20 sm:bg-opaque-secondary sm:px-4 py-1">
          <RouterCurrencyInputPanel
            onAmountChange={handleBorrowMoreAmountChange}
            currency={mtr}
            max={collateralBalance}
            amount={borrowMoreAmount}
            hideChevron
          />
        </div>
        <div className="w-full rounded-20 sm:bg-opaque-secondary sm:px-4 py-1">
          <RouterCurrencyInputPanel
            onAmountChange={onDepositAmountChange}
            currency={collateral}
            max={collateralBalance}
            amount={depositAmount}
            hideChevron
          />
        </div>
        <Button
          className={DefinedStyles.fullButton}
          onClick={onClick}
          disabled={!borrowable}
        >
          {confirmButtonMessage}
        </Button>
      </div>
    </div>
  );
}
