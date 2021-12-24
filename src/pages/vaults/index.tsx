import { VaultCard } from '../../features/vault/vaults/VaultCard';
import { useActiveWeb3React } from '../../hooks';
import { useV1Balance, useV1Ids, useV1Ids2 } from '../../hooks/vault/useV1';
import {
  useVaultAddresses,
  useVaultAddresses2,
} from '../../hooks/vault/useVaultManager';
import { useVaults } from '../../services/graph/hooks/vault';

export default function Vaults() {
  const { account } = useActiveWeb3React();
  const vaults = useVaults({
    where: {
      user: account.toLowerCase(),
    },
  });
  console.log('vaults', vaults);
  // const vaultAddrs = useVaultAddresses(v1Ids);

  const renderVaults = () => {
    return (
      vaults?.map((vault) => {
        const {
          id,
          address,
          CDP,
          currentBorrowed,
          currrentCollateralized,
          collateral,
        } = vault;
        return (
          <VaultCard
            id={id}
            address={address}
            collateralAddress={collateral}
            mcr={CDP.mcr}
            currentBorrowed={currentBorrowed}
            currentCollateralized={currrentCollateralized}
          />
        );
      }) ?? 'Loading'
    );
  };

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-4 2xl:grid-cols-5 gap-4">
      {renderVaults()}
    </div>
  );
}
