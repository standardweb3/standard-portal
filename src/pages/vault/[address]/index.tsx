import Head from 'next/head';
import { useRouter } from 'next/router';
import { useState } from 'react';
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
import { VaultPayBack } from '../../../features/usm/vault/PayBack';
import { useUserVaultInfo } from '../../../features/usm/useVaultInfo';
import { NetworkGuardWrapper } from '../../../guards/Network';
import { ChainId } from '@digitalnative/standard-protocol-sdk';
import { useValidVault } from '../../../hooks/vault/useValidVault';
import { VaultLiquidatedCDPMetrics } from '../../../features/usm/vault/VaultLiquidatedCDPMetrics';

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
    condition,
    loading,
    address,
    id,
    liquidatable,
    isClosed,
    isLiquidated,
    isUserVault,
    liquidation,
    // handleWrapUnwrap,
    // isCollateralNative,
    // isCollateralWnative,
  } = useUserVaultInfo(vaultAddress);

  const usmBalance = useCurrencyBalance(account, usm);
  const [paybackAmount, setPaybackAmount] = useState('');

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
              isClosed={isClosed}
              isLiquidated={isLiquidated}
              ownership={isUserVault}
            />
            {!isClosed && (
              <div className="grid grid-cols-2 lg:grid-cols-7 gap-4">
                <div className="col-span-2 lg:col-span-7">
                  {isLiquidated ? (
                    <VaultLiquidatedCDPMetrics
                      collateralSymbol={collateralCurrency?.symbol}
                      liquidationAmount={liquidation.liquidationAmount}
                      liquidationFee={liquidation.liquidationFee}
                      liquidationAMM={liquidation.liquidationAMM}
                      currentBorrowed={currentBorrowed}
                      horizontal
                    />
                  ) : (
                    <VaultCDPMetrics
                      fee={fee}
                      usmPrice={usmPrice}
                      debtAmount={currentBorrowed}
                      debt={debt}
                      currentBorrowed={currentBorrowed}
                      horizontal
                    />
                  )}
                </div>
                {isUserVault && !isLiquidated && (
                  <>
                    <div className="col-span-2 lg:col-span-4">
                      <div className="rounded-20 p-8 bg-background space-y-8">
                        <VaultHeader vaultAddress={address} payback />
                        <VaultPayBack
                          mcr={mcr}
                          collateralPrice={collateralPrice}
                          currentCollateralized={currentCollateralized}
                          borrowed={currentBorrowed}
                          vaultAddress={address}
                          usm={usm}
                          balance={usmBalance}
                          amount={paybackAmount}
                          onAmountChange={setPaybackAmount}
                          debt={debt}
                        />
                      </div>
                    </div>
                    <div className="col-span-2 lg:col-span-3">
                      <VaultFees sfr={sfr} mcr={mcr} lfr={lfr} />
                    </div>
                  </>
                )}
              </div>
            )}
          </div>
        </PageContent>
      </Page>
    </>
  );
}

Vault.Guard = NetworkGuardWrapper([ChainId.RINKEBY, ChainId.METIS]);
export default Vault;
