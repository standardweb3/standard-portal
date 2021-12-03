import { classNames } from '../../../functions';
import { DefinedStyles } from '../../../utils/DefinedStyles';
import { CollateralizePanelHeader } from './CollateralizePanelHeader';

export function CollateralSelectPanel() {
  return (
    <div className={classNames(DefinedStyles.collateralizePanel)}>
      <CollateralizePanelHeader
        number={1}
        title={'Choose a Collateral Asset'}
        subtitle={'Collateral assets have different collateral ratio'}
      />
      collateral
    </div>
  );
}
