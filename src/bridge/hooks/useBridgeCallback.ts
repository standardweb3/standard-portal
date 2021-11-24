import { AnyswapCurrency, NATIVE } from '@digitalnative/standard-protocol-sdk';
import { useMemo } from 'react';
// import { tryParseAmount, tryParseAmount1 } from './useRouterHooks';
import { tryParseAmount as tryParseNormalCurrencyAmount } from '../../functions';

import { useBridgeContract, useSwapUnderlyingContract } from './useContract';
// import {
//   useConnectedWallet,
//   useWallet,
//   ConnectType,
// } from '@terra-money/wallet-provider';
// import { MsgSend } from '@terra-money/terra.js';

import { recordsTxns } from '../core/Tools/recordsTxns';
import { useActiveWeb3React } from '../../hooks';
import { useCurrencyBalance, useETHBalances } from '../../state/wallet/hooks';
import { toNormalCurrency } from '../../bridge/functions/toNormalToken';
// import { signSwapinData, signSwapoutData } from '../core/Wallet';
import { getBaseCoin } from '../functions/bridge';
import { useTransactionAdder } from '../../state/transactions/hooks';
import { useTransactionAdder as useBridgeTransactionAdder } from '../../state/bridgeTransactions/hooks';
import { NETWORK_LABEL } from '../../constants/networks';
import { signSwapinData, signSwapoutData } from '../core/Wallet';

export enum WrapType {
  NOT_APPLICABLE,
  WRAP,
  UNWRAP,
  NOCONNECT,
}

const NOT_APPLICABLE = { wrapType: WrapType.NOT_APPLICABLE };
/**
 * 跨链any token
 * 给定选定的输入和输出货币，返回一个wrap回调
 * @param inputCurrency 选定的输入货币
 * @param typedValue 用户输入值
 */
export function useBridgeCallback(
  routerToken: string | undefined,
  inputCurrency: AnyswapCurrency | undefined,
  inputToken: string | undefined,
  toAddress: string | undefined,
  typedValue: string | undefined,
  toChainID: string | undefined,
  version: string | undefined,
  // ): { execute?: undefined | (() => Promise<void>); inputError?: string } {
): {
  wrapType: WrapType;
  execute?: undefined | (() => Promise<void>);
  inputError?: string;
} {
  const { chainId, account } = useActiveWeb3React();
  const bridgeContract = useBridgeContract(routerToken);
  const normalCurrency = toNormalCurrency(inputCurrency, chainId);
  const balance = useCurrencyBalance(account ?? undefined, normalCurrency);
  // 我们总是可以解析输入货币的金额，因为包装是1:1
  const inputAmount = useMemo(
    () => tryParseNormalCurrencyAmount(typedValue, normalCurrency),
    [normalCurrency, typedValue],
  );
  const addTransaction = useTransactionAdder();
  const addBridgeTransaction = useBridgeTransactionAdder();

  return useMemo(() => {
    if (
      !bridgeContract ||
      !chainId ||
      !inputCurrency ||
      !toAddress ||
      !toChainID
    )
      return NOT_APPLICABLE;

    const sufficientBalance =
      inputAmount && balance && !balance.lessThan(inputAmount);

    return {
      wrapType: WrapType.WRAP,
      execute:
        sufficientBalance && inputAmount
          ? async () => {
              try {
                const txReceipt = await bridgeContract.anySwapOut(
                  inputToken,
                  toAddress,
                  `0x${inputAmount.numerator.toString(16)}`,
                  toChainID,
                );
                addTransaction(txReceipt, {
                  summary: `Submit - Bridge: ${inputAmount.toSignificant(
                    6,
                  )} ${getBaseCoin(inputCurrency?.symbol, chainId)} to ${
                    NETWORK_LABEL[toChainID]
                  }`,
                });
                addBridgeTransaction(txReceipt, {
                  summary: `Bridge: ${inputAmount.toSignificant(
                    6,
                  )} ${getBaseCoin(inputCurrency?.symbol, chainId)} to ${
                    NETWORK_LABEL[toChainID]
                  }`,
                  srcChainId: String(chainId),
                  destChainId: toChainID,
                });
                // registerSwap(txReceipt.hash, chainId)
                if (txReceipt?.hash && account) {
                  const data = {
                    hash: txReceipt.hash?.toLowerCase(),
                    chainId: chainId,
                    selectChain: toChainID,
                    account: account?.toLowerCase(),
                    value: inputAmount.numerator.toString(),
                    formatvalue: inputAmount?.toSignificant(6),
                    to: toAddress?.toLowerCase(),
                    symbol: inputCurrency?.symbol,
                    routerToken: routerToken,
                    version: version,
                  };
                  recordsTxns(data);
                }
              } catch (error) {
                console.error('Could not swapout', error);
              }
            }
          : undefined,
      inputError: sufficientBalance
        ? undefined
        : `Insufficient ${inputCurrency?.symbol}`,
    };
  }, [
    bridgeContract,
    chainId,
    inputCurrency,
    inputAmount,
    balance,
    addTransaction,
    addBridgeTransaction,
    inputToken,
    toAddress,
    toChainID,
    version,
  ]);
}

