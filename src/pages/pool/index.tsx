import {
  ChainId,
  CurrencyAmount,
  JSBI,
  NATIVE,
  Pair,
} from '@digitalnativeinc/standard-protocol-sdk';
import React, { useMemo } from 'react';
import { classNames, currencyId } from '../../functions';
import {
  toV2LiquidityToken,
  useTrackedTokenPairs,
} from '../../state/user/hooks';

import { Alert } from '../../components-ui/Alert';
import { Back } from '../../components-ui/Back';
import { Button } from '../../components-ui/Button';
import { FullPositionCard } from '../../components-ui/PositionCard';
import Head from 'next/head';
import { MigrationSupported } from '../../features/migration';
import { useActiveWeb3React } from '../../hooks/useActiveWeb3React';
import { useETHBalances } from '../../state/wallet/hooks';
import { useRouter } from 'next/router';
import { useTokenBalancesWithLoadingIndicator } from '../../state/wallet/hooks';
import { useV2Pairs } from '../../hooks/useV2Pairs';
import { Page } from '../../components-ui/Page';
import { PageHeader } from '../../components-ui/PageHeader';
import { WalletConnector } from '../../components-ui/WalletConnector';
import { PageContent } from '../../components-ui/PageContent';
import { useProtocol } from '../../state/protocol/hooks';

export default function Pool() {
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
  return (
    <>
      <Head>
        <title>Pool | Sushi</title>
        <meta
          key="description"
          name="description"
          content="SushiSwap liquidity pools are markets for trades between the two tokens, you can provide these tokens and become a liquidity provider to earn 0.25% of fees from trades."
        />
      </Head>
      <Page id="pool-page">
        <PageHeader title="Liquidity Positions" />
        <PageContent>
          <div className="p-4 mb-3 space-y-3">
            <Back />
          </div>

          <Alert
            className="max-w-[600px]"
            title={`Liquidity Provider Rewards`}
            message={`Liquidity providers earn a 0.25% fee on all trades proportional to their share of
                        the pool. Fees are added to the pool, accrue in real time and can be claimed by
                        withdrawing your liquidity`}
            type="information"
          />

          <div
            className="
            md:min-w-[600px] 
            max-w-[1000px]
            bg-opaque
            rounded-20 p-8
            text-text"
          >
            <div className="grid grid-flow-row gap-3">
              <div className="font-bold">My Liquidity Positions</div>

              {!account ? (
                <WalletConnector />
              ) : v2IsLoading ? (
                `Loading`
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
                <div className="px-4 py-2">{`No liquidity was found. `}</div>
              )}
              <div
                className={classNames(
                  'grid gap-4',
                  migrationSupported ? 'grid-cols-3' : 'grid-cols-2',
                )}
              >
                <Button
                  type="bordered"
                  id="add-pool-button"
                  className="grid items-center justify-center grid-flow-col gap-2 whitespace-nowrap"
                  onClick={() =>
                    router.push(`/add/${currencyId(NATIVE[chainId])}`)
                  }
                >
                  {`Add`}
                </Button>
                <Button
                  type="bordered"
                  id="add-pool-button"
                  onClick={() => router.push(`/find`)}
                >
                  {`Import`}
                </Button>

                {migrationSupported && (
                  <Button
                    type="bordered"
                    id="create-pool-button"
                    onClick={() => router.push(`/migrate`)}
                  >
                    {`Migrate`}
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
