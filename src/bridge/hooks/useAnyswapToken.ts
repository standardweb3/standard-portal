import { AnyswapToken, NATIVE } from '@digitalnative/standard-protocol-sdk';
import { getAddress } from '@ethersproject/address';
import { useMemo } from 'react';
import { useActiveWeb3React } from '../../hooks';

export function useAnyswapToken(
  currency?: any,
): AnyswapToken | undefined | null {
  const { chainId } = useActiveWeb3React();

  // const address = isAddress(currency?.address)
  const address = currency && getAddress(currency.address);

  const symbol = currency?.symbol;
  const name = currency?.name;
  const decimals = currency?.decimals;
  const underlying = currency?.underlying;

  const ContractVersion = currency?.ContractVersion;
  const destChains = currency?.destChains;
  const logoUrl = currency?.logoUrl;
  const price = currency?.price;

  // const token = address && name ? undefined : useToken(address ? address : undefined)
  // console.log(token)
  // console.log(address)
  // console.log(currency)
  return useMemo(() => {
    if (!currency) return undefined;
    // if (!chainId || !address) return undefined
    if (!chainId || !address) return undefined;
    // if (token) return token
    return new AnyswapToken(
      chainId,
      address,
      decimals,
      symbol,
      name,
      underlying,
      ContractVersion,
      destChains,
      logoUrl,
      price,
    );
  }, [
    address,
    chainId,
    symbol,
    decimals,
    name,
    underlying,
    ContractVersion,
    destChains,
    logoUrl,
    price,
  ]);
}
