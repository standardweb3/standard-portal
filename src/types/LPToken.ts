import {
  Currency,
  CurrencyAmount,
  Token,
} from '@digitalnative/standard-protocol-sdk-test';

import { ethers } from 'ethers';

export default interface LPToken {
  id?: number;
  address: string;
  tokenA: Token;
  tokenB: Token;
  totalSupply: ethers.BigNumber;
  balance: CurrencyAmount<Currency>;
  name?: string;
  symbol?: string;
  decimals?: number;
  version?: 'v1' | 'v2';
}
