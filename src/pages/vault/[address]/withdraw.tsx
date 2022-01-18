import Head from 'next/head';
import { getAddress } from 'ethers/lib/utils';
import { useRouter } from 'next/router';
import { useState } from 'react';
import { VaultDeposit } from '../../../features/vault/vaults/Deposit';
import { VaultMint } from '../../../features/vault/vaults/Mint';
import { VaultPayBack } from '../../../features/vault/vaults/PayBack';
import { VaultInfoCard } from '../../../features/vault/vaults/VaultInfoCard';
import { VaultWithdraw } from '../../../features/vault/vaults/Withdraw';
import { tryParseAmount } from '../../../functions';
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

export default function Vault() {
  const { account, chainId } = useActiveWeb3React();
  const protocol = useProtocol();
  const router = useRouter();

  const vaultAddress = router.query.address as string;

  // START: vault info
  const vault = useVaults({
    where: {
      address: vaultAddress.toLowerCase(),
      user: account?.toLowerCase(),
    },
  })?.[0];

  const debt = vaultAddress && useVaultDebt(getAddress(vaultAddress));

  const {
    address,
    collateral: collateralAddress,
    currentBorrowed,
    currrentCollateralized,
    CDP,
  } = vault ?? {};

  const fee =
    debt && currentBorrowed ? debt - parseFloat(currentBorrowed) : undefined;

  const collateralPriceUSD = useVaultManagerAssetPrice(collateralAddress);
  const mcr = CDP && parseFloat(CDP.mcr) / 100;
  const sfr = CDP && parseFloat(CDP.sfr) / 100;

  const liquidationPriceUSD = vault ? mcr * collateralPriceUSD : undefined;
  const collateralCurrency = useCurrency(collateralAddress);

  const currentCollateralizedUSD =
    vault && collateralPriceUSD * parseFloat(currrentCollateralized);

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

  // START: deposit
  const collateralBalance = useCurrencyBalance(account, collateralCurrency);
  const [depositAmount, setDepositAmount] = useState('');
  // END: deposit

  // START: withdraw
  const withdrawableBalance =
    vault && fee !== undefined
      ? parseFloat(currrentCollateralized) - fee - minCollateralAmount
      : undefined;

  const withdrawableCurrencyBalance = tryParseAmount(
    withdrawableBalance?.toString(),
    collateralCurrency,
  );

  const [withdrawAmount, setWithdrawAmount] = useState('');
  // END: withdraw

  // START: payback
  const mtr = useMtr();
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
          <div className="w-full max-w-[1200px]">
            <VaultInfoCard
              accruedStabilityFee={fee}
              collateral={collateralCurrency}
              collateralPriceUSD={collateralPriceUSD}
              liquidationPriceUSD={liquidationPriceUSD}
              currentCollateralizedUSD={currentCollateralizedUSD}
              currentBorrowed={currentBorrowed}
              currentCollateralized={currrentCollateralized}
              mcr={mcr}
              sfr={sfr}
              collateralRatio={currentCollateralRatio}
            />
            <div className={DefinedStyles.vaultPanel}>
              <VaultHeader vaultAddress={vaultAddress} withdraw />
              <VaultWithdraw
                onAmountChange={setWithdrawAmount}
                vaultAddress={checksummedVaultAddress}
                collateral={collateralCurrency}
                amount={withdrawAmount}
                balance={withdrawableCurrencyBalance}
              />
            </div>
          </div>
        </PageContent>
      </Page>
    </>
  );
}
