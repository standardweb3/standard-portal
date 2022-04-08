import { ChainId } from '@digitalnative/standard-protocol-sdk';
import Head from 'next/head';
import { Page } from '../../components-ui/Page';
import { PageContent } from '../../components-ui/PageContent';
import { PageHeader } from '../../components-ui/PageHeader';
import { ViewportMediumUp } from '../../components-ui/Responsive';
import { DashboardMetric } from '../../features/usm/dashboard/DashboardMetric';
import UsmPairCard from '../../features/usmPairs/usmPairCard';
import { formatNumber } from '../../functions';
import { NetworkGuardWrapper } from '../../guards/Network';
import { useUsmPairs } from '../../services/graph/hooks/usmPairs';
import { useVaultManager } from '../../services/graph/hooks/vault';
import { DefinedStyles } from '../../utils/DefinedStyles';

export function Amms() {
  const vaultManager = useVaultManager();
  const usmPairs = useUsmPairs();
  const renderAmmCards = () => {
    return usmPairs?.map((pair) => {
      return (
        <div className="col-span-1" key={pair.id}>
          <UsmPairCard
            inputAddress={pair.isToken0Mtr ? pair.token1 : pair.token0}
            outputAddress={pair.isToken0Mtr ? pair.token0 : pair.token1}
          />
        </div>
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
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                <DashboardMetric
                  header={'USM Total Supply'}
                  stat={
                    vaultManager && formatNumber(vaultManager?.currentBorrowed)
                  }
                />
                <DashboardMetric
                  header={'Cumulative Liquidations (USD)'}
                  stat={
                    vaultManager &&
                    `${formatNumber(
                      vaultManager?.liquidation?.liquidationAmountUSD ?? 0,
                    )} USD`
                  }
                />

                <DashboardMetric
                  header={'Liquidations Count'}
                  stat={
                    vaultManager &&
                    formatNumber(
                      vaultManager?.liquidation?.liquidationCount ?? 0,
                    )
                  }
                />
              </div>
              {usmPairs?.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {renderAmmCards()}
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

Amms.Guard = NetworkGuardWrapper([ChainId.RINKEBY, ChainId.METIS]);
export default Amms;
