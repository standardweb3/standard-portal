import Head from 'next/head';
import { VaultInfo } from '../../features/vault/new/VaultInfo';
import { Page } from '../../components-ui/Page';
import { PageContent } from '../../components-ui/PageContent';
import { DefinedStyles } from '../../utils/DefinedStyles';
import { CollateralSelectPanel } from '../../features/vault/new/CollateralSelectPanel';
import { useMemo, useState } from 'react';
import { tryParseAmount } from '../../functions';
import { useRouter } from 'next/router';
import { useCollateral } from '../../services/graph/hooks/collaterals';
import { useCurrency } from '../../hooks/Tokens';
import { useCurrencyBalance } from '../../state/wallet/hooks';
import { useActiveWeb3React } from '../../hooks';
import { CollateralizeSettingsPanel } from '../../features/vault/new/CollateralizeSettingsPanel';
import { useEthPrice, useToken } from '../../services/graph';
import { ConfirmCollateralizeButton } from '../../features/vault/new/ConfirmCollateralizeButton';
import { CollateralInfo } from '../../features/vault/new/CollateralInfo';
import { useVaultManagerAssetPrice } from '../../hooks/vault/useVaultManager';

export default function Vault() {
  const { account, chainId } = useActiveWeb3React();
  const router = useRouter();
  const collateralAddr = router.query.collateral[0];
  // temporary
  const ethPrice = useEthPrice();

  const collateralInfo = useCollateral(collateralAddr);
  const collateral = useCurrency(collateralAddr);
  // temporary to obtain price
  const collateralExchangeToken = useToken({
    id: collateral?.isToken ? collateral.address.toLowerCase() : null,
  });

  const assetPrice = useVaultManagerAssetPrice(collateralAddr);

  // temporary to use as price - replace with oracle price
  const collateralExchangePrice =
    ethPrice &&
    collateralExchangeToken &&
    collateralExchangeToken.derivedETH * parseFloat(ethPrice);

  const balance = useCurrencyBalance(account, collateral);
  const [collateralizeAmount, setCollateralizeAmount] = useState('');

  const collateralValueUSD =
    collateralExchangePrice && collateralizeAmount !== ''
      ? parseFloat(collateralizeAmount) * collateralExchangePrice
      : 0;

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
      collateralExchangePrice && value !== ''
        ? parseFloat(value) * collateralExchangePrice
        : 0;
    setMtrAmount(
      String((parseFloat(liquidationRatio) * _collateralValueUSD) / 100),
    );
  };

  const [liquidationRatioPercentage, setLiquidationRatioPercentage] = useState(
    (safeLiquidationRatio / maxLiquidationRatio) * 100,
  );

  const [mtrAmount, setMtrAmount] = useState('');

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
    setMtrAmount(String((parseFloat(value) * collateralValueUSD) / 100));
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

  // add in desiredsupply and oracle fetch error
  const borrowable =
    balance &&
    collateralizeCurrencyAmount &&
    (balance.greaterThan(collateralizeCurrencyAmount) ||
      balance.equalTo(collateralizeCurrencyAmount));

  const confirmButtonMessage = useMemo(() => {
    if (
      balance &&
      collateralizeCurrencyAmount &&
      (balance.greaterThan(collateralizeCurrencyAmount) ||
        balance.equalTo(collateralizeCurrencyAmount))
    )
      return 'Borrow';
    else if (!collateralizeCurrencyAmount) {
      return 'Enter Collateral Amount';
    } else {
      return 'Insufficient Balance';
    }
  }, [balance, collateralizeCurrencyAmount]);

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
        <PageContent>
          <div className="grid grid-cols-7 w-full gap-4">
            <div className="col-span-7 md:col-span-4 space-y-4">
              <VaultInfo />
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
                disabled={!borrowable}
                message={confirmButtonMessage}
              />
            </div>
            <div className="col-span-7 md:col-span-3">
              <CollateralInfo
                collateral={collateral}
                collateralInfo={collateralInfo}
              />
            </div>
          </div>
        </PageContent>
      </Page>
    </>
  );
}
