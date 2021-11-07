import gql from 'graphql-tag';

export const poolsQuery = gql`
  query poolsQuery(
    $first: Int! = 1000
    $skip: Int! = 0
    $orderBy: String! = "id"
    $orderDirection: String! = "desc"
  ) {
    pools(
      first: $first
      skip: $skip
      orderBy: $orderBy
      orderDirection: $orderDirection
    ) {
      id
      pair
      allocPoint
      lastRewardBlock
      accSushiPerShare
      balance
      userCount
      owner {
        id
        sushiPerBlock
        totalAllocPoint
      }
    }
  }
`;

export const masterChefV1PairAddressesQuery = gql`
  query masterChefV1PairAddresses(
    $first: Int! = 1000
    $skip: Int! = 0
    $orderBy: String! = "id"
    $orderDirection: String! = "desc"
  ) {
    pools(
      first: $first
      skip: $skip
      orderBy: $orderBy
      orderDirection: $orderDirection
    ) {
      id
      allocPoint
      accSushiPerShare
      pair {
        id
      }
    }
  }
`;

export const masterChefV2TotalAllocPointQuery = gql`
  query masterChefV2TotalAllocPoint(
    $id: String! = "0xc2edad668740f1aa35e4d8f227fb8e17dca888cd"
  ) {
    masterChef(id: $id) {
      id
      totalAllocPoint
    }
  }
`;

export const masterChefV2SushiPerBlockQuery = gql`
  query masterChefV2SushiPerBlock(
    $id: String! = "0xc2edad668740f1aa35e4d8f227fb8e17dca888cd"
  ) {
    masterChef(id: $id) {
      id
      sushiPerBlock
    }
  }
`;

export const masterChefV2Query = gql`
  query masterChefV2(
    $id: String! = "0xc2edad668740f1aa35e4d8f227fb8e17dca888cd"
  ) {
    masterChef(id: $id) {
      id
    }
  }
`;
