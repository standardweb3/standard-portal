import { ChainId } from '@digitalnative/standard-protocol-sdk';

export const TRADE_BLACKLIST = {
  [ChainId.RINKEBY]: {
    '0x984210721baecb816954585847222e1b28a03055': true,
    '0xc7840aa74e683227daa9b1f95ee3e1a793e6fbea': true,
    '0x026d59ea9244d0bcd8b3367fc499a9b9aff3af0e': true,
    '0x0918d629c2c4e9527bb093eba0aeb0204bdf1532': true,
    '0x6aaf863f8822441c5e23596af00a9c484a064341': true,
  },
  [ChainId.METIS]: {
    '0x31021e0b1cc6f89e04586a0e3cf5c46d5498a5e9': true
  }
};
