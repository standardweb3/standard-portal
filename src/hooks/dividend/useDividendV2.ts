import {
  Currency,
  CurrencyAmount,
  getDividendPoolWhitelistPairs,
  getDividendPoolWhitelistTokens,
  JSBI,
  Token,
} from '@digitalnative/standard-protocol-sdk';
import { Interface } from '@ethersproject/abi';
import { useMemo } from 'react';
import { useActiveWeb3React, useDividendPoolAddress } from '..';
import { useBlockNumber } from '../../state/application/hooks';
import { useMultipleContractSingleData } from '../../state/multicall/hooks';
import { useProtocol } from '../../state/protocol/hooks';
import { usePagination } from '../usePagination';
import ERC20_ABI from '../../constants/abis/erc20.json';
import IUniswapV2PairABI from '@sushiswap/core/abi/IUniswapV2Pair.json';

export type DividendPoolWhitelistTokenBalance = {
  token: Token;
  amount: CurrencyAmount<Currency> | null;
};

export type DividendPoolWhitelistPairBalance = {
  address: string;
  reserve0: any | null;
  reserve1: any | null;
  token0: string;
  token1: string;
  amount: CurrencyAmount<Currency> | null;
};

export function useTokensDividendBalances(tokens) {
  const ERC20Interface = new Interface(ERC20_ABI);

  const dividendPoolAddress = useDividendPoolAddress();

  const balances = useMultipleContractSingleData(
    tokens,
    ERC20Interface,
    'balanceOf',
    [dividendPoolAddress],
    undefined,
    100_000,
  );

  const anyLoading: boolean = useMemo(
    () => balances.some((callState) => callState.loading),
    [balances],
  );

  return { balances, anyLoading };
}

export function usePairsDividendBalances(pairs) {
  const PAIR_INTERFACE = new Interface(IUniswapV2PairABI);
  const ERC20Interface = new Interface(ERC20_ABI);

  const dividendPoolAddress = useDividendPoolAddress();

  const balances = useMultipleContractSingleData(
    pairs,
    ERC20Interface,
    'balanceOf',
    [dividendPoolAddress],
    undefined,
    100_000,
  );

  const reserves = useMultipleContractSingleData(
    pairs,
    PAIR_INTERFACE,
    'getReserves',
  );

  const anyLoading: boolean = useMemo(
    () =>
      balances.some((callState) => callState.loading) ||
      reserves.some((callState) => callState.loading),
    [balances, reserves],
  );

  return { balances, reserves, anyLoading };
}

export function useDividendPoolWhitelistTokenBalances(pageSize: number) {
  const tokens = useDivdendPoolWhitelistTokens();
  const lastBlockNumber = useBlockNumber();

  const lastPage = Math.floor(tokens.length / pageSize);
  const { current, next, last } = usePagination(0, pageSize, lastPage);

  const currentTokens = useMemo(() => {
    return tokens
      .slice(current * pageSize, (current + 1) * pageSize)
      .map((token) => token.address);
  }, [tokens, current]);

  const { balances, anyLoading } = useTokensDividendBalances(currentTokens);

  const tokensWithDividends: DividendPoolWhitelistTokenBalance[] = useMemo(() => {
    if (!anyLoading) {
      let position = 0;
      return tokens.map((token, i) => {
        if (i >= current * pageSize && i < current * pageSize + pageSize) {
          const value = balances?.[position++]?.result?.[0];
          const amount = value ? JSBI.BigInt(value.toString()) : undefined;
          return {
            token: token,
            amount: amount ? CurrencyAmount.fromRawAmount(token, amount) : null,
          };
        }
        return {
          token: token,
          amount: null,
        };
      });
    }
    return [];
  }, [balances, anyLoading, current, lastBlockNumber]);

  return { tokensWithDividends, next, current, loading: anyLoading, last };
  // useEffect(() => {
  //   console.log(pairDividends);
  // }, [pairDividends]);
  // const pairsWithDividends = useMemo(
  //   () =>
  //   pairs.reduce<{ [address: string]: CurrencyAmount<Currency> }>(
  //       (memo, address, i) => {
  //         const value = results?.[i]?.result?.[0];
  //         if (value && chainId)
  //           memo[address] = CurrencyAmount.fromRawAmount(
  //             Ether.onChain(chainId),
  //             JSBI.BigInt(value.toString()),
  //           );
  //         return memo;
  //       },
  //       {},
  //     ),
  //   [pairs, chainId, results],
  // );

  // useEffect(() => {
  //   const _pairWithDividends = [...pairWithDividends]
  //   for (let i = current * pageSize; i < (current + 1) * pageSize && i < total; i++) {
  //     _pairWithDividends[i] =
  //   }
  // }, [current])
}

