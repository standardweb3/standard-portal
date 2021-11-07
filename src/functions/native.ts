import { NATIVE, WNATIVE } from '@digitalnative/standard-protocol-sdk';
import { getAddress } from '@ethersproject/address';

export const getSymbol = (chainId: number, symbol: string) => {
  return symbol.toLowerCase() === NATIVE[chainId].wrapped.symbol.toLowerCase()
    ? NATIVE[chainId].symbol
    : symbol;
};

export const getTradeAddress = (chainId: number, address: string) => {
  return getAddress(address) === WNATIVE[chainId].address ? 'ETH' : address;
};
