import Head from 'next/head';
import { Page } from '../../components-ui/Page';
import { PageContent } from '../../components-ui/PageContent';
import { DefinedStyles } from '../../utils/DefinedStyles';
import { CollateralSelectPanel } from '../../features/usm/collateralize/CollateralSelectPanel';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { classNames, formatNumber, tryParseAmount } from '../../functions';
import { useRouter } from 'next/router';
import { useCurrencyBalance } from '../../state/wallet/hooks';
import {
  ApprovalState,
  useActiveWeb3React,
  useApproveCallback,
} from '../../hooks';
import { CollateralInfo } from '../../features/usm/collateralize/CollateralInfo';
import {
  ChainId,
  getVaultManagerAddress,
} from '@digitalnative/standard-protocol-sdk';
import { useProtocol } from '../../state/protocol/hooks';
import useCDP from '../../hooks/vault/useCDP';
import { ViewportMediumUp } from '../../components-ui/Responsive';
import { PageHeader } from '../../components-ui/PageHeader';
import { CollateralizeBorrowPanel } from '../../features/usm/collateralize/CollateralizeBorrowPanel';
import { CDPMetrics } from '../../features/usm/collateralize/CDPMetrics';
import { Button } from '../../components-ui/Button';
import { CollateralizeSettingsPanel } from '../../features/usm/collateralize/CollateralizeSettingsPanel';
import { useTransactionAdder } from '../../state/transactions/hooks';
import { useCollateral } from '../../features/usm/useCollateral';
import {
  getSafeCollateralRatio,
  MAX_COLLATERAL_RATIO,
} from '../../features/usm/constants';
import { RippleSpinner } from '../../components-ui/Spinner/RippleSpinner';
import { useUsmMintableSupply } from '../../features/usm/useUsmMintableSupply';
import { Alert } from '../../components-ui/Alert';
import { NetworkGuardWrapper } from '../../guards/Network';
import TransactionConfirmationModal from '../../modals/TransactionConfirmationModal';
import { useTransactionSubmission } from '../../hooks/useTransactionSubmission';

