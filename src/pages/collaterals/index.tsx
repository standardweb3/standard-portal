import Head from 'next/head';
import { Page } from '../../components-ui/Page';
import { PageContent } from '../../components-ui/PageContent';
import { DefinedStyles } from '../../utils/DefinedStyles';
import { CollateralsTable } from '../../features/vault/CollateralsTable/CollateralsTable';
import { ViewportMediumUp } from '../../components-ui/Responsive';
import { PageHeader } from '../../components-ui/PageHeader';
import { Alert } from '../../components-ui/Alert';
import { VaultManagerInfo } from '../../features/vault/VaultManagerInfo';

export default function Collaterals() {
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
          <PageHeader title="Collaterals" />
        </ViewportMediumUp>
        <PageContent>
          <div className="w-full">
            <Alert
              className={DefinedStyles.pageAlertFull}
              message={
                <div className="leading-relaxed">
                  Select a collateral to borrow MTR
                </div>
              }
              type="information"
            />
            <VaultManagerInfo />
            <CollateralsTable />
          </div>
        </PageContent>
      </Page>
    </>
  );
}
