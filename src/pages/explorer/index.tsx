import { ChainId, WNATIVE } from '@digitalnative/standard-protocol-sdk';
import { getAddress } from 'ethers/lib/utils';
import Head from 'next/head';
import { useMemo, useState } from 'react';
import { Page } from '../../components-ui/Page';
import { PageContent } from '../../components-ui/PageContent';
import { PageHeader } from '../../components-ui/PageHeader';
import { ViewportMediumUp } from '../../components-ui/Responsive';
import { SearchV3 } from '../../components-ui/Search/SearchV3';
import { SimpleNavigator } from '../../components-ui/Table/SimpleNavigator';
import { VaultsTable } from '../../features/explorer/VaultsTable';
import { calculateFee } from '../../features/usm/functions';
import { applyCdpDecimals } from '../../features/usm/utils';
import { useActiveWeb3React } from '../../hooks';
import { useExplorerVaultsPagination } from '../../hooks/explorer/useExplorerVaultsPagination';
import useCurrentBlockTimestamp from '../../hooks/useCurrentBlockTimestamp';
import { useCdpExpiaries, useCdpPrices } from '../../services/graph/hooks/cdpPrices';
import { useExplorerVaults } from '../../services/graph/hooks/vaultExplorer';
import { DefinedStyles } from '../../utils/DefinedStyles';
import { VaultCondition } from '../vaults';
import { WavySpinner } from '../../components-ui/Spinner/WavySpinner';
import { useVault } from '../../services/graph/hooks/vault';
import { VaultCard } from '../../features/usm/vaults/VaultCard';
import useDebounce from '../../hooks/useDebounce';
import { NetworkGuardWrapper } from '../../guards/Network';

