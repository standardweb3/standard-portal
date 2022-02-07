import { useCallback, useEffect, useState } from 'react';
import useActiveWeb3React from './useActiveWeb3React';
import { useCurrency } from './Tokens';
import { WNATIVE } from '@digitalnative/standard-protocol-sdk';
import { getAddress } from 'ethers/lib/utils';

// always returns native currency, when wnative is passed
export function useWrappableCurrency(addr) {
  const { chainId } = useActiveWeb3React();

  const checksummedAddr = addr && getAddress(addr);

  const currencyAddr =
    checksummedAddr &&
    (checksummedAddr === WNATIVE[chainId].address ? 'ETH' : checksummedAddr);

  const [currencyAddress, setCurrencyAddress] = useState(currencyAddr);

  useEffect(() => {
    if (currencyAddr) setCurrencyAddress(currencyAddr);
  }, [currencyAddr]);

  const currency = useCurrency(currencyAddress);
  const handleWrapUnwrap = useCallback(() => {
    if (currency.isNative) {
      setCurrencyAddress(currency.wrapped.address);
    } else if (
      currency.isToken &&
      currency.address === WNATIVE[chainId].address
    ) {
      setCurrencyAddress('ETH');
    }
  }, [currency]);

  return {
    handleWrapUnwrap,
    currency,
    isNative: currency?.isNative,
    isWnative:
      currency?.isToken && currency.address === WNATIVE[chainId].address,
  };
}
