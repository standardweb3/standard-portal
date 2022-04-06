import Skeleton from 'react-loading-skeleton';
import { SimpleCurrencyLogo } from '../../../components-ui/CurrencyLogo/SimpleCurrencyLogo';
import { Flasher } from '../../../components-ui/Flasher';
import { useSizeLgDown } from '../../../components-ui/Responsive';
import { classNames, formatNumber } from '../../../functions';
import { DefinedStyles } from '../../../utils/DefinedStyles';
import { VaultCDPMetric } from './VaultCDPMetric';

export function VaultCDPMetrics({
  usmPrice,
  debtAmount,
  fee,
  horizontal = false,
  debt,
  currentBorrowed,
}) {
  const isViewportLgDown = useSizeLgDown();
  return (
    <div
      className={classNames(
        DefinedStyles.collateralizePanel,
        horizontal &&
          'grid grid-cols-1 xs:grid-cols-2 md:grid-cols-3 xl:grid-cols-5 gap-x-8 gap-y-4 !p-8',
      )}
    >
      <VaultCDPMetric
        preheader={
          <SimpleCurrencyLogo symbol="mtr" size={24} className="rounded-full" />
        }
        className="xl:border-r xl:border-grey xl:pr-8"
        horizontal={horizontal}
        header="Debt"
        tooltip="This is the total amount of vault's debt"
        content={
          debt !== undefined ? (
            <Flasher
              baseColor="#B984FC"
              fromColor="#fff"
              content={parseFloat(debt.toFixed(4)) + ' USM'}
            />
          ) : (
            <Skeleton width="50%" />
          )
        }
      />

      <VaultCDPMetric
        horizontal={horizontal}
        header="Borrowed"
        tooltip="This is the borrowed amount of USM"
        className="xl:border-r xl:border-grey xl:pr-8"
        content={
          currentBorrowed !== undefined ? (
            <Flasher
              baseColor="#fff"
              fromColor="#B984FC"
              content={
                parseFloat(parseFloat(currentBorrowed).toFixed(4)) + ' USM'
              }
            />
          ) : (
            <Skeleton width="50%" />
          )
        }
      />

      <VaultCDPMetric
        className="xl:border-r xl:border-grey xl:pr-8"
        horizontal={horizontal}
        header="Stability Fee"
        tooltip="This is the accrued stability fee of the CDP"
        content={
          fee !== undefined ? (
            <Flasher
              baseColor="#B984FC"
              fromColor="#fff"
              content={parseFloat(fee.toFixed(4)) + ' USM'}
            />
          ) : (
            <Skeleton width="50%" />
          )
        }
      />

      {/* {!horizontal && (
        <div className={classNames(DefinedStyles.divider, '!my-6')} />
      )}

      <VaultCDPMetric
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
      <VaultCDPMetric
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
       */}
      <VaultCDPMetric
        horizontal={horizontal}
        header="USM Price"
        tooltip="This is the oracle price of USM."
        className="xl:border-r xl:border-grey xl:pr-8"
        content={
          usmPrice !== undefined ? (
            <Flasher
              baseColor="#fff"
              fromColor="#B984FC"
              content={formatNumber(usmPrice, true)}
            />
          ) : (
            <Skeleton width="50%" />
          )
        }
      />
      <VaultCDPMetric
        className="xl:pr-8"
        horizontal={horizontal}
        header="Market Debt Value"
        tooltip="This is the rounded market value of borrowed USM."
        content={
          usmPrice !== undefined ? (
            <Flasher
              baseColor="#fff"
              fromColor="#B984FC"
              content={formatNumber(usmPrice * parseFloat(debtAmount), true)}
            />
          ) : (
            <Skeleton width="50%" />
          )
        }
      />
    </div>
  );
}
