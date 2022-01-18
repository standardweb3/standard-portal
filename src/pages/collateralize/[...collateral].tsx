import Head from 'next/head';
import { Page } from '../../components-ui/Page';
import { PageContent } from '../../components-ui/PageContent';
import { DefinedStyles } from '../../utils/DefinedStyles';
import { CollateralSelectPanel } from '../../features/vault/new/CollateralSelectPanel';
import { useCallback, useMemo, useState } from 'react';
import { classNames, formatBalance, tryParseAmount } from '../../functions';
import { useRouter } from 'next/router';
// import { useCollateral } from '../../services/graph/hooks/collaterals';
import { useCurrency } from '../../hooks/Tokens';
import { useCurrencyBalance } from '../../state/wallet/hooks';
import {
  ApprovalState,
  useActiveWeb3React,
  useApproveCallback,
} from '../../hooks';
import { CollateralizeSettingsPanel } from '../../features/vault/new/CollateralizeSettingsPanel';
import { CollateralInfo } from '../../features/vault/new/CollateralInfo';
import { useVaultManagerAssetPrice } from '../../hooks/vault/useVaultManager';
import {
  getVaultManagerAddress,
  WNATIVE,
} from '@digitalnative/standard-protocol-sdk';
import { useProtocol } from '../../state/protocol/hooks';
import useCDP from '../../hooks/vault/useCDP';
import { useMtr } from '../../hooks/vault/useMtr';
import { useCVault } from '../../services/graph/hooks/vault';
import { ViewportMediumUp } from '../../components-ui/Responsive';
import { PageHeader } from '../../components-ui/PageHeader';
import { CollateralizeBorrowPanel } from '../../features/vault/new/CollateralizeBorrowPanel';
import { getAddress } from 'ethers/lib/utils';
import { CDP_DECIMALS } from '../../features/vault/constants';
import { CollateralizeMetrics } from '../../features/vault/new/CollateralizeMetrics';
import { CollateralizeJargons } from '../../features/vault/new/CollateralizeJargons';
import { Button } from '../../components-ui/Button';

