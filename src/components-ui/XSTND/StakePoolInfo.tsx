import { Token } from '@digitalnative/standard-protocol-sdk';
import styled from '@emotion/styled';
import { useMemo } from 'react';
import { classNames, formatNumber, formatPercent } from '../../functions';
import { useXStndInfo } from '../../hooks/stake/useXStndInfo';
import useCurrentBlockTimestamp from '../../hooks/useCurrentBlockTimestamp';
import { useDayData, useStandardPrice } from '../../services/graph';
import { useBarHistories } from '../../services/graph/hooks/bar';
import { CurrencyLogo } from '../CurrencyLogo';
import { ViewportMediumUp } from '../Responsive';

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
  // const [apr, setApr] = useState();
  const { stndBalance, xStndTotalSupply } = useXStndInfo();
  const stndBalanceDecimals = parseFloat(stndBalance?.toExact() ?? '0');
  const xStndTotalSupplyDecimals = parseFloat(
    xStndTotalSupply?.toExact() ?? '0',
  );
  const stndPrice = useStandardPrice();
  const ratio =
    xStndTotalSupplyDecimals === 0
      ? 1
      : stndBalanceDecimals / xStndTotalSupplyDecimals;

  const tvl = formatNumber(stndBalanceDecimals * stndPrice, true);

  const timestamp = useCurrentBlockTimestamp();
  const day = timestamp && Math.floor(timestamp.toNumber() / 86400) * 86400;
  const dayDatas = useDayData({ first: 1, skip: 1 });
  // add first 1 skip 1
  const barHistories = useBarHistories();

  const feeUSD =
    dayDatas && dayDatas[0] && parseFloat(dayDatas[0].volumeUSD) * (0.05 / 3);

  const [barTotalSupply, barRatio] = useMemo(() => {
    if (barHistories && barHistories[0])
      return [
        parseFloat(barHistories[0].xSushiSupply),
        parseFloat(barHistories[0].ratio),
      ];
    return [undefined, undefined];
  }, [barHistories]);

  const apr =
    feeUSD &&
    barTotalSupply &&
    ((feeUSD / barTotalSupply) * 365) / (barRatio * stndPrice);
  // TODO: DROP AND USE SWR HOOKS INSTEAD
  // useEffect(() => {
  //   const fetchData = async () => {
  //     const results = await sushiData.exchange.dayData();
  //     const apr =
  //       (((results[1].volumeUSD * 0.05) / data?.bar?.totalSupply) * 365) /
  //       (data?.bar?.ratio * sushiPrice);

  //     setApr(apr);
  //   };
  //   fetchData();
  // }, [data?.bar?.ratio, data?.bar?.totalSupply, sushiPrice]);
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
      <ViewportMediumUp>
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
                dSTND
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
      </ViewportMediumUp>
      <div className="space-y-3 flex flex-col justify-center h-full">
        <div className="w-full flex justify-between items-center space-x-4">
          <div className="font-bold">
            <span className="text-grey text-lg">Total supply</span>{' '}
            <span className="bg-xstnd bg-clip-text text-transparent text-2xl">
              dSTND
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
        {apr !== undefined && (
          <div className="w-full flex justify-between items-center space-x-2">
            <div className="font-bold">
              <span className="text-grey text-lg">APR</span>
            </div>
            <div className="text-2xl font-bold">{formatPercent(apr ?? 0)} </div>
          </div>
        )}
      </div>
    </StakePoolInfoWrapper>
  );
}
