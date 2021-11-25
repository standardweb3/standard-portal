import {
  AnyswapCurrency,
  AnyswapToken,
  NATIVE,
  Token,
  WNATIVE,
} from '@digitalnative/standard-protocol-sdk';
import { isAddress } from '@ethersproject/address';

export function toNormalToken(token: any | undefined, chainId): Token {
  if (!token || !token.chainId) return undefined;
  if (!isAddress(token.address)) return WNATIVE[chainId];
  if (token.name === 'BASECURRENCY') return WNATIVE[chainId];
  return new Token(
    parseInt(token.chainId),
    token.address,
    token.decimals,
    token.symbol,
    token.name,
  );
}

export function toNormalCurrency(token: any | undefined, chainId): Token {
  if (!token || !token.chainId) return undefined;
  if (!isAddress(token.address)) return NATIVE[chainId];
  if (token.name === 'BASECURRENCY') return NATIVE[chainId];
  return new Token(
    parseInt(token.chainId),
    token.address,
    token.decimals,
    token.symbol,
    token.name,
  );
}
