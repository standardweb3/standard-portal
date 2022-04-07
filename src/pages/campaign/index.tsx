import Head from 'next/head';
import { Page } from '../../components-ui/Page';
import { PageContent } from '../../components-ui/PageContent';
import { DefinedStyles } from '../../utils/DefinedStyles';
import { ViewportMediumUp } from '../../components-ui/Responsive';
import { PageHeader } from '../../components-ui/PageHeader';
import { NetworkGuardWrapper } from '../../guards/Network';
import { ChainId } from '@digitalnative/standard-protocol-sdk';

function Collaterals() {

  return (
    <>
      <Head>
        <title>Campaign | Standard Protocol</title>
        <meta
          key="description"
          name="description"
          content="Metis USM Launch Campaign"
        />
      </Head>
      <Page id="campaign-page" className={DefinedStyles.page}>
        <ViewportMediumUp>
          <PageHeader title="Campaign" />
        </ViewportMediumUp>
        <PageContent>
          <div className="w-full max-w-[1200px]">
            <div className="mt-12 mb-6 flex items-center justify-between">
              <div className="font-bold font-lg">Select a collateral</div>

            </div>
          </div>
        </PageContent>
      </Page>
    </>
  );
}

Collaterals.Guard = NetworkGuardWrapper([ChainId.RINKEBY, ChainId.METIS]);
export default Collaterals;
