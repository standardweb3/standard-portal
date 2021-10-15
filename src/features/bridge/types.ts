export type AnyswapTokenInfo = {
  ID: string;
  Name: string;
  Symbol: string;
  Decimals: number;
  Description: string;
  BaseFeePercent: number;
  BigValueThreshold: number;
  DepositAddress: string;
  ContractAddress: string;
  DcrmAddress: string;
  DisableSwap: boolean;
  IsDelegateContract: boolean;
  MaximumSwap: number;
  MaximumSwapFee: number;
  MinimumSwap: number;
  MinimumSwapFee: number;
  PlusGasPricePercentage: number;
  SwapFeeRate: number;
};

export type AnyswapResultPairInfo = {
  DestToken: AnyswapTokenInfo;
  PairID: string;
  SrcToken: AnyswapTokenInfo;
  destChainID: string;
  logoUrl: string;
  name: string;
  srcChainID: string;
  symbol: string;
};

export type AvailableChainsInfo = {
  id: string;
  token: AnyswapTokenInfo;
  other: AnyswapTokenInfo;
  logoUrl: string;
  name: string;
  symbol: string;
  destChainID: string;
};

export type AnyswapTokensMap = {
  [chainId: number]: { [contract: string]: AvailableChainsInfo };
};
