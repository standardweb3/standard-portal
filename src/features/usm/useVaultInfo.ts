import { getAddress } from 'ethers/lib/utils';
import { useActiveWeb3React } from '../../hooks';
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
  const { account } = useActiveWeb3React();
  let checksummedVaultAddr;
  try {
    checksummedVaultAddr = vaultAddress && getAddress(vaultAddress);
  } catch (err) {}

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
    isClosed,
    isLiquidated,
    liquidation,
    user,
    createdAt,
    ex_sfr
  } = vault ?? {};
  
  const isUserVault = account && user && account.toLowerCase() == user.id;
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
    debt !== undefined && currentBorrowed !== undefined
      ? debt - currentBorrowed
      : undefined;
  const mcr = CDP && applyCdpDecimals(CDP.mcr);
  const sfr = CDP && applyCdpDecimals(CDP.sfr);
  const init_sfr = CDP && applyCdpDecimals(ex_sfr)
  const lfr = CDP && applyCdpDecimals(CDP.lfr);
  const expiary = CDP && applyCdpDecimals(CDP.expiary)

  const liquidationPrice =
    vault && debt !== undefined && (debt * mcr) / 100 / currentCollateralized;

  const debtValue =
    debt !== undefined && usmPrice !== undefined ? usmPrice * debt : undefined;
  // market value of current collateralized
  const currentCollateralizedValue =
    vault && collateralPrice !== undefined
      ? collateralPrice * currentCollateralized
      : undefined;

  const currentCollateralRatio =
    vault && debt !== undefined && currentCollateralizedValue !== undefined
      ? (currentCollateralizedValue / debt) * 100
      : undefined;

  // market value of min collateral amount
  const minCollateralAmountValue =
    vault && debt !== undefined ? (mcr / 100) * debt : undefined;

  const minCollateralAmount =
    minCollateralAmountValue === 0
      ? 0
      : collateralPrice === 0
      ? undefined
      : minCollateralAmountValue !== undefined && collateralPrice !== undefined
      ? minCollateralAmountValue / collateralPrice
      : undefined;

  const liquidatable = currentCollateralRatio < mcr;

  const condition = isClosed
    ? VaultCondition.CLOSED
    : isLiquidated
    ? VaultCondition.LIQUIDATED
    : collateralPrice !== undefined
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
    expiary,
    fee,
    debt,
    usm,
    usmPrice,
    collateralCurrency,
    collateralAddress,
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
      debt !== undefined &&
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
    isClosed,
    isLiquidated,
    liquidation,
    isUserVault,
    createdAt,
    init_sfr
  };
}
