import { Input as PercentInput } from '../PercentInput';
import React from 'react';
import { classNames } from '../../functions';

interface PercentInputPanelProps {
  value: string;
  onUserInput: (value: string) => void;
  id: string;
  className?: string;
}

export default function PercentInputPanel({
  value,
  onUserInput,
  id,
  className,
}: PercentInputPanelProps) {
  return (
    <div id={id} className={className}>
      <div className="flex flex-col justify-between space-y-3 sm:space-y-0 sm:flex-row">
        {/* <div
          className="w-full text-white sm:w-2/5"
          style={{ margin: 'auto 0px' }}
        >
          Amount to Remove
        </div> */}
        <div className="flex items-center w-full px-3 py-2 space-x-3 text-xl font-bold rounded-xl sm:w-3/5">
          <PercentInput
            className="token-amount-input"
            value={value}
            onUserInput={(val) => {
              onUserInput(val);
            }}
            align="right"
          />
          <div className="pl-2 text-xl font-bold">%</div>
        </div>
      </div>
    </div>
  );
}
