import { gql } from 'graphql-request';

export const explorerVaultsQuery = gql`
  query vaults(
    $first: Int! = 1000
    $skip: Int! = 0
    $where: Vault_filter
    $block: Block_height
  ) {
    vaults(
      first: $first
      skip: $skip
      where: $where
      orderBy: numId
      orderDirection: desc
    ) {
      id
      collateral
      user {
        id
      }
      address
      isClosed
      isLiquidated
      currentBorrowed
      currentCollateralized
      CDP {
        id
        mcr
        lfr
        sfr
        decimals
      }
      liquidation {
        liquidationAmount
      }
      createdAt
    }
  }
`;