export function Explorer() {
  const { account, chainId } = useActiveWeb3React();
  const currentBlock = useCurrentBlockTimestamp();
  const cdpPrices = useCdpPrices();
  const cdpExpiaries = useCdpExpiaries();

  const [term, setTerm] = useState('');
  const debouncedTerm = useDebounce(term, 200);

  const {
    currentPage,
    lastPage,
    toNextPage,
    toPage,
    toPrevPage,
    pageSize,
    lastVaultId,
  } = useExplorerVaultsPagination(12);

  const ltIndex = lastVaultId - currentPage * pageSize;
  const vaults = useExplorerVaults({
    first: pageSize,
    where: {
      numId_lte: ltIndex,
    },
  });

  const searchByIdVault = useVault({
    where: {
      id: debouncedTerm,
    },
  });

  const searchByAddressVault = useVault({
    where: {
      address: debouncedTerm,
    },
  });

  const searchVault = searchByIdVault || searchByAddressVault;

  const mapperFn = (v) => {
    const {
      id,
      address,
      CDP,
      currentBorrowed,
      currentCollateralized,
      collateral,
      createdAt,
      isClosed,
      isLiquidated,
      liquidation,
      user,
      ex_sfr,
      lastPaidBack,
    } = v;

    const isUserVault = account && user && account.toLowerCase() == user.id
    const isWnative = getAddress(collateral) === WNATIVE[chainId].address;

    const vMcr = applyCdpDecimals(CDP.mcr);
    const vSfr = applyCdpDecimals(CDP.sfr);
    const initSfr = applyCdpDecimals(ex_sfr);

    const fee = currentBlock
      ? calculateFee(
          currentBlock.toNumber(),
          parseFloat(createdAt),
          lastPaidBack,
          vSfr,
          initSfr,
          cdpExpiaries[collateral],
          parseFloat(currentBorrowed),
        )
      : 0;
    const debt = parseFloat(currentBorrowed) + fee;

    const collateralPrice = cdpPrices[collateral]?.price;
    const collateralValue =
      collateralPrice && parseFloat(currentCollateralized) * collateralPrice;

    const liquidationPrice =
      (debt * vMcr) / 100 / parseFloat(currentCollateralized);

    const condition = isClosed
      ? VaultCondition.CLOSED
      : isLiquidated
      ? VaultCondition.LIQUIDATED
      : collateralPrice !== undefined
      ? collateralPrice > liquidationPrice * 1.3
        ? VaultCondition.SAFE
        : collateralPrice >= liquidationPrice * 1.1
        ? VaultCondition.WARNING
        : VaultCondition.DANGER
      : VaultCondition.UNKNWON;

    const refactoredVault = {
      id,
      address: getAddress(address),
      mcr: vMcr,
      collateralValue,
      liquidationPrice,
      condition,
      currentBorrowed: parseFloat(currentBorrowed),
      currentCollateralized: parseFloat(currentCollateralized),
      collateralAddress: getAddress(collateral),
      collateralPrice,
      isWnative,
      isLiquidated,
      isClosed,
      liquidation,
      fee,
      debt,
      isUserVault
    };

    return refactoredVault;
  };

  const searchVaultForCard = useMemo(() => {
    return searchVault ? mapperFn(searchVault) : undefined;
  }, [searchVault]);

  const vaultsForTable = useMemo(() => {
    return vaults?.map(mapperFn) ?? [];
  }, [cdpPrices, vaults]);

  return (
    <>
      <Head>
        <title>AMMs | Standard Protocol</title>
        <meta
          key="description"
          name="description"
          content="Explore Collateral-USM AMMs."
        />
      </Head>
      <Page id="explorer-page" className={DefinedStyles.page}>
        <ViewportMediumUp>
          <PageHeader title="Explorer" />
        </ViewportMediumUp>

        <PageContent>
          <div className="w-full max-w-[1200px]">
            <div className="space-y-8">
              <SearchV3
                iconRight
                className="flex-1 rounded-20 bg-background p-2 md:max-w-[400px] w-full"
                onChange={setTerm}
                onSearch={(e) => {}}
                term={term}
                inputProps={{
                  className: `
                  relative w-full
                  bg-transparent
                  font-bold  text-xs md:text-sm`,
                  placeholder: 'Search by name, symbol or address',
                }}
              />
              {searchVaultForCard ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
                  <VaultCard
                    isWnative={searchVaultForCard.isWnative}
                    key={searchVaultForCard.address}
                    id={searchVaultForCard.id}
                    address={searchVaultForCard.address}
                    condition={searchVaultForCard.condition}
                    collateralAddress={searchVaultForCard.collateralAddress}
                    collateralPrice={searchVaultForCard.collateralPrice}
                    liquidationPrice={searchVaultForCard.liquidationPrice}
                    mcr={searchVaultForCard.mcr}
                    currentBorrowed={searchVaultForCard.currentBorrowed}
                    currentCollateralized={
                      searchVaultForCard.currentCollateralized
                    }
                    debt={searchVaultForCard.debt}
                    fee={searchVaultForCard.fee}
                    isLiquidated={searchVaultForCard.isLiquidated}
                    liquidation={searchVaultForCard.liquidation}
                    isClosed={searchVaultForCard.isClosed}
                  />
                </div>
              ) : (
                <>
                  {!!vaults ? (
                    <VaultsTable vaults={vaultsForTable} />
                  ) : (
                    <div className="min-h-[500px] flex items-center justify-center">
                      <WavySpinner />
                    </div>
                  )}
                  <SimpleNavigator
                    currentPage={currentPage}
                    handlePrevPage={toPrevPage}
                    handleNextPage={toNextPage}
                    lastPage={lastPage}
                    pageSize={pageSize}
                    toPage={toPage}
                  />
                </>
              )}
            </div>
          </div>
        </PageContent>
      </Page>
    </>
  );
}

Explorer.Guard = NetworkGuardWrapper([ChainId.RINKEBY, ChainId.METIS, ChainId.MAINNET, ChainId.SHIDEN]);
export default Explorer;