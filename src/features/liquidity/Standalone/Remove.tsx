import ReactGA from 'react-ga';
import Link from 'next/link';
import {
  ChainId,
  currencyEquals,
  NATIVE,
  Percent,
  WNATIVE,
} from '@digitalnative/standard-protocol-sdk';
import { TransactionResponse } from '@ethersproject/abstract-provider';
import { BigNumber, Contract } from 'ethers';
import { useCallback, useMemo, useState } from 'react';
import { DEFAULT_REMOVE_LIQUIDITY_SLIPPAGE_TOLERANCE } from '../../../constants/liquidity';
import {
  calculateGasMargin,
  calculateSlippageAmount,
} from '../../../functions';
import {
  ApprovalState,
  useActiveWeb3React,
  useApproveCallback,
  usePairContract,
  useRouterContract,
} from '../../../hooks';
import { useCurrency } from '../../../hooks/Tokens';
import { useV2LiquidityTokenPermit } from '../../../hooks/useERC20Permit';
import useTransactionDeadline from '../../../hooks/useTransactionDeadline';
import { Field } from '../../../state/burn/actions';
import {
  useBurnActionHandlers,
  useBurnState,
  useDerivedBurnInfo,
} from '../../../state/burn/hooks';
import { useTransactionAdder } from '../../../state/transactions/hooks';
import { useUserSlippageToleranceWithDefault } from '../../../state/user/hooks';
import { CurrencyLogo } from '../../../components-ui/CurrencyLogo';
import { ArrowDownIcon, PlusIcon } from '@heroicons/react/outline';
import {
  Button,
  ButtonConfirmed,
  ButtonError,
} from '../../../components-ui/Button';
import useDebouncedChangeHandler from '../../../hooks/useDebouncedChangeHandler';
import { DefinedStyles } from '../../../utils/DefinedStyles';
import { TransactionSettingsWithGas } from '../../../components-ui/Exchange/TransactionSettingsWithGas';
import { AnalyticsLink } from '../../../components-ui/AnalyticsLink';
import TransactionConfirmationModal, {
  ConfirmationModalContent,
} from '../../../modals/TransactionConfirmationModal';
import PercentInputPanel from '../../../components-ui/PercentInputPanel';
import { WalletConnector } from '../../../components-ui/WalletConnector';
import { MinimalPositionCard } from '../../../components-ui/PositionCard';

