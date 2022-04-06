import { WNATIVE } from '@digitalnative/standard-protocol-sdk';
import { useCallback, useState } from 'react';
import { useActiveWeb3React } from '../../hooks';
import { useCurrency } from '../../hooks/Tokens';
import { useMtr } from '../../hooks/vault/useMtr';
import { useVaultManagerAssetPrice } from '../../hooks/vault/useVaultManager';
import { useCVault } from '../../services/graph/hooks/vault';
import { applyCdpDecimals } from './utils';

export function useCollateral(collateral) {
  const { chainId } = useActiveWeb3React();
  const [collateralAddress, setCollateralAddress] = useState(collateral);
  const collateralCurrency = useCurrency(collateralAddress);

  const handleWrapUnwrap = useCallback(() => {
    if (collateralCurrency.isNative) {
      setCollateralAddress(collateralCurrency.wrapped.address);
    } else if (
      collateralCurrency.isToken &&
      collateralCurrency.address === WNATIVE[chainId].address
    ) {
      setCollateralAddress('ETH');
    }
  }, [collateralCurrency]);

  const cVault = useCVault({
    id: collateralCurrency.isNative
      ? collateralCurrency.wrapped.address.toLowerCase()
      : collateralAddress.toLowerCase(),
  });

  const usm = useMtr();

  const { cdp } = cVault ?? {};

  const lfr = applyCdpDecimals(cdp?.lfr ?? 0);
  const sfr = applyCdpDecimals(cdp?.sfr ?? 0);
  const mcr = applyCdpDecimals(cdp?.mcr ?? 0);

  const collateralPrice = useVaultManagerAssetPrice(
    collateralCurrency.wrapped.address,
  );

  const usmPrice = useVaultManagerAssetPrice(usm?.address);

  return {
    collateralAddress,
    collateralCurrency,
    cVault,
    usm,
    lfr,
    sfr,
    mcr,
    collateralPrice,
    usmPrice,
    loading: collateral && cVault && collateralPrice && usmPrice ? false : true,
    isNative: collateralCurrency.isNative,
    isWnative:
      collateralCurrency.isToken &&
      collateralCurrency.address === WNATIVE[chainId].address,
    handleWrapUnwrap,
  };
}
