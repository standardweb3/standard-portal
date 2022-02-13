import Head from 'next/head';
import { useRouter } from 'next/router';
import { useState } from 'react';
import { VaultDeposit } from '../../../features/usm/vault/Deposit';
import { VaultInfoCard } from '../../../features/usm/vault/VaultInfoCard';
import { useActiveWeb3React } from '../../../hooks';
import { useCurrencyBalance } from '../../../state/wallet/hooks';
import { Page } from '../../../components-ui/Page';
import { DefinedStyles } from '../../../utils/DefinedStyles';
import { PageContent } from '../../../components-ui/PageContent';
import { ViewportMediumUp } from '../../../components-ui/Responsive';
import { PageHeader } from '../../../components-ui/PageHeader';
import { VaultHeader } from '../../../features/usm/vault/VaultHeader';
import { VaultCDPMetrics } from '../../../features/usm/vault/VaultCDPMetrics';
import { VaultFees } from '../../../features/usm/vault/VaultFees';
import { useUserVaultInfo } from '../../../features/usm/useVaultInfo';
import { NetworkGuardWrapper } from '../../../guards/Network';
import { ChainId } from '@digitalnative/standard-protocol-sdk';
import { Rebase4 } from '../../../features/usm/Rebase4';

function Vault() {
  const { account } = useActiveWeb3React();

  const router = useRouter();
  const vaultAddress = router.query.address as string;

  const {
    mcr,
    sfr,
    lfr,
    fee,
    debt,
    usm,
    usmPrice,
    collateralCurrency,
    collateralPrice,
    liquidationPrice,
    currentBorrowed,
    currentCollateralized,
    currentCollateralizedValue,
    currentCollateralRatio,
    minCollateralAmountValue,
    minCollateralAmount,
    condition,
    loading,
    address,
    id,
    liquidatable,
    handleWrapUnwrap,
    isCollateralNative,
    isCollateralWnative,
  } = useUserVaultInfo(vaultAddress);

  const collateralBalance = useCurrencyBalance(account, collateralCurrency);
  const [depositAmount, setDepositAmount] = useState('');

  return (
    <>
      <Head>
        <title>Vault | Standard Protocol</title>
        <meta key="description" name="description" content="Manage your CDP" />
      </Head>
      <Page id="vault-page" className={DefinedStyles.page}>
        <ViewportMediumUp>
          <PageHeader title="Vault" back href="/vaults" />
        </ViewportMediumUp>
        <PageContent>
          <div className="w-full max-w-[1200px] space-y-4">
            <VaultInfoCard
              condition={condition}
              fee={fee}
              collateral={collateralCurrency}
              collateralPrice={collateralPrice}
              liquidationPrice={liquidationPrice}
              currentCollateralizedValue={currentCollateralizedValue}
              currentBorrowed={currentBorrowed}
              currentCollateralized={currentCollateralized}
              mcr={mcr}
              sfr={sfr}
              currentCollateralRatio={currentCollateralRatio}
              address={address}
            />
            <div className="grid grid-cols-2 lg:grid-cols-7 gap-4">
              <div className="col-span-2 lg:col-span-7">
                <VaultCDPMetrics
                  fee={fee}
                  usmPrice={usmPrice}
                  debtAmount={currentBorrowed}
                  debt={debt}
                  currentBorrowed={currentBorrowed}
                  horizontal
                />
              </div>
              <div className="col-span-2 lg:col-span-4">
                <div className="rounded-20 p-8 bg-background space-y-8">
                  <VaultHeader vaultAddress={vaultAddress} deposit />
                  <VaultDeposit
                    debt={debt}
                    fee={fee}
                    borrowed={currentBorrowed}
                    mcr={mcr}
                    collateralPrice={collateralPrice}
                    currentCollateralized={currentCollateralized}
                    onAmountChange={setDepositAmount}
                    vaultAddress={address}
                    amount={depositAmount}
                    collateral={collateralCurrency}
                    balance={collateralBalance}
                    minCollateralAmount={minCollateralAmount}
                    handleWrapUnwrap={handleWrapUnwrap}
                    isCollateralNative={isCollateralNative}
                    isCollateralWnative={isCollateralWnative}
                  />
                </div>
              </div>
              <div className="col-span-2 lg:col-span-3">
                <VaultFees sfr={sfr} mcr={mcr} lfr={lfr} />
              </div>
            </div>
          </div>
        </PageContent>
      </Page>
    </>
  );
}

Vault.Guard = NetworkGuardWrapper([ChainId.RINKEBY]);
export default Vault;
