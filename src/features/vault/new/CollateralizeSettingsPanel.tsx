import { classNames } from '../../../functions';
import { useStnd } from '../../../hooks/Tokens';
import { DefinedStyles } from '../../../utils/DefinedStyles';
import { CollateralizePanelHeader } from './CollateralizePanelHeader';
import { CurrencyOutputPanel } from './CurrencyOutputPanel';
import { ProgressBar } from './ProgressBar';

export function CollateralizeSettingsPanel() {
  // change to use MTR later
  const mtr = useStnd();
  return (
    <div className={classNames(DefinedStyles.collateralizePanel, 'space-y-4')}>
      <CollateralizePanelHeader
        number={2}
        title={'Set A Collateral Ratio'}
        subtitle={
          'Collateral will be liquidated when its value falls under the minimum collateral ratio'
        }
      />
      <div>
        <div className="pl-2 mb-2 text-xs font-bold text-grey">
          You will Receive:
        </div>
        <div className="rounded-20 sm:bg-opaque-secondary sm:px-4 py-1">
          <CurrencyOutputPanel currency={mtr} amount={123} />
        </div>
      </div>
      <div className="rounded-20 bg-opaque px-4">
        <ProgressBar />
      </div>
    </div>
  );
}
