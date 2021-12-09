import gql from 'graphql-tag';

export const collateralsQuery = gql`
  query collateralsQuery(
    $aliases: [String!] = null
    $addresses: [String!] = null
    $chainId: Int
  ) {
    collaterals(
      aliases: $aliases
      addresses: $addresses
      chainId: $chainId
      show: true
    ) {
      id
      name
      address
      description
      logo
      alias
      symbol
      lfr
      sfr
      mcr
      decimals
      chainId
      type
      promote
      popular
      color
    }
  }
`;
