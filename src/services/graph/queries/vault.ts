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
        ammReserveCollateralUSD
      }
      liquidation {
        liquidationFeeUSD
        liquidationAmountUSD
        liquidationAMMUSD
        liquidationCount
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
    vaults(
      first: $first
      skip: $skip
      where: $where
      block: $block
      orderBy: numId
      orderDirection: desc
    ) {
      id
      collateral
      isClosed
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
        expiary
        decimals
      }
      liquidation { 
        liquidationAmount
        liquidationFee
        liquidationAMM
      }
      lastPaidBack
      createdAt
      ex_sfr
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
      liquidation {
        liquidationAMM
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
    $skip: Int! = 0
    $where: UserHistory_filter
  ) {
    userHistories(
      skip: $skip
      first: $first
      orderBy: date
      orderDirection: desc
      where: $where
    ) {
      id
      date
      currentBorrowed
      activeVaultCount
      timestamp
    }
  }
`;

export const vaultAmmReservesQuery = gql`
  query vaultAmmReserves(
    $first: Int! = 1000
    $skip: Int! = 0
    $where: Pair_filter
  ) {
    pairs(first: $first, skip: $skip, where: $where) {
      id
      collateral
      collateralReserve
      collateralSymbol
    }
  }
`;

export const vaultCollateralReservesQuery = gql`
  query vaultCollateralReserves(
    $first: Int! = 1000
    $skip: Int! = 0
    $where: CollateralVault_filter
  ) {
    collateralVaults(first: $first, skip: $skip, where: $where) {
      id
      collateral
      currentCollateralized
      cdp {
        symbol
      }
    }
  }
`;

export const collateralVaultHistoriesQuery = gql`
  query collateralVaultHistories(
    $first: Int! = 1000
    $skip: Int! = 0
    $where: CollateralVaultHistory_filter
  ) {
    collateralVaultHistories(
      first: $first
      skip: $skip
      where: $where
      orderBy: date
      orderDirection: desc
    ) {
      id
      collateralVault {
        id
      }
      liquidationAMM
      currentCollateralized
      timestamp
    }
  }
`;
