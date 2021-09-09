import { Input as PercentInput } from '../PercentInput';
import React from 'react';
import { classNames } from '../../functions';
import { Button } from '../Button';

interface PercentInputPanelProps {
  value: string;
  onUserInput: (value: string) => void;
  id: string;
  className?: string;
  preset?: boolean;
}

const presetPercentages = ['10', '25', '50', '100'];

export default function PercentInputPanel({
  value,
  onUserInput,
  id,
  className,
  preset,
}: PercentInputPanelProps) {
  const renderPreset = () => {
    return presetPercentages.map((percent) => {
      return (
        <Button
          type="bordered"
          color="primary"
          key="percent"
          className="px-3 py-2"
          onClick={() => onUserInput(percent)}
        >
          {percent}%
        </Button>
      );
    });
  };

  return (
    <div id={id} className={className}>
      <div
        className="
        flex flex-col justify-between items-center 
        space-y-3"
      >
        <div
          className="
          flex items-center justify-center
          bg-opqaue 
          px-16 py-3
          text-xl font-bold 
          bg-opaque
          rounded-20"
        >
          <PercentInput
            className="token-amount-input w-[50px]"
            value={value}
            onUserInput={(val) => {
              onUserInput(val);
            }}
            align="right"
          />
          <div className="pl-2 text-xl font-bold">%</div>
        </div>
        {preset && (
          <div className="flex items-center space-x-2">{renderPreset()}</div>
        )}
      </div>
    </div>
  );
}
