import Head from 'next/head';
import {
  getBulletPointColors,
  getStopColors,
  getStrokes,
  HistoricSuppliesGraph,
  ItemType,
  PaidBackGraph,
  ReservesGraph,
  SuppliesGraph,
} from '../../features/usm/Graph';
import { useVaultManagerHistories } from '../../services/graph/hooks/vault';
import { DashboardMetric } from '../../features/usm/dashboard/DashboardMetric';
import { Page } from '../../components-ui/Page';
import { ViewportMediumUp } from '../../components-ui/Responsive';
import { PageHeader } from '../../components-ui/PageHeader';
import { DefinedStyles } from '../../utils/DefinedStyles';
import { PageContent } from '../../components-ui/PageContent';
import { ChainId } from '@digitalnative/standard-protocol-sdk';
import { NetworkGuardWrapper } from '../../guards/Network';
import { useVaultManager } from '../../services/graph/hooks/vault';
import { Rebase4 } from '../../features/usm/Rebase4';
import { formatNumber } from '../../functions';
import { useVaultDashboard } from '../../features/usm/useVaultDashboard';
import { LogoSpinner } from '../../components-ui/Spinner/LogoSpinner';

function collectSumFromMap(map, excludedKeys) {
  return Object.keys(map)
    .filter((key) => !excludedKeys[key])
    .reduce((sum, i) => {
      return sum + map[i];
    }, 0);
}

