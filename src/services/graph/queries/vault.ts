import gql from 'graphql-tag';

export const vaultManagerQuery = gql`
  query vaultManagerQuery($id: String, $block: Block_height) {
    vaultManager(id: $id, block: $block) {
      id
      desiredSupply
      rebaseActive
      currentBorrowed
      activeVaultCount
      collectedStabilityFee
      runningStat {
        currentCollateralizedUSD
      }
      liquidation {
        liquidationFeeUSD
      }
    }
  }
`;

export const vaultQuery = gql`
  query vault($where: Vault_filter, $block: Block_height) {
    vault(where: $where, block: $block) {
      id
      address
      CDP {
        lfr
        sfr
        mcr
      }
      collectedStabilityFee
      isLiquidated
      isClosed
    }
  }
`;

export const vaultsQuery = gql`
  query vaults(
    $first: Int! = 1000
    $where: Vault_filter
    $block: Block_height
  ) {
    vaults(first: $first, where: $where, block: $block) {
      id
      collateral
      user {
        id
      }
      address
      isLiquidated
      currentBorrowed
      currrentCollateralized
      CDP {
        mcr
        sfr
      }
    }
  }
`;