/**
 * 跨链underlying
 * 给定选定的输入和输出货币，返回一个wrap回调
 * @param inputCurrency 选定的输入货币
 * @param typedValue 用户输入值
 */
export function useBridgeUnderlyingCallback(
  routerToken: string | undefined,
  inputCurrency: AnyswapCurrency | undefined,
  inputToken: string | undefined,
  toAddress: string | undefined,
  typedValue: string | undefined,
  toChainID: string | undefined,
  version: string | undefined,
  // ): { execute?: undefined | (() => Promise<void>); inputError?: string } {
): {
  wrapType: WrapType;
  execute?: undefined | (() => Promise<void>);
  inputError?: string;
} {
  const { chainId, account } = useActiveWeb3React();
  const bridgeContract = useBridgeContract(routerToken);
  const normalCurrency = toNormalCurrency(inputCurrency, chainId);
  const balance = useCurrencyBalance(account ?? undefined, normalCurrency);
  // 我们总是可以解析输入货币的金额，因为包装是1:1
  const inputAmount = useMemo(
    () => tryParseNormalCurrencyAmount(typedValue, normalCurrency),
    [normalCurrency, typedValue],
  );

  const addTransaction = useTransactionAdder();
  const addBridgeTransaction = useBridgeTransactionAdder();

  return useMemo(() => {
    if (
      !bridgeContract ||
      !chainId ||
      !inputCurrency ||
      !toAddress ||
      !toChainID
    )
      return NOT_APPLICABLE;

    const sufficientBalance =
      inputAmount && balance && !balance.lessThan(inputAmount);

    return {
      wrapType: WrapType.WRAP,
      execute:
        sufficientBalance && inputAmount
          ? async () => {
              try {
                // console.log(bridgeContract)
                // console.log(inputAmount.raw.toString(16))
                // console.log(inputAmount.raw.toString())
                // console.log(inputAmount?.toSignificant(6))

                const txReceipt = await bridgeContract.anySwapOutUnderlying(
                  inputToken,
                  toAddress,
                  `0x${inputAmount.numerator.toString(16)}`,
                  toChainID,
                );
                addTransaction(txReceipt, {
                  summary: `Submit - Bridge: ${inputAmount.toSignificant(
                    6,
                  )} ${getBaseCoin(inputCurrency?.symbol, chainId)} to ${
                    NETWORK_LABEL[toChainID]
                  }`,
                });
                addBridgeTransaction(txReceipt, {
                  summary: `Bridge: ${inputAmount.toSignificant(
                    6,
                  )} ${getBaseCoin(inputCurrency?.symbol, chainId)} to ${
                    NETWORK_LABEL[toChainID]
                  }`,
                  srcChainId: String(chainId),
                  destChainId: toChainID,
                });
                // registerSwap(txReceipt.hash, chainId)
                if (txReceipt?.hash && account) {
                  const data = {
                    hash: txReceipt.hash?.toLowerCase(),
                    chainId: chainId,
                    selectChain: toChainID,
                    account: account?.toLowerCase(),
                    value: inputAmount.numerator.toString(),
                    formatvalue: inputAmount?.toSignificant(6),
                    to: toAddress?.toLowerCase(),
                    symbol: inputCurrency?.symbol,
                    routerToken: routerToken,
                    version: version,
                  };
                  recordsTxns(data);
                }
              } catch (error) {
                console.log('Could not swapout', error);
              }
            }
          : undefined,
      inputError: sufficientBalance
        ? undefined
        : `Insufficient ${inputCurrency?.symbol}`,
    };
  }, [
    bridgeContract,
    chainId,
    inputCurrency,
    inputAmount,
    balance,
    addTransaction,
    addBridgeTransaction,
    inputToken,
    toAddress,
    toChainID,
    version,
  ]);
}