function Dashboard() {
  const vaultManager = useVaultManager();
  const dashboardStats = useVaultDashboard();
  const {
    ammReserveDataKeys,
    collateralReserveDataKeys,
    collateralAmmLiquidationDataKeys,
    ammReserveHistoriesForGraph,
    collateralReserveHistoriesForGraph,
    collateralAmmLiquidationHistoriesForGraph,
    ammReserveTooltipItems,
    collateralReserveTooltipItems,
    collateralAmmLiquidationTooltipItems,
    ammCollaterals,
    cVaultCollaterals,
  } = dashboardStats;

  const data = useVaultManagerHistories();
  const dataForChart = data?.map((d) => {
    return {
      ...d,
      historicBorrowed: parseFloat(d.historicBorrowed),
      historicCollateralizedUSD: parseFloat(d.historicCollateralizedUSD),
      currentBorrowed: parseFloat(d.currentBorrowed),
      currentCollateralizedUSD: parseFloat(d.currentCollateralizedUSD),
      historicPaidBack: parseFloat(d.historicPaidBack),
      collectedStabilityFee: parseFloat(d.collectedStabilityFee),
      ammReserveCollateralUSD: parseFloat(d.ammReserveCollateralUSD),
    };
  });

  const latestCollateralReserve =
    collateralReserveHistoriesForGraph &&
    formatNumber(
      collectSumFromMap(
        collateralReserveHistoriesForGraph[
          collateralReserveHistoriesForGraph.length - 1
        ],
        { timestamp: true },
      ),
      true,
    );

  const latestLiquidation =
    collateralAmmLiquidationHistoriesForGraph &&
    formatNumber(
      collectSumFromMap(
        collateralAmmLiquidationHistoriesForGraph[
          collateralAmmLiquidationHistoriesForGraph.length - 1
        ],
        { timestamp: true },
      ),
      true,
    );

  const latestAmmReserve =
    ammReserveHistoriesForGraph &&
    formatNumber(
      collectSumFromMap(
        ammReserveHistoriesForGraph[ammReserveHistoriesForGraph.length - 1],
        { timestamp: true },
      ),
      true,
    );
    
  return (
    <>
      <Head>
        <title>Collateralize | Standard Protocol</title>
        <meta
          key="description"
          name="description"
          content="Trade ERC 20 tokens on Standard Protocol"
        />
      </Head>
      <Page id="trade-page" className={DefinedStyles.page}>
        <ViewportMediumUp>
          <PageHeader title="Dashboard" />
        </ViewportMediumUp>
        <PageContent>
          <div className="w-full max-w-[1000px] space-y-4">
            {/* <VaultManagerInfo /> */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <DashboardMetric
                header={'USM Total Supply'}
                stat={
                  vaultManager && formatNumber(vaultManager?.currentBorrowed)
                }
              />

              <DashboardMetric
                header={'Collected Stability Fee'}
                stat={
                  vaultManager &&
                  formatNumber(vaultManager?.collectedStabilityFee)
                }
              />
              {/* <DashboardMetric
                header={'Total Backing'}
                stat={usm && formatNumber(totalBacking, true)}
                tip={
                  'Total Backing is the sum of the value of collateralized assets in vaults and the value of collateral assets in USM-collateral AMMs'
                }
              /> */}
              <div className="col-span-1 sm:col-span-2">
                <Rebase4 />
              </div>
              {/* <Rebase3 /> */}
              {/* <Rebase2 /> */}
            </div>
            <div
              className="
        grid grid-cols-1 gap-4 sm:grid-cols-2 w-full"
            >
              <div className="col-span-1 bg-background rounded-20 p-2">
                <SuppliesGraph data={dataForChart} />
              </div>

              <div className="col-span-1 bg-background rounded-20 p-2">
                <HistoricSuppliesGraph data={dataForChart} />
              </div>
              <div className="col-span-1 bg-background rounded-20 p-2">
                {collateralReserveHistoriesForGraph ? (
                  <ReservesGraph
                    itemType={ItemType.dollar}
                    dataKey={collateralReserveDataKeys}
                    data={collateralReserveHistoriesForGraph ?? []}
                    stroke={getStrokes(cVaultCollaterals)}
                    stopColor={getStopColors(cVaultCollaterals)}
                    bulletpointColors={getBulletPointColors(cVaultCollaterals)}
                    tooltipItems={collateralReserveTooltipItems}
                    title="Collateralized Assets (USD)"
                    subtitle={latestCollateralReserve}
                    tooltipInfoMessage="Current collaterals deposited in vaults"
                  />
                ) : (
                  <div className="flex justify-center items-center w-full min-h-[300px]">
                    <LogoSpinner width={48} height={48} />
                  </div>
                )}
              </div>
              <div className="col-span-1 bg-background rounded-20 p-2">
                {ammReserveHistoriesForGraph ? (
                  <ReservesGraph
                    itemType={ItemType.dollar}
                    dataKey={ammReserveDataKeys}
                    data={ammReserveHistoriesForGraph ?? []}
                    stroke={getStrokes(ammCollaterals)}
                    stopColor={getStopColors(ammCollaterals)}
                    bulletpointColors={getBulletPointColors(ammCollaterals)}
                    tooltipItems={ammReserveTooltipItems}
                    title="Collateral-USM AMM Reserves (USD)"
                    subtitle={latestAmmReserve}
                    tooltipInfoMessage="Current collateral reserves in Collateral-USM AMM"
                  />
                ) : (
                  <div className="flex justify-center items-center w-full min-h-[300px]">
                    <LogoSpinner width={48} height={48} />
                  </div>
                )}
              </div>
              <div className="col-span-1 bg-background rounded-20 p-2">
                {collateralAmmLiquidationHistoriesForGraph ? (
                  <ReservesGraph
                    itemType={ItemType.dollar}
                    dataKey={collateralAmmLiquidationDataKeys}
                    data={collateralAmmLiquidationHistoriesForGraph ?? []}
                    stroke={getStrokes(cVaultCollaterals)}
                    stopColor={getStopColors(cVaultCollaterals)}
                    bulletpointColors={getBulletPointColors(cVaultCollaterals)}
                    tooltipItems={collateralAmmLiquidationTooltipItems}
                    title="Collateral Liquidations to AMM (USD)"
                    subtitle={latestLiquidation}
                    tooltipInfoMessage="Collateral liquidations on AMMs"
                  />
                ) : (
                  <div className="flex justify-center items-center w-full min-h-[300px]">
                    <LogoSpinner width={48} height={48} />
                  </div>
                )}
              </div>
              <div className="col-span-1 bg-background rounded-20 p-2">
                <PaidBackGraph data={dataForChart} />
              </div>
            </div>
          </div>
        </PageContent>
      </Page>
    </>
  );
}

Dashboard.Guard = NetworkGuardWrapper([ChainId.RINKEBY, ChainId.METIS]);
export default Dashboard;
