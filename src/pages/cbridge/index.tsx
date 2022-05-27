import Head from 'next/head';
/// Adjust import path according to your project
import { Provider } from 'react-redux';
import store from '../../cbridge/redux/store';
import CBridgeTransferWidget from '../../cbridge/cBridgeTransferWidget';
import { PageContent } from '../../components-ui/PageContent';
import { DefinedStyles } from '../../utils/DefinedStyles';
import { ViewportMediumUp } from '../../components-ui/Responsive';
import { PageHeader } from '../../components-ui/PageHeader';
import { NetworkGuardWrapper } from '../../guards/Network';
import { ChainId } from '@digitalnative/standard-protocol-sdk';
import {
  useCampaingScoreAggregator,
  useCampaingUsers,
} from '../../services/graph/hooks/campaign';
import { formatNumber, shortenAddress } from '../../functions';
import { Page } from '../../components-ui/Page';

function Campaign() {
  return (
    <>
      <Head>
        <title>CBridge | Standard Protocol</title>
        <meta
          key="description"
          name="description"
          content="CBridge"
        />
      </Head>
      <Page id="campaign-page" className={DefinedStyles.page}>
        <ViewportMediumUp>
          <PageHeader title="Campaign" />
        </ViewportMediumUp>
        <PageContent>
          <div>
            <Provider store={store}>
              <CBridgeTransferWidget />
            </Provider>
          </div>
        </PageContent>
      </Page>
    </>
  );
}

Campaign.Guard = NetworkGuardWrapper([ChainId.RINKEBY, ChainId.METIS]);
export default Campaign;
