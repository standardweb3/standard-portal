import gql from 'graphql-tag';

export const usmPairsQuery = gql`
  query pairsQuery($first: Int! = 1000, $where: Pair_filter, $skip: Int! = 0) {
    pairs(skip: $skip, first: $first, where: $where) {
      id
      token0
      token1
      isToken0Mtr
    }
  }
`;

export const usmPairQUery = gql`
  query pairQuery($id: String, $block: Block_height) {
    pair(id: $id, block: $block) {
      id
      token0
      token1
      isToken0Mtr
    }
  }
`;
