import Head from 'next/head';
import { Page } from '../../components-ui/Page';
import { PageContent } from '../../components-ui/PageContent';
import { PageHeader } from '../../components-ui/PageHeader';
import { ViewportMediumUp } from '../../components-ui/Responsive';
import { VaultManagerInfo } from '../../features/usm/collaterals/VaultManagerInfo';
import { DashboardMetric } from '../../features/usm/dashboard/DashboardMetric';
import UsmPairCardType from '../../features/usmPairs/usmPairCard';
import { formatNumber } from '../../functions';
import { useUsmPairs } from '../../services/graph/hooks/usmPairs';
import { useVaultManager } from '../../services/graph/hooks/vault';
import { DefinedStyles } from '../../utils/DefinedStyles';

export default function Amms() {
  const vaultManager = useVaultManager();
  const usmPairs = useUsmPairs();
  const renderAmmCard = () => {
    return usmPairs?.map((pair) => {
      return (
        <UsmPairCardType
          key={pair.id}
          inputAddress={pair.isToken0Mtr ? pair.token1 : pair.token0}
          outputAddress={pair.isToken0Mtr ? pair.token0 : pair.token1}
        />
      );
    });
  };
  return (
    <>
      <Head>
        <title>AMMs | Standard Protocol</title>
        <meta
          key="description"
          name="description"
          content="Explore Collateral-USM AMMs."
        />
      </Head>
      <Page id="amms-page" className={DefinedStyles.page}>
        <ViewportMediumUp>
          <PageHeader title="AMMs" />
        </ViewportMediumUp>

        <PageContent>
          <div className="w-full max-w-[1200px]">
            <div className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                <DashboardMetric
                  header={'USM Total Supply'}
                  stat={
                    vaultManager && formatNumber(vaultManager?.currentBorrowed)
                  }
                />
                <DashboardMetric
                  header={'AMM Reserve'}
                  stat={
                    vaultManager &&
                    formatNumber(
                      vaultManager?.runningStat.ammReserveCollateralUSD,
                      true,
                    )
                  }
                  tip={
                    'Total Backing is the sum of the value of collateralized assets in vaults and the value of collateral assets in USM-collateral AMMs'
                  }
                />
                <DashboardMetric
                  header={'Liquidations (USD)'}
                  stat={
                    vaultManager && formatNumber(vaultManager?.currentBorrowed)
                  }
                />

                <DashboardMetric
                  header={'Liquidations Count'}
                  stat={
                    vaultManager && formatNumber(vaultManager?.currentBorrowed)
                  }
                />
              </div>
              {usmPairs?.length > 0 ? (
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                  <div className="col-span-1">{renderAmmCard()}</div>
                </div>
              ) : (
                <div></div>
              )}
            </div>
          </div>
        </PageContent>
      </Page>
    </>
  );
}
