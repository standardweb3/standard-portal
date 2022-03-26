import React from 'react';
import { useActiveWeb3React } from '../../hooks';
import { getBaseCoin } from '../functions/bridge';
import { thousandBit } from '../core/Tools';

interface ReminderType {
  bridgeConfig: any;
  bridgeType?: string | undefined;
  currency: any;
  selectChain: any;
}

function CrossBridge(
  bridgeConfig: any,
  currency: any,
  selectChain: any,
  bridgeType?: string,
) {
  const { chainId } = useActiveWeb3React();
  if (!bridgeConfig || !currency) {
    return <></>;
  }
  const destConfig =
    bridgeConfig &&
    bridgeConfig?.destChains &&
    bridgeConfig?.destChains[selectChain]
      ? bridgeConfig?.destChains[selectChain]
      : {};
  const isSwapfeeon = destConfig?.swapfeeon ? true : false;
  const viewSymbol = getBaseCoin(currency?.symbol, chainId);
  //   const tipType = bridgeType === 'swapout' ? 'redeemTip' : 'mintTip';
  const dFee = Number(destConfig?.SwapFeeRatePerMillion);
  const useDfee =
    destConfig?.MaximumSwapFee === destConfig?.MinimumSwapFee ? 0 : dFee;
  return (
    <div className="text-xs text-grey bg-opaque rounded-20 p-4">
      <dl className="list space-y-1">
        <dt className="font-bold">
          {/* <img src={BulbIcon} alt="" /> */}
          Reminder
        </dt>
        <div className="space-y-1">
          {destConfig?.MaximumSwapFee === destConfig?.MinimumSwapFee ? (
            <dd>
              {`- Crosschain Fee is ${
                isSwapfeeon ? thousandBit(useDfee, 'no') : 0
              }%, Gas fee ${
                isSwapfeeon ? thousandBit(destConfig?.MaximumSwapFee, 'no') : 0
              } ${viewSymbol}`}
            </dd>
          ) : (
            <dd>
              {`- Crosschain Fee is ${
                isSwapfeeon ? thousandBit(useDfee, 'no') : 0
              } %, Minimum Crosschain Fee is ${
                isSwapfeeon ? thousandBit(destConfig?.MinimumSwapFee, 'no') : 0
              } ${viewSymbol}, Maximum Crosschain Fee is ${
                isSwapfeeon ? thousandBit(destConfig?.MaximumSwapFee, 'no') : 0
              } ${viewSymbol}`}
            </dd>
          )}
          <dd>
            {`- Minimum Crosschain Amount is ${thousandBit(
              destConfig?.MinimumSwap,
              'no',
            )} ${viewSymbol}`}
          </dd>
          <dd>
            {`- Maximum Crosschain Amount is ${thousandBit(
              destConfig?.MaximumSwap,
              'no',
            )} ${viewSymbol}`}
          </dd>
          <dd>- Estimated Time of Crosschain Arrival is 10-30 min</dd>
          <dd>
            {`- Crosschain amount larger than ${thousandBit(
              destConfig?.BigValueThreshold,
              'no',
            )} ${viewSymbol} could take up to 12 hours`}
          </dd>
        </div>
      </dl>
    </div>
  );
}

export default function Reminder({
  bridgeConfig,
  bridgeType,
  currency,
  selectChain,
}: ReminderType) {
  return CrossBridge(bridgeConfig, currency, selectChain, bridgeType);
}
