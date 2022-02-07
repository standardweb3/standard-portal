import Head from 'next/head';
import { Page } from '../../components-ui/Page';
import { PageContent } from '../../components-ui/PageContent';
import { DefinedStyles } from '../../utils/DefinedStyles';
import { CollateralsTable } from '../../features/usm/collaterals/CollateralsTable/CollateralsTable';
import { ViewportMediumUp } from '../../components-ui/Responsive';
import { PageHeader } from '../../components-ui/PageHeader';
import { VaultManagerInfo } from '../../features/usm/collaterals/VaultManagerInfo';
import { NetworkGuardWrapper } from '../../guards/Network';
import { ChainId } from '@digitalnative/standard-protocol-sdk';

function Collaterals() {
  return (
    <>
      <Head>
        <title>Collaterals | Standard Protocol</title>
        <meta
          key="description"
          name="description"
          content="Trade ERC 20 tokens on Standard Protocol"
        />
      </Head>
      <Page id="collaterals-page" className={DefinedStyles.page}>
        <ViewportMediumUp>
          <PageHeader title="Collaterals" />
        </ViewportMediumUp>
        <PageContent>
          <div className="w-full max-w-[1200px]">
            <VaultManagerInfo />
            <CollateralsTable />
          </div>
        </PageContent>
      </Page>
    </>
  );
}

Collaterals.Guard = NetworkGuardWrapper([ChainId.RINKEBY]);
export default Collaterals;
