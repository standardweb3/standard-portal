import { AnyswapToken, Token } from '@digitalnative/standard-protocol-sdk';

export function toNormalToken(token: AnyswapToken | undefined): Token {
  if (!token) return undefined;
  return new Token(
    token.chainId,
    token.address,
    token.decimals,
    token.symbol,
    token.name,
  );
}
