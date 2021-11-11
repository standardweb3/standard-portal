import { TransactionResponse } from '@ethersproject/providers';
import Head from 'next/head';
import ReactGA from 'react-ga';
import {
  ChainId,
  Currency,
  CurrencyAmount,
  currencyEquals,
  Percent,
  WNATIVE,
} from '@digitalnative/standard-protocol-sdk';
import { BigNumber } from 'ethers';
import { useRouter } from 'next/router';
import { useCallback, useState } from 'react';
import { ZERO_PERCENT } from '../../constants';
import {
  calculateGasMargin,
  calculateSlippageAmount,
  currencyId,
  maxAmountSpend,
} from '../../functions';
import {
  ApprovalState,
  useActiveWeb3React,
  useApproveCallback,
  useRouterContract,
} from '../../hooks';
import { useCurrency } from '../../hooks/Tokens';
import useTransactionDeadline from '../../hooks/useTransactionDeadline';
import { Field } from '../../state/mint/actions';
import {
  useDerivedMintInfo,
  useMintActionHandlers,
  useMintState,
} from '../../state/mint/hooks';
import { useTransactionAdder } from '../../state/transactions/hooks';
import {
  useExpertModeManager,
  useUserSlippageToleranceWithDefault,
} from '../../state/user/hooks';
import { DoubleCurrencyLogo } from '../../components-ui/CurrencyLogo/DoubleCurrencyLogo';
import ConfirmAddModalBottom from '../../features/liquidity/ConfirmAddModalBottom';
import { useIsSwapUnsupported } from '../../hooks/useIsSwapUnsupported';
import { PageContent } from '../../components-ui/PageContent';
import { Alert } from '../../components-ui/Alert';
import TransactionConfirmationModal, {
  ConfirmationModalContent,
} from '../../modals/TransactionConfirmationModal';
import { CurrencyInputPanel } from '../../components-ui/CurrencyInputPanel';
import { Button, ButtonError } from '../../components-ui/Button';
import { WalletConnector } from '../../components-ui/WalletConnector';
import { PairState } from '../../hooks/useV2Pairs';
import { PageHeader } from '../../components-ui/PageHeader';
import { Page } from '../../components-ui/Page';
import { ExchangeHeader } from '../../components-ui/Exchange/ExchangeHeader';
import { ArrowRightIcon, PlusIcon } from '@heroicons/react/outline';
import { LiquidityHeader, LiquidityPrice } from '../../features/liquidity';
import { MinimalPositionCard } from '../../components-ui/PositionCard';
import UnsupportedCurrencyFooter from '../../features/swap/UnsupportedCurrencyFooter';
import { RippleSpinner } from '../../components-ui/Spinner/RippleSpinner';
import { DefinedStyles } from '../../utils/DefinedStyles';
import { TradeAmountInfo } from '../../components-ui/TradeAmountInfo';
import {
  ViewportMediumUp,
  ViewportSmallDown,
} from '../../components-ui/Responsive';
import { TransactionSettingsWithGas } from '../../components-ui/Exchange/TransactionSettingsWithGas';
import { ExchangeNavigation } from '../../components-ui/Exchange/ExchangeNavigation';
import { AnalyticsLink } from '../../components-ui/AnalyticsLink';
import { DEFAULT_ADD_V2_SLIPPAGE_TOLERANCE } from '../../constants/liquidity';

