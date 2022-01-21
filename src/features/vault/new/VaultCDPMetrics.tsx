import Skeleton from 'react-loading-skeleton';
import { Flasher } from '../../../components-ui/Flasher';
import { classNames, formatNumber } from '../../../functions';
import { DefinedStyles } from '../../../utils/DefinedStyles';
import { CDPMetric } from './CDPMetric';

export function VaultCDPMetrics({
  collateralPrice,
  liquidationPrice,
  currentCollateralRatio,
  minCollateralRatio,
  mtrPriceUSD,
  debtAmount,
  stabilityFee,
  horizontal = false,
}) {
  return (
    <div
      className={classNames(
        DefinedStyles.collateralizePanel,
        horizontal &&
          'grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 !p-8',
      )}
    >
      <CDPMetric
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
      {!horizontal && (
        <div className={classNames(DefinedStyles.divider, '!my-6')} />
      )}

      <CDPMetric
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
        <div className={classNames(DefinedStyles.divider, '!my-6')} />
      )}
      <CDPMetric
        horizontal={horizontal}
        header="Current Collateral Ratio"
        tooltip="This is current collateral ratio of the CDP"
        content={
          currentCollateralRatio !== undefined ? (
            <Flasher
              baseColor="#B984FC"
              fromColor="#fff"
              content={currentCollateralRatio + '%'}
            />
          ) : (
            <Skeleton width="50%" />
          )
        }
      />
      {!horizontal && (
        <div className={classNames(DefinedStyles.divider, '!my-6')} />
      )}

      <CDPMetric
        horizontal={horizontal}
        header="Stability Fee"
        tooltip="This is the accrued stability fee of the CDP"
        content={
          stabilityFee !== undefined ? (
            <Flasher
              baseColor="#B984FC"
              fromColor="#fff"
              content={'$' + parseFloat(stabilityFee.toFixed(4))}
            />
          ) : (
            <Skeleton width="50%" />
          )
        }
      />
      {!horizontal && (
        <div className={classNames(DefinedStyles.divider, '!my-6')} />
      )}

      <CDPMetric
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
      {!horizontal && (
        <div className={classNames(DefinedStyles.divider, '!my-6')} />
      )}
      <CDPMetric
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
