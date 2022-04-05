import Head from 'next/head';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { formatDecimal, isAddress, thousandBit } from '../../bridge/core/Tools';
import { RouterCurrencyInputPanel } from '../../bridge/feature/RouterCurrencyInputPanel';
import RouterCurrencySelectModal from '../../bridge/feature/RouterCurrencySelectModal';
import {
  getCurChainInfo,
  getCurConfigInfo,
} from '../../bridge/functions/bridge';
import { toNormalCurrency } from '../../bridge/functions/toNormalToken';
import { useCrossBridgeCallback } from '../../bridge/hooks/useBridgeCallback';
import {
  NETWORK_ICON,
  NETWORK_LABEL,
  SUPPORTED_NETWORK_IDS,
} from '../../constants/networks';
import { classNames, tryParseAmount } from '../../functions';
import {
  ApprovalState,
  useActiveWeb3React,
  useApproveCallback,
} from '../../hooks';
import { WrapType } from '../../hooks/useWrapCallback';
import RouterChainSelectModal from '../../bridge/feature/RouterChainModal';
import { ArrowRightIcon, ChevronDownIcon } from '@heroicons/react/outline';
import { WalletConnector } from '../../components-ui/WalletConnector';
import { Button, ButtonConfirmed } from '../../components-ui/Button';
import { RippleSpinner } from '../../components-ui/Spinner/RippleSpinner';
import { getBaseCoin } from '../../bridge/functions/bridge';
import { DefinedStyles } from '../../utils/DefinedStyles';
import { Page } from '../../components-ui/Page';
import { PageContent } from '../../components-ui/PageContent';
import { useSizeXs, ViewportMediumUp } from '../../components-ui/Responsive';
import { PageHeader } from '../../components-ui/PageHeader';
import { useCurrencyBalance } from '../../state/wallet/hooks';
import { BridgeHeader } from '../../bridge/feature/BridgeHeader';
import Reminder from '../../bridge/feature/Reminder';
import { GetTokenListByChainID } from '../../bridge/core/getBridgeInfo';
import { getNodeBalance } from '../../bridge/functions/getBalanceV2';
import { useAnyswapToken } from '../../bridge/hooks/useAnyswapToken';
import Image from '../../components-ui/Image';
import { NetworkGuardWrapper } from '../../guards/Network';
import { ChainId } from '@digitalnative/standard-protocol-sdk';
import { ExternalLink } from '../../components-ui/ExternalLink';

let intervalFN: any = '';

export enum BridgeType {
  //   deposit = 'deposit',
  bridge = 'bridge',
}

export enum SelectListType {
  INPUT = 'INPUT',
  OUTPUT = 'OUTPUT',
}

const unknown =
  'https://raw.githubusercontent.com/digitalnativeinc/icons/master/token/unknown.png';