export default function Liquidity() {
  const { account, chainId, library } = useActiveWeb3React();
  const router = useRouter();
  const queryPair = router.query.pair;
  const [currencyIdA, currencyIdB] = (queryPair as string[]) || [
    undefined,
    undefined,
  ];

  const currencyA = useCurrency(currencyIdA);
  const currencyB = useCurrency(currencyIdB);

  const oneCurrencyIsWETH = Boolean(
    chainId &&
      ((currencyA && currencyEquals(currencyA, WNATIVE[chainId])) ||
        (currencyB && currencyEquals(currencyB, WNATIVE[chainId]))),
  );

  const currencyAIsETH = currencyIdA === 'ETH';
  const currencyBIsETH = currencyIdB === 'ETH';

  // const toggleWalletModal = useWalletModalToggle(); // toggle wallet when disconnected
  const [isExpertMode] = useExpertModeManager();

  // mint state - liquidity trade
  const { independentField, typedValue, otherTypedValue } = useMintState();
  const {
    dependentField,
    currencies,
    pair,
    pairState,
    currencyBalances,
    parsedAmounts,
    price,
    noLiquidity,
    liquidityMinted,
    poolTokenPercentage,
    error,
  } = useDerivedMintInfo(currencyA ?? undefined, currencyB ?? undefined);
  const { onFieldAInput, onFieldBInput } = useMintActionHandlers(noLiquidity);

  const isValid = !error;

  // modal and loading
  const [showConfirm, setShowConfirm] = useState<boolean>(false);
  const [attemptingTxn, setAttemptingTxn] = useState<boolean>(false); // clicked confirm

  // txn values
  const deadline = useTransactionDeadline(); // custom from users settings

  // const [allowedSlippage] = useUserSlippageTolerance(); // custom from users

  const allowedSlippage = useUserSlippageToleranceWithDefault(
    DEFAULT_ADD_V2_SLIPPAGE_TOLERANCE,
  ); // custom from users

  const [txHash, setTxHash] = useState<string>('');

  // get formatted amounts
  const formattedAmounts = {
    [independentField]: typedValue,
    [dependentField]: noLiquidity
      ? otherTypedValue
      : parsedAmounts[dependentField]?.toSignificant(6) ?? '',
  };

  // get the max amounts user can add
  const maxAmounts: { [field in Field]?: CurrencyAmount<Currency> } = [
    Field.CURRENCY_A,
    Field.CURRENCY_B,
  ].reduce((accumulator, field) => {
    return {
      ...accumulator,
      [field]: maxAmountSpend(currencyBalances[field]),
    };
  }, {});

  // whether maxAmt has been entered or not
  const atMaxAmounts: { [field in Field]?: CurrencyAmount<Currency> } = [
    Field.CURRENCY_A,
    Field.CURRENCY_B,
  ].reduce((accumulator, field) => {
    return {
      ...accumulator,
      [field]: maxAmounts[field]?.equalTo(parsedAmounts[field] ?? '0'),
    };
  }, {});

  const overMaxAmounts: { [field in Field]?: CurrencyAmount<Currency> } = [
    Field.CURRENCY_A,
    Field.CURRENCY_B,
  ].reduce((accumulator, field) => {
    return {
      ...accumulator,
      [field]: maxAmounts[field]?.lessThan(parsedAmounts[field] ?? '0'),
    };
  }, {});

  const routerContract = useRouterContract();
  // check whether the user has approved the router on the tokens
  const [approvalA, approveACallback] = useApproveCallback(
    parsedAmounts[Field.CURRENCY_A],
    routerContract?.address,
  );

  const [approvalB, approveBCallback] = useApproveCallback(
    parsedAmounts[Field.CURRENCY_B],
    routerContract?.address,
  );

  const addTransaction = useTransactionAdder();

  async function onAdd() {
    if (!chainId || !library || !account || !routerContract) return;

    const {
      [Field.CURRENCY_A]: parsedAmountA,
      [Field.CURRENCY_B]: parsedAmountB,
    } = parsedAmounts;

    if (
      !parsedAmountA ||
      !parsedAmountB ||
      !currencyA ||
      !currencyB ||
      !deadline
    ) {
      return;
    }

    const amountsMin = {
      [Field.CURRENCY_A]: calculateSlippageAmount(
        parsedAmountA,
        noLiquidity ? ZERO_PERCENT : allowedSlippage,
      )[0],
      [Field.CURRENCY_B]: calculateSlippageAmount(
        parsedAmountB,
        noLiquidity ? ZERO_PERCENT : allowedSlippage,
      )[0],
    };

    let estimate,
      method: (...args: any) => Promise<TransactionResponse>,
      args: Array<string | string[] | number>,
      value: BigNumber | null;
    if (currencyA.isNative || currencyB.isNative) {
      const tokenBIsETH = currencyB.isNative;
      estimate = routerContract.estimateGas.addLiquidityETH;
      method = routerContract.addLiquidityETH;
      args = [
        (tokenBIsETH ? currencyA : currencyB)?.wrapped?.address ?? '', // token
        (tokenBIsETH ? parsedAmountA : parsedAmountB).quotient.toString(), // token desired
        amountsMin[
          tokenBIsETH ? Field.CURRENCY_A : Field.CURRENCY_B
        ].toString(), // token min
        amountsMin[
          tokenBIsETH ? Field.CURRENCY_B : Field.CURRENCY_A
        ].toString(), // eth min
        account,
        deadline.toHexString(),
      ];
      value = BigNumber.from(
        (tokenBIsETH ? parsedAmountB : parsedAmountA).quotient.toString(),
      );
    } else {
      estimate = routerContract.estimateGas.addLiquidity;
      method = routerContract.addLiquidity;
      args = [
        currencyA?.wrapped?.address ?? '',
        currencyB?.wrapped?.address ?? '',
        parsedAmountA.quotient.toString(),
        parsedAmountB.quotient.toString(),
        amountsMin[Field.CURRENCY_A].toString(),
        amountsMin[Field.CURRENCY_B].toString(),
        account,
        deadline.toHexString(),
      ];
      value = null;
    }

    setAttemptingTxn(true);
    await estimate(...args, value ? { value } : {})
      .then((estimatedGasLimit) =>
        method(...args, {
          ...(value ? { value } : {}),
          gasLimit: calculateGasMargin(estimatedGasLimit),
        }).then((response) => {
          setAttemptingTxn(false);

          addTransaction(response, {
            summary: `Add ${parsedAmounts[Field.CURRENCY_A]?.toSignificant(
              3,
            )} ${currencies[Field.CURRENCY_A]?.symbol} and ${parsedAmounts[
              Field.CURRENCY_B
            ]?.toSignificant(3)} ${currencies[Field.CURRENCY_B]?.symbol}`,
          });

          setTxHash(response.hash);

          ReactGA.event({
            category: 'Liquidity',
            action: 'Add',
            label: [
              currencies[Field.CURRENCY_A]?.symbol,
              currencies[Field.CURRENCY_B]?.symbol,
            ].join('/'),
          });
        }),
      )
      .catch((error) => {
        setAttemptingTxn(false);
        // we only care if the error is something _other_ than the user rejected the tx
        if (error?.code !== 4001) {
          console.error(error);
        }
      });
  }

  const modalHeader = () => {
    return noLiquidity ? (
      <div className="flex items-center justify-between mt-4">
        <DoubleCurrencyLogo
          currency0={currencyA}
          currency1={currencyB}
          currencyClassName="rounded-full"
          size={48}
        />
        <div className="text-2xl font-bold text-primary">
          {currencies[Field.CURRENCY_A]?.symbol +
            '/' +
            currencies[Field.CURRENCY_B]?.symbol}
        </div>
      </div>
    ) : (
      <>
        <div className="flex flex-col mt-4">
          <DoubleCurrencyLogo
            currency0={currencyA}
            currency1={currencyB}
            currencyClassName="rounded-full"
            size={48}
          />
          <div className="text-xl font-bold md:text-3xl mr-4 mt-4">
            {liquidityMinted?.toSignificant(6)}
          </div>
        </div>
        <div className="text-lg font-medium md:text-2xl">
          <span className="text-primary">
            {currencies[Field.CURRENCY_A]?.symbol}/
            {currencies[Field.CURRENCY_B]?.symbol}
          </span>
          &nbsp;{`Pool Tokens`}
        </div>
        <div className="pt-3 text-xs text-warn">
          {`Output is estimated. If the price changes by more than ${allowedSlippage.toSignificant(
            4,
          )}% your transaction
            will revert.`}
        </div>
      </>
    );
  };

  const modalBottom = () => {
    return (
      <ConfirmAddModalBottom
        price={price}
        currencies={currencies}
        parsedAmounts={parsedAmounts}
        noLiquidity={noLiquidity}
        onAdd={onAdd}
        poolTokenPercentage={poolTokenPercentage}
      />
    );
  };

  const pendingMessage = () => (
    <div className="flex flex-col justify-center items-center space-y-3">
      <div className="flex items-center space-x-3">
        <TradeAmountInfo amount={parsedAmounts[Field.CURRENCY_A]} />
      </div>
      <div className="flex items-center space-x-3">
        <TradeAmountInfo amount={parsedAmounts[Field.CURRENCY_B]} />
      </div>
      <ArrowRightIcon className="w-3 h-3" />
      <div className="flex items-center space-x-3">
        <DoubleCurrencyLogo
          currency0={currencyA}
          currency1={currencyB}
          currencyClassName="rounded-full"
          size={24}
        />
        <div>
          {liquidityMinted?.toSignificant(6)}&nbsp;
          {currencies[Field.CURRENCY_A]?.symbol +
            '-' +
            currencies[Field.CURRENCY_B]?.symbol}
        </div>
      </div>
    </div>
  );

  const handleCurrencyASelect = useCallback(
    (currencyA: Currency) => {
      const newCurrencyIdA = currencyId(currencyA);
      if (newCurrencyIdA === currencyIdB) {
        router.push(`/add/${currencyIdB}/${currencyIdA}`);
      } else {
        router.push(`/add/${newCurrencyIdA}/${currencyIdB}`);
      }
    },
    [currencyIdB, router, currencyIdA],
  );

  const handleCurrencyBSelect = useCallback(
    (currencyB: Currency) => {
      const newCurrencyIdB = currencyId(currencyB);
      if (currencyIdA === newCurrencyIdB) {
        if (currencyIdB) {
          router.push(`/add/${currencyIdB}/${newCurrencyIdB}`);
        } else {
          router.push(`/add/${newCurrencyIdB}`);
        }
      } else {
        router.push(
          `/add/${currencyIdA ? currencyIdA : 'ETH'}/${newCurrencyIdB}`,
        );
      }
    },
    [currencyIdA, router, currencyIdB],
  );

  const handleDismissConfirmation = useCallback(() => {
    setShowConfirm(false);
    // if there was a tx hash, we want to clear the input
    if (txHash) {
      onFieldAInput('');
    }
    setTxHash('');
  }, [onFieldAInput, txHash]);

  const addIsUnsupported = useIsSwapUnsupported(
    currencies?.CURRENCY_A,
    currencies?.CURRENCY_B,
  );

  const isPairValid = pair && pairState !== PairState.INVALID;
  const pairAddressForAnalytics =
    pair && pairState == PairState.EXISTS && pair?.liquidityToken?.address;

  return (
    <>
      <Head>
        <title>LIQUIDITY | Standard Protocol</title>
        <meta
          key="description"
          name="description"
          content="Add liquidity to the Standard Protocol AMM to enable gas optimised and low slippage trades across countless networks"
        />
      </Head>
      <Page id="add-liquidity-page" className={DefinedStyles.page}>
        <ViewportMediumUp>
          <PageHeader title="add liquidity" />
        </ViewportMediumUp>

        <PageContent>
          {chainId === ChainId.SHIDEN && (
            <Alert
              className={DefinedStyles.pageAlertMaxed}
              title={`Please Read!`}
              message={`Adding liquidity for SDN-ERC20 does not work due to the Shiden EVM error. Please wrap your SDN to WSDN and add WSDN-ERC20 liquidity instead`}
              type="warning"
            />
          )}
          <Alert
            className={DefinedStyles.pageAlertMaxed}
            message={
              noLiquidity ? (
                `When creating a pair you are the first liquidity provider. The ratio of tokens you add will set the price of this pool. Once you are happy with the rate, click supply to review`
              ) : (
                <>
                  <b>{`Tip:`}</b>{' '}
                  {`By providing liquidity you'll earn 0.25% of all trades on this pair
                proportional to your share of the pool. Fees are added to the pool, accrue in real time and can be
                claimed by withdrawing your liquidity.`}
                </>
              )
            }
            type="information"
          />
          <ViewportSmallDown>
            <div className="w-full mb-8">
              <ExchangeNavigation
                input={currencies[Field.CURRENCY_A]}
                output={currencies[Field.CURRENCY_B]}
              />
            </div>
          </ViewportSmallDown>

          <div className={DefinedStyles.pageContent}>
            {/* <AddRemoveTabs creating={isCreate} adding={true} defaultSlippage={DEFAULT_ADD_V2_SLIPPAGE_TOLERANCE} /> */}
            <div className="mb-4">
              <ViewportSmallDown>
                <div className="flex justify-end items-center space-x-2">
                  <TransactionSettingsWithGas
                    allowedSlippage={allowedSlippage}
                  />
                  <AnalyticsLink path={pair ? `pairs/${pair}` : 'pairs'} />
                </div>
              </ViewportSmallDown>
              <ViewportMediumUp>
                <ExchangeHeader
                  input={currencies[Field.CURRENCY_A]}
                  output={currencies[Field.CURRENCY_B]}
                  allowedSlippage={allowedSlippage}
                  pair={pairAddressForAnalytics}
                />
              </ViewportMediumUp>
            </div>

            <TransactionConfirmationModal
              isOpen={showConfirm}
              onDismiss={handleDismissConfirmation}
              attemptingTxn={attemptingTxn}
              hash={txHash}
              content={() => (
                <ConfirmationModalContent
                  title={
                    noLiquidity ? `You are creating a pool` : `You will receive`
                  }
                  onDismiss={handleDismissConfirmation}
                  topContent={modalHeader}
                  bottomContent={modalBottom}
                />
              )}
              pendingText={pendingMessage()}
            />
            <div className="grid gap-3">
              <LiquidityHeader
                input={currencies[Field.CURRENCY_A]}
                output={currencies[Field.CURRENCY_B]}
                isPairValid={isPairValid}
              />

              <div className="mt-5 sm:mt-0">
                <CurrencyInputPanel
                  label={'Token 1:'}
                  value={formattedAmounts[Field.CURRENCY_A]}
                  onUserInput={onFieldAInput}
                  onMax={() => {
                    onFieldAInput(
                      maxAmounts[Field.CURRENCY_A]?.toExact() ?? '',
                    );
                  }}
                  onCurrencySelect={handleCurrencyASelect}
                  showMaxButton={!atMaxAmounts[Field.CURRENCY_A]}
                  currency={currencies[Field.CURRENCY_A]}
                  id="add-liquidity-input-tokena"
                  showCommonBases
                />

                <div className="flex justify-center items-center my-3">
                  <button
                    className="
                      z-10 sm:-mt-10 sm:-mb-10 text-text
                      cursor-default
                    "
                  >
                    <div className="rounded-full p-3 bg-icon-btn-grey">
                      <PlusIcon className="w-6 h-6" />
                    </div>
                  </button>
                </div>

                <CurrencyInputPanel
                  label={'Token 2:'}
                  value={formattedAmounts[Field.CURRENCY_B]}
                  onUserInput={onFieldBInput}
                  onCurrencySelect={handleCurrencyBSelect}
                  onMax={() => {
                    onFieldBInput(
                      maxAmounts[Field.CURRENCY_B]?.toExact() ?? '',
                    );
                  }}
                  showMaxButton={!atMaxAmounts[Field.CURRENCY_B]}
                  currency={currencies[Field.CURRENCY_B]}
                  id="add-liquidity-input-tokenb"
                  showCommonBases
                />
              </div>

              {currencies[Field.CURRENCY_A] &&
                currencies[Field.CURRENCY_B] &&
                pairState !== PairState.INVALID && (
                  <div className="p-1 rounded-20">
                    <LiquidityPrice
                      currencies={currencies}
                      price={price}
                      noLiquidity={noLiquidity}
                      poolTokenPercentage={poolTokenPercentage}
                      className="text-grey"
                    />
                  </div>
                )}

              <div className={DefinedStyles.divider} />
              {(overMaxAmounts[Field.CURRENCY_A] ||
                overMaxAmounts[Field.CURRENCY_B]) && (
                <div className="text-danger text-sm text-center">
                  {overMaxAmounts[Field.CURRENCY_A]
                    ? `Insufficient ${currencyA.symbol} balance`
                    : `Insufficient ${currencyB.symbol} balance`}
                </div>
              )}
              {addIsUnsupported ? (
                <Button color="primary" disabled>
                  {`Unsupported Asset`}
                </Button>
              ) : !account ? (
                <WalletConnector />
              ) : (
                (approvalA === ApprovalState.NOT_APPROVED ||
                  approvalA === ApprovalState.PENDING ||
                  approvalB === ApprovalState.NOT_APPROVED ||
                  approvalB === ApprovalState.PENDING ||
                  isValid) && (
                  <div className="grid gap-4">
                    {
                      <div className="w-full flex justify-between space-x-3">
                        {!currencyAIsETH && (
                          <>
                            {approvalA !== ApprovalState.APPROVED && (
                              <Button
                                className={DefinedStyles.swapButton}
                                onClick={approveACallback}
                                disabled={approvalA === ApprovalState.PENDING}
                                style={{
                                  width:
                                    approvalB !== ApprovalState.APPROVED &&
                                    !currencyBIsETH
                                      ? '48%'
                                      : '100%',
                                }}
                              >
                                {approvalA === ApprovalState.PENDING ? (
                                  <div className="flex items-center justify-center space-x-3">
                                    <div>{`Approving ${
                                      currencies[Field.CURRENCY_A]?.symbol
                                    }`}</div>
                                    <RippleSpinner size={16} />
                                  </div>
                                ) : (
                                  `Approve ${
                                    currencies[Field.CURRENCY_A]?.symbol
                                  }`
                                )}
                              </Button>
                            )}
                          </>
                        )}
                        {!currencyBIsETH && (
                          <>
                            {approvalB !== ApprovalState.APPROVED && (
                              <Button
                                className={DefinedStyles.swapButton}
                                onClick={approveBCallback}
                                disabled={approvalB === ApprovalState.PENDING}
                                style={{
                                  width:
                                    approvalA !== ApprovalState.APPROVED &&
                                    !currencyAIsETH
                                      ? '48%'
                                      : '100%',
                                }}
                              >
                                {approvalB === ApprovalState.PENDING ? (
                                  <div className="flex items-center justify-center space-x-3">
                                    <div>{`Approving ${
                                      currencies[Field.CURRENCY_B]?.symbol
                                    }`}</div>
                                    <RippleSpinner size={16} />
                                  </div>
                                ) : (
                                  `Approve ${
                                    currencies[Field.CURRENCY_B]?.symbol
                                  }`
                                )}
                              </Button>
                            )}
                          </>
                        )}
                      </div>
                    }

                    {approvalA === ApprovalState.APPROVED &&
                      approvalB === ApprovalState.APPROVED && (
                        <ButtonError
                          className={DefinedStyles.swapButton}
                          onClick={() => {
                            isExpertMode ? onAdd() : setShowConfirm(true);
                          }}
                          disabled={
                            !isValid ||
                            approvalA !== ApprovalState.APPROVED ||
                            approvalB !== ApprovalState.APPROVED
                          }
                          error={
                            !isValid &&
                            !!parsedAmounts[Field.CURRENCY_A] &&
                            !!parsedAmounts[Field.CURRENCY_B]
                          }
                        >
                          {error ?? `Confirm Adding Liquidity`}
                        </ButtonError>
                      )}
                  </div>
                )
              )}

              {!addIsUnsupported ? (
                pair && !noLiquidity && pairState !== PairState.INVALID ? (
                  <MinimalPositionCard
                    showUnwrapped={oneCurrencyIsWETH}
                    pair={pair}
                  />
                ) : null
              ) : (
                <UnsupportedCurrencyFooter
                  show={addIsUnsupported}
                  currencies={[currencies.CURRENCY_A, currencies.CURRENCY_B]}
                />
              )}
            </div>
          </div>
        </PageContent>
      </Page>
    </>
  );
}
