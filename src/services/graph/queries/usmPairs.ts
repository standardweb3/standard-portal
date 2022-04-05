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

export const usmPairQuery = gql`
  query pairQuery($id: String, $block: Block_height) {
    pair(id: $id, block: $block) {
      id
      token0
      token1
      isToken0Mtr
    }
  }
`;

export const usmPairDayDatasQuery = gql`
  query pairDayDatasQuery(
    $first: Int! = 1000
    $where: PairDayData_filter
    $skip: Int! = 0
  ) {
    pairDayDatas(skip: $skip, first: $first, where: $where, orderBy: date, orderDirection: desc) {
      id
      collateralReserve
      timestamp
    }
  }
`;
