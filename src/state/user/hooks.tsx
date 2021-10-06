import { AppDispatch, AppState } from '..';
import { BASES_TO_TRACK_LIQUIDITY_FOR, PINNED_PAIRS } from '../../constants';
import {
  ChainId,
  FACTORY_ADDRESS,
  JSBI,
  Pair,
  Percent,
  Token,
  computePairAddress,
  Protocol,
  PROTOCOLS,
  CurrencyAmount,
  Currency,
  getDividendPoolWhitelist,
} from '@digitalnative/standard-protocol-sdk';
import {
  SerializedPair,
  SerializedToken,
  addSerializedPair,
  addSerializedToken,
  removeSerializedToken,
  toggleURLWarning,
  updateUserArcherETHTip,
  updateUserArcherGasEstimate,
  updateUserArcherGasPrice,
  updateUserArcherTipManualOverride,
  updateUserArcherUseRelay,
  updateUserDarkMode,
  updateUserDeadline,
  updateUserExpertMode,
  updateUserSingleHopOnly,
  updateUserSlippageTolerance,
} from './actions';
import { shallowEqual, useDispatch, useSelector } from 'react-redux';
import { useAppDispatch, useAppSelector } from '../hooks';
import { useCallback, useEffect, useMemo, useState } from 'react';

import ReactGA from 'react-ga';
import flatMap from 'lodash/flatMap';
import { useActiveWeb3React } from '../../hooks/useActiveWeb3React';
import { useAllTokens } from '../../hooks/Tokens';
import { useDividendPoolAddress, useFactoryContract } from '../../hooks';
import { usePagination } from '../../hooks/usePagination';
import { useMultipleContractSingleData } from '../multicall/hooks';
import { Interface } from '@ethersproject/abi';
import ERC20_ABI from '../../constants/abis/erc20.json';
import { useProtocol } from '../protocol/hooks';
import { useBlockNumber } from '../application/hooks';
import IUniswapV2PairABI from '@sushiswap/core/abi/IUniswapV2Pair.json';

function serializeToken(token: Token): SerializedToken {
  return {
    chainId: token.chainId,
    address: token.address,
    decimals: token.decimals,
    symbol: token.symbol,
    name: token.name,
  };
}

function deserializeToken(serializedToken: SerializedToken): Token {
  return new Token(
    serializedToken.chainId,
    serializedToken.address,
    serializedToken.decimals,
    serializedToken.symbol,
    serializedToken.name,
  );
}

export function useIsDarkMode(): boolean {
  const { userDarkMode, matchesDarkMode } = useAppSelector(
    ({ user: { matchesDarkMode, userDarkMode } }) => ({
      userDarkMode,
      matchesDarkMode,
    }),
    shallowEqual,
  );

  return userDarkMode === null ? matchesDarkMode : userDarkMode;
}

export function useDarkModeManager(): [boolean, () => void] {
  const dispatch = useAppDispatch();
  const darkMode = useIsDarkMode();

  const toggleSetDarkMode = useCallback(() => {
    dispatch(updateUserDarkMode({ userDarkMode: !darkMode }));
  }, [darkMode, dispatch]);

  return [darkMode, toggleSetDarkMode];
}

export function useIsExpertMode(): boolean {
  return useAppSelector((state) => state.user.userExpertMode);
}

export function useExpertModeManager(): [boolean, () => void] {
  const dispatch = useAppDispatch();
  const expertMode = useIsExpertMode();

  const toggleSetExpertMode = useCallback(() => {
    dispatch(updateUserExpertMode({ userExpertMode: !expertMode }));
  }, [expertMode, dispatch]);

  return [expertMode, toggleSetExpertMode];
}

export function useUserSingleHopOnly(): [
  boolean,
  (newSingleHopOnly: boolean) => void,
] {
  const dispatch = useAppDispatch();

  const singleHopOnly = useAppSelector((state) => state.user.userSingleHopOnly);

  const setSingleHopOnly = useCallback(
    (newSingleHopOnly: boolean) => {
      ReactGA.event({
        category: 'Routing',
        action: newSingleHopOnly ? 'enable single hop' : 'disable single hop',
      });
      dispatch(
        updateUserSingleHopOnly({ userSingleHopOnly: newSingleHopOnly }),
      );
    },
    [dispatch],
  );

  return [singleHopOnly, setSingleHopOnly];
}

