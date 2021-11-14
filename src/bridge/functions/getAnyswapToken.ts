import { AnyswapToken } from '@digitalnative/standard-protocol-sdk';

export function getAnyswapToken(value) {
  return new AnyswapToken(
    value && Number(value?.chainId),
    value?.address,
    value?.decimals,
    value?.symbol,
    value?.name,
    value?.underlying,
    value?.ContractVersion,
    value?.destChains,
    value?.logoUrl,
    value?.price,
    value?.routerToken,
  );
}
