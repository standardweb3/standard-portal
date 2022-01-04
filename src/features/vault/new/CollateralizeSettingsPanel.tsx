import { classNames } from '../../../functions';
import { DefinedStyles } from '../../../utils/DefinedStyles';
import { CollateralizePanelHeader } from './CollateralizePanelHeader';
import { ProgressBar } from './ProgressBar';
import { Input as NumericalInput } from '../../../components-ui/NumericalInput';
import { useMtr } from '../../../hooks/vault/useMtr';

export function CollateralizeSettingsPanel({
  mtrAmount,
  liquidationRatio,
  setLiquidationRatio,
  maxLiquidationRatio,
  setLiquidationRatioPercentage,
  liquidationRatioPercentage,
  setToMinLiquidationRatio,
  setToSafeLiquidationRatio,
}) {
  // change to use MTR later
  const mtr = useMtr();
  return (
    <div className={classNames(DefinedStyles.collateralizePanel, 'space-y-4')}>
      <div className="flex flex-col lg:flex-row space-y-4 lg:space-y-0 lg:space-x-8">
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
        rounded-20 bg-background-currency-input-xs sm:bg-opaque 
        px-4 py-4 sm:py-2
        flex flex-col-reverse sm:flex-row 
        items-end sm:items-center 
        w-full space-x-4"
          >
            <div className="flex flex-1 w-full">
              <ProgressBar
                liquidationRatioPercentage={liquidationRatioPercentage}
                setLiquidationRatioPercentage={setLiquidationRatioPercentage}
                maxLiquidationRatio={maxLiquidationRatio}
                setLiquidationRatio={setLiquidationRatio}
                liquidationRatio={liquidationRatio}
                setToMinLiquidationRatio={setToMinLiquidationRatio}
                setToSafeLiquidationRatio={setToSafeLiquidationRatio}
              />
            </div>
            <div className="flex items-center space-x-2 bg-opaque rounded-20 px-4 py-4">
              <NumericalInput
                className={classNames('text-right max-w-[110px]')}
                value={liquidationRatio}
                onUserInput={setLiquidationRatio}
              />
              <div>%</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
