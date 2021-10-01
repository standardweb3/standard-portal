import { useRouter } from 'next/router';
import Head from 'next/head';

import { PairType } from '../../features/farm/enum';
import { usePositions } from '../../features/farm/hooks';
import { useActiveWeb3React, useFuse } from '../../hooks';

import {
  useAverageBlockTime,
  useEthPrice,
  useFarmPairAddresses,
  useFarms,
  useMasterChefV2SushiPerBlock,
  useMasterChefV2TotalAllocPoint,
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
import { Typographies } from '../../utils/Typography';
import {
  ViewportMediumUp,
  ViewportSmallDown,
} from '../../components-ui/Responsive';

export default function Farm() {
  const { chainId } = useActiveWeb3React();

  const router = useRouter();

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

  const [ethPrice, stndPrice] = [useEthPrice(), useStandardPrice()];
  const averageBlockTime = useAverageBlockTime();

  const masterChefV2TotalAllocPoint = useMasterChefV2TotalAllocPoint();
  const masterChefV2SushiPerBlock = useMasterChefV2SushiPerBlock();

  const blocksPerDay = 86400 / Number(averageBlockTime);

  const map = (pool) => {
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

    const blocksPerHour = 3600 / averageBlockTime;

    function getRewards() {
      // TODO: Some subgraphs give sushiPerBlock & sushiPerSecond, and mcv2 gives nothing
      const sushiPerBlock =
        pool?.owner?.sushiPerBlock / 1e18 ||
        (pool?.owner?.sushiPerSecond / 1e18) * averageBlockTime ||
        masterChefV2SushiPerBlock;

      const rewardPerBlock =
        (pool.allocPoint / pool.owner.totalAllocPoint) * sushiPerBlock;
      const defaultReward = {
        token: 'STND',
        icon:
          'https://raw.githubusercontent.com/sushiswap/assets/master/blockchains/ethereum/assets/0x9040e237C3bF18347bb00957Dc22167D0f2b999d/logo.png',
        rewardPerBlock,
        rewardPerDay: rewardPerBlock * blocksPerDay,
        rewardPrice: stndPrice, // change to sushiprice
      };

      const defaultRewards = [defaultReward];

      //   if (pool.chef === Chef.MASTERCHEF_V2) {
      //     // override for mcv2...
      //     pool.owner.totalAllocPoint = masterChefV2TotalAllocPoint

      //     const icon = ['0', '3', '4', '8'].includes(pool.id)
      //       ? `https://raw.githubusercontent.com/sushiswap/icons/master/token/${pool.rewardToken.symbol.toLowerCase()}.jpg`
      //       : `https://raw.githubusercontent.com/sushiswap/assets/master/blockchains/ethereum/assets/${getAddress(
      //           pool.rewarder.rewardToken
      //         )}/logo.png`

      //     const decimals = 10 ** pool.rewardToken.decimals

      //     const rewardPerBlock =
      //       pool.rewardToken.symbol === 'ALCX'
      //         ? pool.rewarder.rewardPerSecond / decimals
      //         : (pool.rewarder.rewardPerSecond / decimals) * averageBlockTime

      //     const rewardPerDay =
      //       pool.rewardToken.symbol === 'ALCX'
      //         ? (pool.rewarder.rewardPerSecond / decimals) * blocksPerDay
      //         : (pool.rewarder.rewardPerSecond / decimals) * averageBlockTime * blocksPerDay

      //     const reward = {
      //       token: pool.rewardToken.symbol,
      //       icon: icon,
      //       rewardPerBlock: rewardPerBlock,
      //       rewardPerDay: rewardPerDay,
      //       rewardPrice: pool.rewardToken.derivedETH * ethPrice,
      //     }

      //     return [...defaultRewards, reward]
      //   } else if (pool.chef === Chef.MINICHEF) {
      //     const sushiPerSecond = ((pool.allocPoint / pool.miniChef.totalAllocPoint) * pool.miniChef.sushiPerSecond) / 1e18
      //     const sushiPerBlock = sushiPerSecond * averageBlockTime
      //     const sushiPerDay = sushiPerBlock * blocksPerDay
      //     const rewardPerSecond =
      //       ((pool.allocPoint / pool.miniChef.totalAllocPoint) * pool.rewarder.rewardPerSecond) / 1e18
      //     const rewardPerBlock = rewardPerSecond * averageBlockTime
      //     const rewardPerDay = rewardPerBlock * blocksPerDay

      //     const reward = {
      //       [ChainId.MATIC]: {
      //         token: 'MATIC',
      //         icon: 'https://raw.githubusercontent.com/sushiswap/icons/master/token/polygon.jpg',
      //         rewardPrice: maticPrice,
      //       },
      //       [ChainId.XDAI]: {
      //         token: 'STAKE',
      //         icon: 'https://raw.githubusercontent.com/sushiswap/icons/master/token/stake.jpg',
      //         rewardPrice: stakePrice,
      //       },
      //       [ChainId.HARMONY]: {
      //         token: 'ONE',
      //         icon: 'https://raw.githubusercontent.com/sushiswap/icons/master/token/one.jpg',
      //         rewardPrice: onePrice,
      //       },
      //     }

      //     return [
      //       {
      //         ...defaultReward,
      //         rewardPerBlock: sushiPerBlock,
      //         rewardPerDay: sushiPerDay,
      //       },
      //       {
      //         ...reward[chainId],
      //         rewardPerBlock: rewardPerBlock,
      //         rewardPerDay: rewardPerDay,
      //       },
      //     ]
      //   }
      return defaultRewards;
    }
    const rewards = getRewards();

    const balance = Number(pool.balance / 1e18);

    const tvl = Number(swapPair.reserveUSD);
    //   (balance / Number(swapPair.totalSupply)) * Number(swapPair.reserveUSD);

    const roiPerBlock =
      rewards.reduce((previousValue, currentValue) => {
        return (
          previousValue + currentValue.rewardPerBlock * currentValue.rewardPrice
        );
      }, 0) / tvl;

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
      pair: {
        ...pair,
        decimals:
          pair.type === PairType.KASHI
            ? Number(pair.asset.tokenInfo.decimals)
            : 18,
        type,
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
    // sushi: (farm) => farm.pair.type === PairType.SWAP && farm.allocPoint !== '0',
    // 'standaard': (farm) => (farm.chef === Chef.MASTERCHEF_V2 || farm.chef === Chef.MINICHEF) && farm.allocPoint !== '0',
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

  // console.log({ data })

  const { result, term, search } = useFuse({
    data,
    options,
  });

  return (
    <>
      <Head>
        <title>FARM | Standard Protcol</title>
        <meta
          key="description"
          name="description"
          content="Farms of the Standard Protcol AMM to enable gas optimised and low slippage trades across countless networks"
        />
      </Head>
      <Page id="farm-page" className={Typographies.page}>
        <ViewportMediumUp>
          <PageHeader title="Farm" />
        </ViewportMediumUp>
        <PageContent>
          <div
            className="
            w-full py-4 lg:p-8
          "
          >
            <ViewportSmallDown>
              <div className="w-full mb-8">
                <Menu positionsLength={positions.length} />
              </div>
            </ViewportSmallDown>
            <div
              className="
              p-0 md:p-8 
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

                <FarmList farms={result} term={term} />
              </div>
            </div>
          </div>
        </PageContent>
      </Page>
    </>
  );
}
