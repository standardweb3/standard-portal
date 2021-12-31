import Head from 'next/head';
import { VaultInfo } from '../../features/vault/new/VaultInfo';
import { Page } from '../../components-ui/Page';
import { PageContent } from '../../components-ui/PageContent';
import { DefinedStyles } from '../../utils/DefinedStyles';
import { CollateralSelectPanel } from '../../features/vault/new/CollateralSelectPanel';
import { useCallback, useMemo, useState } from 'react';
import { tryParseAmount } from '../../functions';
import { useRouter } from 'next/router';
import { useCollateral } from '../../services/graph/hooks/collaterals';
import { useCurrency } from '../../hooks/Tokens';
import { useCurrencyBalance } from '../../state/wallet/hooks';
import {
  ApprovalState,
  useActiveWeb3React,
  useApproveCallback,
} from '../../hooks';
import { CollateralizeSettingsPanel } from '../../features/vault/new/CollateralizeSettingsPanel';
import { useEthPrice, useToken } from '../../services/graph';
import { ConfirmCollateralizeButton } from '../../features/vault/new/ConfirmCollateralizeButton';
import { CollateralInfo } from '../../features/vault/new/CollateralInfo';
import {
  useVaultManagerAssetPrice,
  useVaultManagerIsValidCDP,
} from '../../hooks/vault/useVaultManager';
import {
  getVaultManagerAddress,
  NATIVE,
  WNATIVE,
} from '@digitalnative/standard-protocol-sdk';
import { useProtocol } from '../../state/protocol/hooks';
import useCDP from '../../hooks/vault/useCDP';
import { useMtr } from '../../hooks/vault/useMtr';
import { useCVault } from '../../services/graph/hooks/vault';
import { ViewportMediumUp } from '../../components-ui/Responsive';
import { PageHeader } from '../../components-ui/PageHeader';

