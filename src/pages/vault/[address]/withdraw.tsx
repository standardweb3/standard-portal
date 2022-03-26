import Head from 'next/head';
import { useRouter } from 'next/router';
import { useState } from 'react';
import { VaultInfoCard } from '../../../features/usm/vault/VaultInfoCard';
import { VaultWithdraw } from '../../../features/usm/vault/Withdraw';
import { tryParseAmount } from '../../../functions';
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
import { ChainId } from '@digitalnative/standard-protocol-sdk';
import { NetworkGuardWrapper } from '../../../guards/Network';
import { useValidVault } from '../../../hooks/vault/useValidVault';

function Vault() {
  const router = useRouter();
  const vaultAddress = router.query.address as string;
  useValidVault(vaultAddress);

  const { account } = useActiveWeb3React();

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
    isClosed,
  } = useUserVaultInfo(vaultAddress);

  // START: withdraw

  const collateralBalance = useCurrencyBalance(account, collateralCurrency);

  const withdrawableBalance = !loading
    ? Math.max(currentCollateralized - minCollateralAmount, 0)
    : undefined;

  const withdrawableCurrencyBalance = tryParseAmount(
    withdrawableBalance?.toString(),
    collateralCurrency,
  );

  const [withdrawAmount, setWithdrawAmount] = useState('');

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
                  <VaultHeader vaultAddress={vaultAddress} withdraw />
                  <VaultWithdraw
                    minCollateralAmount={minCollateralAmount}
                    borrowed={currentBorrowed}
                    mcr={mcr}
                    collateralPrice={collateralPrice}
                    currentCollateralized={currentCollateralized}
                    onAmountChange={setWithdrawAmount}
                    vaultAddress={address}
                    collateral={collateralCurrency}
                    amount={withdrawAmount}
                    balance={withdrawableCurrencyBalance}
                    balanceNum={withdrawableBalance}
                    collateralBalance={collateralBalance}
                    debt={debt}
                    fee={fee}
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