export function useSetUserSlippageTolerance(): (
  slippageTolerance: Percent | 'auto',
) => void {
  const dispatch = useAppDispatch();

  return useCallback(
    (userSlippageTolerance: Percent | 'auto') => {
      let value: 'auto' | number;
      try {
        value =
          userSlippageTolerance === 'auto'
            ? 'auto'
            : JSBI.toNumber(userSlippageTolerance.multiply(10_000).quotient);
      } catch (error) {
        value = 'auto';
      }
      dispatch(
        updateUserSlippageTolerance({
          userSlippageTolerance: value,
        }),
      );
    },
    [dispatch],
  );
}

/**
 * Return the user's slippage tolerance, from the redux store, and a function to update the slippage tolerance
 */
export function useUserSlippageTolerance(): Percent | 'auto' {
  const userSlippageTolerance = useAppSelector((state) => {
    return state.user.userSlippageTolerance;
  });

  return useMemo(
    () =>
      userSlippageTolerance === 'auto'
        ? 'auto'
        : new Percent(userSlippageTolerance, 10_000),
    [userSlippageTolerance],
  );
}

export function useUserTransactionTTL(): [number, (slippage: number) => void] {
  const dispatch = useDispatch<AppDispatch>();
  const userDeadline = useSelector<AppState, AppState['user']['userDeadline']>(
    (state) => {
      return state.user.userDeadline;
    },
  );

  const setUserDeadline = useCallback(
    (userDeadline: number) => {
      dispatch(updateUserDeadline({ userDeadline }));
    },
    [dispatch],
  );

  return [userDeadline, setUserDeadline];
}

export function useAddUserToken(): (token: Token) => void {
  const dispatch = useDispatch<AppDispatch>();
  return useCallback(
    (token: Token) => {
      dispatch(addSerializedToken({ serializedToken: serializeToken(token) }));
    },
    [dispatch],
  );
}

export function useRemoveUserAddedToken(): (
  chainId: number,
  address: string,
) => void {
  const dispatch = useAppDispatch();
  return useCallback(
    (chainId: number, address: string) => {
      dispatch(removeSerializedToken({ chainId, address }));
    },
    [dispatch],
  );
}

export function useUserAddedTokens(): Token[] {
  const { chainId } = useActiveWeb3React();
  const serializedTokensMap = useAppSelector(({ user: { tokens } }) => tokens);

  return useMemo(() => {
    if (!chainId) return [];
    return Object.values(serializedTokensMap?.[chainId] ?? {}).map(
      deserializeToken,
    );
  }, [serializedTokensMap, chainId]);
}

function serializePair(pair: Pair): SerializedPair {
  return {
    token0: serializeToken(pair.token0),
    token1: serializeToken(pair.token1),
  };
}

export function usePairAdder(): (pair: Pair) => void {
  const dispatch = useAppDispatch();

  return useCallback(
    (pair: Pair) => {
      dispatch(addSerializedPair({ serializedPair: serializePair(pair) }));
    },
    [dispatch],
  );
}

export function useURLWarningVisible(): boolean {
  return useAppSelector((state: AppState) => state.user.URLWarningVisible);
}

export function useURLWarningToggle(): () => void {
  const dispatch = useAppDispatch();
  return useCallback(() => dispatch(toggleURLWarning()), [dispatch]);
}

/**
 * Given two tokens return the liquidity token that represents its liquidity shares
 * @param tokenA one of the two tokens
 * @param tokenB the other token
 */
