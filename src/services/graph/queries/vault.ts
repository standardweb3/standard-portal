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

export const vaultManagerHistoriesQuery = gql`
  query vaultManagerHistoriesQuery(
    $first: Int! = 1000
    $date: Int! = 0
    $where: VaultManagerHistory_filter
    $skip: Int! = 0
  ) {
    vaultManagerHistories(
      skip: $skip
      first: $first
      orderBy: date
      orderDirection: desc
      where: $where
    ) {
      id
      date
      desiredSupply
      currentBorrowed
      historicBorrowed
      historicPaidBack
      historicVaultCount
      activeVaultCount
      historicUserCount
      activeUserCount
      collectedStabilityFee
      ammReserveCollateralUSD
      currentCollateralizedUSD
      historicCollateralizedUSD
      liquidationCount
      liquidationAmountUSD
      liquidationFeeUSD
      liquidationAMMUSD
      timestamp
    }
  }
`;

export const vaultQuery = gql`
  query vault($id: String!, $block: Block_height) {
    vault(id: $id, block: $block) {
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
    $skip: Int! = 0
    $where: Vault_filter
    $block: Block_height
  ) {
    vaults(first: $first, skip: $skip, where: $where, block: $block) {
      id
      collateral
      user {
        id
      }
      address
      isLiquidated
      currentBorrowed
      currentCollateralized
      CDP {
        id
        mcr
        lfr
        sfr
      }
      createdAt
    }
  }
`;

export const cVaultQuery = gql`
  query cVault($id: String!) {
    collateralVault(id: $id) {
      currentBorrowed
      currentCollateralized
      cdp {
        id
        mcr
        sfr
        lfr
        symbol
        decimals
      }
    }
  }
`;

export const cdpsQuery = gql`
  query cdps(
    $first: Int! = 1000
    $date: Int! = 0
    $where: CDP_filter
    $skip: Int! = 0
  ) {
    cdps(
      skip: $skip
      first: $first
      orderBy: symbol
      orderDirection: asc
      where: $where
    ) {
      id
      lfr
      mcr
      sfr
      decimals
      symbol
    }
  }
`;

export const vaultUserQuery = gql`
  query user($id: String!) {
    user(id: $id) {
      currentBorrowed
      activeVaultCount
    }
  }
`;

export const vaultUserHistoriesQuery = gql`
  query userHistories(
    $first: Int! = 1000
    $date: Int! = 0
    $id: String!
    $skip: Int! = 0
  ) {
    userHistories(
      id: $id
      skip: $skip
      first: $first
      orderBy: date
      orderDirection: desc
    ) {
      id
      date
      currentBorrowed
      activeVaultCount
      timestamp
    }
  }
`;
