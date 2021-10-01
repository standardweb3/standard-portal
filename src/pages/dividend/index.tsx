import { Pair } from '@digitalnative/standard-protocol-sdk-test';
import React, { useCallback, useMemo } from 'react';
import { classNames } from '../../functions';
import {
  toV2LiquidityToken,
  useTrackedTokenPairs,
} from '../../state/user/hooks';
import { Image } from '../../components-ui/Image';

import { Alert } from '../../components-ui/Alert';
import Head from 'next/head';
import { MigrationSupported } from '../../features/migration';
import { useActiveWeb3React } from '../../hooks/useActiveWeb3React';
import { useETHBalances } from '../../state/wallet/hooks';
import { useRouter } from 'next/router';
import { useTokenBalancesWithLoadingIndicator } from '../../state/wallet/hooks';
import { useV2Pairs } from '../../hooks/useV2Pairs';
import { Page } from '../../components-ui/Page';
import { PageHeader } from '../../components-ui/PageHeader';
import { PageContent } from '../../components-ui/PageContent';
import { useProtocol } from '../../state/protocol/hooks';
import { Typographies } from '../../utils/Typography';
import {
  ViewportLargeUp,
  ViewportMedium,
  ViewportMediumUp,
  ViewportSmall,
  ViewportXSmall,
} from '../../components-ui/Responsive';
import { DividendProgressBar } from '../../components-ui/CircularProgressBar/DividendProgressBar';
import { Button } from '../../components-ui/Button';
import { DividendPercentage } from '../../components-ui/Dividend/DividendPercentage';

