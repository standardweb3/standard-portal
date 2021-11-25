import Head from 'next/head';
import { PageHeader } from '../../components-ui/PageHeader';
import { ViewportMediumUp } from '../../components-ui/Responsive';
import { Page } from '../../components-ui/Page';
import { PageContent } from '../../components-ui/PageContent';
import { DefinedStyles } from '../../utils/DefinedStyles';
import { RouterHistories } from '../../bridge/feature/RouterHistories';
import { BridgeHeader } from '../../bridge/feature/BridgeHeader';
import { NetworkGuardWrapper } from '../../guards/Network';
import { NORMAL_GUARDED_CHAINS } from '../../constants/networks';
import { ChainId } from '@digitalnative/standard-protocol-sdk';

export function History() {
  return (
    <>
      <Head>
        <title>Bridge | Standard Protocol</title>
        <meta
          key="description"
          name="description"
          content="Bridge assets from one EVM chain to another, powered by Anyswap"
        />
      </Head>
      <Page id="router-history-page" className={DefinedStyles.page}>
        <ViewportMediumUp>
          <PageHeader title="Bridge" />
        </ViewportMediumUp>

        <PageContent>
          <div className="space-y-4 w-full md:max-w-[600px] bg-transparent sm:bg-opaque rounded-20 p-0 sm:p-5 text-text">
            <div className="flex justify-center w-full">
              <BridgeHeader />
            </div>
            <RouterHistories />
          </div>
        </PageContent>
      </Page>
    </>
  );
}

History.Guard = NetworkGuardWrapper(
  NORMAL_GUARDED_CHAINS.concat(ChainId.BSC, ChainId.MATIC),
);
export default History;
