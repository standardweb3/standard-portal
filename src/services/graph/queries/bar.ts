import gql from 'graphql-tag';

export const barHistoriesQuery = gql`
  query historiesQuery($first: Int! = 1000, $date: Int! = 0, $skip: Int! = 0) {
    histories(skip: $skip, first: $first, orderBy: date, orderDirection: desc) {
      xSushiSupply
      ratio
    }
  }
`;