export function toV2LiquidityToken({
  tokens: [tokenA, tokenB],
  protocol,
}: {
  tokens: [Token, Token];
  protocol: Protocol;
}): Token {
  if (tokenA.chainId !== tokenB.chainId)
    throw new Error('Not matching chain IDs');
  if (tokenA.equals(tokenB)) throw new Error('Tokens cannot be equal');
  const factoryAddress = PROTOCOLS[protocol].FACTORY_ADDRESS[tokenA.chainId];
  if (!factoryAddress) throw new Error('No V2 factory address on this chain');

  return new Token(
    tokenA.chainId,
    computePairAddress({
      factoryAddress: factoryAddress,
      tokenA,
      tokenB,
      protocol,
    }),
    18,
    'UNI-V2',
    'Uniswap V2',
  );
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

export type DividendPoolWhitelistPairBalance = {
  address: string;
  reserve0: any | null;
  reserve1: any | null;
  token0: string;
  token1: string;
  amount: CurrencyAmount<Currency> | null;
};

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
          const reserve = reserves?.[position].result;
          const amount = value ? JSBI.BigInt(value.toString()) : undefined;
          if (amount) {
            return {
              address: pair.lpToken.address,
              amount: CurrencyAmount.fromRawAmount(pair.lpToken, amount),
              reserve0: reserve?.reserve0,
              reserve1: reserve?.reserve1,
              token0: pair.token0,
              token1: pair.token1,
            };
          }
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
  const whitelist = getDividendPoolWhitelist(protocol, chainId);
  const whitelistLpTokens = useMemo(() => {
    return whitelist.map((pair) => {
      return {
        lpToken: new Token(chainId, pair.address, 18, 'UNI-V2', 'Uniswap V2'),
        token0: pair.token0,
        token1: pair.token1,
      };
    });
  }, [whitelist]);

  return whitelistLpTokens;
}

export function useAllPairs() {
  const { chainId } = useActiveWeb3React();
  const factoryContract = useFactoryContract();
  const [pairAddressesLength, setPairAddressesLength] = useState(null);
  const [pairAddressesPromises, setPairAddressePromises] = useState(null);
  const [pairs, setPairs] = useState([]);

  useEffect(() => {
    if (factoryContract !== null && pairAddressesLength === null) {
      factoryContract.allPairsLength().then((res) => {
        setPairAddressesLength(res.toNumber());
      });
    }
  }, [factoryContract, pairAddressesLength]);

  useEffect(() => {
    if (pairAddressesLength !== null && pairAddressesPromises == null) {
      const _pairAddressesPromises = [];
      for (let i = 0; i < pairAddressesLength; i++) {
        _pairAddressesPromises.push(factoryContract.allPairs(i));
      }
      setPairAddressePromises(_pairAddressesPromises);
    }
  }, [pairAddressesLength, pairAddressesPromises]);

  useEffect(() => {
    if (pairAddressesPromises !== null) {
      Promise.all(pairAddressesPromises).then((values) => {
        setPairs(
          values.map(
            (value) =>
              new Token(chainId, value as string, 18, 'UNI-V2', 'Uniswap V2'),
          ),
        );
      });
    }
  }, [pairAddressesPromises]);

  return pairs;
}

/**
 * Returns all the pairs of tokens that are tracked by the user for the current chain ID.
 */
export function useTrackedTokenPairs(): [Token, Token][] {
  const { chainId } = useActiveWeb3React();
  const tokens = useAllTokens();

  // pinned pairs
  const pinnedPairs = useMemo(
    () => (chainId ? PINNED_PAIRS[chainId] ?? [] : []),
    [chainId],
  );

  // pairs for every token against every base
  const generatedPairs: [Token, Token][] = useMemo(
    () =>
      chainId
        ? flatMap(Object.keys(tokens), (tokenAddress) => {
            const token = tokens[tokenAddress];
            // for each token on the current chain,
            return (
              // loop though all bases on the current chain
              (BASES_TO_TRACK_LIQUIDITY_FOR[chainId] ?? [])
                // to construct pairs of the given token with each base
                .map((base) => {
                  if (base.address === token.address) {
                    return null;
                  } else {
                    return [base, token];
                  }
                })
                .filter((p): p is [Token, Token] => p !== null)
            );
          })
        : [],
    [tokens, chainId],
  );

  // pairs saved by users
  const savedSerializedPairs = useAppSelector(({ user: { pairs } }) => pairs);

  const userPairs: [Token, Token][] = useMemo(() => {
    if (!chainId || !savedSerializedPairs) return [];
    const forChain = savedSerializedPairs[chainId];
    if (!forChain) return [];

    return Object.keys(forChain).map((pairId) => {
      return [
        deserializeToken(forChain[pairId].token0),
        deserializeToken(forChain[pairId].token1),
      ];
    });
  }, [savedSerializedPairs, chainId]);

  const combinedList = useMemo(
    () => userPairs.concat(generatedPairs).concat(pinnedPairs),
    [generatedPairs, pinnedPairs, userPairs],
  );

  return useMemo(() => {
    // dedupes pairs of tokens in the combined list
    const keyed = combinedList.reduce<{ [key: string]: [Token, Token] }>(
      (memo, [tokenA, tokenB]) => {
        const sorted = tokenA.sortsBefore(tokenB);
        const key = sorted
          ? `${tokenA.address}:${tokenB.address}`
          : `${tokenB.address}:${tokenA.address}`;
        if (memo[key]) return memo;
        memo[key] = sorted ? [tokenA, tokenB] : [tokenB, tokenA];
        return memo;
      },
      {},
    );

    return Object.keys(keyed).map((key) => keyed[key]);
  }, [combinedList]);
}