export default function Dividend() {
  const router = useRouter();
  const { account, chainId } = useActiveWeb3React();
  const protocol = useProtocol();

  const userEthBalance = useETHBalances(account ? [account] : [])?.[
    account ?? ''
  ];

  // fetch the user's balances of all tracked V2 LP tokens
  const trackedTokenPairs = useTrackedTokenPairs();
  const tokenPairsWithLiquidityTokens = useMemo(
    () =>
      trackedTokenPairs.map((tokens) => ({
        liquidityToken: toV2LiquidityToken({ tokens, protocol }),
        tokens,
      })),
    [trackedTokenPairs],
  );
  const liquidityTokens = useMemo(
    () => tokenPairsWithLiquidityTokens.map((tpwlt) => tpwlt.liquidityToken),
    [tokenPairsWithLiquidityTokens],
  );
  const [
    v2PairsBalances,
    fetchingV2PairBalances,
  ] = useTokenBalancesWithLoadingIndicator(
    account ?? undefined,
    liquidityTokens,
  );

  // fetch the reserves for all V2 pools in which the user has a balance
  const liquidityTokensWithBalances = useMemo(
    () =>
      tokenPairsWithLiquidityTokens.filter(({ liquidityToken }) =>
        v2PairsBalances[liquidityToken.address]?.greaterThan('0'),
      ),
    [tokenPairsWithLiquidityTokens, v2PairsBalances],
  );

  const v2Pairs = useV2Pairs(
    liquidityTokensWithBalances.map(({ tokens }) => tokens),
  );
  const v2IsLoading =
    fetchingV2PairBalances ||
    v2Pairs?.length < liquidityTokensWithBalances.length ||
    v2Pairs?.some((V2Pair) => !V2Pair);

  const allV2PairsWithLiquidity = v2Pairs
    .map(([, pair]) => pair)
    .filter((v2Pair): v2Pair is Pair => Boolean(v2Pair));

  // TODO: Replicate this!
  // show liquidity even if its deposited in rewards contract
  // const stakingInfo = useStakingInfo()
  // const stakingInfosWithBalance = stakingInfo?.filter((pool) =>
  //   JSBI.greaterThan(pool.stakedAmount.quotient, BIG_INT_ZERO)
  // )
  // const stakingPairs = useV2Pairs(stakingInfosWithBalance?.map((stakingInfo) => stakingInfo.tokens))

  // // remove any pairs that also are included in pairs with stake in mining pool
  // const v2PairsWithoutStakedAmount = allV2PairsWithLiquidity.filter((v2Pair) => {
  //   return (
  //     stakingPairs
  //       ?.map((stakingPair) => stakingPair[1])
  //       .filter((stakingPair) => stakingPair?.liquidityToken.address === v2Pair.liquidityToken.address).length === 0
  //   )
  // })
  const migrationSupported = chainId in MigrationSupported;

  const DividendProgressBarChild = () => (
    <div className="flex flex-col w-full h-full justify-center items-center">
      <Image
        src="https://raw.githubusercontent.com/sushiswap/assets/master/blockchains/ethereum/assets/0x9040e237C3bF18347bb00957Dc22167D0f2b999d/logo.png"
        layout="fill"
        className="opacity-30"
        alt="STND logo"
      />
      {/* <div className="font-bold">Your Share</div>
      <div
        className="
      flex items-center space-x-1
      text-highlight
      "
      >
        <div className="text-lg font-bold">239,294</div>
        <div>STND</div>
      </div>
      <div className="text-highlight">3.25%</div> */}
    </div>
  );

  const Unbonding = useCallback(
    () => (
      <div className="space-y-3">
        <div className="text-center">
          <div className="font-bold opacity-50">Unbonding Period</div>
          <div className="text-grey">
            <span className="font-bold">30</span> days left
          </div>
        </div>
        <div className="text-center space-y-2">
          <Button className="px-8 py-2 border-4" disabled type="bordered">
            Unbond
          </Button>
          <div className="text-xs opacity-50">
            You'll be able to unbond in 30 days
          </div>
        </div>
      </div>
    ),
    [],
  );

  const Bonding = useCallback(
    () => (
      <div className="flex flex-col justify-center space-y-4">
        <div>
          <div className="text-4xl text-center">
            Your Bonded <span className="font-bold">STND</span>
          </div>
          <div className="text-highlight text-center">
            <span className="font-bold text-2xl">239,934</span> STND
          </div>
        </div>
        <Button
          className={classNames(
            Typographies.button,
            'min-w-[200px] self-center',
          )}
        >
          Bond
        </Button>
      </div>
    ),
    [],
  );

  return (
    <>
      <Head>
        <title>Dividend | Standard Protocol</title>
        <meta
          key="description"
          name="description"
          content="Standard Protocol dividend pool creates passive income for STND holders through fees collected on portal usage"
        />
      </Head>
      <Page id="dividend-page" className={Typographies.page}>
        <ViewportMediumUp>
          <PageHeader title="Dividend Pool" />
        </ViewportMediumUp>
        <PageContent>
          {/* <div className="p-4 mb-3 space-y-3">
              <Back />
            </div> */}

          <Alert
            className={Typographies.pageAlertFull}
            title={`Dividends`}
            message={
              <div className="leading-relaxed">
                Other protocols take a big percentage of total pool growth as a
                fee and do not give back.
                <br /> At <strong>Standard’s Portal</strong>, portions of the
                swap fees are distributed as proportional to your share of the
                pool letting both the plataform and the community maintain
                sustainability and grow together as one
              </div>
            }
            type="information"
          />

          <div
            className="
            w-full py-4 lg:py-8
          "
          >
            <div
              className="
                w-full flex flex-col items-center 
                sm:flex-row 
                sm:justify-center
                lg:space-x-20
                space-y-12
                lg:space-y-0
                bg-bond p-8 rounded-20
                "
            >
              <div className="flex-grow-[1] lg:flex-grow-0  flex justify-center items-center">
                <DividendPercentage value={10} />
              </div>
              <ViewportXSmall>
                <Bonding />
                <Unbonding />
              </ViewportXSmall>
              <ViewportSmall>
                <div className="space-y-4 flex-grow-[2] flex flex-col justify-center items-center">
                  <Bonding />
                  <Unbonding />
                </div>
              </ViewportSmall>
              <ViewportMedium>
                <div className="space-y-4 flex-grow-[2] flex flex-col justify-center items-center">
                  <Bonding />
                  <Unbonding />
                </div>
              </ViewportMedium>
              <ViewportLargeUp>
                <Bonding />
                <Unbonding />
              </ViewportLargeUp>
            </div>
            <div className="grid grid-cols-8 p-4 rounded-20 bg-opaque mt-6">
              <div className="col-span-8 lg:col-span-6 grid grid-cols-3 items-center">
                <div className="font-bold text-lg">Total Dividends</div>
                <div>
                  <div>Your Share</div>
                  <div className="text-highlight text-sm">
                    <span className="font-bold text-lg">234,294</span> STND
                  </div>
                </div>
                <div>
                  <div>APR</div>
                  <div className="text-highlight font-bold">23%</div>
                </div>
              </div>
              <Button
                className="
                px-4 py-2 
                font-bold text-base
                "
              >
                Claim All
              </Button>
            </div>
          </div>
        </PageContent>
      </Page>
    </>
  );
}