export default function Remove({ tokenAId, tokenBId, liquidityToken }) {
  const { account, chainId, library } = useActiveWeb3React();

  const [currencyIdA, setCurrencyIdA] = useState(tokenAId || undefined);
  const [currencyIdB, setcurrencyIdB] = useState(tokenBId || undefined);

  const [currencyA, currencyB] = [
    useCurrency(currencyIdA) ?? undefined,
    useCurrency(currencyIdB) ?? undefined,
  ];

  const currencyAIsWeth =
    chainId && currencyA && currencyEquals(currencyA, WNATIVE[chainId]);
  const currencyBIsWeth =
    chainId && currencyB && currencyEquals(currencyB, WNATIVE[chainId]);
  const oneCurrencyIsWETH = currencyAIsWeth || currencyBIsWeth;

  const currencyAIsETH = currencyIdA === 'ETH';
  const currencyBIsETH = currencyIdB === 'ETH';

  const handleWrapUnwrap = useCallback(() => {
    if (currencyAIsETH) {
      setCurrencyIdA(WNATIVE[chainId].address);
    }
    if (currencyBIsETH) {
      setcurrencyIdB(WNATIVE[chainId].address);
    }
    if (currencyAIsWeth) {
      setCurrencyIdA('ETH');
    }
    if (currencyBIsWeth) {
      setcurrencyIdB('ETH');
    }
  }, [currencyAIsWeth, currencyAIsETH, currencyBIsETH, currencyBIsWeth]);

  const [tokenA, tokenB] = useMemo(
    () => [currencyA?.wrapped, currencyB?.wrapped],
    [currencyA, currencyB],
  );

  // burn state
  const { independentField, typedValue } = useBurnState();
  const { pair, parsedAmounts, error } = useDerivedBurnInfo(
    currencyA ?? undefined,
    currencyB ?? undefined,
  );
  const { onUserInput: _onUserInput } = useBurnActionHandlers();
  const isValid = !error;

  // modal and loading
  const [showConfirm, setShowConfirm] = useState<boolean>(false);
  const [attemptingTxn, setAttemptingTxn] = useState(false); // clicked confirm

  // txn values
  const [txHash, setTxHash] = useState<string>('');
  const deadline = useTransactionDeadline();
  const allowedSlippage = useUserSlippageToleranceWithDefault(
    DEFAULT_REMOVE_LIQUIDITY_SLIPPAGE_TOLERANCE,
  );

  const formattedAmounts = {
    [Field.LIQUIDITY_PERCENT]: parsedAmounts[Field.LIQUIDITY_PERCENT].equalTo(
      '0',
    )
      ? '0'
      : parsedAmounts[Field.LIQUIDITY_PERCENT].lessThan(new Percent('1', '100'))
      ? '<1'
      : parsedAmounts[Field.LIQUIDITY_PERCENT].toFixed(0),
    [Field.LIQUIDITY]:
      independentField === Field.LIQUIDITY
        ? typedValue
        : parsedAmounts[Field.LIQUIDITY]?.toSignificant(6) ?? '',
    [Field.CURRENCY_A]:
      independentField === Field.CURRENCY_A
        ? typedValue
        : parsedAmounts[Field.CURRENCY_A]?.toSignificant(6) ?? '',
    [Field.CURRENCY_B]:
      independentField === Field.CURRENCY_B
        ? typedValue
        : parsedAmounts[Field.CURRENCY_B]?.toSignificant(6) ?? '',
  };

  // pair contract
  const pairContract: Contract | null = usePairContract(
    pair?.liquidityToken?.address,
  );

  // router contract
  const routerContract = useRouterContract();

  // allowance handling
  const { gatherPermitSignature, signatureData } = useV2LiquidityTokenPermit(
    parsedAmounts[Field.LIQUIDITY],
    routerContract?.address,
  );
  const [approval, approveCallback] = useApproveCallback(
    parsedAmounts[Field.LIQUIDITY],
    routerContract?.address,
  );

  async function onAttemptToApprove() {
    if (!pairContract || !pair || !library || !deadline)
      throw new Error('missing dependencies');
    const liquidityAmount = parsedAmounts[Field.LIQUIDITY];
    if (!liquidityAmount) throw new Error('missing liquidity amount');

    if (chainId !== ChainId.HARMONY && gatherPermitSignature) {
      try {
        await gatherPermitSignature();
      } catch (error) {
        // try to approve if gatherPermitSignature failed for any reason other than the user rejecting it
        if (error?.code !== 4001) {
          await approveCallback();
        }
      }
    } else {
      await approveCallback();
    }
  }

  // wrapped onUserInput to clear signatures
  const onUserInput = useCallback(
    (field: Field, typedValue: string) => {
      return _onUserInput(field, typedValue);
    },
    [_onUserInput],
  );

  const addTransaction = useTransactionAdder();

  async function onRemove() {
    if (!chainId || !library || !account || !deadline)
      throw new Error('missing dependencies');
    const {
      [Field.CURRENCY_A]: currencyAmountA,
      [Field.CURRENCY_B]: currencyAmountB,
    } = parsedAmounts;
    if (!currencyAmountA || !currencyAmountB) {
      throw new Error('missing currency amounts');
    }

    const amountsMin = {
      [Field.CURRENCY_A]: calculateSlippageAmount(
        currencyAmountA,
        allowedSlippage,
      )[0],
      [Field.CURRENCY_B]: calculateSlippageAmount(
        currencyAmountB,
        allowedSlippage,
      )[0],
    };

    if (!currencyA || !currencyB) throw new Error('missing tokens');
    const liquidityAmount = parsedAmounts[Field.LIQUIDITY];
    if (!liquidityAmount) throw new Error('missing liquidity amount');

    const currencyBIsETH = currencyB.isNative;
    const oneCurrencyIsETH = currencyA.isNative || currencyBIsETH;

    if (!tokenA || !tokenB) throw new Error('could not wrap');

    let methodNames: string[],
      args: Array<string | string[] | number | boolean>;
    // we have approval, use normal remove liquidity
    if (approval === ApprovalState.APPROVED) {
      // removeLiquidityETH
      if (oneCurrencyIsETH) {
        methodNames = [
          'removeLiquidityETH',
          'removeLiquidityETHSupportingFeeOnTransferTokens',
        ];
        args = [
          currencyBIsETH ? tokenA.address : tokenB.address,
          liquidityAmount.quotient.toString(),
          amountsMin[
            currencyBIsETH ? Field.CURRENCY_A : Field.CURRENCY_B
          ].toString(),
          amountsMin[
            currencyBIsETH ? Field.CURRENCY_B : Field.CURRENCY_A
          ].toString(),
          account,
          deadline.toHexString(),
        ];
      }
      // removeLiquidity
      else {
        methodNames = ['removeLiquidity'];
        args = [
          tokenA.address,
          tokenB.address,
          liquidityAmount.quotient.toString(),
          amountsMin[Field.CURRENCY_A].toString(),
          amountsMin[Field.CURRENCY_B].toString(),
          account,
          deadline.toHexString(),
        ];
      }
    }
    // we have a signature, use permit versions of remove liquidity
    else if (signatureData !== null) {
      // removeLiquidityETHWithPermit
      if (oneCurrencyIsETH) {
        methodNames = [
          'removeLiquidityETHWithPermit',
          'removeLiquidityETHWithPermitSupportingFeeOnTransferTokens',
        ];
        args = [
          currencyBIsETH ? tokenA.address : tokenB.address,
          liquidityAmount.quotient.toString(),
          amountsMin[
            currencyBIsETH ? Field.CURRENCY_A : Field.CURRENCY_B
          ].toString(),
          amountsMin[
            currencyBIsETH ? Field.CURRENCY_B : Field.CURRENCY_A
          ].toString(),
          account,
          signatureData.deadline,
          false,
          signatureData.v,
          signatureData.r,
          signatureData.s,
        ];
      }
      // removeLiquidityETHWithPermit
      else {
        methodNames = ['removeLiquidityWithPermit'];
        args = [
          tokenA.address,
          tokenB.address,
          liquidityAmount.quotient.toString(),
          amountsMin[Field.CURRENCY_A].toString(),
          amountsMin[Field.CURRENCY_B].toString(),
          account,
          signatureData.deadline,
          false,
          signatureData.v,
          signatureData.r,
          signatureData.s,
        ];
      }
    } else {
      throw new Error(
        'Attempting to confirm without approval or a signature. Please contact support.',
      );
    }

    const safeGasEstimates: (BigNumber | undefined)[] = await Promise.all(
      methodNames.map((methodName) =>
        routerContract.estimateGas[methodName](...args)
          .then(calculateGasMargin)
          .catch((error) => {
            console.error(`estimateGas failed`, methodName, args, error);
            return undefined;
          }),
      ),
    );

    const indexOfSuccessfulEstimation = safeGasEstimates.findIndex(
      (safeGasEstimate) => BigNumber.isBigNumber(safeGasEstimate),
    );

    // all estimations failed...
    if (indexOfSuccessfulEstimation === -1) {
      console.error('This transaction would fail. Please contact support.');
    } else {
      const methodName = methodNames[indexOfSuccessfulEstimation];
      const safeGasEstimate = safeGasEstimates[indexOfSuccessfulEstimation];

      setAttemptingTxn(true);
      await routerContract[methodName](...args, {
        gasLimit: safeGasEstimate,
      })
        .then((response: TransactionResponse) => {
          setAttemptingTxn(false);

          addTransaction(response, {
            summary: `Remove ${parsedAmounts[Field.CURRENCY_A]?.toSignificant(
              3,
            )} ${currencyA?.symbol} and ${parsedAmounts[
              Field.CURRENCY_B
            ]?.toSignificant(3)} ${currencyB?.symbol}`,
          });

          setTxHash(response.hash);

          ReactGA.event({
            category: 'Liquidity',
            action: 'Remove',
            label: [currencyA?.symbol, currencyB?.symbol].join('/'),
          });
        })
        .catch((error: Error) => {
          setAttemptingTxn(false);
          // we only care if the error is something _other_ than the user rejected the tx
          console.error(error);
        });
    }
  }

  function modalHeader() {
    return (
      <div className="grid gap-4 pt-3 pb-4">
        <div className="grid gap-2">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <CurrencyLogo
                currency={currencyA}
                size={48}
                className="rounded-full"
              />
              <div className="text-2xl font-bold">
                {parsedAmounts[Field.CURRENCY_A]?.toSignificant(6)}
              </div>
            </div>
            <div className="ml-3 text-2xl font-medium">{currencyA?.symbol}</div>
          </div>
          <div className="ml-3 mr-3 min-w-[24px]">
            <PlusIcon className="w-4 h-4" />
          </div>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <CurrencyLogo
                currency={currencyB}
                size={48}
                className="rounded-full"
              />
              <div className="text-2xl font-bold">
                {parsedAmounts[Field.CURRENCY_B]?.toSignificant(6)}
              </div>
            </div>
            <div className="ml-3 text-2xl font-medium">{currencyB?.symbol}</div>
          </div>
        </div>
        <div className="justify-start text-sm">
          {`Output is estimated. If the price changes by more than ${allowedSlippage.toSignificant(
            4,
          )}% your transaction will revert.`}
        </div>
      </div>
    );
  }

  function modalBottom() {
    return (
      <div className="p-6 mt-0 -m-6 bg-dark-800">
        {pair && (
          <>
            <div className="grid gap-1">
              <div className="flex items-center justify-between">
                <div className="text-sm">{`Rates`}</div>
                <div className="text-sm font-bold justify-center items-center flex right-align pl-1.5">
                  {`1 ${currencyA?.symbol} = ${
                    tokenA ? pair.priceOf(tokenA).toSignificant(6) : '-'
                  } ${currencyB?.symbol}`}
                </div>
              </div>
              <div className="flex items-center justify-end">
                <div className="text-sm font-bold justify-center items-center flex right-align pl-1.5">
                  {`1 ${currencyB?.symbol} = ${
                    tokenB ? pair.priceOf(tokenB).toSignificant(6) : '-'
                  } ${currencyA?.symbol}`}
                </div>
              </div>
            </div>
            <div className="h-px my-6 bg-gray-700" />
          </>
        )}
        <div className="grid gap-1 pb-6">
          <div className="flex items-center justify-between">
            <div className="text-sm text-text">
              {`${currencyA?.symbol}/${currencyB?.symbol} Burned`}
            </div>
            <div className="text-sm font-bold justify-center items-center flex right-align pl-1.5 text-high-emphasis">
              {parsedAmounts[Field.LIQUIDITY]?.toSignificant(6)}
            </div>
          </div>
        </div>
        <Button
          className="w-full px-4 py-4 text-lg"
          disabled={
            !(approval === ApprovalState.APPROVED || signatureData !== null)
          }
          onClick={onRemove}
        >
          {`Confirm`}
        </Button>
      </div>
    );
  }

  const pendingText = `Removing ${parsedAmounts[
    Field.CURRENCY_A
  ]?.toSignificant(6)} ${currencyA?.symbol} and ${parsedAmounts[
    Field.CURRENCY_B
  ]?.toSignificant(6)} ${currencyB?.symbol}`;

  const liquidityPercentChangeCallback = useCallback(
    (value: string) => {
      onUserInput(Field.LIQUIDITY_PERCENT, value);
    },
    [onUserInput],
  );

  const oneCurrencyIsETH = currencyA?.isNative || currencyB?.isNative;

  // const oneCurrencyIsWETH = Boolean(
  //   chainId &&
  //     WNATIVE[chainId] &&
  //     (currencyA?.equals(WNATIVE[chainId]) ||
  //       currencyB?.equals(WNATIVE[chainId])),
  // );

  const handleDismissConfirmation = useCallback(() => {
    setShowConfirm(false);
    // if there was a tx hash, we want to clear the input
    if (txHash) {
      onUserInput(Field.LIQUIDITY_PERCENT, '0');
    }
    setTxHash('');
  }, [onUserInput, txHash]);

  const [
    innerLiquidityPercentage,
    setInnerLiquidityPercentage,
  ] = useDebouncedChangeHandler(
    parsedAmounts[Field.LIQUIDITY_PERCENT].toFixed(0),
    liquidityPercentChangeCallback,
  );

  //   const pairAddressForAnalytics = pair?.liquidityToken?.address;

  return (
    <>
      <div className="w-full space-y-4">
        <div className="flex justify-end items-center space-x-2">
          <TransactionSettingsWithGas allowedSlippage={allowedSlippage} />
          <AnalyticsLink
            path={
              liquidityToken
                ? `pairs/${liquidityToken.address.toLowerCase()}`
                : 'pairs'
            }
          />
        </div>
        <div className="grid gap-4">
          <TransactionConfirmationModal
            isOpen={showConfirm}
            onDismiss={handleDismissConfirmation}
            attemptingTxn={attemptingTxn}
            hash={txHash ? txHash : ''}
            content={() => (
              <ConfirmationModalContent
                title={`You will receive`}
                onDismiss={handleDismissConfirmation}
                topContent={modalHeader}
                bottomContent={modalBottom}
              />
            )}
            pendingText={pendingText}
          />

          <div>
            <PercentInputPanel
              value={innerLiquidityPercentage}
              onUserInput={setInnerLiquidityPercentage}
              id="liquidity-percent"
              preset
            />

            <div className="flex justify-center items-center">
              <button
                className="
                      z-10 rounded-20 px-3 py-6 -mb-10 text-text
                      cursor-default
                    "
              >
                <div className="rounded-full p-3 bg-icon-btn-grey">
                  <ArrowDownIcon className="w-6 h-6" />
                </div>
              </button>
            </div>

            <div id="remove-liquidity-output">
              <div className="flex flex-col justify-center items-center space-y-4">
                <div className="w-full flex flex-col space-y-3 md:flex-row md:space-x-2 md:space-y-0">
                  <div
                    className="
                      w-full
                      flex justify-center items-center 
                      p-3 pr-8 space-x-3 
                      rounded-20 bg-opaque-secondary"
                  >
                    <CurrencyLogo
                      currency={currencyA}
                      size="46px"
                      className="rounded-full"
                    />
                    <div>
                      <div className="text-white">
                        {formattedAmounts[Field.CURRENCY_A] || '-'}
                      </div>
                      <div className="text-sm">{currencyA?.symbol}</div>
                    </div>
                  </div>
                  <div
                    className="
                      w-full
                      flex justify-center items-center 
                      p-3 pr-8 space-x-3 
                      rounded-20 bg-opaque-secondary"
                  >
                    <CurrencyLogo
                      currency={currencyB}
                      size="46px"
                      className="rounded-full"
                    />
                    <div>
                      <div className="text-white">
                        {formattedAmounts[Field.CURRENCY_B] || '-'}
                      </div>
                      <div className="text-sm">{currencyB?.symbol}</div>
                    </div>
                  </div>
                </div>
                {chainId && (oneCurrencyIsWETH || oneCurrencyIsETH) ? (
                  <div className="flex items-center text-sm">
                    {(oneCurrencyIsWETH || oneCurrencyIsETH) && (
                      <div
                        className="text-blue cursor-pointer pl-3"
                        onClick={handleWrapUnwrap}
                      >
                        use{' '}
                        {oneCurrencyIsWETH
                          ? NATIVE[chainId].symbol
                          : WNATIVE[chainId].symbol}
                      </div>
                    )}
                  </div>
                ) : null}
              </div>
            </div>
          </div>

          <div className="relative my-4">
            {!account ? (
              <WalletConnector />
            ) : (
              <div className="grid grid-cols-2 gap-4">
                <ButtonConfirmed
                  color="primary"
                  className={DefinedStyles.swapButton}
                  onClick={onAttemptToApprove}
                  confirmed={
                    approval === ApprovalState.APPROVED ||
                    signatureData !== null
                  }
                  disabled={
                    approval !== ApprovalState.NOT_APPROVED ||
                    signatureData !== null
                  }
                >
                  {approval === ApprovalState.PENDING
                    ? `Approving`
                    : approval === ApprovalState.APPROVED ||
                      signatureData !== null
                    ? `Approved`
                    : `Approve`}
                </ButtonConfirmed>
                <ButtonError
                  color="primary"
                  className={DefinedStyles.swapButton}
                  onClick={() => {
                    setShowConfirm(true);
                  }}
                  disabled={
                    !isValid ||
                    (signatureData === null &&
                      approval !== ApprovalState.APPROVED)
                  }
                  error={
                    !isValid &&
                    !!parsedAmounts[Field.CURRENCY_A] &&
                    !!parsedAmounts[Field.CURRENCY_B]
                  }
                >
                  {error || `Remove`}
                </ButtonError>
              </div>
            )}
          </div>
        </div>

        {pair ? (
          <MinimalPositionCard showUnwrapped={oneCurrencyIsWETH} pair={pair} />
        ) : null}
      </div>
    </>
  );
}
