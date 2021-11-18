import gql from 'graphql-tag';

export const barHistoriesQuery = gql`
  query historiesQuery($first: Int! = 1000, $date: Int! = 0, $skip: Int! = 0) {
    histories(skip: $skip, first: $first, orderBy: date, orderDirection: desc) {
      xSushiSupply
      ratio
    }
  }
`;

export const barQuery = gql`
  query barQuery($id: String!) {
    bar(id: $id) {
      id
      totalSupply
      ratio
      xSushiMinted
      xSushiBurned
      sushiStaked
      sushiStakedUSD
      sushiHarvested
      sushiHarvestedUSD
      xSushiAge
      xSushiAgeDestroyed
      # histories(first: 1000) {
      #   id
      #   date
      #   timeframe
      #   sushiStaked
      #   sushiStakedUSD
      #   sushiHarvested
      #   sushiHarvestedUSD
      #   xSushiAge
      #   xSushiAgeDestroyed
      #   xSushiMinted
      #   xSushiBurned
      #   xSushiSupply
      #   ratio
      # }
    }
  }
`;
