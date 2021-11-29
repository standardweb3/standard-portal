import { useRouter } from 'next/router';
import Head from 'next/head';

import { PairType } from '../../features/farm/enum';
import { usePositions } from '../../features/farm/hooks';
import { useActiveWeb3React, useFuse } from '../../hooks';

import {
  useAverageBlockTime,
  useEthPrice,
  useExchangeAvailability,
  useFarmPairAddresses,
  useFarms,
  useMasterChefV2Availability,
  useMasterChefV2SushiPerBlock,
  useStandardPrice,
  useSushiPairs,
} from '../../services/graph';
import { Page } from '../../components-ui/Page';
import { PageHeader } from '../../components-ui/PageHeader';
import { PageContent } from '../../components-ui/PageContent';
import { classNames } from '../../functions';
import Menu from '../../features/farm/FarmMenu';
import { Search } from '../../components-ui/Search';
import FarmList from '../../features/farm/FarmList';
import { DefinedStyles } from '../../utils/DefinedStyles';
import {
  ViewportMediumUp,
  ViewportSmallDown,
} from '../../components-ui/Responsive';
import { AVERAGE_BLOCK_TIME_IN_SECS } from '../../constants';
import { WavySpinner } from '../../components-ui/Spinner/WavySpinner';
import { NetworkGuardWrapper } from '../../guards/Network';
import { NORMAL_GUARDED_CHAINS } from '../../constants/networks';
import { ChainId } from '@digitalnative/standard-protocol-sdk';

