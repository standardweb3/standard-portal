import { RouterCurrencyInputPanel } from '../../../bridge/feature/RouterCurrencyInputPanel';
import { classNames, formatNumber } from '../../../functions';
import { DefinedStyles } from '../../../utils/DefinedStyles';
import { CollateralizePanelHeader } from './CollateralizePanelHeader';

export function CollateralizeBorrowPanel({
  usmAmount,
  usm,
  setUsmAmount,
  borrowable,
  onBorrowClick,
  buttonMessage,
  mintableSupply,
}) {
  return (
    <>
      <div
        className={classNames(
          DefinedStyles.collateralizePanel,
          'flex flex-col items-center',
        )}
      >
        <div className={DefinedStyles.collateralizePanelContent}>
          <CollateralizePanelHeader
            number={3}
            title={'Confirm Borrow Amount'}
            subtitle={
              'Collateral will be liquidated when its value falls under the minimum collateral ratio'
            }
            className="min-w-[50%]"
          />
          <div className="w-full rounded-20 sm:bg-opaque-secondary sm:px-4 py-1">
            <RouterCurrencyInputPanel
              currency={usm}
              amount={usmAmount}
              onAmountChange={setUsmAmount}
              hideChevron
              className="!bg-transparent !p-0"
            />
          </div>
          {mintableSupply !== undefined && (
            <div>
              <div className="text-sm">Borrowable USM Supply:</div>
              <div className="text-primary font-bold">
                {formatNumber(mintableSupply)} USM
              </div>
            </div>
          )}
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
    </>
  );
}