/**
 * 跨链native
 * 给定选定的输入和输出货币，返回一个wrap回调
 * @param inputCurrency 选定的输入货币
 * @param typedValue 用户输入值
 */
export function useBridgeNativeCallback(
  routerToken: string | undefined,
  inputCurrency: AnyswapCurrency | undefined,
  inputToken: string | undefined,
  toAddress: string | undefined,
  typedValue: string | undefined,
  toChainID: string | undefined,
  version: string | undefined,
  // ): { execute?: undefined | (() => Promise<void>); inputError?: string } {
): {
  wrapType: WrapType;
  execute?: undefined | (() => Promise<void>);
  inputError?: string;
} {
  const { chainId, account } = useActiveWeb3React();
  const bridgeContract = useBridgeContract(routerToken);
  const balance = useETHBalances(account ? [account] : [])?.[account ?? ''];
  const normalCurrency = toNormalCurrency(inputCurrency, chainId);
  // console.log(balance)
  // console.log(inputCurrency)
  // 我们总是可以解析输入货币的金额，因为包装是1:1
  const inputAmount = useMemo(
    () => tryParseNormalCurrencyAmount(typedValue, normalCurrency),
    [normalCurrency, typedValue],
  );

  const addTransaction = useTransactionAdder();
  const addBridgeTransaction = useBridgeTransactionAdder();

  return useMemo(() => {
    // console.log(inputCurrency)
    if (
      !bridgeContract ||
      !chainId ||
      !inputCurrency ||
      !toAddress ||
      !toChainID
    )
      return NOT_APPLICABLE;
    // console.log(typedValue)

    const sufficientBalance =
      inputAmount && balance && !balance.lessThan(inputAmount);

    return {
      wrapType: WrapType.WRAP,
      execute:
        sufficientBalance && inputAmount
          ? async () => {
              try {
                // console.log(bridgeContract.anySwapOutNative)
                // console.log(inputAmount.raw.toString(16))
                const txReceipt = await bridgeContract.anySwapOutNative(
                  ...[inputToken, toAddress, toChainID],
                  { value: `0x${inputAmount.numerator.toString(16)}` },
                );
                addTransaction(txReceipt, {
                  summary: `Submit - Bridge: ${inputAmount.toSignificant(
                    6,
                  )} ${getBaseCoin(inputCurrency?.symbol, chainId)} to ${
                    NETWORK_LABEL[toChainID]
                  }`,
                });
                addBridgeTransaction(txReceipt, {
                  summary: `Bridge: ${inputAmount.toSignificant(
                    6,
                  )} ${getBaseCoin(inputCurrency?.symbol, chainId)} to ${
                    NETWORK_LABEL[toChainID]
                  }`,
                  srcChainId: String(chainId),
                  destChainId: toChainID,
                });
                // registerSwap(txReceipt.hash, chainId)
                if (txReceipt?.hash && account) {
                  const data = {
                    hash: txReceipt.hash?.toLowerCase(),
                    chainId: chainId,
                    selectChain: toChainID,
                    account: account?.toLowerCase(),
                    value: inputAmount.numerator.toString(),
                    formatvalue: inputAmount?.toSignificant(6),
                    to: toAddress?.toLowerCase(),
                    symbol: inputCurrency?.symbol,
                    routerToken: routerToken,
                    version: version,
                  };
                  recordsTxns(data);
                }
              } catch (error) {
                console.error('Could not swapout', error);
              }
            }
          : undefined,
      inputError: sufficientBalance
        ? undefined
        : `Insufficient ${inputCurrency?.symbol}`,
    };
  }, [
    bridgeContract,
    chainId,
    inputCurrency,
    inputAmount,
    balance,
    addTransaction,
    addBridgeTransaction,
    inputToken,
    toAddress,
    toChainID,
    version,
  ]);
}

/**
 * any token 充值与提现underlying
 * 给定选定的输入和输出货币，返回一个wrap回调
 * @param inputCurrency 选定的输入货币
 * @param typedValue 用户输入值
 */
