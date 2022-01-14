import { Token } from '@digitalnative/standard-protocol-sdk';
import { formatNumber } from '../../functions';
import { CurrencyLogo } from '../../components-ui/CurrencyLogo';

export type EstimatedXStndTypes = {
  stnd: Token;
  estimate: number;
  currentStaked: number;
  newStaked: number;
};

export function EstimatedXStnd({ stnd, estimate, currentStaked, newStaked }) {
  const formattedNewStaked = formatNumber(newStaked);

  return (
    <div
      className="
        flex flex-col md:flex-row
        justify-center items-center 
        space-x-0 md:space-x-4 
        space-y-4 md:space-y-0 

        bg-transparent
        p-4"
    >
      <div className="flex space-x-4">
        <CurrencyLogo size={84} currency={stnd} className="rounded-full" />

        <div>
          <div className="text-base md:text-lg flex items-end space-x-1">
            <div>Estimated</div>
            <div className="bg-xstnd bg-clip-text text-transparent">
              <span className="text-2xl font-bold">dSTND</span>
              <span className="text-xs"> per day</span>
            </div>
          </div>
          <div className="font-bold text-3xl">{formatNumber(estimate)}</div>
        </div>
      </div>
      <div
        className="
        flex
        flex-col
        items-end
        text-sm
        "
      >
        <div className="flex items-center space-x-1">
          <div className="font">Currently Staked:</div>
          <div className="font-bold">{formatNumber(currentStaked)} STND</div>
        </div>

        <div className="flex items-center space-x-1">
          <div className="font">Newly Staked:</div>
          <div className="font-bold">
            {formattedNewStaked !== 'NaNt' ? formattedNewStaked : 'Too much'}{' '}
            STND
          </div>
        </div>
      </div>
    </div>
  );
}
