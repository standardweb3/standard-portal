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
// import { ExternalLink } from '../../components-ui/ExternalLink';

function Collaterals() {
  // const { isMintable, mintableSupply } = useUsmMintableSupply();

  return (
    <>
      <Head>
        <title>Borrow | Standard Protocol</title>
        <meta
          key="description"
          name="description"
          content="Borrow USM on Standard Protocol"
        />
      </Head>
      <Page id="borrow-page" className={DefinedStyles.page}>
        <ViewportMediumUp>
          <PageHeader title="Borrow" />
        </ViewportMediumUp>
        <PageContent>
          <div className="w-full max-w-[1200px]">
            <VaultManagerInfo />
            <div className="mt-12 mb-6 flex items-center justify-between">
              <div className="font-bold font-lg">Select a collateral</div>
              {/* <ExternalLink href="https://forum.standard.tech/c/proposal-governance/26">
                <div className="text-xs text-highlight">
                  Suggest a collateral
                </div>
              </ExternalLink> */}
            </div>
            <CollateralsTable />
          </div>
        </PageContent>
      </Page>
    </>
  );
}

Collaterals.Guard = NetworkGuardWrapper([ChainId.RINKEBY, ChainId.METIS, ChainId.SHIDEN]);
export default Collaterals;
