import { ChainId } from '@digitalnative/standard-protocol-sdk';

export function getGeckoUrl(chainId) {
  switch (chainId) {
    case ChainId.METIS: {
      return 'https://geckoterminal.com/metis/pools/0xf48c7b00c26b46d316267460c4aaba2b84546d21';
    }
    default:
      return undefined;
  }
}
