import gql from 'graphql-tag';

export const collateralsQuery = gql`
  query collateralsQuery(
    $aliases: [String!] = null
    $addresses: [String!] = null
    $chainId: Int
    $show: Boolean
  ) {
    collaterals(
      aliases: $aliases
      addresses: $addresses
      chainId: $chainId
      show: $show
    ) {
      id
      name
      address
      priceAddress
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
