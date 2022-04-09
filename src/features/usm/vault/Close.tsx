import Skeleton from 'react-loading-skeleton';
import { Button } from '../../../components-ui/Button';
import { SimpleCurrencyLogo } from '../../../components-ui/CurrencyLogo/SimpleCurrencyLogo';
import { ModalHeader } from '../../../components-ui/Modal/ModalHeader';
import { Question } from '../../../components-ui/Question';
import { RippleSpinner } from '../../../components-ui/Spinner/RippleSpinner';
import {
  classNames,
  formatNumber,
  formatPercent,
  tryParseAmount,
} from '../../../functions';
import {
  ApprovalState,
  useActiveWeb3React,
  useApproveCallback,
} from '../../../hooks';
import useCurrentBlockTimestamp from '../../../hooks/useCurrentBlockTimestamp';
import { useVault } from '../../../hooks/vault/useVault';
import { useTransactionAdder } from '../../../state/transactions/hooks';
import { useCurrencyBalance } from '../../../state/wallet/hooks';
import { DefinedStyles } from '../../../utils/DefinedStyles';
import { getConditionColor } from '../functions';
import { VaultStatusBadge } from '../vaults/VaultStatusBadge';

export function Close({ vaultInfo, onDismiss }) {
  const addTransaction = useTransactionAdder();
  const currentBlockTimestamp = useCurrentBlockTimestamp();
  const { account } = useActiveWeb3React();
  const { closeVault } = useVault(vaultInfo.address);

  const vaultLife =
    vaultInfo &&
    currentBlockTimestamp &&
    currentBlockTimestamp.toNumber() - vaultInfo.createdAt;

  const padding =
    vaultLife !== undefined && vaultInfo && (vaultInfo.fee / vaultLife) * 100;

  const debtCurrencyBalance = tryParseAmount(
    vaultInfo && padding !== undefined
      ? String(vaultInfo.debt + padding)
      : undefined,
    vaultInfo?.usm,
  );

  const [usmApprovalState, approveUsm] = useApproveCallback(
    debtCurrencyBalance,
    vaultInfo.address,
  );

  const usmBalance = useCurrencyBalance(account, vaultInfo.usm);
  const closeable =
    vaultInfo?.debt === 0 ||
    (usmBalance &&
      debtCurrencyBalance &&
      vaultInfo &&
      (usmBalance.greaterThan(debtCurrencyBalance) ||
        usmBalance.equalTo(debtCurrencyBalance)));

  const conditionColor = getConditionColor(vaultInfo.condition);

  const buttonText =
    vaultInfo?.debt === 0 || usmApprovalState === ApprovalState.APPROVED ? (
      closeable ? (
        'Close Vault'
      ) : (
        'Insufficience USM balance'
      )
    ) : usmApprovalState === ApprovalState.PENDING ? (
      <div className="flex items-center justify-center space-x-3">
        <div>Approving</div>
        <RippleSpinner size={16} />
      </div>
    ) : (
      'Approve USM'
    );

  const handleCloseVault = async () => {
    if (vaultInfo?.debt === 0) {
      const tx = await closeVault('0');
      tx &&
        addTransaction(tx, {
          summary: `Close vault ${vaultInfo.address} for ${formatNumber(0)}`,
        });
      tx && onDismiss();
    } else if (usmApprovalState === ApprovalState.APPROVED) {
      if (closeable && debtCurrencyBalance) {
        const tx = await closeVault(debtCurrencyBalance.quotient.toString());
        tx &&
          addTransaction(tx, {
            summary: `Close vault ${vaultInfo.address} for ${formatNumber(
              debtCurrencyBalance.toExact(),
            )}`,
          });
        tx && onDismiss();
      }
    } else {
      approveUsm();
    }
  };

  // add liquidation warning + handler
  return (
    <div className="space-y-8">
      <div>
        <ModalHeader onClose={onDismiss} title="Close Vault" className="mb-4" />

        <div className="space-y-1">
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2">
              <SimpleCurrencyLogo
                className="rounded-full"
                size="24px"
                symbol={vaultInfo.collateralCurrency.symbol}
              />
              <div className="text-lg">Collateral</div>
            </div>
            <VaultStatusBadge condition={vaultInfo.condition} disableShow />
          </div>
          <div className="text-2xl font-bold">
            {vaultInfo.currentCollateralized}{' '}
            {vaultInfo.collateralCurrency.symbol}
          </div>
        </div>
        <div className="flex items-center flex-wrap">
          <div className="space-y-1 mt-4 mr-4">
            <div className="text-sm">Collateral Price</div>
            <div className="font-bold">
              ${formatNumber(vaultInfo.collateralPrice)}
            </div>
          </div>
          <div className="space-y-1 mt-4 mr-4">
            <div className="text-sm">Liquidation Price</div>
            <div className={classNames('font-bold', conditionColor)}>
              ${formatNumber(vaultInfo.liquidationPrice)}
            </div>
          </div>
          <div className="space-y-1 mt-4 mr-4">
            <div className="text-sm">Collateral Value</div>
            <div className="font-bold">
              ${formatNumber(vaultInfo.currentCollateralizedValue)}
            </div>
          </div>

          <div className="space-y-1 mt-4 mr-4">
            <div className="text-sm">Collateral Ratio</div>
            <div className="font-bold text-primary">
              {formatPercent(vaultInfo.currentCollateralRatio)}
            </div>
          </div>

          <div className="space-y-1 mt-4 mr-4">
            <div className="text-sm">Min. Collateral Ratio</div>
            <div className="font-bold">{formatPercent(vaultInfo.mcr)}</div>
          </div>
        </div>
      </div>
      <div className={classNames(DefinedStyles.divider, '!border-primary')} />

      <div className="">
        <div className="space-y-1">
          <div className="flex items-center space-x-2">
            <SimpleCurrencyLogo
              className="rounded-full"
              size="24px"
              symbol="mtr"
            />
            <div className="text-lg">Debt</div>
            <Question
              text={`Debt amount includes stability fee inclusive for the next block. If block doesn't change before the transaction is submitted, unused USM will be returned`}
            />
          </div>
          <div className="text-2xl font-bold">
            {vaultInfo && padding !== undefined ? (
              `${parseFloat((vaultInfo.debt + padding)?.toFixed(4))} USM`
            ) : (
              <Skeleton />
            )}
          </div>
        </div>
        <div className="flex items-center space-x-4">
          <div className="space-y-1 mt-4 mr-4">
            <div className="text-sm">Borrowed</div>
            <div className="font-bold">
              {formatNumber(vaultInfo.currentBorrowed)} USM
            </div>
          </div>
          <div className="space-y-1 mt-4 mr-4">
            <div className="text-sm">Stability Fee</div>
            <div className="font-bold">{formatNumber(vaultInfo.fee)} USM</div>
          </div>
          <div className="space-y-1 mt-4 mr-4">
            <div className="text-sm">USM Price</div>
            <div className="font-bold">${formatNumber(vaultInfo.usmPrice)}</div>
          </div>
          <div className="space-y-1 mt-4 mr-4">
            <div className="text-sm">Debt Value</div>
            <div className="font-bold">
              {vaultInfo && padding !== undefined ? (
                `${formatNumber(vaultInfo.debtValue + padding)}`
              ) : (
                <Skeleton />
              )}
            </div>
          </div>
        </div>
      </div>

      {vaultInfo.liquidatable && (
        <div className="text-danger text-sm">
          * The vault may be liquidated anytime
        </div>
      )}

      <Button
        disabled={usmApprovalState === ApprovalState.APPROVED && !closeable}
        className={DefinedStyles.fullButton}
        onClick={handleCloseVault}
      >
        {buttonText}
      </Button>
    </div>
  );
}
