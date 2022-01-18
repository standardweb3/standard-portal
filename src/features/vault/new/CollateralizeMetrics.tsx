import Skeleton from 'react-loading-skeleton';
import { Flasher } from '../../../components-ui/Flasher';
import { classNames, formatNumber } from '../../../functions';
import { DefinedStyles } from '../../../utils/DefinedStyles';
import { CollateralizeMetric } from './CollateralizeMetric';

export function CollateralizeMetrics({
  collateralPrice,
  liquidationPrice,
  mtrPriceUSD,
  debtAmount,
}) {
  return (
    <div className={DefinedStyles.collateralizePanel}>
      <CollateralizeMetric
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
      <div className={classNames(DefinedStyles.divider, '!my-6')} />

      <CollateralizeMetric
        header="Liquidation Price"
        tooltip="This is the price of the collateral asset at which the collaterals will be liquidated."
        content={
          liquidationPrice !== undefined ? (
            <Flasher
              baseColor="#B984FC"
              fromColor="#fff"
              content={formatNumber(liquidationPrice, true)}
            />
          ) : (
            <Skeleton width="50%" />
          )
        }
      />
      <div className={classNames(DefinedStyles.divider, '!my-6')} />
      <CollateralizeMetric
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
      <div className={classNames(DefinedStyles.divider, '!my-6')} />
      <CollateralizeMetric
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