export function useSwapUnderlyingCallback(
  inputCurrency: AnyswapCurrency | undefined,
  inputToken: string | undefined,
  typedValue: string | undefined,
  swapType: string | undefined,
  // ): { execute?: undefined | (() => Promise<void>); inputError?: string } {
): {
  wrapType: WrapType;
  execute?: undefined | (() => Promise<void>);
  inputError?: string;
} {
  const { chainId, account } = useActiveWeb3React();
  const bridgeContract = useSwapUnderlyingContract(inputToken);
  const normalCurrency = toNormalCurrency(inputCurrency, chainId);
  const balance = useCurrencyBalance(account ?? undefined, normalCurrency);
  // console.log(balance?.raw.toString())
  // console.log(inputCurrency)
  // 我们总是可以解析输入货币的金额，因为包装是1:1
  const inputAmount = useMemo(
    () => tryParseNormalCurrencyAmount(typedValue, normalCurrency),
    [normalCurrency, typedValue],
  );
  const addTransaction = useTransactionAdder();
  return useMemo(() => {
    // console.log(inputCurrency)
    if (!bridgeContract || !chainId || !inputCurrency || !swapType)
      return NOT_APPLICABLE;
    // console.log(inputAmount?.raw.toString())

    const sufficientBalance =
      inputAmount && balance && !balance.lessThan(inputAmount);
    // console.log(sufficientBalance)
    return {
      wrapType: WrapType.WRAP,
      execute:
        sufficientBalance && inputAmount
          ? async () => {
              try {
                // console.log(inputAmount.raw.toString(16))
                const txReceipt =
                  swapType === 'deposit'
                    ? await bridgeContract.deposit(
                        `0x${inputAmount.numerator.toString(16)}`,
                      )
                    : await bridgeContract.withdraw(
                        `0x${inputAmount.numerator.toString(16)}`,
                      );
                addTransaction(txReceipt, {
                  summary: `${
                    swapType === 'deposit' ? 'Deposit' : 'Withdraw'
                  } ${inputAmount.toSignificant(6)} ${getBaseCoin(
                    inputCurrency?.symbol,
                    chainId,
                  )}`,
                });
              } catch (error) {
                console.log('Could not swapout', error);
              }
            }
          : undefined,
      inputError: sufficientBalance
        ? undefined
        : `Insufficient ${inputCurrency?.symbol}`,
    };
  }, [
    bridgeContract,
    chainId,
    inputCurrency,
    inputAmount,
    balance,
    addTransaction,
    swapType,
  ]);
}

/**
 * any token 充值与提现native
 * 给定选定的输入和输出货币，返回一个wrap回调
 * @param inputCurrency 选定的输入货币
 * @param typedValue 用户输入值
 */
export function useSwapNativeCallback(
  routerToken: string | undefined,
  inputCurrency: AnyswapCurrency | undefined,
  inputToken: string | undefined,
  typedValue: string | undefined,
  swapType: string | undefined,
  // ): { execute?: undefined | (() => Promise<void>); inputError?: string } {
): {
  wrapType: WrapType;
  execute?: undefined | (() => Promise<void>);
  inputError?: string;
} {
  const { chainId, account } = useActiveWeb3React();
  const bridgeContract = useBridgeContract(routerToken);
  const ethbalance = useETHBalances(account ? [account] : [])?.[account ?? ''];
  const normalCurrency = toNormalCurrency(inputCurrency, chainId);
  const anybalance = useCurrencyBalance(account ?? undefined, normalCurrency);
  const balance = swapType === 'deposit' ? ethbalance : anybalance;
  // console.log(balance)
  // console.log(inputCurrency)
  // 我们总是可以解析输入货币的金额，因为包装是1:1
  const inputAmount = useMemo(
    () => tryParseNormalCurrencyAmount(typedValue, normalCurrency),
    [normalCurrency, typedValue],
  );
  const addTransaction = useTransactionAdder();
  return useMemo(() => {
    // console.log(inputCurrency)
    if (!bridgeContract || !chainId || !inputCurrency || !swapType)
      return NOT_APPLICABLE;
    // console.log(typedValue)

    const sufficientBalance =
      inputAmount && balance && !balance.lessThan(inputAmount);

    return {
      wrapType: WrapType.WRAP,
      execute:
        sufficientBalance && inputAmount
          ? async () => {
              try {
                // console.log(`0x${inputAmount.raw.toString(16)}`)
                const v = { value: `0x${inputAmount.numerator.toString(16)}` };
                // console.log(v)
                // console.log([inputToken, account])
                const txReceipt =
                  swapType === 'deposit'
                    ? await bridgeContract.depositNative(
                        ...[inputToken, account],
                        v,
                      )
                    : await bridgeContract.withdrawNative(
                        inputToken,
                        `0x${inputAmount.numerator.toString(16)}`,
                        account,
                      );
                addTransaction(txReceipt, {
                  summary: `${
                    swapType === 'deposit' ? 'Deposit' : 'Withdraw'
                  } ${inputAmount.toSignificant(6)} ${getBaseCoin(
                    inputCurrency?.symbol,
                    chainId,
                  )}`,
                });
              } catch (error) {
                console.log('Could not swapout', error);
              }
            }
          : undefined,
      inputError: sufficientBalance
        ? undefined
        : `Insufficient ${inputCurrency?.symbol}`,
    };
  }, [
    bridgeContract,
    chainId,
    inputCurrency,
    inputAmount,
    balance,
    addTransaction,
    inputToken,
    account,
  ]);
}