export function Bridge() {
  const { account, chainId } = useActiveWeb3React();
  // const { push } = useRouter();

  // tx adder
  // const addTransaction = useTransactionAdder();

  // chain selection modals
  const [chainFromModalOpen, setChainFromModal] = useState(false);
  const [chainToModalOpen, setChainToModal] = useState(false);

  // chain selection modal handlers
  const openChainFromModal = () => setChainFromModal(true);
  const closeChainFromModal = () => setChainFromModal(false);
  const openChainToModal = () => setChainToModal(true);
  const closeChainToMoal = () => setChainToModal(false);

  // bridge amount and currency
  const [inputBridgeValue, setInputBridgeValue] = useState('');
  const [selectCurrency, setSelectCurrency] = useState<any>();
  const [selectCurrencyType, setSelectCurrencyType] = useState<any>(
    SelectListType.INPUT,
  );

  // to chain state / handler
  const [selectChain, setSelectChain] = useState<any>();
  const handleSelectChain = (chainId) => {
    setSelectChain(chainId);
  };

  // current chain Info
  const chainFrom = {
    id: chainId,
    icon: NETWORK_ICON[chainId],
    name: NETWORK_LABEL[chainId],
  };

  // to chain info
  const chainTo = {
    id: selectChain,
    icon: selectChain ? NETWORK_ICON[selectChain] : unknown,
    name: selectChain ? NETWORK_LABEL[selectChain] : 'Select Chain',
  };

  // curChain / destChain info balance + ts tracker
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

  // router token list
  //   const allTokensList = useFetchRouterTokenList();
  const [allTokens, setAllTokens] = useState<any>({});

  const [selectChainList, setSelectChainList] = useState<Array<any>>([]);

  // custom recipient
  const [recipient, setRecipient] = useState<any>(account ?? '');

  // bridge swap type
  const [swapType, setSwapType] = useState(BridgeType.bridge);

  const allTokensList = useMemo(() => allTokens?.[swapType] ?? {}, [
    allTokens,
    swapType,
  ]);

  const allTokensArray = useMemo(
    () =>
      Object.values(allTokensList).filter((token: any) => {
        if (token.destChains[selectChain] === undefined) {
          return false;
        }
        return true;
      }),
    [allTokensList, selectChain],
  );

  const [count, setCount] = useState<number>(0);
  const [intervalCount, setIntervalCount] = useState<number>(0);

  // router currency select modal
  const [modalOpen, setModalOpen] = useState(false);
  const [modalTipOpen, setModalTipOpen] = useState(false);

  const [delayAction, setDelayAction] = useState<boolean>(false);

  // default bridge token for a network
  const initBridgeToken = '';

  useEffect(() => {
    setSelectChain(getCurChainInfo(chainId).crossBridgeInitChain);
  }, [chainId]);

  useEffect(() => {
    const urlParams =
      selectCurrency &&
      selectCurrency.chainId?.toString() === chainId?.toString() &&
      selectChain &&
      selectCurrency.destChains[selectChain] !== undefined
        ? selectCurrency.address
        : initBridgeToken
        ? initBridgeToken
        : getCurChainInfo(chainId).crossBridgeInitTokens[
            parseInt(selectChain)
          ]?.toLowerCase();

    const list: any = {};
    if (allTokensArray.length > 0) {
      for (const token in allTokensList) {
        const obj = allTokensList;
        if (
          !isAddress(token, chainId) &&
          token !== getCurChainInfo(chainId).symbol
        )
          continue;
        if (obj[token].destChains[selectChain] === undefined) {
          continue;
        }
        list[token] = {
          ...obj[token],
        };
        if (
          !selectCurrency ||
          selectCurrency?.chainId?.toString() !== chainId?.toString() ||
          selectCurrency.destChains[selectChain] === undefined
        ) {
          if (
            urlParams &&
            (urlParams === token.toLowerCase() ||
              list[token]?.name?.toLowerCase() === urlParams ||
              list[token]?.symbol?.toLowerCase() === urlParams)
          ) {
            setSelectCurrency(list[token]);
          }
        }
      }
    } else {
      setSelectCurrency('');
    }
  }, [allTokensArray, swapType, chainId, selectCurrencyType, selectChain]);

  const bridgeConfig = useMemo(() => {
    if (
      selectCurrency?.address &&
      (allTokensList[selectCurrency?.address.toLowerCase()] !== undefined ||
        allTokensList[selectCurrency?.address] !== undefined)
    ) {
      return (
        allTokensList[selectCurrency?.address.toLowerCase()] ||
        allTokensList[selectCurrency?.address]
      );
    }
    return '';
  }, [selectCurrency, allTokensList]);

  const destConfig = useMemo(() => {
    if (bridgeConfig && bridgeConfig?.destChains[selectChain]) {
      return bridgeConfig?.destChains[selectChain];
    }
    return false;
  }, [bridgeConfig, selectChain]);

  // useEffect(() => {
  //   if (
  //     (selectCurrency &&
  //       chainId?.toString() !== selectCurrency?.chainId?.toString()) ||
  //     (!bridgeConfig && selectCurrency)
  //   ) {
  //     // history.go(0);
  //   }
  // }, [chainId, bridgeConfig, swapType]);

  const isUnderlying = useMemo(() => {
    if (selectCurrency?.underlying) {
      return true;
    }
    return false;
  }, [selectCurrency, selectChain, destConfig]);

  const isDestUnderlying = useMemo(() => {
    if (destConfig?.underlying) {
      return true;
    }
    return false;
  }, [destConfig]);

  const isNativeToken = useMemo(() => {
    return false;
  }, [selectCurrency, chainId]);

  const isUsePool = useMemo(() => {
    if (selectCurrency?.symbol?.toLowerCase() === 'prq') {
      return false;
    }
    return true;
  }, [selectCurrency]);

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

  // formats selected curreny to AnyswapToken Class
  const formatCurrency = useAnyswapToken(chainId ? selectCurrency : undefined);
  // formats AnyswapToken to noraml Token class
  const normalCurrency = toNormalCurrency(selectCurrency, chainId);
  const balance = useCurrencyBalance(account, normalCurrency);
  // uses the normal Token class to utilize CurrencyAmount
  const formatInputBridgeValue = tryParseAmount(
    inputBridgeValue,
    normalCurrency,
  );

  // track pending approval
  const [approvalSubmitted, setApprovalSubmitted] = useState<boolean>(false);
  // approval callback
  const [approval, approveCallback] = useApproveCallback(
    formatInputBridgeValue ?? undefined,
    formatCurrency0?.address,
  );

  // useEffect to track if approval has been submitted
  useEffect(() => {
    if (approval === ApprovalState.PENDING) {
      setApprovalSubmitted(true);
    }
  }, [approval, approvalSubmitted]);

  // delay button enabling
  function onDelay() {
    setDelayAction(true);
  }

  // enables button
  function onClear(type?: any) {
    setDelayAction(false);
    setModalTipOpen(false);
    if (!type) {
      setInputBridgeValue('');
    }
  }

  // if selectCurrency is changed, reset destChain to none
  useEffect(() => {
    setDestChain('');
  }, [selectChain, selectCurrency]);

  // polls liquidity pool for selected currency

  const getSelectPool = useCallback(async () => {
    if (
      selectCurrency &&
      chainId &&
      (isUnderlying || isDestUnderlying) &&
      isUsePool
    ) {
      const curChain = isUnderlying ? chainId : selectChain;
      const destChain = isUnderlying ? selectChain : chainId;
      const tokenA = isUnderlying
        ? selectCurrency
        : selectCurrency?.destChains[selectChain];
      const dec = selectCurrency?.decimals;

      const CC: any = await getNodeBalance(
        tokenA?.underlying?.address,
        tokenA?.address,
        curChain,
        dec,
      );
      let DC: any = '';
      if (!isNaN(selectChain)) {
        DC = await getNodeBalance(
          // tokenA?.underlying?.address,
          selectCurrency?.destChains[selectChain]?.DepositAddress,
          selectCurrency.symbol,
          destChain,
          dec,
        );
      }
      if (CC) {
        if (isUnderlying) {
          setCurChain({
            chain: chainId,
            ts: CC,
          });
        } else {
          setDestChain({
            chain: selectChain,
            ts: CC,
          });
        }
      }
      if (DC) {
        if (isUnderlying) {
          setDestChain({
            chain: selectChain,
            ts: DC,
          });
        } else {
          setCurChain({
            chain: chainId,
            ts: DC,
          });
        }
      }
      if (intervalFN) clearTimeout(intervalFN);
      intervalFN = setTimeout(() => {
        setIntervalCount(intervalCount + 1);
      }, 1000 * 10);
    }
  }, [
    selectCurrency,
    chainId,
    account,
    selectChain,
    intervalCount,
    isDestUnderlying,
    isUnderlying,
  ]);

  // executes getSelectPool on start
  useEffect(() => {
    getSelectPool();
  }, [getSelectPool]);

  const {
    wrapType,
    execute: onWrap,
    inputError: wrapInputError,
  } = useCrossBridgeCallback(
    formatCurrency ? formatCurrency : undefined,
    destConfig?.type === 'swapin' ? destConfig.DepositAddress : recipient,
    inputBridgeValue,
    selectChain,
    destConfig?.type,
    isUnderlying
      ? selectCurrency?.underlying?.address
      : selectCurrency?.address,
    destConfig?.pairid,
  );

  const outputBridgeValue = useMemo(() => {
    if (inputBridgeValue && destConfig) {
      const baseFee = destConfig.BaseFeePercent
        ? (destConfig.MinimumSwapFee / (100 + destConfig.BaseFeePercent)) * 100
        : 0;
      const fee =
        Number(inputBridgeValue) * Number(destConfig.SwapFeeRatePerMillion);
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

  const isCrossBridge = useMemo(() => {
    const isAddr = isAddress(recipient, selectChain);
    if (
      account &&
      destConfig &&
      selectCurrency &&
      inputBridgeValue &&
      !wrapInputError &&
      Boolean(isAddr) &&
      (!(isUnderlying && isDestUnderlying) ||
        ((isUnderlying || isDestUnderlying) && destChain))
    ) {
      if (
        Number(inputBridgeValue) < Number(destConfig.MinimumSwap) ||
        Number(inputBridgeValue) > Number(destConfig.MaximumSwap) ||
        ((isUnderlying || isDestUnderlying) &&
          isUsePool &&
          Number(inputBridgeValue) > Number(destChain.ts))
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
    swapType,
    destChain,
    wrapInputError,
    selectChain,
    isUnderlying,
    isDestUnderlying,
    isUsePool,
  ]);

  // // error - looks the same as isInputError = isCrosBridge
  // const isInputError = useMemo(() => {
  //   if (
  //     account &&
  //     destConfig &&
  //     selectCurrency &&
  //     inputBridgeValue &&
  //     isCrossBridge
  //   ) {
  //     return true;
  //   } else {
  //     return false;
  //   }
  // }, [account, destConfig, selectCurrency, inputBridgeValue, isCrossBridge]);

  // button text

  const btnTxt = useMemo(() => {
    if (wrapInputError && inputBridgeValue) {
      return wrapInputError;
    } else if (destConfig && inputBridgeValue) {
      if (Number(inputBridgeValue) > Number(destConfig.MaximumSwap)) {
        return 'Over Maximum Limit';
      }
      if (Number(inputBridgeValue) < Number(destConfig.MinimumSwap)) {
        return 'Below Minimum Limit';
      }
    } else if (
      (isUnderlying || isDestUnderlying) &&
      isUsePool &&
      Number(inputBridgeValue) > Number(destChain.ts)
    ) {
      return 'Dest Liquidity Insufficient';
    } else if (wrapType === WrapType.WRAP) {
      return 'Confirm';
    }
    return 'Confirm';
  }, [
    wrapInputError,
    inputBridgeValue,
    swapType,
    isUnderlying,
    isDestUnderlying,
    isUsePool,
  ]);

  useEffect(() => {
    if (account) {
      if (destConfig?.type === 'swapin' || !isNaN(selectChain)) {
        setRecipient(account);
      } else {
        setRecipient('');
      }
    } else {
      setRecipient('');
    }
  }, [account, destConfig, swapType, selectChain]);

  useEffect(() => {
    if (chainId) {
      setAllTokens({});
      GetTokenListByChainID({
        srcChainID: chainId,
        chainList: getCurConfigInfo().showChain,
      }).then((res: any) => {
        if (res) {
          setAllTokens(res);
        } else {
          setTimeout(() => {
            setCount(count + 1);
          }, 1000);
          // setBridgeConfig('')
        }
      });
    } else {
      setAllTokens({});
    }
    // }, [chainId, swapType, count, selectCurrency])
  }, [chainId, count]);
  // useEffect(() => {
  //   if (selectCurrency) {
  //     const arr: any = [];

  //     for (const c in selectCurrency?.destChains) {
  //       if (c?.toString() === chainId?.toString()) continue;
  //       if (
  //         (getCurConfigInfo().showChain.length > 0 &&
  //           !getCurConfigInfo().showChain.includes(c)) ||
  //         c?.toString() === chainId?.toString() ||
  //         !getCurChainInfo(chainId) ||
  //         !SUPPORTED_NETWORKS[parseInt(c)]
  //       )
  //         continue;
  //       arr.push(c);
  //     }

  //     let useChain: any = selectChain
  //       ? selectChain
  //       : getCurChainInfo(chainId).bridgeInitChain;

  //     if (arr.length > 0) {
  //       if (!useChain || (useChain && !arr.includes(useChain))) {
  //         for (const c of arr) {
  //           if (getCurConfigInfo()?.hiddenChain?.includes(c)) continue;
  //           useChain = c;
  //           break;
  //         }
  //       }
  //     }
  //     setSelectChain(useChain);
  //     setSelectChainList(arr);
  //   } else {
  //     let initChain = getCurChainInfo(chainId).bridgeInitChain;
  //     setSelectChain(initChain);
  //   }
  // }, [selectCurrency, swapType, chainId]);

  const handleModalDismiss = () => setModalOpen(false);
  const isViewportXs = useSizeXs();
  return (
    <>
      <Head>
        <title>Bridge | Standard Protocol</title>
        <meta
          key="description"
          name="description"
          content="Bridge assets from one EVM chain to another, powered by Anyswap"
        />
      </Head>
      <Page id="router-page" className={DefinedStyles.page}>
        <ViewportMediumUp>
          <PageHeader title="Bridge" />
        </ViewportMediumUp>
        <PageContent>
          <div className="space-y-4 w-full md:max-w-[600px] bg-transparent sm:bg-background rounded-20 p-0 sm:p-5 text-text">
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
              chainIds={SUPPORTED_NETWORK_IDS.filter(
                (id) => id != chainFrom.id,
              )}
              isFrom
            />
            <RouterChainSelectModal
              onChainSelect={handleSelectChain}
              isOpen={chainToModalOpen}
              onDismiss={closeChainToMoal}
              chainIds={SUPPORTED_NETWORK_IDS.filter(
                (id) =>
                  id != chainFrom.id &&
                  getCurChainInfo(chainId).crossBridgeInitTokens[id],
              )}
            />
            <div className="flex justify-center w-full">
              <BridgeHeader />
            </div>
            <div className="flex flex-col sm:flex-row items-center justify-center space-y-2">
              <div className="flex-1 w-full space-y-2 flex flex-col items-end sm:items-stretch">
                <div className="text-grey text-sm text-right sm:text-center pr-4 sm:pr-0">
                  From
                </div>
                <div
                  className="
                  cursor-pointer
                  inline-flex sm:flex 
                  flex-row sm:flex-col
                  justify-end
                  items-center
                  bg-opaque rounded-20 
                  px-4 py-4
                  sm:px-8 sm:py-8
                  space-y-0
                  space-x-3
                  sm:space-y-6
                  sm:space-x-0"
                  onClick={openChainFromModal}
                >
                  <div
                    className={classNames(
                      'bg-white rounded-full overflow-hidden',
                      isViewportXs ? 'w-[42px] h-[42px]' : 'w-[72px] h-[72px]',
                    )}
                  >
                    <Image
                      src={chainFrom?.icon ?? unknown}
                      alt={`${chainFrom?.name} Network`}
                      width="100%"
                      height="100%"
                    />
                  </div>
                  <div
                    className="
                    text-grey sm:border border-grey 
                    rounded-20 px-3 py-1 
                    font-bold
                    flex items-center space-x-1
                    "
                  >
                    <div>{chainFrom?.name}</div>
                    <ChevronDownIcon className="w-3 h-3" />
                  </div>
                </div>
              </div>
              {!isViewportXs && (
                <div className="bg-icon-btn-grey rounded-full p-3 mx-3">
                  <ArrowRightIcon className="w-6 h-6" />
                </div>
              )}
              <div className="flex-1 w-full space-y-2 flex flex-col items-end sm:items-stretch">
                <div className="text-grey text-sm text-right sm:text-center pr-4 sm:pr-0">
                  To
                </div>
                <div
                  className="
               cursor-pointer
               inline-flex sm:flex 
               flex-row sm:flex-col
               justify-end
               items-center
               bg-opaque rounded-20
               px-4 py-4
               sm:px-8 sm:py-8
               space-y-0
               space-x-3
               sm:space-y-6
               sm:space-x-0"
                  onClick={openChainToModal}
                >
                  <div
                    className={classNames(
                      'bg-white rounded-full overflow-hidden',
                      isViewportXs ? 'w-[42px] h-[42px]' : 'w-[72px] h-[72px]',
                    )}
                  >
                    <Image
                      src={chainTo?.icon ?? unknown}
                      alt={`${chainTo?.name} Network`}
                      width="100%"
                      height="100%"
                    />
                  </div>
                  <div
                    className="
                    text-grey sm:border border-grey 
                    rounded-20 px-3 py-1 
                    font-bold
                    flex items-center space-x-1
                    "
                  >
                    <div>{chainTo?.name}</div>
                    <ChevronDownIcon className="w-3 h-3" />
                  </div>
                </div>
              </div>
            </div>
            <div className="space-y-2 text-sm mt-4">
              <div className="text-grey text-right px-4">Token to bridge</div>
              <div className="rounded-20 sm:bg-opaque-secondary sm:px-4 py-1">
                <RouterCurrencyInputPanel
                  currency={normalCurrency}
                  amount={inputBridgeValue}
                  max={balance}
                  onCurrencyClick={() => setModalOpen(true)}
                  onAmountChange={setInputBridgeValue}
                />
              </div>
            </div>
            {/* {account && chainId && isUnderlying && isDestUnderlying ? (
              <RouterLiquidityPool
                curChainInfo={chainFrom}
                destChainInfo={chainTo}
                curChain={curChain}
                destChain={destChain}
                isUnderlying={isUnderlying}
                isDestUnderlying={isDestUnderlying}
              />
            ) : (
              ''
            )} */}

            {outputBridgeValue && (
              <div>
                {/* <Image src={bridgeConfig?.logoUrl} width="24px" height="24px" /> */}
                <div className="flex justify-center items-center space-x-2">
                  <div className="font-bold">Output Amount:</div>

                  <div>{`${outputBridgeValue} ${
                    destConfig?.symbol
                      ? destConfig?.symbol.length > 20
                        ? destConfig?.symbol.slice(0, 4) +
                          '...' +
                          destConfig?.symbol.slice(
                            destConfig?.symbol.length - 5,
                            destConfig?.symbol.length,
                          )
                        : getBaseCoin(destConfig?.symbol, chainId)
                      : null
                  }`}</div>
                </div>
              </div>
            )}
            <div className={DefinedStyles.divider} />
            <Reminder
              bridgeConfig={selectCurrency}
              currency={selectCurrency}
              selectChain={selectChain}
            />
            {!account ? (
              <WalletConnector />
            ) : !isNativeToken &&
              selectCurrency &&
              selectCurrency.underlying &&
              selectCurrency.underlying.isApprove &&
              inputBridgeValue &&
              (approval === ApprovalState.NOT_APPROVED ||
                approval === ApprovalState.PENDING) ? (
              <ButtonConfirmed
                className={DefinedStyles.fullButton}
                onClick={() => {
                  onDelay();
                  approveCallback()
                    .then(() => {
                      onClear(1);
                    })
                    .catch(() => {
                      setDelayAction(false);
                    });
                }}
                disabled={
                  approval !== ApprovalState.NOT_APPROVED ||
                  approvalSubmitted ||
                  delayAction
                }
                // confirmed={approval === ApprovalState.APPROVED}
              >
                {approval === ApprovalState.PENDING ? (
                  <div className="flex items-center space-x-2">
                    {'Approving'} <RippleSpinner size={16} />
                  </div>
                ) : approvalSubmitted ? (
                  'Approved'
                ) : (
                  'Approve' +
                  ' ' +
                  getBaseCoin(
                    selectCurrency?.symbol ?? selectCurrency?.symbol,
                    chainId,
                  )
                )}
              </ButtonConfirmed>
            ) : (
              <Button
                className={DefinedStyles.fullButton}
                disabled={isCrossBridge || delayAction}
                onClick={() => {
                  // <Button disabled={delayAction} onClick={() => {
                  onDelay();
                  if (onWrap)
                    onWrap()
                      .then(() => {
                        onClear();
                      })
                      .catch(() => {
                        setDelayAction(false);
                      });
                  //   if (isRouter) {
                  //     if (!selectCurrency || !isUnderlying) {
                  //       if (onWrap)
                  //         onWrap().then(() => {
                  //           onClear();
                  //         });
                  //     } else {
                  //       // if (onWrapUnderlying) onWrapUnderlying()
                  //       if (isNativeToken) {
                  //         if (onWrapNative)
                  //           onWrapNative().then(() => {
                  //             onClear();
                  //           });
                  //       } else {
                  //         if (onWrapUnderlying) {
                  //           onWrapUnderlying().then(() => {
                  //             onClear();
                  //           });
                  //         }
                  //       }
                  //     }
                  //   }
                }}
              >
                {btnTxt}
              </Button>
            )}
            <div>
              <ExternalLink
                href="https://app.multichain.org/#/bridge"
                className="!whitespace-normal"
              >
                <div className="flex flex-col justify-center items-center">
                  <div className="text-xs text-text">Powered by</div>
                  <Image
                    src="/img/bridge/anyswap.png"
                    width="169px"
                    height="50px"
                  />
                </div>
              </ExternalLink>
            </div>
          </div>
        </PageContent>
      </Page>
    </>
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

Bridge.Guard = NetworkGuardWrapper([
  ChainId.MAINNET,
  ChainId.SHIDEN,
  ChainId.BSC,
  ChainId.MATIC,
  ChainId.METIS,
]);
export default Bridge;
