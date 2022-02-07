import Head from 'next/head';
import { getAddress } from 'ethers/lib/utils';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import { VaultInfoCard } from '../../../features/usm/vault/VaultInfoCard';
import { useActiveWeb3React } from '../../../hooks';
import { useCurrencyBalance } from '../../../state/wallet/hooks';
import { Page } from '../../../components-ui/Page';
import { DefinedStyles } from '../../../utils/DefinedStyles';
import { PageContent } from '../../../components-ui/PageContent';
import { ViewportMediumUp } from '../../../components-ui/Responsive';
import { PageHeader } from '../../../components-ui/PageHeader';
import { VaultHeader } from '../../../features/usm/vault/VaultHeader';
import { VaultCDPMetrics } from '../../../features/usm/vault/VaultCDPMetrics';
import { VaultFees } from '../../../features/usm/vault/VaultFees';
import { VaultMint } from '../../../features/usm/vault/Mint';
import { useUserVaultInfo } from '../../../features/usm/useVaultInfo';
import { useUsmMintableSupply } from '../../../features/usm/useUsmMintableSupply';
import { Alert } from '../../../components-ui/Alert';
import { NetworkGuardWrapper } from '../../../guards/Network';
import { ChainId } from '@digitalnative/standard-protocol-sdk';

function Vault() {
  const { account } = useActiveWeb3React();
  const router = useRouter();
  const { isMintable, mintableSupply } = useUsmMintableSupply();

  const vaultAddress = router.query.address as string;

  const {
    mcr,
    sfr,
    lfr,
    fee,
    debt,
    usm,
    usmPrice,
    collateralCurrency,
    collateralPrice,
    liquidationPrice,
    currentBorrowed,
    currentCollateralized,
    currentCollateralizedValue,
    currentCollateralRatio,
    minCollateralAmountValue,
    minCollateralAmount,
    condition,
    loading,
    address,
    id,
    liquidatable,
    handleWrapUnwrap,
    isCollateralNative,
    isCollateralWnative,
  } = useUserVaultInfo(vaultAddress);

  // END: vault info

  // START: deposit
  const collateralBalance = useCurrencyBalance(account, collateralCurrency);
  const [depositAmount, setDepositAmount] = useState('');
  // END: deposit

  // END: withdraw

  // START: borrow more
  const usmBalance = useCurrencyBalance(account, usm);
  const [borrowMoreAmount, setBorrowMoreAmount] = useState('');
  // END
  //
  const maxCollateralRatio = 320;
  const safeCollateralRatio = 200;
  const minCollateralRatio = mcr;

  const [collateralRatio, setCollateralRatio] = useState(undefined);
  const [collateralRatioPercentage, setCollateralRatioPercentage] = useState(
    undefined,
  );

  useEffect(() => {
    if (currentCollateralRatio === undefined) return;
    setCollateralRatio(String(currentCollateralRatio));
    setCollateralRatioPercentage(
      Math.min((currentCollateralRatio / maxCollateralRatio) * 100, 100),
    );
  }, [currentCollateralRatio]);

  const handleChangeBorrowMoreAmount = (value) => {
    const newDebt = value !== '' ? parseFloat(value) + debt : debt;
    const newCollateralizedValue =
      (currentCollateralized +
        (depositAmount !== '' ? parseFloat(depositAmount) : 0)) *
      collateralPrice;

    const newCollateralRatio = (newCollateralizedValue / newDebt) * 100;
    setBorrowMoreAmount(value);
    setCollateralRatio(String(newCollateralRatio));
    setCollateralRatioPercentage(
      Math.min((newCollateralRatio / maxCollateralRatio) * 100, 100),
    );
  };

  const handleChangeDepositAmount = (value) => {
    const newCollateralizedValue =
      (currentCollateralized + (value !== '' ? parseFloat(value) : 0)) *
      collateralPrice;

    const newCollateralRatio = (newCollateralizedValue / debt) * 100;
    setDepositAmount(value);
    setCollateralRatio(String(newCollateralRatio));
    setCollateralRatioPercentage(
      Math.min((newCollateralRatio / maxCollateralRatio) * 100, 100),
    );
  };

  const handleChangeCollateralRatio = (value, changePerc = true) => {
    if (value === '') {
      setCollateralRatioPercentage(
        Math.min((currentCollateralRatio / maxCollateralRatio) * 100, 100),
      );
      setCollateralRatio('');
      // setBorrowMoreAmount('');
      return;
    }
    if (parseFloat(value) >= maxCollateralRatio) {
      setCollateralRatio(value);
      setCollateralRatioPercentage(100);

      const newDebt =
        borrowMoreAmount !== '' ? debt + parseFloat(borrowMoreAmount) : debt;
      const newDepositAmount =
        (newDebt * parseFloat(value)) / 100 / collateralPrice -
        currentCollateralized;
      setDepositAmount(String(newDepositAmount));
      return;
    }
    if (changePerc) {
      const newCollateralRatioPercentage =
        (parseFloat(value) / maxCollateralRatio) * 100;

      setCollateralRatioPercentage(newCollateralRatioPercentage);
    }
    setCollateralRatio(value);

    const newDebt =
      borrowMoreAmount !== '' ? debt + parseFloat(borrowMoreAmount) : debt;
    const newDepositAmount =
      (newDebt * parseFloat(value)) / 100 / collateralPrice -
      currentCollateralized;
    setDepositAmount(String(newDepositAmount));
  };

  const setToMinCollataralRatio = () => {
    handleChangeCollateralRatio(String(minCollateralRatio), true);
  };

  const setToSafeCollateralRatio = () => {
    handleChangeCollateralRatio(String(safeCollateralRatio), true);
  };

  const checksummedVaultAddress = getAddress(vaultAddress);

  return (
    <>
      <Head>
        <title>Vault | Standard Protocol</title>
        <meta key="description" name="description" content="Manage your CDP" />
      </Head>
      <Page id="vault-page" className={DefinedStyles.page}>
        <ViewportMediumUp>
          <PageHeader title="Vault" back href="/vaults" />
        </ViewportMediumUp>
        <PageContent>
          <div className="w-full max-w-[1200px] space-y-8">
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
            <VaultInfoCard
              condition={condition}
              fee={fee}
              collateral={collateralCurrency}
              collateralPrice={collateralPrice}
              liquidationPrice={liquidationPrice}
              currentCollateralizedValue={currentCollateralizedValue}
              currentBorrowed={currentBorrowed}
              currentCollateralized={currentCollateralized}
              mcr={mcr}
              sfr={sfr}
              currentCollateralRatio={currentCollateralRatio}
              address={address}
            />

            <div className="grid grid-cols-2 lg:grid-cols-7 gap-4">
              <div className="col-span-2 lg:col-span-7">
                <VaultCDPMetrics
                  fee={fee}
                  currentCollateralRatio={currentCollateralRatio}
                  minCollateralRatio={mcr}
                  collateralPrice={collateralPrice}
                  liquidationPrice={liquidationPrice}
                  usmPrice={usmPrice}
                  debtAmount={currentBorrowed}
                  debt={debt}
                  currentBorrowed={currentBorrowed}
                  horizontal
                />
              </div>
              <div className="col-span-2 lg:col-span-4">
                <div className="rounded-20 p-8 bg-background space-y-8">
                  <VaultHeader vaultAddress={vaultAddress} mint />
                  <VaultMint
                    debt={debt}
                    stabilityFee={fee}
                    collateral={collateralCurrency}
                    mcr={mcr}
                    minCollateralAmount={minCollateralAmount}
                    collateralBalance={collateralBalance}
                    collateralPrice={collateralPrice}
                    currentCollateralized={currentCollateralized}
                    borrowed={currentBorrowed}
                    vaultAddress={checksummedVaultAddress}
                    usm={usm}
                    depositAmount={depositAmount}
                    borrowMoreAmount={borrowMoreAmount}
                    onBorrowMoreAmountChange={handleChangeBorrowMoreAmount}
                    onDepositAmountChange={handleChangeDepositAmount}
                    collateralRatio={collateralRatio}
                    setCollateralRatio={handleChangeCollateralRatio}
                    maxCollateralRatio={maxCollateralRatio}
                    setCollateralRatioPercentage={setCollateralRatioPercentage}
                    collateralRatioPercentage={collateralRatioPercentage}
                    setToMinCollataralRatio={setToMinCollataralRatio}
                    setToSafeCollateralRatio={setToSafeCollateralRatio}
                    handleWrapUnwrap={handleWrapUnwrap}
                    isCollateralNative={isCollateralNative}
                    isCollateralWnative={isCollateralWnative}
                    loading={loading}
                    mintableSupply={mintableSupply}
                    isMintable={isMintable}
                  />
                </div>
              </div>

              <div className="col-span-2 lg:col-span-3">
                <VaultFees sfr={sfr} mcr={mcr} lfr={lfr} />
              </div>
            </div>
          </div>
        </PageContent>
      </Page>
    </>
  );
}

Vault.Guard = NetworkGuardWrapper([ChainId.RINKEBY]);
export default Vault;
