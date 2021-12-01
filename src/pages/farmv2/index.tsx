import { useRouter } from 'next/router';
import { useMasterPoolPairsWithReserves } from '../../state/user/hooks';
import Head from 'next/head';
import { Page } from '../../components-ui/Page';
import {
  ViewportMediumUp,
  ViewportSmallDown,
} from '../../components-ui/Responsive';
import { DefinedStyles } from '../../utils/DefinedStyles';
import { PageHeader } from '../../components-ui/PageHeader';
import { PageContent } from '../../components-ui/PageContent';
import Menu from '../../features/farm/FarmMenu';
import { classNames } from '../../functions';
import FarmListV2 from '../../features/farm/FarmListV2';
import { useMasterChefInfo } from '../../features/farm/useMasterChef';
import { BigNumber } from 'ethers';
import { NORMAL_GUARDED_CHAINS } from '../../constants/networks';
import { NetworkGuardWrapper } from '../../guards/Network';
import { AVERAGE_BLOCK_TIME_IN_SECS } from '../../constants';
import { useActiveWeb3React } from '../../hooks';

function Farmbare() {
  const router = useRouter();
  const { chainId } = useActiveWeb3React();

  const { totalAllocPoint, sushiPerBlock } = useMasterChefInfo();
  // const type =
  //   router.query.filter == null ? 'all' : (router.query.filter as string);
  const {
    poolsWithReserves,
    // next,
    // current,
    // loading,
    // last,
  } = useMasterPoolPairsWithReserves(10);

  const defaultReward = {
    token: 'STND',
    icon:
      'https://raw.githubusercontent.com/digitalnativeinc/assets/master/blockchains/ethereum/assets/0x9040e237C3bF18347bb00957Dc22167D0f2b999d/logo.png',
  };
  const sushiPerBlockDecimals =
    sushiPerBlock &&
    totalAllocPoint &&
    sushiPerBlock.div(BigNumber.from(String(1e16))).toNumber() / 100;

  const poolsWithAllocation = poolsWithReserves.map((pool) => {
    if (sushiPerBlockDecimals) {
      const rewardPerBlock =
        (sushiPerBlockDecimals * pool.allocPoint.toNumber()) /
        totalAllocPoint.toNumber();
      return { ...pool, rewards: [{ ...defaultReward, rewardPerBlock }] };
    }
    return { ...pool, rewards: null };
  });

  //   const { result, term, search } = useFuse({
  //     data,
  //     options,
  //   });

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
            w-full py-4
          "
          >
            <ViewportSmallDown>
              <div className="w-full mb-8">
                <Menu positionsLength={0} />
              </div>
            </ViewportSmallDown>
            <div
              className="
              p-0 md:p-4
              rounded-20 
              bg-transparent md:bg-opaque"
            >
              <ViewportMediumUp>
                <div className="mb-6">
                  <Menu positionsLength={0} />
                </div>
              </ViewportMediumUp>
              <div className={classNames('space-y-6 col-span-4 lg:col-span-3')}>
                {/* <div className="flex items-center text-lg font-bold text-high-emphesis whitespace-nowrap">
            Ready to Stake{' '}
            <div className="w-full h-0 ml-4 font-bold bg-transparent border border-b-0 border-transparent rounded text-high-emphesis md:border-gradient-r-blue-pink-dark-800 opacity-20"></div>
          </div>
          <FarmList farms={filtered} term={term} /> */}
                <div>
                  <div className="text-grey">
                    Average Blocks per day:{' '}
                    {Math.floor(86400 / AVERAGE_BLOCK_TIME_IN_SECS[chainId])}{' '}
                  </div>
                  <div className="text-grey">
                    Estimated STND farmed in a day:{' '}
                    {sushiPerBlockDecimals
                      ? Math.floor(
                          86400 / AVERAGE_BLOCK_TIME_IN_SECS[chainId],
                        ) * sushiPerBlockDecimals
                      : 'Calculating...'}
                  </div>
                </div>

                <FarmListV2 farms={poolsWithAllocation} />
              </div>
            </div>
          </div>
        </PageContent>
      </Page>
    </>
  );
}

Farmbare.Guard = NetworkGuardWrapper(NORMAL_GUARDED_CHAINS);
export default Farmbare;