export function useUserArcherUseRelay(): [
  boolean,
  (newUseRelay: boolean) => void,
] {
  const dispatch = useAppDispatch();

  const useRelay = useSelector<
    AppState,
    AppState['user']['userArcherUseRelay']
  >((state) => state.user.userArcherUseRelay);

  const setUseRelay = useCallback(
    (newUseRelay: boolean) => {
      dispatch(updateUserArcherUseRelay({ userArcherUseRelay: newUseRelay }));
    },
    [dispatch],
  );

  return [useRelay, setUseRelay];
}

export function useUserArcherGasPrice(): [
  string,
  (newGasPrice: string) => void,
] {
  const dispatch = useAppDispatch();
  const userGasPrice = useSelector<
    AppState,
    AppState['user']['userArcherGasPrice']
  >((state) => {
    return state.user.userArcherGasPrice;
  });

  const setUserGasPrice = useCallback(
    (newGasPrice: string) => {
      dispatch(updateUserArcherGasPrice({ userArcherGasPrice: newGasPrice }));
    },
    [dispatch],
  );

  return [userGasPrice, setUserGasPrice];
}

export function useUserArcherETHTip(): [string, (newETHTip: string) => void] {
  const dispatch = useAppDispatch();
  const userETHTip = useSelector<
    AppState,
    AppState['user']['userArcherETHTip']
  >((state) => {
    return state.user.userArcherETHTip;
  });

  const setUserETHTip = useCallback(
    (newETHTip: string) => {
      dispatch(updateUserArcherETHTip({ userArcherETHTip: newETHTip }));
    },
    [dispatch],
  );

  return [userETHTip, setUserETHTip];
}

export function useUserArcherGasEstimate(): [
  string,
  (newGasEstimate: string) => void,
] {
  const dispatch = useAppDispatch();
  const userGasEstimate = useSelector<
    AppState,
    AppState['user']['userArcherGasEstimate']
  >((state) => {
    return state.user.userArcherGasEstimate;
  });

  const setUserGasEstimate = useCallback(
    (newGasEstimate: string) => {
      dispatch(
        updateUserArcherGasEstimate({
          userArcherGasEstimate: newGasEstimate,
        }),
      );
    },
    [dispatch],
  );

  return [userGasEstimate, setUserGasEstimate];
}

export function useUserArcherTipManualOverride(): [
  boolean,
  (newManualOverride: boolean) => void,
] {
  const dispatch = useAppDispatch();
  const userTipManualOverride = useSelector<
    AppState,
    AppState['user']['userArcherTipManualOverride']
  >((state) => {
    return state.user.userArcherTipManualOverride;
  });

  const setUserTipManualOverride = useCallback(
    (newManualOverride: boolean) => {
      dispatch(
        updateUserArcherTipManualOverride({
          userArcherTipManualOverride: newManualOverride,
        }),
      );
    },
    [dispatch],
  );

  return [userTipManualOverride, setUserTipManualOverride];
}

/**
 * Same as above but replaces the auto with a default value
 * @param defaultSlippageTolerance the default value to replace auto with
 */
export function useUserSlippageToleranceWithDefault(
  defaultSlippageTolerance: Percent,
): Percent {
  const allowedSlippage = useUserSlippageTolerance();
  return useMemo(
    () =>
      allowedSlippage === 'auto' ? defaultSlippageTolerance : allowedSlippage,
    [allowedSlippage, defaultSlippageTolerance],
  );
}
