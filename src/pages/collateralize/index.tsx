import Head from 'next/head';
import { VaultInfo } from '../../features/vault/new/VaultInfo';
import { Page } from '../../components-ui/Page';
import { PageContent } from '../../components-ui/PageContent';
import { DefinedStyles } from '../../utils/DefinedStyles';
import { CollateralSelectPanel } from '../../features/vault/new/CollateralSelectPanel';
import { useState } from 'react';
import { tryParseAmount } from '../../functions';

export default function Vault() {
  const [collateralizeAmount, setCollateralizeAmount] = useState('');
  const [selectedCollateral, setSelectedCollateral] = useState(undefined);
  const [pendingTx, setPendingTx] = useState(false);

  const formattedCollateralizeAmount = tryParseAmount(
    collateralizeAmount,
    selectedCollateral,
  );

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
          <div className="grid grid-cols-7 w-full">
            <div className="col-span-7 md:col-span-4 space-y-4">
              <VaultInfo />
              <CollateralSelectPanel />
            </div>
            <div className="col-span-7 md:col-span-3">second</div>
          </div>
        </PageContent>
      </Page>
    </>
  );
}
