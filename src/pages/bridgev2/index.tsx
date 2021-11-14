import { useRouter } from 'next/router';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { formatDecimal, isAddress, thousandBit } from '../../bridge/core/Tools';
import { RouterCurrencyInputPanel } from '../../bridge/feature/RouterCurrencyInputPanel';
import RouterCurrencySelectModal from '../../bridge/feature/RouterCurrencySelectModal';
import {
  getCurChainInfo,
  getCurConfigInfo,
} from '../../bridge/functions/bridge';
import { getNodeTotalsupply } from '../../bridge/functions/getBalanceV2';
import { toNormalToken } from '../../bridge/functions/toNormalToken';
import { useFetchRouterTokenList } from '../../bridge/hooks/fetchLists';
import { useAnyswapToken } from '../../bridge/hooks/useAnyswapToken';
import {
  useBridgeCallback,
  useBridgeNativeCallback,
  useBridgeUnderlyingCallback,
  // useCrossBridgeCallback,
} from '../../bridge/hooks/useBridgeCallback';
import {
  NETWORK_ICON,
  NETWORK_LABEL,
  SUPPORTED_NETWORK_IDS,
} from '../../constants/networks';
import { AvailableChainsInfo } from '../../features/bridge/types';
import { tryParseAmount } from '../../functions';
import {
  ApprovalState,
  useActiveWeb3React,
  useAnyswapTokenContract,
  useApproveCallback,
  useTokenContract,
} from '../../hooks';
import { useAnyswapInfo } from '../../hooks/bridge/useBridge';
import { WrapType } from '../../hooks/useWrapCallback';
import { useTransactionAdder } from '../../state/transactions/hooks';
import { useCurrencyBalance } from '../../state/wallet/hooks';
import Image from 'next/image';
import RouterChainSelectModal from '../../bridge/feature/RouterChainModal';
import { ArrowRightIcon } from '@heroicons/react/outline';

let intervalFN: any = '';

