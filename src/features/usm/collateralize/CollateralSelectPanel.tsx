import { RouterCurrencyInputPanel } from '../../../bridge/feature/RouterCurrencyInputPanel';
import { classNames } from '../../../functions';
import { DefinedStyles } from '../../../utils/DefinedStyles';
import { CollateralizePanelHeader } from './CollateralizePanelHeader';

export function CollateralSelectPanel({
  collateral,
  balance,
  collateralizeAmount,
  setCollateralizeAmount,
  isNative,
  isWnative,
  handleWrapUnwrap,
}) {
  return (
    <div
      className={classNames(
        DefinedStyles.collateralizePanel,
        DefinedStyles.collateralizePanelContent,
      )}
    >
      <CollateralizePanelHeader
        number={1}
        title={'Enter Amount'}
        subtitle={'Collateral assets have different collateral ratio'}
        className="min-w-[50%]"
      />
      <div className="w-full rounded-20 sm:bg-opaque-secondary sm:px-4 py-1">
        <RouterCurrencyInputPanel
          hideChevron
          currency={collateral}
          onAmountChange={setCollateralizeAmount}
          max={balance}
          amount={collateralizeAmount}
          className="!bg-transparent !p-0"
        />
      </div>
      {isNative && (
        <div
          className="cursor-pointer text-blue text-sm"
          onClick={handleWrapUnwrap}
        >
          Use W{collateral.symbol}
        </div>
      )}
      {isWnative && (
        <div
          className="cursor-pointer text-blue text-sm"
          onClick={handleWrapUnwrap}
        >
          Use {collateral.symbol.substring(1)}
        </div>
      )}
    </div>
  );
}