/**
 * 跨链交易 native swap to native
 * 给定选定的输入和输出货币，返回一个wrap回调
 * @param inputCurrency 选定的输入货币
 * @param typedValue 用户输入值
 */
export function useBridgeSwapNativeCallback(
  routerToken: string | undefined,
  inputCurrency: AnyswapCurrency | undefined,
  toAddress: string | null | undefined,
  typedValue: string | undefined,
  toChainID: string | undefined,
  deadline: number | undefined,
  outputAmount: string | undefined,
  routerPath: any,
  isUnderlying: any,
  version: any,
  // ): { execute?: undefined | (() => Promise<void>); inputError?: string } {
): {
  wrapType: WrapType;
  execute?: undefined | (() => Promise<void>);
  inputError?: string;
} {
  const { chainId, account } = useActiveWeb3React();
  const bridgeContract = useBridgeContract(routerToken);
  const normalCurrency = toNormalCurrency(inputCurrency, chainId);

  const balance = useCurrencyBalance(account ?? undefined, normalCurrency);
  // console.log(balance)
  // console.log(inputCurrency)
  // 我们总是可以解析输入货币的金额，因为包装是1:1
  const inputAmount = useMemo(
    () => tryParseNormalCurrencyAmount(typedValue, normalCurrency),
    [normalCurrency, typedValue],
  );
  const addTransaction = useTransactionAdder();
  return useMemo(() => {
    // console.log(inputCurrency)
    if (
      !bridgeContract ||
      !chainId ||
      !inputCurrency ||
      !toAddress ||
      !toChainID ||
      !deadline ||
      !outputAmount ||
      !routerPath ||
      routerPath.length <= 0
    )
      return NOT_APPLICABLE;
    // console.log(typedValue)

    const sufficientBalance =
      inputAmount && balance && !balance.lessThan(inputAmount);

    return {
      wrapType: WrapType.WRAP,
      execute:
        sufficientBalance && inputAmount
          ? async () => {
              try {
                // console.log(`0x${inputAmount.raw.toString(16)}`)
                // console.log(inputAmount.raw.toString())
                // console.log(outputAmount)
                // console.log(routerPath)
                // console.log(toAddress)
                // console.log(parseInt((Date.now()/1000 + deadline).toString()))
                // console.log(toChainID)
                const txType = isUnderlying
                  ? 'anySwapOutExactTokensForNativeUnderlying'
                  : 'anySwapOutExactTokensForNative';
                // console.log(txType)
                // const txReceipt = await bridgeContract.anySwapOutExactTokensForNative(
                const txReceipt = await bridgeContract[txType](
                  `0x${inputAmount.numerator.toString(16)}`,
                  outputAmount,
                  routerPath,
                  toAddress,
                  parseInt((Date.now() / 1000 + deadline).toString()),
                  toChainID,
                );
                addTransaction(txReceipt, {
                  summary: `Cross bridge txns ${inputAmount.toSignificant(
                    6,
                  )} ${getBaseCoin(inputCurrency?.symbol, chainId)}`,
                });
                // registerSwap(txReceipt.hash, chainId)
                if (txReceipt?.hash && account) {
                  const data = {
                    hash: txReceipt.hash?.toLowerCase(),
                    chainId: chainId,
                    selectChain: toChainID,
                    account: account?.toLowerCase(),
                    value: inputAmount.numerator.toString(),
                    formatvalue: inputAmount?.toSignificant(6),
                    to: toAddress?.toLowerCase(),
                    symbol: inputCurrency?.symbol,
                    routerToken: routerToken,
                    version: version,
                  };
                  recordsTxns(data);
                }
              } catch (error) {
                console.log('Could not swapout', error);
              }
            }
          : undefined,
      inputError: sufficientBalance
        ? undefined
        : `Insufficient ${inputCurrency?.symbol}`,
    };
  }, [
    bridgeContract,
    chainId,
    inputCurrency,
    inputAmount,
    balance,
    addTransaction,
    outputAmount,
    routerPath,
    toAddress,
    deadline,
    toChainID,
  ]);
}

