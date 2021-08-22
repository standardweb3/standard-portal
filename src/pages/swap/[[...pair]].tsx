import Head from 'next/head';
import {
  ChainId,
  Currency,
  CurrencyAmount,
  JSBI,
  Token,
  TradeType,
  Trade as V2Trade,
} from '@sushiswap/sdk';
import { useRouter } from 'next/router';
import { useCallback, useEffect, useMemo, useState } from 'react';
import {
  ApprovalState,
  useActiveWeb3React,
  useApproveCallbackFromTrade,
} from '../../hooks';
import { useAllTokens, useCurrency } from '../../hooks/Tokens';
import useWrapCallback, { WrapType } from '../../hooks/useWrapCallback';
import {
  useNetworkModalToggle,
  useToggleSettingsMenu,
  useWalletModalToggle,
} from '../../state/application/hooks';
import { useDefaultsFromURLSearch } from '../../state/limit-order/hooks';
import {
  useDerivedSwapInfo,
  useSwapActionHandlers,
  useSwapState,
} from '../../state/swap/hooks';
import {
  useExpertModeManager,
  useUserArcherETHTip,
  useUserArcherGasPrice,
  useUserArcherUseRelay,
  useUserSingleHopOnly,
  useUserTransactionTTL,
} from '../../state/user/hooks';

import { Field } from '../../state/swap/actions';
import useENSAddress from '../../hooks/useENSAddress';
import { useUSDCValue } from '../../hooks/useUSDCPrice';
import {
  computeFiatValuePriceImpact,
  maxAmountSpend,
  warningSeverity,
} from '../../functions';
import { useSwapCallback } from '../../hooks/useSwapCallback';
import confirmPriceImpactWithoutFee from '../../constants/features/swap/confirmPriceImpactWithoutFee';
import { useIsSwapUnsupported } from '../../hooks/useIsSwapUnsupported';
import usePrevious from '../../hooks/usePrevious';
import Container from '../../components-ui/Container';
import useIsArgentWallet from '../../hooks/useIsArgentWallet';
import { PageHeader } from '../../components-ui/PageHeader';
import { Page } from '../../components-ui/Page';
import TokenWarningModal from '../../modals/TokenWarningModal';
import { PageContent } from '../../components-ui/PageContent';
import { SwapHeader } from '../../components-ui/Swap/SwapHeader';
import { Gas } from '../../components-ui/Gas';

