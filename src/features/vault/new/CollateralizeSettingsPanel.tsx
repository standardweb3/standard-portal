import { classNames } from '../../../functions';
import { useStnd } from '../../../hooks/Tokens';
import { DefinedStyles } from '../../../utils/DefinedStyles';
import { CollateralizePanelHeader } from './CollateralizePanelHeader';
import { CurrencyOutputPanel } from './CurrencyOutputPanel';
import { ProgressBar } from './ProgressBar';
import { Input as NumericalInput } from '../../../components-ui/NumericalInput';
import Image from '../../../components-ui/Image';

const lf =
  'https://raw.githubusercontent.com/digitalnativeinc/icons/master/collateralize/lf.png';

const lr =
  'https://raw.githubusercontent.com/digitalnativeinc/icons/master/collateralize/lr.png';

const sf =
  'https://raw.githubusercontent.com/digitalnativeinc/icons/master/collateralize/sf.png';

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
          <CurrencyOutputPanel currency={mtr} amount={mtrAmount} />
        </div>
      </div>
      <div
        className="
        rounded-20 bg-opaque 
        px-4 py-2
        flex flex-col xl:flex-row 
        items-end xl:items-center
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

      <div className="p-4 !mt-0">
        <div className="flex space-x-2 justify-between text-sm text-grey">
          <div>Stability Fee:</div>
          <div className="font-semibold">1.5%</div>
        </div>

        <div className="flex space-x-2 justify-between text-sm text-grey">
          <div>Liquidation Ratio:</div>
          <div className="font-semibold">1.5%</div>
        </div>

        <div className="flex space-x-2 justify-between text-sm text-grey">
          <div>Liquidation Fee:</div>
          <div className="font-semibold">1.5%</div>
        </div>
      </div>
      <div className={classNames(DefinedStyles.divider, '!my-0')} />

      <div className="grid grid-cols-3 px-8 text-grey !mt-6">
        <div className="col-span-1 text-center">
          <div className="flex justify-center mb-1">
            <Image src={sf} width="36px" height="36px" layout="fixed" />
          </div>
          <div className="text-sm font-medium">Stability Fee</div>
          <div className="text-xs mt-2">
            Stability Fee is continuously accruing interest that is due upon
            repayment of the borrowed tokens
          </div>
        </div>

        <div className="col-span-1 text-center">
          <div className="flex justify-center mb-1">
            <Image src={lr} width="36px" height="36px" layout="fixed" />
          </div>
          <div className="text-sm font-medium">Liquidation Ratio</div>
          <div className="text-xs mt-2">
            Liquidation Ratio is the ratio of the collateral to the borrowed MTR
            that will trigger the collateral to be liquidated
          </div>
        </div>

        <div className="col-span-1 text-center">
          <div className="flex justify-center mb-1">
            <Image src={lf} width="36px" height="36px" layout="fixed" />
          </div>
          <div className="text-sm font-medium">Liquidation Fee</div>

          <div className="text-xs mt-2">
            Liquidation Fee is the fee paid to the liquidator and the protocol
            when the collaterals are liquidated
          </div>
        </div>
      </div>
    </div>
  );
}
