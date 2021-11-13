import {
  ChainId,
  Currency,
  WNATIVE,
} from '@digitalnative/standard-protocol-sdk';
import { useRouter } from 'next/router';
import { useEffect, useMemo, useState } from 'react';
import { getCurChainInfo } from '../../bridge/functions/bridge';
import { useFetchRouterTokenList } from '../../bridge/hooks/fetchLists';
import {
  NETWORK_ICON,
  NETWORK_LABEL,
  SUPPORTED_NETWORKS,
} from '../../constants/networks';
import { AvailableChainsInfo } from '../../features/bridge/types';
import {
  useActiveWeb3React,
  useAnyswapTokenContract,
  useTokenContract,
} from '../../hooks';
import { useAnyswapInfo } from '../../hooks/bridge/useBridge';
import { useTransactionAdder } from '../../state/transactions/hooks';
import { useCurrencyBalance } from '../../state/wallet/hooks';

export default function Bridge() {
  const { account, chainId } = useActiveWeb3React();
  const { push } = useRouter();

  const addTransaction = useTransactionAdder();

  const chainFrom = {
    id: chainId,
    icon: NETWORK_ICON[chainId],
    name: NETWORK_LABEL[chainId],
  };

  const [inputBridgeValue, setInputBridgeValue] = useState('');
  const [selectCurrency, setSelectCurrency] = useState<any>();
  const [selectChain, setSelectChain] = useState<any>();
  const [selectChainList, setSelectChainList] = useState<Array<any>>([]);
  const [recipient, setRecipient] = useState<any>(account ?? '');
  const [swapType, setSwapType] = useState('swap');

  const [intervalCount, setIntervalCount] = useState<number>(0);
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

  const isRouter = useMemo(() => {
    // console.log(destConfig)
    if (['swapin', 'swapout'].includes(destConfig?.type)) {
      return false;
    }
    return true;
  }, [destConfig]);

  const useDestAddress = useMemo(() => {
    if (isRouter) {
      return destConfig?.routerToken;
    }
    return destConfig?.DepositAddress;
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

  const tokens = useFetchRouterTokenList();
  return <div>bridge</div>;

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
