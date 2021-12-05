import Head from 'next/head';
import { VaultInfo } from '../../features/vault/new/VaultInfo';
import { Page } from '../../components-ui/Page';
import { PageContent } from '../../components-ui/PageContent';
import { DefinedStyles } from '../../utils/DefinedStyles';
import { CollateralSelectPanel } from '../../features/vault/new/CollateralSelectPanel';
import { useEffect, useState } from 'react';
import { tryParseAmount } from '../../functions';
import { useRouter } from 'next/router';
import { useCollateral } from '../../services/graph/hooks/collaterals';
import { useCurrency } from '../../hooks/Tokens';
import { useCurrencyBalance } from '../../state/wallet/hooks';
import { useActiveWeb3React } from '../../hooks';
import { CollateralizeSettingsPanel } from '../../features/vault/new/CollateralizeSettingsPanel';

export default function Vault() {
  const { account, chainId } = useActiveWeb3React();
  const router = useRouter();
  const collateralAddr = router.query.collateral[0];

  const collateralInfo = useCollateral(collateralAddr);
  const collateral = useCurrency(collateralAddr);

  const balance = useCurrencyBalance(account, collateral);
  const [collateralizeAmount, setCollateralizeAmount] = useState('');
  const [liquidationRatio, setLiquidationRatio] = useState(150);

  const maxLiquidationRatio = 440;
  const safeLiquidationRatio = 200;
  // change to collateral info
  const minLiquidationRatio = 150;

  const [liquidationRatioPercentage, setLiquidationRatioPercentage] = useState(
    (safeLiquidationRatio / maxLiquidationRatio) * 100,
  );

  const handleChangeLiquidationRatio = (value) => {
    if (value >= maxLiquidationRatio) {
      setLiquidationRatio(maxLiquidationRatio);
      setLiquidationRatioPercentage(100);
      return;
    }
    const newLiqudationRatioPercentage =
      Math.round(liquidationRatioPercentage * maxLiquidationRatio * 10) / 1000;
    console.log(newLiqudationRatioPercentage);

    setLiquidationRatioPercentage(newLiqudationRatioPercentage);
    setLiquidationRatio(value);
  };

  useEffect(() => {}, [liquidationRatio]);
  const [pendingTx, setPendingTx] = useState(false);

  const formattedCollateralizeAmount = tryParseAmount(
    collateralizeAmount,
    collateral,
  );

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
          <div className="grid grid-cols-7 w-full">
            <div className="col-span-7 md:col-span-4 space-y-4">
              <VaultInfo />
              <CollateralSelectPanel
                balance={balance}
                collateral={collateral}
                collateralizeAmount={collateralizeAmount}
                setCollateralizeAmount={setCollateralizeAmount}
              />
              <CollateralizeSettingsPanel
                liquidationRatio={liquidationRatio}
                setLiquidationRatio={handleChangeLiquidationRatio}
                maxLiquidationRatio={maxLiquidationRatio}
                setLiquidationRatioPercentage={setLiquidationRatioPercentage}
                liquidationRatioPercentage={liquidationRatioPercentage}
              />
            </div>
            <div className="col-span-7 md:col-span-3">second</div>
          </div>
        </PageContent>
      </Page>
    </>
  );
}
