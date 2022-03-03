import { CurrencyAmount, Pair } from '@digitalnative/standard-protocol-sdk';
import React, { useMemo } from 'react';
import {
  toV2LiquidityToken,
  useTrackedTokenPairs,
} from '../../state/user/hooks';

import { Alert } from '../../components-ui/Alert';
import { Button } from '../../components-ui/Button';
import { FullPositionCard } from '../../components-ui/PositionCard';
import Head from 'next/head';
import { MigrationSupported } from '../../features/migration';
import { useActiveWeb3React } from '../../hooks/useActiveWeb3React';
import { useRouter } from 'next/router';
import { useTokenBalancesWithLoadingIndicator } from '../../state/wallet/hooks';
import { useV2Pairs } from '../../hooks/useV2Pairs';
import { Page } from '../../components-ui/Page';
import { PageHeader } from '../../components-ui/PageHeader';
import { WalletConnector } from '../../components-ui/WalletConnector';
import { PageContent } from '../../components-ui/PageContent';
import { useProtocol } from '../../state/protocol/hooks';
import { LiquidityHeader } from '../../features/liquidity';
import { LogoSpinner } from '../../components-ui/Spinner/LogoSpinner';
import { DefinedStyles } from '../../utils/DefinedStyles';
import { ViewportMediumUp } from '../../components-ui/Responsive';
import { AnalyticsLink } from '../../components-ui/AnalyticsLink';
import { NetworkGuardWrapper } from '../../guards/Network';
import { NORMAL_GUARDED_CHAINS } from '../../constants/networks';

function Pool() {
  const router = useRouter();
  const { account, chainId } = useActiveWeb3React();
  const protocol = useProtocol();

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

  console.log(allV2PairsWithLiquidity);
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
  return (
    <>
      <Head>
        <title>POOL | Standard Protocol</title>
        <meta
          key="description"
          name="description"
          content="Standard Protocol liquidity pools are markets for trades between the two tokens, you can provide these tokens and become a liquidity provider to earn 0.3% of fees from trades."
        />
      </Head>
      <Page id="pool-page" className={DefinedStyles.page}>
        <ViewportMediumUp>
          <PageHeader title="Liquidity Positions" />
        </ViewportMediumUp>
        <PageContent>
          {/* <div className="p-4 mb-3 space-y-3">
            <Back />
          </div> */}

          <Alert
            className={DefinedStyles.pageAlertMaxed}
            title={`Liquidity Provider Rewards`}
            message={`Liquidity providers earn a 0.25% fee on all trades proportional to their share of
                        the pool. Fees are added to the pool, accrue in real time and can be claimed by
                        withdrawing your liquidity`}
            type="information"
          />

          <div className={DefinedStyles.pageContent}>
            <div className="grid grid-flow-row gap-4">
              <div className="flex justify-between">
                <div className="font-bold">My Liquidity Positions</div>
                <AnalyticsLink path="pairs" />
              </div>
              <LiquidityHeader />
              {!account ? (
                <WalletConnector />
              ) : v2IsLoading ? (
                <div className="flex justify-center my-2">
                  <LogoSpinner width={92} height={114} rot />
                </div>
              ) : allV2PairsWithLiquidity?.length > 0 ? (
                <>
                  {/* <div className="flex items-center justify-center">
                  <ExternalLink
                    href={"https://analytics.sushi.com/user/" + account}
                  >
                  Account analytics and accrued fees <span> ↗</span>
                  </ExternalLink>
                </div> */}
                  {allV2PairsWithLiquidity.map((v2Pair) => (
                    <FullPositionCard
                      key={v2Pair.liquidityToken.address}
                      pair={v2Pair}
                      stakedBalance={CurrencyAmount.fromRawAmount(
                        v2Pair.liquidityToken,
                        '0',
                      )}
                    />
                  ))}
                </>
              ) : (
                <div className="px-4 py-2 text-center">{`No liquidity was found. `}</div>
              )}
              <div className="flex items-center space-x-3">
                <Button
                  type="bordered"
                  id="add-pool-button"
                  onClick={() => router.push(`/find`)}
                >
                  Import pair
                </Button>

                {migrationSupported && (
                  <Button
                    type="bordered"
                    id="create-pool-button"
                    onClick={() => router.push(`/migrate`)}
                  >
                    Migrate
                  </Button>
                )}
              </div>
            </div>
          </div>
        </PageContent>
      </Page>
    </>
  );
}

Pool.Guard = NetworkGuardWrapper(NORMAL_GUARDED_CHAINS);
export default Pool;