export default function Collateral() {
  const { account, chainId } = useActiveWeb3React();
  const protocol = useProtocol();
  const router = useRouter();

  const collateralAddr = router.query.collateral[0];
  const isNative = collateralAddr === 'ETH';

  const cVault = useCVault({
    id: isNative
      ? WNATIVE[chainId].address.toLowerCase()
      : collateralAddr.toLowerCase(),
  });

  const { cdp } = cVault ?? {};
  const { lfr, sfr, mcr } = cdp ?? {};
  // temporary
  // const ethPrice = useEthPrice();

  const collateralInfo = useCollateral(collateralAddr);
  const collateral = useCurrency(collateralAddr);
  const isCollateralETH = collateral?.isNative;

  // console.log('vault: collateral', collateral);
  // console.log('vault: collateralInfo', collateralInfo);
  // temporary to obtain price
  // const collateralExchangeToken = useToken({
  //   id: collateral?.isToken ? collateral.address.toLowerCase() : null,
  // });

  const collateralPriceUSD = useVaultManagerAssetPrice(
    collateralInfo?.priceAddress,
  );
  // console.log('vault: collateral price', collateralPriceUSD);

  const balance = useCurrencyBalance(account, collateral);
  const [collateralizeAmount, setCollateralizeAmount] = useState('');

  const collateralValueUSD =
    collateralPriceUSD && collateralizeAmount !== ''
      ? parseFloat(collateralizeAmount) * collateralPriceUSD
      : 0;

  // console.log('vault: collateral value usd:', collateralValueUSD);

  // // temporary
  const collateralizeCurrencyAmount = tryParseAmount(
    collateralizeAmount,
    collateral,
  );

  const maxLiquidationRatio = 400;
  const safeLiquidationRatio = 200;
  // change to collateral info
  const minLiquidationRatio = 150;

  const [liquidationRatio, setLiquidationRatio] = useState(
    String(safeLiquidationRatio),
  );

  const handleCollateralizeAmountChange = (value) => {
    setCollateralizeAmount(value);
    const _collateralValueUSD =
      collateralPriceUSD && value !== ''
        ? parseFloat(value) * collateralPriceUSD
        : 0;

    // console.log(
    //   'vault _collateralValueUSD / parseFloat(liquidationRatio) ',
    //   _collateralValueUSD / parseFloat(liquidationRatio),
    //   liquidationRatio,
    // );
    setMtrAmount(
      String((_collateralValueUSD / parseFloat(liquidationRatio)) * 100),
    );
  };

  const [liquidationRatioPercentage, setLiquidationRatioPercentage] = useState(
    (safeLiquidationRatio / maxLiquidationRatio) * 100,
  );

  const [mtrAmount, setMtrAmount] = useState('');
  const mtr = useMtr();
  const mtrCourrencyAmount = tryParseAmount(mtrAmount, mtr);

  const handleChangeLiquidationRatio = (value, changePerc = true) => {
    if (value === '') {
      setLiquidationRatioPercentage(
        (minLiquidationRatio / maxLiquidationRatio) * 100,
      );
      setLiquidationRatio('');
      setMtrAmount('');
      return;
    }
    if (parseFloat(value) >= maxLiquidationRatio) {
      setLiquidationRatio(String(maxLiquidationRatio));
      setLiquidationRatioPercentage(100);
      return;
    }
    if (changePerc) {
      const newLiqudationRatioPercentage =
        (parseFloat(value) / maxLiquidationRatio) * 100;

      setLiquidationRatioPercentage(newLiqudationRatioPercentage);
    }
    setLiquidationRatio(value);
    // console.log('vault', value, collateralValueUSD);
    setMtrAmount(String((collateralValueUSD / parseFloat(value)) * 100));
  };

  const setToMinLiquidationRatio = () => {
    handleChangeLiquidationRatio(String(minLiquidationRatio), true);
  };

  const setToSafeLiquidationRatio = () => {
    handleChangeLiquidationRatio(String(safeLiquidationRatio), true);
  };

  const [pendingTx, setPendingTx] = useState(false);

  const formattedCollateralizeAmount = tryParseAmount(
    collateralizeAmount,
    collateral,
  );

  // console.log(
  //   'vault: formatted collateral amount',
  //   formattedCollateralizeAmount,
  // );

  const [approvalState, approve] = useApproveCallback(
    formattedCollateralizeAmount,
    getVaultManagerAddress(protocol, chainId),
  );

  const { createCDP, createCDPNative } = useCDP();

  // console.log('vault: approvalState', approvalState);
  // console.log('vault: manager addr', getVaultManagerAddress(protocol, chainId));
  // console.log(
  //   'vault: collateralize amount',
  //   formattedCollateralizeAmount?.toExact(),
  // );
  // console.log('vault: mtr amount', mtrAmount);

  // add in desiredsupply and oracle fetch error
  const borrowable =
    balance &&
    collateralizeCurrencyAmount &&
    liquidationRatio &&
    parseFloat(liquidationRatio) > minLiquidationRatio &&
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
          <div className="w-full max-w-[1200px] space-y-4">
            <CollateralInfo
              mcr={mcr}
              lfr={lfr}
              sfr={sfr}
              priceUSD={collateralPriceUSD}
              collateral={collateral}
            />
            <CollateralSelectPanel
              balance={balance}
              collateral={collateral}
              collateralizeAmount={collateralizeAmount}
              setCollateralizeAmount={handleCollateralizeAmountChange}
            />
            <CollateralizeSettingsPanel
              mtrAmount={mtrAmount}
              liquidationRatio={liquidationRatio}
              setLiquidationRatio={handleChangeLiquidationRatio}
              maxLiquidationRatio={maxLiquidationRatio}
              setLiquidationRatioPercentage={setLiquidationRatioPercentage}
              liquidationRatioPercentage={liquidationRatioPercentage}
              setToMinLiquidationRatio={setToMinLiquidationRatio}
              setToSafeLiquidationRatio={setToSafeLiquidationRatio}
            />
            <ConfirmCollateralizeButton
              onClick={onClick}
              disabled={!borrowable}
              message={confirmButtonMessage}
            />
          </div>
        </PageContent>
      </Page>
    </>
  );
}
