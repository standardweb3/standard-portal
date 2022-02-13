import { getAddress } from 'ethers/lib/utils';
import { useWrappableCurrency } from '../../hooks/useWrappableCurrency';
import { useMtr } from '../../hooks/vault/useMtr';
import {
  useVaultBorrowed,
  useVaultCollateralized,
  useVaultDebt,
} from '../../hooks/vault/useVault';
import { useVaultManagerAssetPrice } from '../../hooks/vault/useVaultManager';
import { VaultCondition } from '../../pages/vaults';
import { useUserVault } from '../../services/graph/hooks/vault';
import { applyCdpDecimals } from './utils';

export function useUserVaultInfo(vaultAddress) {
  const checksummedVaultAddr = vaultAddress && getAddress(vaultAddress);

  const usm = useMtr();
  const usmPrice = useVaultManagerAssetPrice(usm && usm.address);
  const vault = useUserVault(vaultAddress);
  const debt = useVaultDebt(checksummedVaultAddr);

  const {
    id,
    collateral: collateralAddress,
    // currentBorrowed: currentBorrowedString,
    // currentCollateralized: currentCollateralizedString,
    CDP,
  } = vault ?? {};

  const {
    handleWrapUnwrap,
    currency: collateralCurrency,
    isNative: isCollateralNative,
    isWnative: isCollateralWnative,
  } = useWrappableCurrency(collateralAddress);

  const collateralPrice = useVaultManagerAssetPrice(collateralAddress);

  // const currentBorrowed = vault && parseFloat(currentBorrowedString);
  const currentBorrowed = useVaultBorrowed(checksummedVaultAddr);
  // const currentCollateralized =
  //   vault && parseFloat(currentCollateralizedString);
  const currentCollateralized = useVaultCollateralized(
    collateralAddress && getAddress(collateralAddress),
    checksummedVaultAddr,
    CDP && parseFloat(CDP.decimals),
  );

  const fee =
    debt && currentBorrowed !== undefined ? debt - currentBorrowed : undefined;

  const mcr = CDP && applyCdpDecimals(CDP.mcr);
  const sfr = CDP && applyCdpDecimals(CDP.sfr);
  const lfr = CDP && applyCdpDecimals(CDP.lfr);

  const liquidationPrice =
    vault && debt && (debt * mcr) / 100 / currentCollateralized;

  const debtValue =
    debt && usmPrice !== undefined ? usmPrice * debt : undefined;
  // market value of current collateralized
  const currentCollateralizedValue =
    vault && collateralPrice !== undefined
      ? collateralPrice * currentCollateralized
      : undefined;

  const currentCollateralRatio =
    vault && debt && currentCollateralizedValue !== undefined
      ? (currentCollateralizedValue / debt) * 100
      : undefined;

  // market value of min collateral amount
  const minCollateralAmountValue =
    vault && debt ? (mcr / 100) * debt : undefined;

  const minCollateralAmount =
    minCollateralAmountValue && collateralPrice
      ? minCollateralAmountValue / collateralPrice
      : undefined;

  const liquidatable = currentCollateralRatio < mcr;

  const condition =
    collateralPrice !== undefined
      ? collateralPrice > liquidationPrice * 1.3
        ? VaultCondition.SAFE
        : collateralPrice >= liquidationPrice * 1.1
        ? VaultCondition.WARNING
        : VaultCondition.DANGER
      : undefined;

  return {
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
    debtValue,
    currentCollateralized,
    currentCollateralizedValue,
    currentCollateralRatio,
    minCollateralAmountValue,
    minCollateralAmount,
    condition,
    loading:
      vaultAddress &&
      vault &&
      debt &&
      collateralCurrency &&
      collateralPrice &&
      usmPrice
        ? false
        : true,
    address: checksummedVaultAddr,
    id,
    liquidatable,
    handleWrapUnwrap,
    isCollateralNative,
    isCollateralWnative,
  };
}