export default function Collateral() {
  const { account, chainId } = useActiveWeb3React();
  const protocol = useProtocol();
  const router = useRouter();
  const mtr = useMtr();

  const collateralAddr = router.query.collateral[0];
  const isNative = collateralAddr === 'ETH';

  const cVault = useCVault({
    id: isNative
      ? WNATIVE[chainId].address.toLowerCase()
      : collateralAddr.toLowerCase(),
  });

  const { cdp } = cVault ?? {};
  const { id, symbol, lfr: _lfr, sfr: _sfr, mcr: _mcr, decimals } = cdp ?? {};
  const lfr = parseFloat(formatBalance(_lfr ?? 0, CDP_DECIMALS));
  const sfr = parseFloat(formatBalance(_sfr ?? 0, CDP_DECIMALS));
  const mcr = parseFloat(formatBalance(_mcr ?? 0, CDP_DECIMALS));

  // const collateralInfo = useCollateral(collateralAddr);
  const collateral = useCurrency(collateralAddr);
  const isCollateralETH = collateral?.isNative;

  const collateralPriceUSD = useVaultManagerAssetPrice(id && getAddress(id));
  const mtrPriceUSD = useVaultManagerAssetPrice(mtr && mtr.address);

  const balance = useCurrencyBalance(account, collateral);
  const [collateralizeAmount, setCollateralizeAmount] = useState('');

  const collateralValueUSD =
    collateralPriceUSD && collateralizeAmount !== ''
      ? parseFloat(collateralizeAmount) * collateralPriceUSD
      : 0;

  // // temporary
  const collateralizeCurrencyAmount = tryParseAmount(
    collateralizeAmount,
    collateral,
  );

  const maxCollateralRatio = 320;
  const safeCollateralRatio = 200;
  // change to collateral info
  const minCollateralRatio = mcr;

  const [collateralRatio, setCollateralRatio] = useState(
    String(safeCollateralRatio),
  );

  const liquidationPriceUSD =
    collateralPriceUSD &&
    (collateralPriceUSD / parseFloat(collateralRatio)) * 100;

  const handleCollateralizeAmountChange = (value) => {
    setCollateralizeAmount(value);
    const _collateralValueUSD =
      collateralPriceUSD && value !== ''
        ? parseFloat(value) * collateralPriceUSD
        : 0;

    setMtrAmount(
      String((_collateralValueUSD / parseFloat(collateralRatio)) * 100),
    );
  };

  const [collateralRatioPercentage, setCollateralRatioPercentage] = useState(
    (safeCollateralRatio / maxCollateralRatio) * 100,
  );

  const [mtrAmount, setMtrAmount] = useState('');
  const mtrCourrencyAmount = tryParseAmount(mtrAmount, mtr);

  const handleChangeMtrAmount = (value) => {
    const newCollateralAmount =
      collateralPriceUSD && collateralRatio
        ? (parseFloat(value) * parseFloat(collateralRatio)) /
          collateralPriceUSD /
          100
        : '';
    setCollateralizeAmount(newCollateralAmount.toString());
    setMtrAmount(value);
  };

  const handleChangeCollateralRatio = (value, changePerc = true) => {
    if (value === '') {
      setCollateralRatioPercentage(
        (minCollateralRatio / maxCollateralRatio) * 100,
      );
      setCollateralRatio('');
      setMtrAmount('');
      return;
    }
    if (parseFloat(value) >= maxCollateralRatio) {
      setCollateralRatio(String(maxCollateralRatio));
      setCollateralRatioPercentage(100);
      return;
    }
    if (changePerc) {
      const newCollateralRatioPercentage =
        (parseFloat(value) / maxCollateralRatio) * 100;

      setCollateralRatioPercentage(newCollateralRatioPercentage);
    }
    setCollateralRatio(value);
    // console.log('vault', value, collateralValueUSD);
    setMtrAmount(String((collateralValueUSD / parseFloat(value)) * 100));
  };

  const setToMinCollataralRatio = () => {
    handleChangeCollateralRatio(String(minCollateralRatio), true);
  };

  const setToSafeCollateralRatio = () => {
    handleChangeCollateralRatio(String(safeCollateralRatio), true);
  };

  const [pendingTx, setPendingTx] = useState(false);

  const formattedCollateralizeAmount = tryParseAmount(
    collateralizeAmount,
    collateral,
  );

  const [approvalState, approve] = useApproveCallback(
    formattedCollateralizeAmount,
    getVaultManagerAddress(protocol, chainId),
  );

  const { createCDP, createCDPNative } = useCDP();

  const borrowable =
    balance &&
    collateralizeCurrencyAmount &&
    collateralRatio &&
    parseFloat(collateralRatio) >= minCollateralRatio &&
    (balance.greaterThan(collateralizeCurrencyAmount) ||
      balance.equalTo(collateralizeCurrencyAmount));

  const confirmButtonMessage = useMemo(() => {
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
        return 'Approving';
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
      if (mtrCourrencyAmount) {
        if (isCollateralETH) {
          console.log('vault: createCDPNative');
          await createCDPNative(
            formattedCollateralizeAmount.quotient.toString(),
            mtrCourrencyAmount.quotient.toString(),
          );
        } else if (collateral.isToken) {
          console.log(
            'vault: createCDP',
            formattedCollateralizeAmount.quotient.toString(),
            mtrCourrencyAmount.quotient.toString(),
          );
          await createCDP(
            collateral.address,
            mtr.address,
            formattedCollateralizeAmount.quotient.toString(),
            mtrCourrencyAmount.quotient.toString(),
          );
        }
      }
    } else if (approvalState == ApprovalState.NOT_APPROVED) {
      await approve();
    }
  }, [approvalState]);

  // const isValidCDP = useVaultManagerIsValidCDP(
  //   collateralInfo?.priceAddress,
  //   mtr.address,
  //   formattedCollateralizeAmount?.quotient.toString(),
  //   mtrCourrencyAmount?.quotient.toString(),
  // );

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
      <Page id="trade-page" className={DefinedStyles.page}>
        <ViewportMediumUp>
          <PageHeader title="Collateralize" />
        </ViewportMediumUp>
        <PageContent>
          <div className="w-full max-w-[1000px] space-y-8">
            <CollateralInfo
              mcr={mcr}
              lfr={lfr}
              sfr={sfr}
              priceUSD={collateralPriceUSD}
              collateral={collateral}
            />
            <div className="grid grid-cols-2 lg:grid-cols-7 gap-4">
              <div className="space-y-4 col-span-2 lg:col-span-5">
                <CollateralSelectPanel
                  balance={balance}
                  collateral={collateral}
                  collateralizeAmount={collateralizeAmount}
                  setCollateralizeAmount={handleCollateralizeAmountChange}
                />
                <CollateralizeSettingsPanel
                  mtrAmount={mtrAmount}
                  collateralRatio={collateralRatio}
                  setCollateralRatio={handleChangeCollateralRatio}
                  maxCollateralRatio={maxCollateralRatio}
                  setCollateralRatioPercentage={setCollateralRatioPercentage}
                  collateralRatioPercentage={collateralRatioPercentage}
                  setToMinCollataralRatio={setToMinCollataralRatio}
                  setToSafeCollateralRatio={setToSafeCollateralRatio}
                />
                <CollateralizeBorrowPanel
                  mtrAmount={mtrAmount}
                  mtr={mtr}
                  setMtrAmount={handleChangeMtrAmount}
                  onBorrowClick={onClick}
                  borrowable={borrowable}
                  buttonMessage={confirmButtonMessage}
                />
              </div>
              <div className="col-span-2">
                <CollateralizeMetrics
                  collateralPrice={collateralPriceUSD}
                  liquidationPrice={liquidationPriceUSD}
                  mtrPriceUSD={mtrPriceUSD}
                  debtAmount={mtrAmount}
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
            {/* <CollateralizeJargons /> */}
          </div>
        </PageContent>
      </Page>
    </>
  );
}
