import { useCurrency } from '../../../hooks/Tokens';
import Chart from '../../../components-ui/Chart/pairChart';
import { CandlePeriod } from '../../../types/Candle';

type UsmPairCardType = {
  inputAddress?: string;
  outputAddress?: string;
};

export default function UsmPairCard({
  inputAddress,
  outputAddress,
}: UsmPairCardType) {
  const inputCurrency = useCurrency(inputAddress);
  const outputCurrency = useCurrency(outputAddress);
  return (
    <div
      className="
      bg-background
      p-8
      rounded-20"
    >
      <Chart
        inputCurrency={inputCurrency}
        outputCurrency={outputCurrency}
        initialCandlePeriod={CandlePeriod.OneDay}
      />
    </div>
  );
}
