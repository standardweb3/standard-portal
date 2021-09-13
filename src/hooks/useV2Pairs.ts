import {
  Currency,
  CurrencyAmount,
  FACTORY_ADDRESS,
  Pair,
  computePairAddress,
  PROTOCOLS,
} from '@digitalnativeinc/standard-protocol-sdk';

import IUniswapV2PairABI from '@sushiswap/core/abi/IUniswapV2Pair.json';
import { Interface } from '@ethersproject/abi';
import { useMemo } from 'react';
import { useMultipleContractSingleData } from '../state/multicall/hooks';
import { useProtocol } from '../state/protocol/hooks';

const PAIR_INTERFACE = new Interface(IUniswapV2PairABI);

export enum PairState {
  LOADING,
  NOT_EXISTS,
  EXISTS,
  INVALID,
}

export function useV2Pairs(
  currencies: [Currency | undefined, Currency | undefined][],
): [PairState, Pair | null][] {
  const protocol = useProtocol();

  const tokens = useMemo(
    () =>
      currencies.map(([currencyA, currencyB]) => [
        currencyA?.wrapped,
        currencyB?.wrapped,
      ]),
    [currencies],
  );

  const pairAddresses = useMemo(
    () =>
      tokens.map(([tokenA, tokenB]) => {
        const factoryAddress =
          PROTOCOLS[protocol].FACTORY_ADDRESS[tokenA.chainId];
        return tokenA &&
          tokenB &&
          tokenA.chainId === tokenB.chainId &&
          !tokenA.equals(tokenB) &&
          factoryAddress
          ? computePairAddress({
              factoryAddress: factoryAddress,
              tokenA,
              tokenB,
              protocol,
            })
          : undefined;
      }),
    [tokens],
  );

  const results = useMultipleContractSingleData(
    pairAddresses,
    PAIR_INTERFACE,
    'getReserves',
  );
  console.log('results', results);

  return useMemo(() => {
    return results.map((result, i) => {
      const { result: reserves, loading } = result;
      const tokenA = tokens[i][0];
      const tokenB = tokens[i][1];
      if (loading) return [PairState.LOADING, null];
      if (!tokenA || !tokenB || tokenA.equals(tokenB))
        return [PairState.INVALID, null];
      if (!reserves) return [PairState.NOT_EXISTS, null];
      const { reserve0, reserve1 } = reserves;
      const [token0, token1] = tokenA.sortsBefore(tokenB)
        ? [tokenA, tokenB]
        : [tokenB, tokenA];
      return [
        PairState.EXISTS,
        new Pair(
          CurrencyAmount.fromRawAmount(token0, reserve0.toString()),
          CurrencyAmount.fromRawAmount(token1, reserve1.toString()),
          protocol,
        ),
      ];
    });
  }, [results, tokens]);
}

export function useV2Pair(
  tokenA?: Currency,
  tokenB?: Currency,
): [PairState, Pair | null] {
  const inputs: [[Currency | undefined, Currency | undefined]] = useMemo(
    () => [[tokenA, tokenB]],
    [tokenA, tokenB],
  );
  return useV2Pairs(inputs)[0];
}
