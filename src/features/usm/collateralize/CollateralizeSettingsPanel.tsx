import { classNames } from '../../../functions';
import { DefinedStyles } from '../../../utils/DefinedStyles';
import { CollateralizePanelHeader } from './CollateralizePanelHeader';
import { Input as NumericalInput } from '../../../components-ui/NumericalInput';
import { useMtr } from '../../../hooks/vault/useMtr';
import { CollateralRatioProgressBar } from '../../../components-ui/ProgressBar/CollateralRatioProgressBar';

export function CollateralizeSettingsPanel({
  usmAmount,
  collateralRatio,
  setCollateralRatio,
  maxCollateralRatio,
  minCollateralRatio,
  setCollateralRatioPercentage,
  collateralRatioPercentage,
  setToMinCollataralRatio,
  safeCollateralRatio,
  setToSafeCollateralRatio,
  loading,
}) {
  // change to use MTR later
  const mtr = useMtr();
  return (
    <div className={classNames(DefinedStyles.collateralizePanel, 'space-y-4')}>
      <div className={DefinedStyles.collateralizePanelContent}>
        <CollateralizePanelHeader
          number={2}
          title={'Set A Collateral Ratio'}
          subtitle={
            'Collateral will be liquidated when its value falls under the minimum collateral ratio'
          }
          className="min-w-[50%]"
        />
        <div className="w-full space-y-2">
          <div
            className="
        rounded-20 bg-transparent sm:bg-opaque 
        px-0 py-0 sm:py-2 sm:px-4
        flex flex-col-reverse sm:flex-row 
        items-center 
        w-full space-x-4"
          >
            {!loading && (
              <div className="flex flex-1 w-full">
                <CollateralRatioProgressBar
                  minCollateralRatio={minCollateralRatio}
                  collateralRatioPercentage={collateralRatioPercentage}
                  setCollateralRatioPercentage={setCollateralRatioPercentage}
                  maxCollateralRatio={maxCollateralRatio}
                  setCollateralRatio={setCollateralRatio}
                  collateralRatio={collateralRatio}
                  setToMinCollataralRatio={setToMinCollataralRatio}
                  safeCollateralRatio={safeCollateralRatio}
                  setToSafeCollateralRatio={setToSafeCollateralRatio}
                />
              </div>
            )}
            <div className="flex items-center space-x-2 bg-opaque rounded-20 px-4 py-4 mb-4 sm:mb-0">
              <NumericalInput
                className={classNames('text-right max-w-[110px]')}
                value={collateralRatio}
                onUserInput={setCollateralRatio}
              />
              <div>%</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
