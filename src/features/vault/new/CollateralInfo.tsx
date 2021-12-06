import { CurrencyLogo } from '../../../components-ui/CurrencyLogo';
import { DefinedStyles } from '../../../utils/DefinedStyles';

export function CollateralInfo({ collateralInfo, collateral }) {
  return (
    <div className={DefinedStyles.collateralizePanel}>
      <CurrencyLogo currency={collateral} size={36} className="rounded-full" />
    </div>
  );
}
