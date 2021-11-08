import { Token } from '@digitalnative/standard-protocol-sdk';
import styled from '@emotion/styled';
import { formatNumber } from '../../functions';
import { CurrencyLogo } from '../CurrencyLogo';

export const EstimateXStndWrapper = styled.div`
  @media only screen and (min-width: 640px) {
    background-repeat: no-repeat;
    background-image: url('/img/bg-bond.png');
    background-position: top 20px right 20px;
  }
`;
export type EstimatedXStndTypes = {
  stnd: Token;
  estimate: number;
  currentStaked: number;
  newStaked: number;
};

export function EstimatedXStnd({ stnd, estimate, currentStaked, newStaked }) {
  const formattedNewStaked = formatNumber(newStaked);

  return (
    <EstimateXStndWrapper
      className="
        flex flex-col md:flex-row justify-center items-center 
        space-x-0 md:space-x-4 
        space-y-4 md:space-y-0
        bg-background-bond 
        rounded-20 p-4"
    >
      <div className="space-y-2">
        <div className="font-bold text-base md:text-xl text-green">
          Estimated xSTND per day
        </div>
        <div className="flex justify-center md:justify-start items-center space-x-2">
          <CurrencyLogo size={52} currency={stnd} className="rounded-full" />
          <div>{formatNumber(estimate)} xSTND</div>
        </div>
      </div>
      <div
        className="
        flex items-center 
        text-xs md:text-sm
        space-x-2 md:space-x-0
        md:block md:space-y-2"
      >
        <div className="text-center md:text-left">
          <div className="font-bold">Current Staked</div>
          <div>{formatNumber(currentStaked)} STND</div>
        </div>

        <div className="text-center md:text-left">
          <div className="font-bold">New Staked</div>
          <div>
            {formattedNewStaked !== 'NaNt' ? formattedNewStaked : 'Too much'}{' '}
            STND
          </div>
        </div>
      </div>
    </EstimateXStndWrapper>
  );
}