function Collateral() {
  const addTransaction = useTransactionAdder();
  const {
    showConfirm,
    attemptingTxn,
    setAttemptingTxn,
    txHash,
    handleSubmission,
    handleDismissConfirmation,
  } = useTransactionSubmission();
  const { isMintable, mintableSupply } = useUsmMintableSupply();
  const { account, chainId } = useActiveWeb3React();
  const protocol = useProtocol();
  const router = useRouter();
  const collateralAddr = router.query.collateral[0];

  const {
    collateralAddress,
    collateralCurrency,
    cVault,
    usm,
    lfr,
    sfr,
    mcr,
    collateralPrice,
    usmPrice,
    loading,
    isNative,
    isWnative,
    handleWrapUnwrap,
  } = useCollateral(collateralAddr);

  const balance = useCurrencyBalance(account, collateralCurrency);
  const [collateralizeAmount, setCollateralizeAmount] = useState('');

  const [usmAmount, setUsmAmount] = useState('');
  const usmCurrencyAmount = tryParseAmount(usmAmount, usm);

  const collateralizeValue =
    collateralPrice && collateralizeAmount !== ''
      ? parseFloat(collateralizeAmount) * collateralPrice
      : 0;

  const collateralizeCurrencyAmount = tryParseAmount(
    collateralizeAmount,
    collateralCurrency,
  );

  const safeCollateralRatio = getSafeCollateralRatio(mcr);

  const [collateralRatio, setCollateralRatio] = useState(
    String(safeCollateralRatio),
  );

  const [collateralRatioPercentage, setCollateralRatioPercentage] = useState(
    (safeCollateralRatio / MAX_COLLATERAL_RATIO) * 100,
  );

  useEffect(() => {
    if (safeCollateralRatio) {
      setCollateralRatio(String(safeCollateralRatio));
      setCollateralRatioPercentage(
        (safeCollateralRatio / MAX_COLLATERAL_RATIO) * 100,
      );
    }
  }, [safeCollateralRatio]);

  const handleCollateralizeAmountChange = (value) => {
    setCollateralizeAmount(value);
    const _collateralValue =
      collateralPrice && value !== '' ? parseFloat(value) * collateralPrice : 0;

    if (collateralRatio !== '') {
      setUsmAmount(
        String((_collateralValue / parseFloat(collateralRatio)) * 100),
      );
    } else {
      setUsmAmount('');
    }
  };

  const liquidationPrice =
    !loading && usmAmount !== '' && collateralizeAmount !== ''
      ? (parseFloat(usmAmount) * mcr) / 100 / parseFloat(collateralizeAmount)
      : 0;

  const handleChangeUsmAmount = (value) => {
    const newCollateralAmount =
      collateralPrice && collateralRatio
        ? (parseFloat(value) * parseFloat(collateralRatio)) /
          collateralPrice /
          100
        : '';
    setCollateralizeAmount(newCollateralAmount.toString());
    setUsmAmount(value);
  };

  const handleChangeCollateralRatio = (value, changePerc = true) => {
    if (value === '') {
      setCollateralRatioPercentage((mcr / MAX_COLLATERAL_RATIO) * 100);
      setCollateralRatio('');
      setUsmAmount('');
      return;
    }
    if (parseFloat(value) >= MAX_COLLATERAL_RATIO) {
      setCollateralRatio(String(value));
      setCollateralRatioPercentage(100);
      setUsmAmount(String((collateralizeValue / parseFloat(value)) * 100));
      return;
    }
    if (changePerc) {
      const newCollateralRatioPercentage =
        (parseFloat(value) / MAX_COLLATERAL_RATIO) * 100;

      setCollateralRatioPercentage(newCollateralRatioPercentage);
    }
    setCollateralRatio(value);
    setUsmAmount(String((collateralizeValue / parseFloat(value)) * 100));
  };

  const setToMinCollataralRatio = () => {
    handleChangeCollateralRatio(String(mcr), true);
  };

  const setToSafeCollateralRatio = () => {
    handleChangeCollateralRatio(String(safeCollateralRatio), true);
  };

  const formattedCollateralizeAmount = tryParseAmount(
    collateralizeAmount,
    collateralCurrency,
  );

  const [approvalState, approve] = useApproveCallback(
    formattedCollateralizeAmount,
    getVaultManagerAddress(protocol, chainId),
  );

  const { createCDP, createCDPNative } = useCDP();

  const borrowable =
    isMintable &&
    balance &&
    collateralizeCurrencyAmount &&
    collateralRatio &&
    parseFloat(collateralRatio) >= mcr &&
    (balance.greaterThan(collateralizeCurrencyAmount) ||
      balance.equalTo(collateralizeCurrencyAmount));

  const confirmButtonMessage = useMemo(() => {
    if (!isMintable) return 'USM is not borrowable';
    if (
      balance &&
      collateralizeCurrencyAmount &&
      (balance.greaterThan(collateralizeCurrencyAmount) ||
        balance.equalTo(collateralizeCurrencyAmount))
    ) {
      if (
        approvalState == ApprovalState.NOT_APPROVED ||
        approvalState == ApprovalState.UNKNOWN
      ) {
        return 'Approve';
      } else if (approvalState == ApprovalState.PENDING) {
        return (
          <div className="flex items-center justify-center space-x-3">
            <div>Approving</div>
            <RippleSpinner size={16} />
          </div>
        );
      }
      return 'Borrow';
    } else if (!collateralizeCurrencyAmount) {
      return 'Enter Collateral Amount';
    } else {
      return 'Insufficient Balance';
    }
  }, [balance, collateralizeCurrencyAmount]);

  const onClick = useCallback(async () => {
    if (approvalState == ApprovalState.APPROVED) {
      if (usmCurrencyAmount) {
        let tx;
        if (collateralCurrency.isNative) {
          tx = await createCDPNative(
            formattedCollateralizeAmount.quotient.toString(),
            usmCurrencyAmount.quotient.toString(),
          );
        } else if (collateralCurrency.isToken) {
          tx = await createCDP(
            collateralCurrency.address,
            usm.address,
            formattedCollateralizeAmount.quotient.toString(),
            usmCurrencyAmount.quotient.toString(),
          );
        }
        tx &&
          addTransaction(tx, {
            summary: `Collateralize ${formatNumber(
              formattedCollateralizeAmount.toExact(),
            )} ${collateralCurrency.symbol} and borrow ${formatNumber(
              usmCurrencyAmount.toExact(),
            )}`,
          });
        tx && handleSubmission(tx.hash);
      }
    } else if (approvalState == ApprovalState.NOT_APPROVED) {
      await approve();
    }
  }, [
    approvalState,
    usmCurrencyAmount,
    formattedCollateralizeAmount,
    collateralCurrency,
    usm,
  ]);

  return (
    <>
      <Head>
        <title>Collateralize | Standard Protocol</title>
        <meta
          key="description"
          name="description"
          content="Trade ERC 20 tokens on Standard Protocol"
        />
      </Head>
      <Page id="collateralize-page" className={DefinedStyles.page}>
        <ViewportMediumUp>
          <PageHeader title="Collateralize" />
        </ViewportMediumUp>
        <PageContent>
          <div className="w-full max-w-[1000px] space-y-8">
            {!isMintable && (
              <Alert
                type="error"
                dismissable={false}
                showIcon
                message={
                  <div>
                    <div>
                      USM Cap has been reached and USM is not borrowable at the
                      moment
                    </div>
                  </div>
                }
              />
            )}
            <CollateralInfo
              mcr={mcr}
              lfr={lfr}
              sfr={sfr}
              collateralPrice={collateralPrice}
              collateral={collateralCurrency}
            />
            <div className="grid grid-cols-2 lg:grid-cols-7 gap-4">
              <div className="space-y-4 col-span-2 lg:col-span-5">
                <CollateralSelectPanel
                  balance={balance}
                  collateral={collateralCurrency}
                  collateralizeAmount={collateralizeAmount}
                  setCollateralizeAmount={handleCollateralizeAmountChange}
                  isNative={isNative}
                  isWnative={isWnative}
                  handleWrapUnwrap={handleWrapUnwrap}
                />
                <CollateralizeSettingsPanel
                  usmAmount={usmAmount}
                  collateralRatio={collateralRatio}
                  setCollateralRatio={handleChangeCollateralRatio}
                  maxCollateralRatio={MAX_COLLATERAL_RATIO}
                  setCollateralRatioPercentage={setCollateralRatioPercentage}
                  collateralRatioPercentage={collateralRatioPercentage}
                  setToMinCollataralRatio={setToMinCollataralRatio}
                  setToSafeCollateralRatio={setToSafeCollateralRatio}
                />
                <CollateralizeBorrowPanel
                  mintableSupply={mintableSupply}
                  usmAmount={usmAmount}
                  usm={usm}
                  setUsmAmount={handleChangeUsmAmount}
                  onBorrowClick={onClick}
                  borrowable={borrowable}
                  buttonMessage={confirmButtonMessage}
                />
              </div>
              <div className="col-span-2">
                <CDPMetrics
                  collateralPrice={collateralPrice}
                  liquidationPrice={liquidationPrice}
                  mtrPriceUSD={usmPrice}
                  debtAmount={usmAmount}
                />
              </div>
            </div>
            <div className="flex justify-center">
              <Button
                disabled={!borrowable}
                className={classNames(
                  DefinedStyles.fullButton,
                  'md:max-w-[50%]',
                )}
                onClick={onClick}
              >
                {confirmButtonMessage}
              </Button>
            </div>
            <TransactionConfirmationModal
              isOpen={showConfirm}
              onDismiss={handleDismissConfirmation}
              attemptingTxn={attemptingTxn}
              currencyToAdd={usm}
              hash={txHash ? txHash : ''}
              content={() => {
                return <></>;
              }}
              pendingText={''}
            />
          </div>
        </PageContent>
      </Page>
    </>
  );
}

Collateral.Guard = NetworkGuardWrapper([ChainId.RINKEBY]);
export default Collateral;
