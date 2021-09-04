import React from 'react';

function TradeSummary() {
  return (
    <>
      <div style={{ padding: '0 16px' }} className="text-sm">
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <div className="text-secondary">Your Pool Tokens</div>
          </div>
          <div className="flex items-center">
            <div className="text-white">
              1.576 →&nbsp;
              <span className="text-green">1.787 ETH/SUSHI SLP</span>
            </div>
          </div>
        </div>
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <div className="text-secondary">Your Pool Share</div>
          </div>
          <div className="flex items-center">
            <div className="text-white">
              &lt; 0.01% →&nbsp;
              <span className="text-green">0.01%</span>
            </div>
          </div>
        </div>
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <div className="text-secondary">Liquidity Provider Fee</div>
          </div>
          <div className="flex items-center">
            <div className="text-white">0.00283 ETH</div>
          </div>
        </div>
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <div className="text-secondary">Network Fee</div>
          </div>
          <div className="flex items-center">
            <div className="text-white">0.008654 ETH</div>
          </div>
        </div>
      </div>
    </>
  );
}

export interface AdvancedLiquidityDetailsProps {
  show?: boolean;
}

export function AdvancedLiquidityDetails() {
  return (
    <div>
      <TradeSummary />
    </div>
  );
}

export default AdvancedLiquidityDetails;
