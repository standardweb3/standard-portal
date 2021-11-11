import { CurrencyAmount, Token } from '@digitalnative/standard-protocol-sdk';
import styled from '@emotion/styled';
import { classNames, formatNumber, formatPercent } from '../../functions';
import { useXStndInfo } from '../../hooks/stake/useXStndInfo';
import { useStandardPrice } from '../../services/graph';
import { CurrencyLogo } from '../CurrencyLogo';

export const StakePoolInfoWrapper = styled.div`
  background-repeat: no-repeat;
  // background-image: url('/img/bg-bond.png');
  // background-position: top 50px left -30px;
  position: relative;
  overflow: hidden;

  &:before {
    content: '';
    position: absolute;
    width: 300px;
    height: 300px;
    z-index: -1;
    top: -12px;
    left: 5px;
    background-repeat: no-repeat;
    background-image: url('/img/bg-bond.png');

    -webkit-transform: rotate(-34.72deg);
    -moz-transform: rotate(-34.72deg);
    -ms-transform: rotate(-34.72deg);
    -o-transform: rotate(-34.72deg);
    transform: rotate(-34.72deg);
  }
`;

export type StakePoolInfoTypes = {
  stnd: Token;
  xStnd: Token;
  className?: string;
};

export function StakePoolInfo({ stnd, xStnd, className }: StakePoolInfoTypes) {
  const { stndBalance, xStndTotalSupply } = useXStndInfo();
  const stndBalanceDecimals = parseFloat(stndBalance?.toExact() ?? '0');
  const xStndTotalSupplyDecimals = parseFloat(
    xStndTotalSupply?.toExact() ?? '0',
  );
  const stndPrice = useStandardPrice();
  const ratio =
    stndBalanceDecimals /
    (xStndTotalSupplyDecimals === 0 ? 1 : xStndTotalSupplyDecimals);

  const tvl = formatNumber(stndBalanceDecimals * stndPrice, true);
  return (
    <StakePoolInfoWrapper
      className={classNames(
        `w-full
        flex flex-col justify-start items-center
        bg-opaque p-5 rounded-20`,
        className,
      )}
    >
      <div className="flex text-center font-bold mt-2 mb-4">Stats</div>

      <div
        className="
        flex items-center 
        space-x-2 
        rounded-20 border border-primary px-4 py-2
        mb-4"
      >
        <div className="flex items-center space-x-2">
          <CurrencyLogo currency={xStnd} className="rounded-full" size={24} />
          <div className="font-bold">
            1{' '}
            <span className="bg-xstnd bg-clip-text text-transparent">
              xSTND
            </span>
          </div>
        </div>
        <div>=</div>
        <div className="flex items-center space-x-2">
          <CurrencyLogo currency={stnd} className="rounded-full" size={24} />
          <div className="font-bold">
            {ratio} <span className="text-primary">STND</span>
          </div>
        </div>
      </div>
      <div className="space-y-3 flex flex-col justify-center h-full">
        <div className="w-full flex justify-between items-center space-x-4">
          <div className="font-bold">
            <span className="text-grey text-lg">Total supply</span>{' '}
            <span className="bg-xstnd bg-clip-text text-transparent text-2xl">
              xSTND
            </span>
          </div>
          <div className="text-2xl font-bold">
            {formatNumber(parseFloat(xStndTotalSupply?.toExact() ?? '0'))}
          </div>
        </div>
        <div className="w-full flex justify-between items-center space-x-2">
          <div className="font-bold">
            <span className="text-grey text-lg">Total staked</span>{' '}
            <span className="text-primary text-2xl">STND</span>
          </div>
          <div className="text-2xl font-bold">
            {formatNumber(parseFloat(stndBalance?.toExact() ?? '0'))}{' '}
          </div>
        </div>
        <div className="w-full flex justify-between items-center space-x-2">
          <div className="font-bold">
            <span className="text-grey text-lg">TVL</span>
          </div>
          <div className="text-2xl font-bold">{tvl} </div>
        </div>
        {/* <div className="w-full flex justify-between items-center space-x-2">
          <div className="font-bold">
            <span className="text-grey text-lg">APY</span>
          </div>
          <div className="text-2xl font-bold">
            {formatPercent(parseFloat(stakePoolStndTotal?.toExact() ?? '0'))}{' '}
          </div>
        </div> */}
      </div>
    </StakePoolInfoWrapper>
  );
}