/**
 * 跨链交易native swap to underlying
 * 给定选定的输入和输出货币，返回一个wrap回调
 * @param inputCurrency 选定的输入货币
 * @param typedValue 用户输入值
 */
export function useBridgeSwapUnderlyingCallback(
  routerToken: string | undefined,
  inputCurrency: AnyswapCurrency | undefined,
  toAddress: string | null | undefined,
  typedValue: string | undefined,
  toChainID: string | undefined,
  deadline: number | undefined,
  outputAmount: string | undefined,
  routerPath: any,
  isUnderlying: any,
  version: any,
  // ): { execute?: undefined | (() => Promise<void>); inputError?: string } {
): {
  wrapType: WrapType;
  execute?: undefined | (() => Promise<void>);
  inputError?: string;
} {
  const { chainId, account } = useActiveWeb3React();
  const bridgeContract = useBridgeContract(routerToken);
  const normalCurrency = toNormalCurrency(inputCurrency, chainId);

  const balance = useCurrencyBalance(account ?? undefined, normalCurrency);
  // console.log(balance)
  // console.log(inputCurrency)
  // 我们总是可以解析输入货币的金额，因为包装是1:1
  const inputAmount = useMemo(
    () => tryParseNormalCurrencyAmount(typedValue, normalCurrency),
    [normalCurrency, typedValue],
  );
  const addTransaction = useTransactionAdder();
  return useMemo(() => {
    // console.log(inputCurrency)
    if (
      !bridgeContract ||
      !chainId ||
      !inputCurrency ||
      !toAddress ||
      !toChainID ||
      !deadline ||
      !outputAmount ||
      !routerPath ||
      routerPath.length <= 0
    )
      return NOT_APPLICABLE;
    // console.log(typedValue)

    const sufficientBalance =
      inputAmount && balance && !balance.lessThan(inputAmount);
    // console.log(sufficientBalance)
    // console.log(inputAmount)
    return {
      wrapType: WrapType.WRAP,
      execute:
        sufficientBalance && inputAmount
          ? async () => {
              try {
                // console.log(`0x${inputAmount.raw.toString(16)}`)
                // console.log(outputAmount)
                // console.log(routerPath)
                // console.log(toAddress)
                // console.log(parseInt((Date.now()/1000 + deadline).toString()))
                // console.log(toChainID)
                // const txReceipt = await bridgeContract.anySwapOutExactTokensForNativeUnderlying(
                const txType = isUnderlying
                  ? 'anySwapOutExactTokensForTokensUnderlying'
                  : 'anySwapOutExactTokensForTokens';
                const txReceipt = await bridgeContract[txType](
                  `0x${inputAmount.numerator.toString(16)}`,
                  outputAmount,
                  routerPath,
                  toAddress,
                  parseInt((Date.now() / 1000 + deadline).toString()),
                  toChainID,
                );
                addTransaction(txReceipt, {
                  summary: `Cross bridge txns ${inputAmount.toSignificant(
                    6,
                  )} ${getBaseCoin(inputCurrency?.symbol, chainId)}`,
                });
                // registerSwap(txReceipt.hash, chainId)
                if (txReceipt?.hash && account) {
                  const data = {
                    hash: txReceipt.hash?.toLowerCase(),
                    chainId: chainId,
                    selectChain: toChainID,
                    account: account?.toLowerCase(),
                    value: inputAmount.numerator.toString(),
                    formatvalue: inputAmount?.toSignificant(6),
                    to: toAddress?.toLowerCase(),
                    symbol: inputCurrency?.symbol,
                    routerToken: routerToken,
                    version: version,
                  };
                  recordsTxns(data);
                }
              } catch (error) {
                console.log('Could not swapout', error);
              }
            }
          : undefined,
      inputError: sufficientBalance
        ? undefined
        : `Insufficient ${inputCurrency?.symbol}`,
    };
  }, [
    bridgeContract,
    chainId,
    inputCurrency,
    inputAmount,
    balance,
    addTransaction,
    outputAmount,
    routerPath,
    toAddress,
    deadline,
    toChainID,
  ]);
}

