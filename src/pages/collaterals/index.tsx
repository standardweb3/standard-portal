import Head from 'next/head';
import { Page } from '../../components-ui/Page';
import { PageContent } from '../../components-ui/PageContent';
import { DefinedStyles } from '../../utils/DefinedStyles';
import { CollateralsTable } from '../../features/vault/new/CollateralsTable';

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
        <PageContent>
          <div className="w-full max-w-[1000px]">
            <CollateralsTable />
          </div>
        </PageContent>
      </Page>
    </>
  );
}
