import { current } from '@reduxjs/toolkit';
import { getAddress } from 'ethers/lib/utils';
import { useRouter } from 'next/router';
import { useState } from 'react';
import { VaultDeposit } from '../../features/vault/vaults/Deposit';
import { VaultMint } from '../../features/vault/vaults/Mint';
import { VaultPayBack } from '../../features/vault/vaults/PayBack';
import { VaultInfoCard } from '../../features/vault/vaults/VaultInfoCard';
import { VaultWithdraw } from '../../features/vault/vaults/Withdraw';
import { tryParseAmount } from '../../functions';
import { useActiveWeb3React } from '../../hooks';
import { useCurrency } from '../../hooks/Tokens';
import { useVaultDebt } from '../../hooks/vault/useVault';
import { useVaultManagerAssetPrice } from '../../hooks/vault/useVaultManager';
import { useVault, useVaults } from '../../services/graph/hooks/vault';
import { useProtocol } from '../../state/protocol/hooks';
import { useCurrencyBalance } from '../../state/wallet/hooks';

export default function Vault() {
  const { account, chainId } = useActiveWeb3React();
  const protocol = useProtocol();
  const router = useRouter();

  const vaultAddress = router.query.vault[0];

  // START: vault info
  const vault = useVaults({
    where: {
      address: vaultAddress.toLowerCase(),
      user: account.toLowerCase(),
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
  // const depositCurrencyAmount = tryParseAmount(
  //   depositAmount,
  //   collateralCurrency,
  // );
  // END: deposit

  // START: withdraw
  const withdrawableBalance =
    vault && fee !== undefined
      ? parseFloat(currrentCollateralized) - fee - minCollateralAmount
      : undefined;

  const minBalance = vault;

  const withdrawableCurrencyBalance = tryParseAmount(
    withdrawableBalance?.toString(),
    collateralCurrency,
  );

  const [withdrawAmount, setWithdrawAmount] = useState('');
  // const withdrawCurrencyAmount = tryParseAmount(
  //   withdrawAmount,
  //   collateralCurrency,
  // );
  // console.log('withdraw', withdrawCurrencyAmount);
  // END: withdraw

  return (
    <div>
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
      <VaultPayBack />
      <VaultWithdraw
        onAmountChange={setWithdrawAmount}
        vaultAddress={getAddress(vaultAddress)}
        collateral={collateralCurrency}
        amount={withdrawAmount}
        balance={withdrawableCurrencyBalance}
      />
      <VaultDeposit
        onAmountChange={setDepositAmount}
        vaultAddress={getAddress(vaultAddress)}
        amount={depositAmount}
        collateral={collateralCurrency}
        balance={collateralBalance}
      />
      <VaultMint />
    </div>
  );
}
