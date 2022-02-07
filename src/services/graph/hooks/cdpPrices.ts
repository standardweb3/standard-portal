import { getAddress } from 'ethers/lib/utils';
import { useMemo } from 'react';
import { formatBalance } from '../../../functions';
import { useVaultMannagerConract } from '../../../hooks/vault/useVaultManager';
import { useSingleContractMultipleData } from '../../../state/multicall/hooks';
import { useCdps } from './vault';

export function useCdpPrices() {
  const cdps = useCdps();
  const vaultManager = useVaultMannagerConract();

  const pricesMap = {};

  const args = useMemo(() => {
    if (!cdps) return;

    return cdps.map((cdp) => [getAddress(cdp.id)]);
  }, [cdps]);
  console.log(args);

  const callResult = useSingleContractMultipleData(
    args ? vaultManager : null,
    'getAssetPrice',
    args,
  );

  callResult?.forEach((res, i) => {
    const assetPrice = res?.result?.[0];
    if (assetPrice) {
      pricesMap[cdps[i].id] = {
        price: parseFloat(formatBalance(assetPrice, 8)),
        symbol: cdps[i].symbol,
      };
    }
  });

  return pricesMap;
}
