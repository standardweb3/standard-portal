import { RouterCurrencyInputPanel } from '../../../bridge/feature/RouterCurrencyInputPanel';
import Image from '../../../components-ui/Image';
import { classNames } from '../../../functions';
import { DefinedStyles } from '../../../utils/DefinedStyles';
import { CollateralizePanelHeader } from './CollateralizePanelHeader';
import { Button } from '../../../components-ui/Button';

const lf =
  'https://raw.githubusercontent.com/digitalnativeinc/icons/master/collateralize/lf.png';

const lr =
  'https://raw.githubusercontent.com/digitalnativeinc/icons/master/collateralize/lr.png';

const sf =
  'https://raw.githubusercontent.com/digitalnativeinc/icons/master/collateralize/sf.png';

export function CollateralizeBorrowPanel({
  mtrAmount,
  mtr,
  setMtrAmount,
  borrowable,
  onBorrowClick,
  buttonMessage,
}) {
  return (
    <>
      <div
        className={classNames(
          DefinedStyles.collateralizePanel,
          'flex flex-col items-center',
        )}
      >
        <div className="w-full flex flex-col lg:flex-row space-y-4 lg:space-y-0 lg:space-x-8">
          <CollateralizePanelHeader
            number={3}
            title={'Confirm Borrow Amount'}
            subtitle={
              'Collateral will be liquidated when its value falls under the minimum collateral ratio'
            }
            className="min-w-[50%]"
          />{' '}
          <div className="w-full rounded-20 sm:bg-opaque-secondary sm:px-4 py-1">
            <RouterCurrencyInputPanel
              currency={mtr}
              amount={mtrAmount}
              onAmountChange={setMtrAmount}
              hideChevron
            />
          </div>
        </div>
        {/* <div className="p-4 !mt-0">
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
      </div> */}
      </div>
      {/* 
      <ConfirmCollateralizeButton
        onClick={onBorrowClick}
        disabled={!borrowable}
        message={buttonMessage}
      /> */}

      <div className="flex justify-center">
        <Button
          disabled={!borrowable}
          className={classNames(DefinedStyles.fullButton, 'md:max-w-[50%]')}
          onClick={onBorrowClick}
        >
          {buttonMessage}
        </Button>
      </div>
      <div
        className={classNames(
          DefinedStyles.collateralizePanel,
          'flex justify-center !py-4 !mt-12',
        )}
      >
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-8 px-8 text-grey max-w-[600px] content-center">
          <div className="col-span-1 text-center flex flex-col items-center">
            <div className="flex justify-center mb-1">
              <Image src={sf} width="36px" height="36px" layout="fixed" />
            </div>
            <div className="max-w-[200px] sm:max-w-none">
              <div className="text-sm font-medium">Stability Fee</div>
              <div className="text-xs mt-2">
                Stability Fee is continuously accruing interest that is due upon
                repayment of the borrowed tokens
              </div>
            </div>
          </div>

          <div className="col-span-1 text-center flex flex-col items-center">
            <div className="flex justify-center mb-1">
              <Image src={lr} width="36px" height="36px" layout="fixed" />
            </div>
            <div className="max-w-[200px] sm:max-w-none">
              <div className="text-sm font-medium">Liquidation Ratio</div>
              <div className="text-xs mt-2">
                Liquidation Ratio is the ratio of the collateral to the borrowed
                MTR that will trigger the collateral to be liquidated
              </div>
            </div>
          </div>

          <div className="col-span-1 text-center flex flex-col items-center">
            <div className="flex justify-center mb-1">
              <Image src={lf} width="36px" height="36px" layout="fixed" />
            </div>
            <div className="max-w-[200px] sm:max-w-none">
              <div className="text-sm font-medium">Liquidation Fee</div>

              <div className="text-xs mt-2">
                Liquidation Fee is the fee paid to the liquidator and the
                protocol when the collaterals are liquidated
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
