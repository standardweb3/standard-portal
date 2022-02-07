import { Button } from '../../../components-ui/Button';
import { SimpleCurrencyLogo } from '../../../components-ui/CurrencyLogo/SimpleCurrencyLogo';
import { ModalHeader } from '../../../components-ui/Modal/ModalHeader';
import {
  classNames,
  formatNumber,
  formatPercent,
  tryParseAmount,
} from '../../../functions';
import { useActiveWeb3React } from '../../../hooks';
import { useVault } from '../../../hooks/vault/useVault';
import { useTransactionAdder } from '../../../state/transactions/hooks';
import { useCurrencyBalance } from '../../../state/wallet/hooks';
import { DefinedStyles } from '../../../utils/DefinedStyles';
import { getConditionColor } from '../functions';
import { VaultStatusBadge } from '../vaults/VaultStatusBadge';

export function Close({ vaultInfo, onDismiss }) {
  const addTransaction = useTransactionAdder();
  const { account } = useActiveWeb3React();
  const { closeVault } = useVault(vaultInfo.address);

  const debtCurrencyBalance = tryParseAmount(
    String(vaultInfo.debt),
    vaultInfo.usm,
  );

  const usmBalance = useCurrencyBalance(account, vaultInfo.usm);
  const closeable = usmBalance?.greaterThan(vaultInfo.debt);

  const conditionColor = getConditionColor(vaultInfo.condition);

  const buttonText = closeable ? 'Close Vault' : 'Insufficience USM balance';

  const handleCloseVault = async () => {
    if (closeable && debtCurrencyBalance) {
      const tx = await closeVault(debtCurrencyBalance.quotient.toString());
      tx &&
        addTransaction(tx, {
          summary: `Close vault ${vaultInfo.address} for ${formatNumber(
            debtCurrencyBalance.toExact(),
          )}`,
        });
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
          </div>
          <div className="text-2xl font-bold">
            {formatNumber(vaultInfo.debt)} USM
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
              ${formatNumber(vaultInfo.debtValue)}
            </div>
          </div>
        </div>
      </div>

      {vaultInfo.liquidatable && (
        <div className="text-danger text-sm">
          * The vault may be liquidated anytime
        </div>
      )}

      <Button className={DefinedStyles.fullButton} onClick={handleCloseVault}>
        {buttonText}
      </Button>
    </div>
  );
}
