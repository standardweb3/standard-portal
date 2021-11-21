import {
  AnyswapToken,
  NATIVE,
  Token,
  WNATIVE,
} from '@digitalnative/standard-protocol-sdk';

export function toNormalToken(token: AnyswapToken | undefined, chainId): Token {
  if (!token) return undefined;
  if (token.name === 'BASECURRENCY') return WNATIVE[chainId];
  return new Token(
    token.chainId,
    token.address,
    token.decimals,
    token.symbol,
    token.name,
  );
}

export function toNormalCurrency(
  token: AnyswapToken | undefined,
  chainId,
): Token {
  if (!token) return undefined;
  if (token.name === 'BASECURRENCY') return NATIVE[chainId];
  return new Token(
    token.chainId,
    token.address,
    token.decimals,
    token.symbol,
    token.name,
  );
}
