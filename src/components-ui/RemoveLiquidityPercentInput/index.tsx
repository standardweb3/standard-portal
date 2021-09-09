import { Button } from '../Button';
import PercentInputPanel from '../PercentInputPanel';

export type RemoveLiquidityPercentInputProps = {
  value: string;
  onUserInput: (value: string) => void;
};

const percentages = ['10', '25', '50', '100'];

export function RemoveLiquidityPercentInput({
  value,
  onUserInput,
}: RemoveLiquidityPercentInputProps) {
  return (
    <div className="flex flex-col items-center justify-center space-y-">
      <PercentInputPanel
        value={value}
        onUserInput={onUserInput}
        id="liquidity-percent"
        // className="py-2 px-2 rounded-20 bg-opaque-secondary"
      />
      <div className="flex items-center">
        {percentages.map((percentage) => (
          <Button
            className="py-2 px-3 font-primary"
            type="bordered"
            color="primary"
            onClick={() => {
              onUserInput(percentage);
            }}
          >
            {percentage}%
          </Button>
        ))}
      </div>
    </div>
  );
}
