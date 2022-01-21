import Head from 'next/head';
import { getAddress } from 'ethers/lib/utils';
import { useRouter } from 'next/router';
import { useState } from 'react';
import { VaultDeposit } from '../../../features/vault/vaults/Deposit';
import { VaultMint } from '../../../features/vault/vaults/Mint';
import { VaultPayBack } from '../../../features/vault/vaults/PayBack';
import { VaultInfoCard } from '../../../features/vault/vaults/VaultInfoCard';
import { VaultWithdraw } from '../../../features/vault/vaults/Withdraw';
import { classNames, formatBalance, tryParseAmount } from '../../../functions';
import { useActiveWeb3React } from '../../../hooks';
import { useCurrency } from '../../../hooks/Tokens';
import { useMtr } from '../../../hooks/vault/useMtr';
import { useVaultDebt } from '../../../hooks/vault/useVault';
import { useVaultManagerAssetPrice } from '../../../hooks/vault/useVaultManager';
import { useVaults } from '../../../services/graph/hooks/vault';
import { useProtocol } from '../../../state/protocol/hooks';
import { useCurrencyBalance } from '../../../state/wallet/hooks';
import { Page } from '../../../components-ui/Page';
import { DefinedStyles } from '../../../utils/DefinedStyles';
import { PageContent } from '../../../components-ui/PageContent';
import { ViewportMediumUp } from '../../../components-ui/Responsive';
import { PageHeader } from '../../../components-ui/PageHeader';
import { VaultHeader } from '../../../features/vault/vaults/VaultHeader';
import { CDP_DECIMALS } from '../../../features/vault/constants';
import { applyCdpDecimals } from '../../../features/vault/utils';
import { CDPMetrics } from '../../../features/vault/new/CDPMetrics';
import { VaultCDPMetrics } from '../../../features/vault/new/VaultCDPMetrics';

export default function Vault() {
  const { account, chainId } = useActiveWeb3React();
  const protocol = useProtocol();
  const router = useRouter();
  const vaultAddress = router.query.address as string;

  const mtr = useMtr();
  const mtrPriceUSD = useVaultManagerAssetPrice(mtr && mtr.address);

  // START: vault info
  const vault = useVaults({
    where: {
      address: vaultAddress.toLowerCase(),
      user: account?.toLowerCase(),
    },
  })?.[0];

  const debt = useVaultDebt(getAddress(vaultAddress));

  const {
    address,
    collateral: collateralAddress,
    currentBorrowed,
    currentCollateralized,
    CDP,
  } = vault ?? {};

  const fee =
    debt && currentBorrowed ? debt - parseFloat(currentBorrowed) : undefined;

  const collateralPriceUSD = useVaultManagerAssetPrice(collateralAddress);
  const mcr = CDP && applyCdpDecimals(CDP.mcr);
  const sfr = CDP && applyCdpDecimals(CDP.sfr);

  const liquidationPriceUSD =
    CDP &&
    (parseFloat(currentBorrowed) * mcr) /
      100 /
      parseFloat(currentCollateralized);

  const collateralCurrency = useCurrency(collateralAddress);

  const currentCollateralizedUSD =
    vault && collateralPriceUSD * parseFloat(currentCollateralized);

  const currentCollateralRatio =
    vault && (currentCollateralizedUSD / parseFloat(currentBorrowed)) * 100;

  const minCollateralAmountUSD = vault
    ? mcr * parseFloat(currentBorrowed)
    : undefined;
  const minCollateralAmount =
    minCollateralAmountUSD && collateralPriceUSD
      ? minCollateralAmountUSD / collateralPriceUSD
      : undefined;

  // END: vault info

  // START: payback
  const mtrBalance = useCurrencyBalance(account, mtr);
  const [paybackAmount, setPaybackAmount] = useState('');
  // END

  const checksummedVaultAddress = getAddress(vaultAddress);

  return (
    <>
      <Head>
        <title>Vault | Standard Protocol</title>
        <meta key="description" name="description" content="Manage your CDP" />
      </Head>
      <Page id="vault-page" className={DefinedStyles.page}>
        <ViewportMediumUp>
          <PageHeader title="Vault" />
        </ViewportMediumUp>
        <PageContent>
          <div className="w-full max-w-[1000px] space-y-4">
            <VaultInfoCard
              accruedStabilityFee={fee}
              collateral={collateralCurrency}
              collateralPriceUSD={collateralPriceUSD}
              liquidationPriceUSD={liquidationPriceUSD}
              currentCollateralizedUSD={currentCollateralizedUSD}
              currentBorrowed={currentBorrowed}
              currentCollateralized={currentCollateralized}
              mcr={mcr}
              sfr={sfr}
              collateralRatio={currentCollateralRatio}
            />
            <VaultCDPMetrics
              stabilityFee={fee}
              currentCollateralRatio={currentCollateralRatio}
              minCollateralRatio={mcr}
              collateralPrice={collateralPriceUSD}
              liquidationPrice={liquidationPriceUSD}
              mtrPriceUSD={mtrPriceUSD}
              debtAmount={currentBorrowed}
              horizontal
            />
            <div
              className={classNames(
                DefinedStyles.vaultPanel,
                'py-8 px-8 space-y-8',
              )}
            >
              <VaultHeader vaultAddress={vaultAddress} payback />
              <VaultPayBack
                mcr={mcr}
                collateralPriceUSD={collateralPriceUSD}
                currentCollateralized={currentCollateralized}
                borrowed={currentBorrowed}
                vaultAddress={checksummedVaultAddress}
                mtr={mtr}
                balance={mtrBalance}
                amount={paybackAmount}
                onAmountChange={setPaybackAmount}
              />
            </div>
          </div>
        </PageContent>
      </Page>
    </>
  );
}
