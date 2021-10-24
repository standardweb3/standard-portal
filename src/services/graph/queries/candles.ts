import gql from 'graphql-tag';

export const dexCandlesQuery = gql`
  query dexCandlesQuery($pair: String!, $period: Int!, $skip: Int!) {
    candles(
      first: 1000
      skip: $skip
      orderBy: time
      orderDirection: asc
      where: { pair: $pair, period: $period }
    ) {
      token0
      token1
      time
      open
      low
      high
      close
    }
  }
`;