export default function Swap() {
  /** PARSE TOKENS FROM CONTRACT ADDRESSES PROVIDED IN URL */
  const loadedUrlParams = useDefaultsFromURLSearch();

  // token warning stuff
  const [loadedInputCurrency, loadedOutputCurrency] = [
    useCurrency(loadedUrlParams?.inputCurrencyId),
    useCurrency(loadedUrlParams?.outputCurrencyId),
  ];

  const [dismissTokenWarning, setDismissTokenWarning] = useState<boolean>(
    false,
  );

  // get valid tokens
  const urlLoadedTokens: Token[] = useMemo(
    () =>
      [loadedInputCurrency, loadedOutputCurrency]?.filter(
        (c): c is Token => c?.isToken ?? false,
      ) ?? [],
    [loadedInputCurrency, loadedOutputCurrency],
  );

  const handleConfirmTokenWarning = useCallback(() => {
    setDismissTokenWarning(true);
  }, []);

  const defaultTokens = useAllTokens();

  const importTokensNotInDefault =
    urlLoadedTokens &&
    urlLoadedTokens.filter((token: Token) => {
      return !Boolean(token.address in defaultTokens);
    });

  const { account, chainId } = useActiveWeb3React();

  const toggleNetworkModal = useNetworkModalToggle();

  const router = useRouter();

  // toggle wallet when disconnected
  const toggleWalletModal = useWalletModalToggle();

  // for expert mode
  const [isExpertMode] = useExpertModeManager();
  const toggleSettings = useToggleSettingsMenu();

  // // get custom setting values for user -- archer
  // const [ttl] = useUserTransactionTTL()
  // const [useArcher] = useUserArcherUseRelay()
  // const [archerETHTip] = useUserArcherETHTip()
  // const [archerGasPrice] = useUserArcherGasPrice()

  // archer
  // const archerRelay = chainId ? ARCHER_RELAY_URI?.[chainId] : undefined
  // // const doArcher = archerRelay !== undefined && useArcher
  // const doArcher = undefined

  // swap state
  const { independentField, typedValue, recipient } = useSwapState();

  // gets best v2trade
  const {
    v2Trade,
    currencyBalances,
    parsedAmount,
    currencies,
    inputError: swapInputError,
    allowedSlippage,
  } = useDerivedSwapInfo();

  // prepare for wrapping swap
  const {
    wrapType,
    execute: onWrap,
    inputError: wrapInputError,
  } = useWrapCallback(
    currencies[Field.INPUT],
    currencies[Field.OUTPUT],
    typedValue,
  );

  // is a wrapper swap?
  const showWrap: boolean = wrapType !== WrapType.NOT_APPLICABLE;
  const { address: recipientAddress } = useENSAddress(recipient);

  const trade = showWrap ? undefined : v2Trade;

  // wrap or normal swap
  const parsedAmounts = useMemo(
    () =>
      showWrap
        ? {
            [Field.INPUT]: parsedAmount,
            [Field.OUTPUT]: parsedAmount,
          }
        : {
            [Field.INPUT]:
              independentField === Field.INPUT
                ? parsedAmount
                : trade?.inputAmount,
            [Field.OUTPUT]:
              independentField === Field.OUTPUT
                ? parsedAmount
                : trade?.outputAmount,
          },
    [independentField, parsedAmount, showWrap, trade],
  );

  // value of i / o
  const fiatValueInput = useUSDCValue(parsedAmounts[Field.INPUT]);
  const fiatValueOutput = useUSDCValue(parsedAmounts[Field.OUTPUT]);
  const priceImpact = computeFiatValuePriceImpact(
    fiatValueInput,
    fiatValueOutput,
  );

  const {
    onSwitchTokens,
    onCurrencySelection,
    onUserInput,
    onChangeRecipient,
  } = useSwapActionHandlers();

  const isValid = !swapInputError;

  const dependentField: Field =
    independentField === Field.INPUT ? Field.OUTPUT : Field.INPUT;

  const handleTypeInput = useCallback(
    (value: string) => {
      onUserInput(Field.INPUT, value);
    },
    [onUserInput],
  );

  const handleTypeOutput = useCallback(
    (value: string) => {
      onUserInput(Field.OUTPUT, value);
    },
    [onUserInput],
  );

  // reset if they close warning without tokens in params
  const handleDismissTokenWarning = useCallback(() => {
    setDismissTokenWarning(true);
    router.push('/swap/');
  }, [router]);

  // modal and loading
  const [
    { showConfirm, tradeToConfirm, swapErrorMessage, attemptingTxn, txHash },
    setSwapState,
  ] = useState<{
    showConfirm: boolean;
    tradeToConfirm: V2Trade<Currency, Currency, TradeType> | undefined;
    attemptingTxn: boolean;
    swapErrorMessage: string | undefined;
    txHash: string | undefined;
  }>({
    showConfirm: false,
    tradeToConfirm: undefined,
    attemptingTxn: false,
    swapErrorMessage: undefined,
    txHash: undefined,
  });

  const formattedAmounts = {
    [independentField]: typedValue,
    [dependentField]: showWrap
      ? parsedAmounts[independentField]?.toExact() ?? ''
      : parsedAmounts[dependentField]?.toSignificant(6) ?? '',
  };

  const userHasSpecifiedInputOutput = Boolean(
    currencies[Field.INPUT] &&
      currencies[Field.OUTPUT] &&
      parsedAmounts[independentField]?.greaterThan(JSBI.BigInt(0)),
  );

  const routeNotFound = !trade?.route;

  // check whether the user has approved the router on the input token -- archer
  const [approvalState, approveCallback] = useApproveCallbackFromTrade(
    trade,
    allowedSlippage,
  );
  const signatureData = undefined;

  // const {
  //   state: signatureState,
  //   signatureData,
  //   gatherPermitSignature,
  // } = useERC20PermitFromTrade(trade, allowedSlippage)

  const handleApprove = useCallback(async () => {
    await approveCallback();
    // if (signatureState === UseERC20PermitState.NOT_SIGNED && gatherPermitSignature) {
    //   try {
    //     await gatherPermitSignature()
    //   } catch (error) {
    //     // try to approve if gatherPermitSignature failed for any reason other than the user rejecting it
    //     if (error?.code !== 4001) {
    //       await approveCallback()
    //     }
    //   }
    // } else {
    //   await approveCallback()
    // }
  }, [approveCallback]);
  // }, [approveCallback, gatherPermitSignature, signatureState])

  //// APPROVAL
  // check if user has gone through approval process, used to show two step buttons, reset on token change
  const [approvalSubmitted, setApprovalSubmitted] = useState<boolean>(false);

  // mark when a user has submitted an approval, reset onTokenSelection for input field
  useEffect(() => {
    if (approvalState === ApprovalState.PENDING) {
      setApprovalSubmitted(true);
    }
  }, [approvalState, approvalSubmitted]);

  const maxInputAmount: CurrencyAmount<Currency> | undefined = maxAmountSpend(
    currencyBalances[Field.INPUT],
  );
  const showMaxButton = Boolean(
    maxInputAmount?.greaterThan(0) &&
      !parsedAmounts[Field.INPUT]?.equalTo(maxInputAmount),
  );

  // the callback to execute the swap -- archer
  const { callback: swapCallback, error: swapCallbackError } = useSwapCallback(
    trade,
    allowedSlippage,
    recipient,
    signatureData,
    undefined,
  );

  const [singleHopOnly] = useUserSingleHopOnly();

  const handleSwap = useCallback(() => {
    if (!swapCallback) {
      return;
    }
    if (priceImpact && !confirmPriceImpactWithoutFee(priceImpact)) {
      return;
    }
    setSwapState({
      attemptingTxn: true,
      tradeToConfirm,
      showConfirm,
      swapErrorMessage: undefined,
      txHash: undefined,
    });
    swapCallback()
      .then((hash) => {
        setSwapState({
          attemptingTxn: false,
          tradeToConfirm,
          showConfirm,
          swapErrorMessage: undefined,
          txHash: hash,
        });

        // ReactGA.event({
        //   category: 'Swap',
        //   action:
        //     recipient === null
        //       ? 'Swap w/o Send'
        //       : (recipientAddress ?? recipient) === account
        //       ? 'Swap w/o Send + recipient'
        //       : 'Swap w/ Send',
        //   label: [
        //     trade?.inputAmount?.currency?.symbol,
        //     trade?.outputAmount?.currency?.symbol,
        //     singleHopOnly ? 'SH' : 'MH',
        //   ].join('/'),
        // })

        // ReactGA.event({
        //   category: 'Routing',
        //   action: singleHopOnly ? 'Swap with multihop disabled' : 'Swap with multihop enabled',
        // })
      })
      .catch((error) => {
        setSwapState({
          attemptingTxn: false,
          tradeToConfirm,
          showConfirm,
          swapErrorMessage: error.message,
          txHash: undefined,
        });
      });
  }, [
    swapCallback,
    priceImpact,
    tradeToConfirm,
    showConfirm,
    recipient,
    recipientAddress,
    account,
    trade?.inputAmount?.currency?.symbol,
    trade?.outputAmount?.currency?.symbol,
    singleHopOnly,
  ]);

  // warnings on slippage
  // const priceImpactSeverity = warningSeverity(priceImpactWithoutFee);
  const priceImpactSeverity = useMemo(() => {
    const executionPriceImpact = trade?.priceImpact;
    return warningSeverity(
      executionPriceImpact && priceImpact
        ? executionPriceImpact.greaterThan(priceImpact)
          ? executionPriceImpact
          : priceImpact
        : executionPriceImpact ?? priceImpact,
    );
  }, [priceImpact, trade]);

  // errors
  const [showInverted, setShowInverted] = useState<boolean>(false);

  const isArgentWallet = useIsArgentWallet();

  // show approve flow when: no error on inputs, not approved or pending, or approved in current session
  // never show if price impact is above threshold in non expert mode
  const showApproveFlow =
    !isArgentWallet &&
    !swapInputError &&
    (approvalState === ApprovalState.NOT_APPROVED ||
      approvalState === ApprovalState.PENDING ||
      (approvalSubmitted && approvalState === ApprovalState.APPROVED)) &&
    !(priceImpactSeverity > 3 && !isExpertMode);

  const handleConfirmDismiss = useCallback(() => {
    setSwapState({
      showConfirm: false,
      tradeToConfirm,
      attemptingTxn,
      swapErrorMessage,
      txHash,
    });
    // if there was a tx hash, we want to clear the input
    if (txHash) {
      onUserInput(Field.INPUT, '');
    }
  }, [attemptingTxn, onUserInput, swapErrorMessage, tradeToConfirm, txHash]);

  const handleAcceptChanges = useCallback(() => {
    setSwapState({
      tradeToConfirm: trade,
      swapErrorMessage,
      txHash,
      attemptingTxn,
      showConfirm,
    });
  }, [attemptingTxn, showConfirm, swapErrorMessage, trade, txHash]);

  const handleInputSelect = useCallback(
    (inputCurrency) => {
      setApprovalSubmitted(false); // reset 2 step UI for approvals
      onCurrencySelection(Field.INPUT, inputCurrency);
    },
    [onCurrencySelection],
  );

  const handleMaxInput = useCallback(() => {
    maxInputAmount && onUserInput(Field.INPUT, maxInputAmount.toExact());
  }, [maxInputAmount, onUserInput]);

  const handleOutputSelect = useCallback(
    (outputCurrency) => onCurrencySelection(Field.OUTPUT, outputCurrency),
    [onCurrencySelection],
  );

  // useEffect(() => {
  //   if (
  //     doArcher &&
  //     parsedAmounts[Field.INPUT] &&
  //     maxAmountInput &&
  //     parsedAmounts[Field.INPUT]?.greaterThan(maxAmountInput)
  //   ) {
  //     handleMaxInput();
  //   }
  // }, [handleMaxInput, parsedAmounts, maxAmountInput, doArcher]);

  const swapIsUnsupported = useIsSwapUnsupported(
    currencies?.INPUT,
    currencies?.OUTPUT,
  );

  const priceImpactTooHigh = priceImpactSeverity > 3 && !isExpertMode;

  const [animateSwapArrows, setAnimateSwapArrows] = useState<boolean>(false);

  const previousChainId = usePrevious<ChainId>(chainId);

  // useEffect(() => {
  //   if (
  //     previousChainId &&
  //     previousChainId !== chainId &&
  //     router.asPath.includes(Currency.getNativeCurrencySymbol(previousChainId))
  //   ) {
  //     router.push(`/swap/${Currency.getNativeCurrencySymbol(chainId)}`);
  //   }
  // }, [chainId, previousChainId, router]);

  return (
    <>
      <Head>
        <title>SWAP | Standard Protocol</title>
        <meta
          key="description"
          name="description"
          content="Swap ERC 20 tokens on Standard Protocol"
        />
      </Head>
      <Page>
        <PageHeader title="swap" />

        <TokenWarningModal
          isOpen={importTokensNotInDefault.length > 0 && !dismissTokenWarning}
          tokens={importTokensNotInDefault}
          onConfirm={handleConfirmTokenWarning}
        />
        <PageContent>
          <div
            className={`
            max-w-[500px] 
            bg-swap-background 
            rounded-xl p-8
            shadow-primary-glow
          `}
          >
            <SwapHeader
              input={currencies[Field.INPUT]}
              output={currencies[Field.OUTPUT]}
              allowedSlippage={allowedSlippage}
            />
          </div>
        </PageContent>
      </Page>
    </>
  );
}
