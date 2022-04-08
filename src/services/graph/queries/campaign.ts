import gql from 'graphql-tag';

export const campaignUsersQuery = gql`
  query users(
    $first: Int! = 100
    $skip: Int! = 0
  ) {
    users(first: $first, orderBy: score, orderDirection: desc) {
      id
      score
    }
  }
`;

export const scoreAggregatorsQuery = gql`
  query scoreAggregators {
    scoreAggregators(first: 1) {
      id
      usersCount
      totalScore
    }
  }
`;