// /**
//  * 跨链桥
//  * 给定选定的输入和输出货币，返回一个wrap回调
//  * @param inputCurrency 选定的输入货币
//  * @param typedValue 用户输入值
//  */
export function useCrossBridgeCallback(
  inputCurrency: AnyswapCurrency | undefined,
  toAddress: string | undefined,
  typedValue: string | undefined,
  toChainID: any,
  txnsType: string | undefined,
  inputToken: string | undefined,
  pairid: string | undefined,
): {
  wrapType: WrapType;
  execute?: undefined | (() => Promise<void>);
  inputError?: string;
} {
  const { chainId, account } = useActiveWeb3React();
  const normalCurrency = toNormalCurrency(inputCurrency, chainId);
  // const balance = inputCurrency ? useCurrencyBalance(account ?? undefined, inputCurrency) : useETHBalances(account ? [account] : [])?.[account ?? '']
  const tokenBalance = useCurrencyBalance(account ?? undefined, normalCurrency);
  const ethBalance = useETHBalances(account ? [account] : [])?.[account ?? ''];
  const balance = inputCurrency ? tokenBalance : ethBalance;
  // console.log(balance)
  // console.log(inputCurrency)
  // 我们总是可以解析输入货币的金额，因为包装是1:1
  const inputAmount = useMemo(
    () =>
      tryParseNormalCurrencyAmount(
        typedValue,
        inputCurrency ? normalCurrency : NATIVE[chainId],
      ),
    [normalCurrency, typedValue],
  );
  const addTransaction = useTransactionAdder();
  const addBridgeTransaction = useBridgeTransactionAdder();

  return useMemo(() => {
    if (!chainId || !toAddress || !toChainID) return NOT_APPLICABLE;
    // console.log(typedValue)

    const sufficientBalance =
      inputAmount && balance && !balance.lessThan(inputAmount);
    // console.log(inputAmount?.raw?.toString())
    // console.log(balance?.raw?.toString())
    return {
      wrapType: WrapType.WRAP,
      execute:
        sufficientBalance && inputAmount
          ? async () => {
              try {
                console.log(txnsType);
                const txReceipt: any =
                  txnsType === 'swapin'
                    ? await signSwapinData({
                        value: `0x${inputAmount.numerator.toString(16)}`,
                        address: toAddress,
                        token: inputToken,
                        destChain: toChainID,
                        isRecords: true,
                      })
                    : await signSwapoutData({
                        value: `0x${inputAmount.numerator.toString(16)}`,
                        address: toAddress,
                        token: inputToken,
                        destChain: toChainID,
                        isRecords: true,
                      });
                const txData: any = { hash: txReceipt?.info };
                addTransaction(txData, {
                  summary: `Submit - Bridge: ${inputAmount.toSignificant(
                    6,
                  )} ${getBaseCoin(inputCurrency?.symbol, chainId)} to ${
                    NETWORK_LABEL[toChainID]
                  }`,
                });
                addBridgeTransaction(txData, {
                  summary: `Bridge: ${inputAmount.toSignificant(
                    6,
                  )} ${getBaseCoin(inputCurrency?.symbol, chainId)} to ${
                    NETWORK_LABEL[toChainID]
                  }`,
                  srcChainId: String(chainId),
                  destChainId: toChainID,
                  pairId: pairid,
                });
                if (txData.hash && account) {
                  const rdata = {
                    hash: txData.hash,
                    chainId: chainId,
                    selectChain: toChainID,
                    account: account?.toLowerCase(),
                    value: inputAmount.numerator.toString(),
                    formatvalue: inputAmount?.toSignificant(6),
                    to: toAddress,
                    symbol: '',
                    version: txnsType,
                    pairid: pairid,
                  };
                  recordsTxns(rdata);
                }
              } catch (error) {
                console.log('Could not swapout', error);
              }
            }
          : undefined,
      inputError: sufficientBalance
        ? undefined
        : `Insufficient ${
            inputCurrency ? inputCurrency?.symbol : NATIVE[chainId].symbol
          }`,
    };
  }, [
    chainId,
    inputCurrency,
    inputAmount,
    balance,
    addTransaction,
    txnsType,
    toAddress,
    inputToken,
    toChainID,
    pairid,
  ]);
}

