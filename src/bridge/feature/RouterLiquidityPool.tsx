import React from 'react';
import Image from '../../components-ui/Image';
import { thousandBit } from '../core/Tools';

interface RouterLiquidityPoolProps {
  curChain: any;
  destChain: any;
  isUnderlying: any;
  isDestUnderlying: any;
  isViewAll?: any;
  curChainInfo: any;
  destChainInfo: any;
}

export default function RouterLiquidityPool({
  curChainInfo,
  destChainInfo,
  curChain,
  destChain,
  isUnderlying,
  isDestUnderlying,
  isViewAll,
}: RouterLiquidityPoolProps) {
  // console.log(destChain)
  return (
    <>
      <div className="flex justify-center items-center space-x-3 bg-opaque rounded-20 px-3 py-2">
        <div className="font-bold">Pool: </div>
        {curChain && (isUnderlying || isViewAll) ? (
          <div className="flex items-center space-x-2">
            <div className="flex items-center space-x-4">
              <Image
                src={curChainInfo.icon}
                width="30px"
                height="30px"
                className="rounded-full"
              />
              <div>{curChainInfo.name}</div>
            </div>
            <div className="cont">
              {curChain.ts ? thousandBit(curChain.ts, 2) : '0.00'}
            </div>
          </div>
        ) : (
          ''
        )}
        {destChain && (isDestUnderlying || isViewAll) ? (
          <div className="flex items-center space-x-2">
            <div className="flex items-center space-x-4">
              <Image
                src={destChainInfo.icon}
                width="30px"
                height="30px"
                className="rounded-full"
              />
              <div>{destChainInfo.name}</div>
            </div>
            <span className="cont">
              {destChain.ts ? thousandBit(destChain.ts, 2) : '0.00'}
            </span>
          </div>
        ) : (
          ''
        )}
      </div>
    </>
  );
}
