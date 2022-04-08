import Head from 'next/head';
import { Page } from '../../components-ui/Page';
import { DefinedStyles } from '../../utils/DefinedStyles';
import { PageContent } from '../../components-ui/PageContent';
import { PageHeader } from '../../components-ui/PageHeader';
import { ViewportMediumUp } from '../../components-ui/Responsive';
import { VaultUserInfo } from '../../features/usm/vaults/VaultUserInfo';
import { applyCdpDecimals } from '../../features/usm/utils';
import { useUserVaults2 } from '../../services/graph/hooks/userVaults';
import { useCdpExpiaries, useCdpPrices } from '../../services/graph/hooks/cdpPrices';
import { useMemo } from 'react';
import { VaultsTable } from '../../features/usm/vaults/VaultsTable';
import { RiskyVaultsTable } from '../../features/usm/collaterals/RiskyVaultsTable';
import { getAddress } from 'ethers/lib/utils';
import useCurrentBlockTimestamp from '../../hooks/useCurrentBlockTimestamp';
import { useMtr } from '../../hooks/vault/useMtr';
import { calculateFee } from '../../features/usm/functions';
import {
  CloseVaultContext,
  useCloseVaultState,
} from '../../features/usm/vault/CloseVaultContext';
import CloseVaultModal from '../../features/usm/vault/CloseVaultModal';
import { ChainId, WNATIVE } from '@digitalnative/standard-protocol-sdk';
import { useActiveWeb3React } from '../../hooks';
import { NetworkGuardWrapper } from '../../guards/Network';
import { WavySpinner } from '../../components-ui/Spinner/WavySpinner';
import { CollateralsTable } from '../../features/usm/collaterals/CollateralsTable/CollateralsTable';
import { Alert } from '../../components-ui/Alert';

export enum VaultCondition {
  SAFE = 'safe',
  WARNING = 'warning',
  DANGER = 'danger',
  CLOSED = 'closed',
  LIQUIDATED = 'liquidated',
  UNKNWON = 'unknown',
}

function Vaults() {
  const { chainId } = useActiveWeb3React();
  // const [filters, setFilters] = useState([]);

  const currentBlock = useCurrentBlockTimestamp();
  const cdpPrices = useCdpPrices();
  const cdpExpiaries = useCdpExpiaries();
  const usm = useMtr();
  // const usmPrice = useVaultManagerAssetPrice(usm.address);
  const { isLoading, userVaults } = useUserVaults2();

  const {
    dangerVaults,
    warningVaults,
    liquidatedVaults,
    allVaults,
    totalCollateralized,
  } = useMemo(() => {
    const dangerVaults = [];
    const warningVaults = [];
    const closedVaults = [];
    const liquidatedVaults = [];
    let totalCollateralized = 0;
    const allVaults = userVaults.map((v) => {
      const {
        id,
        address,
        CDP,
        currentBorrowed,
        currentCollateralized,
        collateral,
        createdAt,
        isLiquidated,
        liquidation
      } = v;

      const isWnative = getAddress(collateral) === WNATIVE[chainId].address;

      const vMcr = applyCdpDecimals(CDP.mcr);
      const vSfr = applyCdpDecimals(CDP.sfr);

      const fee = currentBlock && cdpExpiaries
        ? calculateFee(
            currentBlock.toNumber(),
            parseFloat(createdAt),
            vSfr,
            parseFloat(currentBorrowed),
          )
        : 0;
      const debt = parseFloat(currentBorrowed) + fee;

      const collateralPrice = cdpPrices[collateral]?.price;
      const collateralValue =
        collateralPrice && parseFloat(currentCollateralized) * collateralPrice;
      if (collateralValue) totalCollateralized += collateralValue;

      const liquidationPrice =
        (debt * vMcr) / 100 / parseFloat(currentCollateralized);

      const condition = isLiquidated
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
        fee,
        debt,
        liquidation
      };
      if (isLiquidated) {
        liquidatedVaults.push(refactoredVault);
      } else if (condition === VaultCondition.DANGER) {
        dangerVaults.push(refactoredVault);
      } else if (condition === VaultCondition.WARNING) {
        warningVaults.push(refactoredVault);
      }

      return refactoredVault;
    });
    return { dangerVaults, warningVaults, liquidatedVaults, allVaults, totalCollateralized };
  }, [cdpPrices, userVaults]);

  // const vaultAddrs = useVaultAddresses(v1Ids);

  const closeVaultState = useCloseVaultState();

  return (
    <>
      <Head>
        <title>Vaults | Standard Protocol</title>
        <meta key="description" name="description" content="View your CDPs" />
      </Head>
      <Page id="vaults-page" className={DefinedStyles.page}>
        <ViewportMediumUp>
          <PageHeader title="Vaults" />
        </ViewportMediumUp>
        <PageContent>
          <div className="w-full max-w-[1200px] space-y-16">
            <CloseVaultContext.Provider value={closeVaultState}>
              <VaultUserInfo
                totalCollateralized={totalCollateralized}
                dangerVaultCount={dangerVaults.length}
              />
              {isLoading ? (
                <div>
                  <WavySpinner />
                </div>
              ) : (
                <>
                  {dangerVaults.length > 0 && (
                    <RiskyVaultsTable vaults={dangerVaults} />
                  )}
                  {allVaults.length > 0 ? (
                    <VaultsTable vaults={allVaults} />
                  ) : (
                    <div>
                      <Alert
                        dismissable={false}
                        className="mb-4"
                        message={
                          <div className="p-0 md:p-4">
                            <div className="text-xl font-bold">
                              You don&apos;t own any vaults
                            </div>
                            <div>
                              Select a collateral from below and borrow USM
                            </div>
                          </div>
                        }
                      />
                      <CollateralsTable />
                    </div>
                  )}

                  <CloseVaultModal
                    isOpen={closeVaultState.isOpen}
                    onDismiss={closeVaultState.dismiss}
                    onConfirm={undefined}
                  />
                </>
              )}
            </CloseVaultContext.Provider>
          </div>
        </PageContent>
      </Page>
    </>
  );
}

Vaults.Guard = NetworkGuardWrapper([ChainId.RINKEBY, ChainId.METIS]);
export default Vaults;
