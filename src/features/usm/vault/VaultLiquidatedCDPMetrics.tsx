import Skeleton from 'react-loading-skeleton';
import { SimpleCurrencyLogo } from '../../../components-ui/CurrencyLogo/SimpleCurrencyLogo';
import { Flasher } from '../../../components-ui/Flasher';
import { useSizeLgDown } from '../../../components-ui/Responsive';
import { classNames, formatNumber } from '../../../functions';
import { DefinedStyles } from '../../../utils/DefinedStyles';
import { VaultCDPMetric } from './VaultCDPMetric';

export function VaultLiquidatedCDPMetrics({
  collateralSymbol,
  liquidationAmount,
  liquidationFee,
  liquidationAMM,
  currentBorrowed,
  horizontal
}) {
  const isViewportLgDown = useSizeLgDown();
  return (
    <div
      className={classNames(
        DefinedStyles.collateralizePanel,
        horizontal &&
          'grid grid-cols-1 xs:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-x-8 gap-y-4 !p-8',
      )}
    >
      <VaultCDPMetric
        preheader={
          <SimpleCurrencyLogo symbol="mtr" size={24} className="rounded-full" />
        }
        className="xl:border-r xl:border-grey xl:pr-8"
        horizontal={horizontal}
        header="Borrowed"
        tooltip="This is the borrowed amount of USM"
        content={
          currentBorrowed !== undefined ? (
            <Flasher
              baseColor="#B984FC"
              fromColor="#fff"
              content={parseFloat(currentBorrowed.toFixed(4)) + ' USM'}
            />
          ) : (
            <Skeleton width="50%" />
          )
        }
      />

      <VaultCDPMetric
        horizontal={horizontal}
        header="Liquidation Amount"
        tooltip="This is the liquidated collateral amount"
        className="xl:border-r xl:border-grey xl:pr-8"
        content={
          liquidationAmount !== undefined ? (
            <Flasher
              baseColor="#fff"
              fromColor="#B984FC"
              content={
                parseFloat(parseFloat(liquidationAmount).toFixed(4)) +  ` ${collateralSymbol}`
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
        header="Liquidation Fee"
        tooltip="This is the liquidation fee of the CDP"
        content={
          liquidationFee !== undefined ? (
            <Flasher
              baseColor="#B984FC"
              fromColor="#fff"
              content={parseFloat(parseFloat(liquidationFee).toFixed(4)) + ` ${collateralSymbol}`}
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
        header="AMM Liquidation Amount"
        tooltip="This is the amount of liquidated collateral sent to the AMM."
        className="xl:pr-8"
        content={
          liquidationAMM !== undefined ? (
            <Flasher
              baseColor="#fff"
              fromColor="#B984FC"
              content={formatNumber(liquidationAMM, true) + ` ${collateralSymbol}`}
            />
          ) : (
            <Skeleton width="50%" />
          )
        }
      />
    </div>
  );
}