// /**
//  * 跨链桥
//  * 给定选定的输入和输出货币，返回一个wrap回调
//  * @param inputCurrency 选定的输入货币
//  * @param typedValue 用户输入值
//  */
// export function useTerraCrossBridgeCallback(
//   inputCurrency: AnyswapCurrency | undefined,
//   toAddress: string,
//   typedValue: string | undefined,
//   toChainID: any,
//   inputToken: string | undefined,
//   pairid: string | undefined,
//   // ): { execute?: undefined | (() => Promise<void>); inputError?: string } {
// ): {
//   wrapType: WrapType;
//   onConnect?: undefined | (() => Promise<void>);
//   execute?: undefined | (() => Promise<void>);
//   inputError?: string;
// } {
//   const { chainId, account } = useActiveWeb3React();
//   const connectedWallet = useConnectedWallet();
//   const { post, connect } = useWallet();
//   // console.log(balance)
//   // console.log(inputCurrency)
//   // 我们总是可以解析输入货币的金额，因为包装是1:1
//   const inputAmount = useMemo(
//     () =>
//       inputCurrency
//         ? tryParseAmount(typedValue, inputCurrency)
//         : tryParseAmount1(typedValue, 18),
//     [inputCurrency, typedValue],
//   );
//   const addTransaction = useTransactionAdder();

//   const sendTx = useCallback(() => {
//     console.log(connectedWallet);
//     if (
//       !connectedWallet ||
//       !account ||
//       !inputAmount ||
//       ConnectType.CHROME_EXTENSION !== connectedWallet.connectType
//     )
//       return;
//     const send: any = new MsgSend(connectedWallet.walletAddress, toAddress, {
//       uluna: inputAmount.raw.toString(),
//     });
//     return post({
//       msgs: [send],
//       memo: account,
//     });
//   }, []);

//   return useMemo(() => {
//     if (!chainId || !toAddress || !toChainID) return NOT_APPLICABLE;
//     // console.log(typedValue)

//     // console.log(inputAmount?.raw?.toString())
//     // console.log(balance?.raw?.toString())
//     return {
//       wrapType: !connectedWallet ? WrapType.NOCONNECT : WrapType.WRAP,
//       onConnect: async () => {
//         connect(ConnectType.CHROME_EXTENSION);
//       },
//       execute: inputAmount
//         ? async () => {
//             try {
//               console.log(12);
//               const txReceipt: any = await sendTx();
//               console.log(txReceipt);
//               if (txReceipt) {
//                 const txData: any = { hash: txReceipt?.result?.txhash };
//                 addTransaction(txData, {
//                   summary: `Cross bridge ${inputAmount.toSignificant(
//                     6,
//                   )} ${getBaseCoin(inputCurrency?.symbol, chainId)}`,
//                 });
//                 if (txReceipt?.info && account) {
//                   const data = {
//                     hash: txData.hash?.toLowerCase(),
//                     chainId: chainId,
//                     selectChain: toChainID,
//                     account: connectedWallet?.walletAddress,
//                     value: inputAmount.raw.toString(),
//                     formatvalue: inputAmount?.toSignificant(6),
//                     to: account,
//                     symbol: inputCurrency?.symbol,
//                     version: 'swapin',
//                     pairid: pairid,
//                   };
//                   recordsTxns(data);
//                 }
//               }
//             } catch (error) {
//               console.log('Could not swapout', error);
//             }
//           }
//         : undefined,
//       inputError: undefined,
//     };
//   }, [
//     chainId,
//     inputCurrency,
//     inputAmount,
//     addTransaction,
//     toAddress,
//     inputToken,
//     toChainID,
//   ]);
// }
