import Head from 'next/head';
import { PageHeader } from '../../components-ui/PageHeader';
import { ViewportMediumUp } from '../../components-ui/Responsive';
import { Page } from '../../components-ui/Page';
import { PageContent } from '../../components-ui/PageContent';
import { classNames } from '../../functions';
import { DefinedStyles } from '../../utils/DefinedStyles';
import { RouterHistories } from '../../bridge/feature/RouterHistories';
import { BridgeHeader } from '../../bridge/feature/BridgeHeader';

export default function History() {
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
      <Page>
        <ViewportMediumUp>
          <PageHeader title="Bridge" />
        </ViewportMediumUp>

        <PageContent>
          <div className={classNames(DefinedStyles.pageContent, 'space-y-4')}>
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
