import { RouterCurrencyInputPanel } from '../../../bridge/feature/RouterCurrencyInputPanel';
import { TokenInputPanelV2 } from '../../../components-ui/XSTND/TokenInputPanelV2';
import { classNames } from '../../../functions';
import { DefinedStyles } from '../../../utils/DefinedStyles';
import { CollateralizePanelHeader } from './CollateralizePanelHeader';

export function CollateralSelectPanel({
  collateral,
  balance,
  collateralizeAmount,
  setCollateralizeAmount,
}) {
  return (
    <div className={classNames(DefinedStyles.collateralizePanel, 'space-y-4')}>
      <CollateralizePanelHeader
        number={1}
        title={'Choose a Collateral Asset'}
        subtitle={'Collateral assets have different collateral ratio'}
      />
      <div className="rounded-20 sm:bg-opaque-secondary sm:px-4 py-1">
        <RouterCurrencyInputPanel
          currency={collateral}
          onAmountChange={setCollateralizeAmount}
          max={balance}
          amount={collateralizeAmount}
        />
      </div>
    </div>
  );
}