function Farm() {
  const router = useRouter();
  useExchangeAvailability(() => router.push('/farmv2'));
  useMasterChefV2Availability(() => router.push('/farmv2'));

  const { chainId } = useActiveWeb3React();

  const type =
    router.query.filter == null ? 'all' : (router.query.filter as string);

  const pairAddresses = useFarmPairAddresses();

  const swapPairs = useSushiPairs({
    where: {
      id_in: pairAddresses,
    },
  });

  const farms = useFarms();

  const positions = usePositions();
  const ethPrice = useEthPrice();

  const [stndPrice] = [useStandardPrice()];
  const averageBlockTime = useAverageBlockTime();

  const _averageBlockTime =
    typeof averageBlockTime == 'number'
      ? averageBlockTime !== 0
        ? averageBlockTime
        : AVERAGE_BLOCK_TIME_IN_SECS[chainId]
      : averageBlockTime && averageBlockTime?.averageBlockTime !== 0
      ? averageBlockTime?.averageBlockTime
      : AVERAGE_BLOCK_TIME_IN_SECS[chainId];
  // const masterChefV2TotalAllocPoint = useMasterChefV2TotalAllocPoint();
  const masterChefV2SushiPerBlock = useMasterChefV2SushiPerBlock();
  const blocksPerDay = 86400 / _averageBlockTime;

  const map = (pool) => {
    console.log(pool);
    // TODO: Account for fees generated in case of swap pairs, and use standard compounding
    // algorithm with the same intervals acrosss chains to account for consistency.
    // For lending pairs, what should the equivilent for fees generated? Interest gained?
    // How can we include this?

    // TODO: Deal with inconsistencies between properties on subgraph
    pool.owner = pool?.masterChef;
    pool.balance = pool?.slpBalance;

    const swapPair = swapPairs?.find((pair) => pair.id === pool.pair);

    const type = PairType.SWAP;

    const pair = swapPair;

    const blocksPerHour = 3600 / _averageBlockTime;
    function getRewards() {
      // TODO: Some subgraphs give sushiPerBlock & sushiPerSecond, and mcv2 gives nothing
      const sushiPerBlock =
        pool?.owner?.sushiPerBlock / 1e18 ||
        (pool?.owner?.sushiPerSecond / 1e18) * _averageBlockTime ||
        masterChefV2SushiPerBlock;

      const rewardPerBlock =
        (pool.allocPoint / pool.owner.totalAllocPoint) * sushiPerBlock;
      const defaultReward = {
        token: 'STND',
        icon:
          'https://raw.githubusercontent.com/digitalnativeinc/assets/master/blockchains/ethereum/assets/0x9040e237C3bF18347bb00957Dc22167D0f2b999d/logo.png',
        rewardPerBlock,
        rewardPerDay: rewardPerBlock * blocksPerDay,
        rewardPrice: stndPrice, // change to sushiprice
      };

      const defaultRewards = [defaultReward];

      return defaultRewards;
    }
    const rewards = getRewards();

    const balance = Number(pool.balance / 1e10 / 1e8);
    const farmShare = balance / Number(swapPair.totalSupply);
    const tvl =
      chainId === ChainId.METIS
        ? 0.4 * Number(swapPair.reserveETH) * Number(ethPrice)
        : farmShare * Number(swapPair.reserveETH) * Number(ethPrice);

    const roiPerBlock =
      rewards.reduce((previousValue, currentValue) => {
        return (
          previousValue + currentValue.rewardPerBlock * currentValue.rewardPrice
        );
      }, 0) / (tvl > 0 ? tvl : 1);

    const roiPerHour = roiPerBlock * blocksPerHour;

    const roiPerDay = roiPerHour * 24;

    const roiPerMonth = roiPerDay * 30;

    const roiPerYear = roiPerMonth * 12;

    const position = positions.find(
      (position) => position.id === pool.id && position.chef === pool.chef,
    );

    return {
      ...pool,
      ...position,
      share: farmShare,
      pair: {
        ...pair,
        decimals: 18,
        type,
        symbol: `${pair.token0.symbol}/${pair.token1.symbol}`,
        name: 'Standard LTR Token',
      },
      balance,
      roiPerBlock,
      roiPerHour,
      roiPerDay,
      roiPerMonth,
      roiPerYear,
      rewards,
      tvl,
    };
  };

  const FILTER = {
    all: (farm) => farm.allocPoint !== '0',
    portfolio: (farm) => farm?.amount && !farm.amount.isZero(),
  };

  const data = farms
    .filter((farm) => {
      return swapPairs && swapPairs.find((pair) => pair.id === farm.pair);
    })
    .map(map)
    .filter((farm) => {
      return type in FILTER ? FILTER[type](farm) : true;
    });

  const options = {
    keys: ['pair.id', 'pair.token0.symbol', 'pair.token1.symbol'],
    threshold: 0.4,
  };

  const { result, term, search } = useFuse({
    data,
    options,
  });

  return (
    <>
      <Head>
        <title>FARM | Standard Protocol</title>
        <meta
          key="description"
          name="description"
          content="Farms of the Standard Protocol AMM to enable gas optimised and low slippage trades across countless networks"
        />
      </Head>
      <Page id="farm-page" className={DefinedStyles.page}>
        <ViewportMediumUp>
          <PageHeader title="Farm" />
        </ViewportMediumUp>
        <PageContent>
          <div
            className="
            w-full
          "
          >
            <ViewportSmallDown>
              <div className="w-full mb-8">
                <Menu positionsLength={positions.length} />
              </div>
            </ViewportSmallDown>
            <div
              className="
              p-0 md:p-5
              rounded-20 
              bg-transparent md:bg-opaque"
            >
              <ViewportMediumUp>
                <div className="mb-6">
                  <Menu positionsLength={positions.length} />
                </div>
              </ViewportMediumUp>
              <div className={classNames('space-y-6 col-span-4 lg:col-span-3')}>
                <Search
                  search={search}
                  term={term}
                  inputProps={{
                    className: `
                    relative w-full
                    bg-transparent
                    bg-opaque 
                    rounded-20
                    border border-transparent
                    focus:border-primary
                    font-bold text-base px-6 py-3.5`,
                  }}
                />

                {/* <div className="flex items-center text-lg font-bold text-high-emphesis whitespace-nowrap">
            Ready to Stake{' '}
            <div className="w-full h-0 ml-4 font-bold bg-transparent border border-b-0 border-transparent rounded text-high-emphesis md:border-gradient-r-blue-pink-dark-800 opacity-20"></div>
          </div>
          <FarmList farms={filtered} term={term} /> */}

                <div className="flex items-center text-lg font-bold text-high-emphesis whitespace-nowrap">
                  <div className="w-full h-0 ml-4 font-bold bg-transparent border border-b-0 border-transparent rounded text-high-emphesis md:border-gradient-r-blue-pink-dark-800 opacity-20"></div>
                </div>
                {farms.length === 0 ? (
                  <div className="text-center space-y-2">
                    <WavySpinner className="bg-text" />
                    <div className="text-sm">Loading Farms...</div>
                  </div>
                ) : (
                  <FarmList farms={result} term={term} />
                )}
              </div>
            </div>
          </div>
        </PageContent>
      </Page>
    </>
  );
}
Farm.Guard = NetworkGuardWrapper(NORMAL_GUARDED_CHAINS);
export default Farm;