export default function Bridge() {
  const { account, chainId } = useActiveWeb3React();

  const { push } = useRouter();

  const allTokensList = useFetchRouterTokenList();
  const allTokensArray = useMemo(() => Object.values(allTokensList), [
    allTokensList,
  ]);

  const addTransaction = useTransactionAdder();

  const chainFrom = {
    id: chainId,
    icon: NETWORK_ICON[chainId],
    name: NETWORK_LABEL[chainId],
  };

  const [chainFromModalOpen, setChainFromModal] = useState(false);
  const [chainToModalOpen, setChainToModal] = useState(false);

  const openChainFromModal = () => setChainFromModal(true);
  const closeChainFromModal = () => setChainFromModal(false);

  const openChainToModal = () => setChainToModal(true);
  const closeChainToMoal = () => setChainToModal(false);

  const [inputBridgeValue, setInputBridgeValue] = useState('');
  const [selectCurrency, setSelectCurrency] = useState<any>();
  const [selectChain, setSelectChain] = useState<any>();

  const handleSelectChain = (chainId) => setSelectChain(chainId);

  const [selectChainList, setSelectChainList] = useState<Array<any>>([]);
  const [recipient, setRecipient] = useState<any>(account ?? '');
  const [swapType, setSwapType] = useState('swap');

  const [intervalCount, setIntervalCount] = useState<number>(0);
  const [modalOpen, setModalOpen] = useState(false);
  const [modalTipOpen, setModalTipOpen] = useState(false);
  const [approvalSubmitted, setApprovalSubmitted] = useState<boolean>(false);

  const [delayAction, setDelayAction] = useState<boolean>(false);

  const [curChain, setCurChain] = useState<any>({
    chain: chainId,
    ts: '',
    bl: '',
  });
  const [destChain, setDestChain] = useState<any>({
    chain: '',
    ts: '',
    bl: '',
  });

  const destConfig = useMemo(() => {
    // console.log(selectCurrency)
    if (
      selectCurrency &&
      selectCurrency?.destChains &&
      selectCurrency?.destChains[selectChain]
    ) {
      return selectCurrency?.destChains[selectChain];
    }
    return false;
  }, [selectCurrency, selectChain]);

  const initBridgeToken = '';

  const isRouter = useMemo(() => {
    // console.log(destConfig)
    if (['swapin', 'swapout'].includes(destConfig?.type)) {
      return false;
    }
    return true;
  }, [destConfig]);

  const useDestAddress = useMemo(() => {
    // only enable when router
    if (isRouter) {
      return destConfig?.routerToken;
    }
    // return destConfig?.DepositAddress;
    return undefined;
  }, [destConfig, isRouter]);

  const isNativeToken = useMemo(() => {
    if (
      selectCurrency &&
      selectCurrency.address &&
      chainId &&
      getCurChainInfo(chainId) &&
      getCurChainInfo(chainId).nativeToken &&
      getCurChainInfo(chainId).nativeToken.toLowerCase() ===
        selectCurrency.address.toLowerCase()
    ) {
      return true;
    }
    return false;
  }, [selectCurrency, chainId]);

  const isUnderlying = useMemo(() => {
    if (selectCurrency && selectCurrency?.underlying) {
      return true;
    }
    return false;
  }, [selectCurrency, selectChain]);

  const isDestUnderlying = useMemo(() => {
    if (
      selectCurrency &&
      selectCurrency?.destChains &&
      selectCurrency?.destChains[selectChain] &&
      selectCurrency?.destChains[selectChain]?.underlying
    ) {
      return true;
    }
    return false;
  }, [selectCurrency, selectChain]);

  const formatCurrency0 = useAnyswapToken(
    selectCurrency?.underlying
      ? {
          ...selectCurrency,
          address: selectCurrency.underlying.address,
          name: selectCurrency.underlying.name,
          symbol: selectCurrency.underlying?.symbol,
          decimals: selectCurrency.underlying.decimals,
        }
      : selectCurrency,
  );

  const formatCurrency = useAnyswapToken(chainId ? undefined : selectCurrency);
  const normalCurrency = toNormalToken(formatCurrency);
  const formatInputBridgeValue = tryParseAmount(
    inputBridgeValue,
    normalCurrency,
  );

  const [approval, approveCallback] = useApproveCallback(
    formatInputBridgeValue ?? undefined,
    isRouter ? useDestAddress : undefined,
  );

  useEffect(() => {
    if (approval === ApprovalState.PENDING) {
      setApprovalSubmitted(true);
    }
  }, [approval, approvalSubmitted]);

  function onDelay() {
    setDelayAction(true);
  }

  function onClear(type?: any) {
    setDelayAction(false);
    setModalTipOpen(false);
    if (!type) {
      setInputBridgeValue('');
    }
  }

  useEffect(() => {
    setDestChain('');
  }, [selectChain, selectCurrency]);

  const getSelectPool = useCallback(async () => {
    if (selectCurrency && chainId) {
      const CC: any = await getNodeTotalsupply(
        selectCurrency?.underlying?.address,
        chainId,
        selectCurrency?.decimals,
        account,
        selectCurrency?.address,
      );
      // console.log(CC)
      // console.log(selectCurrency)
      if (CC) {
        setCurChain({
          chain: chainId,
          ts: selectCurrency?.underlying
            ? CC[selectCurrency?.underlying?.address]?.ts
            : CC[selectCurrency?.address]?.anyts,
          bl: CC[selectCurrency?.address]?.balance,
        });
      }

      const DC: any = await getNodeTotalsupply(
        selectCurrency?.destChains[selectChain]?.underlying?.address,
        selectChain,
        selectCurrency?.destChains[selectChain]?.decimals,
        account,
        selectCurrency?.destChains[selectChain]?.address,
      );
      // console.log(DC)
      if (DC) {
        setDestChain({
          chain: selectChain,
          ts: selectCurrency?.underlying
            ? DC[selectCurrency?.destChains[selectChain]?.underlying.address]
                ?.ts
            : DC[selectCurrency?.destChains[selectChain].token]?.anyts,
          bl: DC[selectCurrency?.destChains[selectChain].address]?.balance,
        });
      }
      // console.log(CC)
      // console.log(DC)
      if (intervalFN) clearTimeout(intervalFN);
      intervalFN = setTimeout(() => {
        setIntervalCount(intervalCount + 1);
      }, 1000 * 10);
    }
  }, [selectCurrency, chainId, account, selectChain, intervalCount]);

  useEffect(() => {
    getSelectPool();
  }, [getSelectPool]);

  const {
    wrapType,
    execute: onWrap,
    inputError: wrapInputError,
  } = useBridgeCallback(
    isRouter ? useDestAddress : undefined,
    formatCurrency ? formatCurrency : undefined,
    isUnderlying
      ? selectCurrency?.underlying?.address
      : selectCurrency?.address,
    recipient,
    inputBridgeValue,
    selectChain,
    destConfig?.type,
  );

  const {
    wrapType: wrapTypeNative,
    execute: onWrapNative,
    inputError: wrapInputErrorNative,
  } = useBridgeNativeCallback(
    isRouter ? useDestAddress : undefined,
    formatCurrency ? formatCurrency : undefined,
    isUnderlying
      ? selectCurrency?.underlying?.address
      : selectCurrency?.address,
    recipient,
    inputBridgeValue,
    selectChain,
    destConfig?.type,
  );

  const {
    wrapType: wrapTypeUnderlying,
    execute: onWrapUnderlying,
    inputError: wrapInputErrorUnderlying,
  } = useBridgeUnderlyingCallback(
    isRouter ? useDestAddress : undefined,
    formatCurrency ? formatCurrency : undefined,
    isUnderlying
      ? selectCurrency?.underlying?.address
      : selectCurrency?.address,
    recipient,
    inputBridgeValue,
    selectChain,
    destConfig?.type,
  );

  // const {
  //   wrapType: wrapTypeCrossBridge,
  //   execute: onWrapCrossBridge,
  //   inputError: wrapInputErrorCrossBridge,
  // } = useCrossBridgeCallback(
  //   formatCurrency ? formatCurrency : undefined,
  //   destConfig?.type === 'swapin' ? useDestAddress : recipient,
  //   inputBridgeValue,
  //   selectChain,
  //   destConfig?.type,
  //   isUnderlying
  //     ? selectCurrency?.underlying?.address
  //     : selectCurrency?.address,
  //   destConfig?.pairid,
  // );

  const outputBridgeValue = useMemo(() => {
    if (inputBridgeValue && destConfig) {
      const baseFee = destConfig.BaseFeePercent
        ? (destConfig.MinimumSwapFee / (100 + destConfig.BaseFeePercent)) * 100
        : 0;
      const fee =
        (Number(inputBridgeValue) * Number(destConfig.SwapFeeRatePerMillion)) /
        100;
      let value = Number(inputBridgeValue) - fee;
      if (fee < Number(destConfig.MinimumSwapFee)) {
        value = Number(inputBridgeValue) - Number(destConfig.MinimumSwapFee);
      } else if (fee > destConfig.MaximumSwapFee) {
        value = Number(inputBridgeValue) - Number(destConfig.MaximumSwapFee);
      } else {
        value = Number(inputBridgeValue) - fee - baseFee;
      }
      if (value && Number(value) && Number(value) > 0) {
        return thousandBit(
          formatDecimal(value, Math.min(6, selectCurrency.decimals)),
          'no',
        );
      }
      return '';
    } else {
      return '';
    }
  }, [inputBridgeValue, destConfig]);

  const isWrapInputError = useMemo(() => {
    if (isRouter) {
      if (!isUnderlying && !isNativeToken) {
        if (wrapInputError) {
          return wrapInputError;
        } else {
          return false;
        }
      } else {
        if (isUnderlying && !isNativeToken) {
          if (wrapInputErrorUnderlying) {
            return wrapInputErrorUnderlying;
          } else {
            return false;
          }
        } else if (isUnderlying && isNativeToken) {
          if (wrapInputErrorNative) {
            return wrapInputErrorNative;
          } else {
            return false;
          }
        }
        return false;
      }
    } else {
      // if (wrapInputErrorCrossBridge) {
      //   return wrapInputErrorCrossBridge;
      // } else {
      return false;
      // }
    }
  }, [
    isNativeToken,
    wrapInputError,
    wrapInputErrorUnderlying,
    wrapInputErrorNative,
    selectCurrency,
    isRouter,
    // wrapInputErrorCrossBridge,
  ]);
  // console.log(selectCurrency)
  const isCrossBridge = useMemo(() => {
    const isAddr = isAddress(recipient, selectChain);
    if (
      account &&
      destConfig &&
      selectCurrency &&
      inputBridgeValue &&
      !isWrapInputError &&
      isAddr &&
      ((isDestUnderlying && destChain) || (!isDestUnderlying && !destChain))
    ) {
      if (
        Number(inputBridgeValue) < Number(destConfig.MinimumSwap) ||
        Number(inputBridgeValue) > Number(destConfig.MaximumSwap) ||
        (isDestUnderlying && Number(inputBridgeValue) > Number(destChain.ts))
      ) {
        return true;
      } else {
        return false;
      }
    } else {
      return true;
    }
  }, [
    selectCurrency,
    account,
    destConfig,
    inputBridgeValue,
    recipient,
    destChain,
    isWrapInputError,
    selectChain,
  ]);

  const isInputError = useMemo(() => {
    if (
      account &&
      destConfig &&
      selectCurrency &&
      inputBridgeValue &&
      isCrossBridge
    ) {
      if (
        Number(inputBridgeValue) < Number(destConfig.MinimumSwap) ||
        Number(inputBridgeValue) > Number(destConfig.MaximumSwap) ||
        (isDestUnderlying && Number(inputBridgeValue) > Number(destChain.ts)) ||
        isWrapInputError ||
        isCrossBridge
      ) {
        // console.log(1)
        return true;
      } else {
        // console.log(2)
        return false;
      }
    } else {
      // console.log(3)
      return false;
    }
  }, [
    account,
    destConfig,
    selectCurrency,
    inputBridgeValue,
    isCrossBridge,
    isWrapInputError,
  ]);

  const btnTxt = useMemo(() => {
    // console.log(isWrapInputError)
    if (isWrapInputError && inputBridgeValue) {
      return isWrapInputError;
    } else if (
      destConfig &&
      inputBridgeValue &&
      (Number(inputBridgeValue) < Number(destConfig.MinimumSwap) ||
        Number(inputBridgeValue) > Number(destConfig.MaximumSwap))
    ) {
      return 'ExceedLimit';
    } else if (
      isDestUnderlying &&
      Number(inputBridgeValue) > Number(destChain.ts)
    ) {
      return 'nodestlr';
    } else if (
      wrapType === WrapType.WRAP ||
      wrapTypeNative === WrapType.WRAP ||
      wrapTypeUnderlying === WrapType.WRAP
      // ||
      // wrapTypeCrossBridge === WrapType.WRAP
    ) {
      return 'swap';
    }
    return 'swap';
  }, [
    isWrapInputError,
    inputBridgeValue,
    destConfig,
    destChain,
    wrapType,
    wrapTypeNative,
    wrapTypeUnderlying,
    isDestUnderlying,
    // wrapTypeCrossBridge,
    isRouter,
  ]);

  useEffect(() => {
    const t =
      selectCurrency &&
      selectCurrency.chainId?.toString() === chainId?.toString()
        ? selectCurrency.address
        : initBridgeToken
        ? initBridgeToken
        : getCurChainInfo(chainId).bridgeInitToken;

    const list: any = {};
    // console.log(bridgeKey)
    // console.log(allTokensList)
    if (Object.keys(allTokensList).length > 0) {
      let useToken = selectCurrency ? selectCurrency?.address : '';
      for (const token in allTokensList) {
        if (!isAddress(token) && token !== getCurChainInfo(chainId).symbol)
          continue;
        list[token] = {
          ...allTokensList[token],
        };
        // console.log(selectCurrency)
        if (!useToken || useToken.chainId?.toString() !== chainId?.toString()) {
          if (
            t === token ||
            list[token]?.symbol?.toLowerCase() === t ||
            list[token]?.underlying?.symbol?.toLowerCase() === t
          ) {
            useToken = token;
          }
        }
      }
      // console.log(list)
      setSelectCurrency(list[useToken]);
    } else {
      setSelectCurrency(undefined);
    }
  }, [chainId, allTokensList]);

  useEffect(() => {
    if (swapType == 'swap' && account && !isNaN(selectChain)) {
      setRecipient(account);
    } else if (isNaN(selectChain) && destConfig?.type === 'swapout') {
      setRecipient('');
    }
  }, [account, swapType, selectChain, destConfig]);

  useEffect(() => {
    // console.log(selectCurrency)
    if (selectCurrency) {
      const arr = [];
      for (const c in selectCurrency?.destChains) {
        if (c?.toString() === chainId?.toString()) continue;
        arr.push(c);
      }
      let useChain: any = selectChain
        ? selectChain
        : getCurChainInfo(chainId).bridgeInitChain;
      if (arr.length > 0) {
        if (!useChain || (useChain && !arr.includes(useChain))) {
          for (const c of arr) {
            if (getCurConfigInfo()?.hiddenChain?.includes(c)) continue;
            useChain = c;
            break;
          }
        }
      }
      setSelectChain(useChain);
      setSelectChainList(arr);
    }
  }, [selectCurrency]);

  const handleMaxInput = useCallback(
    (value) => {
      if (value) {
        setInputBridgeValue(value);
      } else {
        setInputBridgeValue('');
      }
    },
    [setInputBridgeValue],
  );

  const handleModalDismiss = () => setModalOpen(false);
  return (
    <div className="text-text">
      <div onClick={() => setModalOpen(true)}>Open</div>
      <div>Close</div>
      <RouterCurrencySelectModal
        currencyList={allTokensArray}
        isOpen={modalOpen}
        onDismiss={handleModalDismiss}
        onCurrencySelect={(inputCurrency) => {
          setSelectCurrency(inputCurrency);
        }}
      />
      <RouterChainSelectModal
        isOpen={chainFromModalOpen}
        onDismiss={closeChainFromModal}
        chainIds={SUPPORTED_NETWORK_IDS.filter((id) => id != chainFrom.id)}
      />
      <RouterChainSelectModal
        onChainSelect={handleSelectChain}
        isOpen={chainToModalOpen}
        onDismiss={closeChainToMoal}
        chainIds={SUPPORTED_NETWORK_IDS.filter((id) => id != chainFrom.id)}
      />

      <div>
        <RouterCurrencyInputPanel token={selectCurrency} />
      </div>

      <div className="flex items-center justify-center space-x-4">
        <div
          className="
            flex flex-col
            items-center
            bg-opaque rounded-20 p-8"
          onClick={openChainFromModal}
        >
          <Image
            src={chainFrom.icon}
            alt={`${chainFrom.name} Network`}
            className="rounded-full"
            width="120px"
            height="120px"
          />
          <div>{chainFrom.name}</div>
        </div>
        <div className="bg-opaque rounded-full p-4">
          <ArrowRightIcon className="w-6 h-6" />
        </div>
        <div
          className="
            flex flex-col
            items-center
            bg-opaque rounded-20 p-8"
          onClick={openChainFromModal}
        >
          <Image
            src={chainFrom.icon}
            alt={`${chainFrom.name} Network`}
            className="rounded-full"
            width="120px"
            height="120px"
          />
          <div>{chainFrom.name}</div>
        </div>
      </div>
    </div>
  );

  // useEffect(() => {
  //   let tokens: Currency[] = Object.keys((anyswapInfo && anyswapInfo[chainFrom.id]) || {})
  //     .filter((r) => anyswapInfo[chainFrom.id][r].destChainID == chainTo.id.toString())
  //     .map((r) => {
  //       const info: AvailableChainsInfo = anyswapInfo[chainFrom.id][r]
  //       if (r.toLowerCase() == WNATIVE[chainFrom.id].address.toLowerCase()) {
  //         if (chainFrom.id == ChainId.MOONRIVER) {
  //           return Moonriver.onChain(chainFrom.id)
  //         }
  //         if (chainFrom.id == ChainId.BSC) {
  //           return Binance.onChain(chainFrom.id)
  //         }
  //         if (chainFrom.id == ChainId.MAINNET) {
  //           return Ether.onChain(chainFrom.id)
  //         }
  //       }
  //       return new Token(chainFrom.id, getAddress(r), info.token.Decimals, info.token.Symbol, info.name)
  //     })

  //   setTokenList(tokens)
  //   setCurrency0(null)
  //   setCurrencyAmount('')
  // }, [chainFrom, anyswapInfo, chainTo.id])
}