export function useDividendPoolWhitelistPairBalances(pageSize: number) {
  const pairs = useDivdendPoolWhitelistPairs();
  const lastBlockNumber = useBlockNumber();

  const lastPage = Math.floor(pairs.length / pageSize);
  const { current, next, last } = usePagination(0, pageSize, lastPage);

  const currentPairs = useMemo(() => {
    return pairs
      .slice(current * pageSize, (current + 1) * pageSize)
      .map((pair) => pair.lpToken.address);
  }, [pairs, current]);

  const { balances, reserves, anyLoading } = usePairsDividendBalances(
    currentPairs,
  );

  const pairsWithDividends: DividendPoolWhitelistPairBalance[] = useMemo(() => {
    if (!anyLoading) {
      let position = 0;
      return pairs.map((pair, i) => {
        if (i >= current * pageSize && i < current * pageSize + pageSize) {
          const value = balances?.[position]?.result?.[0];
          const reserve = reserves?.[position++].result;
          const amount = value ? JSBI.BigInt(value.toString()) : undefined;
          return {
            address: pair.lpToken.address,
            amount: amount
              ? CurrencyAmount.fromRawAmount(pair.lpToken, amount)
              : null,
            reserve0: reserve ? reserve.reserve0 : null,
            reserve1: reserve ? reserve.reserve1 : null,
            token0: pair.token0,
            token1: pair.token1,
          };
        }
        return {
          address: pair.lpToken.address,
          amount: null,
          reserve0: null,
          reserve1: null,
          token0: pair.token0,
          token1: pair.token1,
        };
      });
    }
    return [];
  }, [balances, anyLoading, current, lastBlockNumber]);

  return { pairsWithDividends, next, current, loading: anyLoading, last };
  // useEffect(() => {
  //   console.log(pairDividends);
  // }, [pairDividends]);
  // const pairsWithDividends = useMemo(
  //   () =>
  //   pairs.reduce<{ [address: string]: CurrencyAmount<Currency> }>(
  //       (memo, address, i) => {
  //         const value = results?.[i]?.result?.[0];
  //         if (value && chainId)
  //           memo[address] = CurrencyAmount.fromRawAmount(
  //             Ether.onChain(chainId),
  //             JSBI.BigInt(value.toString()),
  //           );
  //         return memo;
  //       },
  //       {},
  //     ),
  //   [pairs, chainId, results],
  // );

  // useEffect(() => {
  //   const _pairWithDividends = [...pairWithDividends]
  //   for (let i = current * pageSize; i < (current + 1) * pageSize && i < total; i++) {
  //     _pairWithDividends[i] =
  //   }
  // }, [current])
}

export function useDivdendPoolWhitelistPairs() {
  const { chainId } = useActiveWeb3React();
  const protocol = useProtocol();
  const pairs = getDividendPoolWhitelistPairs(protocol, chainId);
  const whitelistLpPairs = useMemo(() => {
    return pairs?.map((pair) => {
      return {
        lpToken: new Token(
          chainId,
          pair.address,
          18,
          'LTR',
          'Standard Liter Token',
        ),
        token0: pair.token0,
        token1: pair.token1,
      };
    });
  }, [pairs]);

  return whitelistLpPairs ?? [];
}

export function useDivdendPoolWhitelistTokens() {
  const { chainId } = useActiveWeb3React();
  const protocol = useProtocol();
  const tokens = getDividendPoolWhitelistTokens(protocol, chainId);
  const whitelistLpTokens = useMemo(() => {
    return tokens?.map((token) => {
      return new Token(
        chainId,
        token.address,
        token.decimals,
        token.symbol,
        token.name,
      );
    });
  }, [tokens]);
  return whitelistLpTokens ?? [];
}
