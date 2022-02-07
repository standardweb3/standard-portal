import Skeleton from 'react-loading-skeleton';
import { Flasher } from '../../../components-ui/Flasher';
import { useSizeMdDown } from '../../../components-ui/Responsive';
import { classNames, formatNumber } from '../../../functions';
import { DefinedStyles } from '../../../utils/DefinedStyles';
import { CDPMetric } from './CDPMetric';

export function CDPMetrics({
  collateralPrice,
  liquidationPrice,
  mtrPriceUSD,
  debtAmount,
  horizontal = false,
}) {
  const isViewportMdDown = useSizeMdDown();
  return (
    <div
      className={classNames(
        DefinedStyles.collateralizePanel,
        'grid grid-cols-2 lg:grid-cols-1 gap-4 !p-8',
        horizontal &&
          'grid !grid-cols-1 !sm:grid-cols-2 !lg:grid-cols-4 gap-4 !p-8',
      )}
    >
      <CDPMetric
        className="cols-span-1"
        horizontal={horizontal}
        header="Collateral Price"
        tooltip="This is the oracle price of the collateral asset."
        content={
          collateralPrice !== undefined ? (
            <Flasher
              baseColor="#fff"
              fromColor="#B984FC"
              content={formatNumber(collateralPrice, true)}
            />
          ) : (
            <Skeleton width="50%" />
          )
        }
      />
      {!horizontal && !isViewportMdDown && (
        <div className={classNames(DefinedStyles.divider, '!my-2')} />
      )}

      <CDPMetric
        className="cols-span-1"
        horizontal={horizontal}
        header="Liquidation Price"
        tooltip="This is the price of the collateral asset at which the collaterals will be liquidated."
        content={
          liquidationPrice !== undefined ? (
            <Flasher
              baseColor="#B984FC"
              fromColor="#fff"
              content={'$' + parseFloat(liquidationPrice.toFixed(4))}
            />
          ) : (
            <Skeleton width="50%" />
          )
        }
      />
      {!horizontal && (
        <div
          className={classNames(
            DefinedStyles.divider,
            '!my-2 col-span-2 lg:col-span-1',
          )}
        />
      )}
      <CDPMetric
        className="cols-span-1"
        horizontal={horizontal}
        header="USM Price"
        tooltip="This is the oracle price of USM."
        content={
          mtrPriceUSD !== undefined ? (
            <Flasher
              baseColor="#fff"
              fromColor="#B984FC"
              content={formatNumber(mtrPriceUSD, true)}
            />
          ) : (
            <Skeleton width="50%" />
          )
        }
      />
      {!horizontal && !isViewportMdDown && (
        <div className={classNames(DefinedStyles.divider, '!my-2')} />
      )}
      <CDPMetric
        className="cols-span-1"
        horizontal={horizontal}
        header="Market Debt Value"
        tooltip="This is the rounded market value of borrowed USM."
        content={
          mtrPriceUSD !== undefined ? (
            <Flasher
              baseColor="#B984FC"
              fromColor="#fff"
              content={formatNumber(mtrPriceUSD * parseFloat(debtAmount), true)}
            />
          ) : (
            <Skeleton width="50%" />
          )
        }
      />
    </div>
  );
}
