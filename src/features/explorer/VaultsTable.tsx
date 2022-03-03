import { VaultCard } from '../usm/vaults/VaultCard';

export function VaultsTable({ vaults }) {
  const renderVaults = () => {
    return vaults?.map(
      ({
        id,
        address,
        mcr,
        currentBorrowed,
        currentCollateralized,
        collateralAddress,
        liquidationPrice,
        collateralPrice,
        condition,
        debt,
        fee,
        isWnative,
      }) => (
        <VaultCard
          isWnative={isWnative}
          key={address}
          id={id}
          address={address}
          condition={condition}
          collateralAddress={collateralAddress}
          collateralPrice={collateralPrice}
          liquidationPrice={liquidationPrice}
          mcr={mcr}
          currentBorrowed={currentBorrowed}
          currentCollateralized={currentCollateralized}
          debt={debt}
          fee={fee}
        />
      ),
    );
  };
  return (
    <div
      className="
    grid grid-cols-1 
    sm:grid-cols-2 
    lg:grid-cols-3 
    xl:grid-cols-4 gap-4"
    >
      {renderVaults()}
    </div>
  );
}
