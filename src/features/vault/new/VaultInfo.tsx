import { classNames } from '../../../functions';
import { DefinedStyles } from '../../../utils/DefinedStyles';

type VaultInfoType = {
  totalSupply?: number;
  desiredSupply?: number;
};

export function VaultInfo({ totalSupply, desiredSupply }: VaultInfoType) {
  return (
    <div className={classNames(DefinedStyles.collateralizePanel)}>
      {totalSupply ?? 'totalSupply'}
      {desiredSupply ?? 'desiredSupply'}
    </div>
  );
}
