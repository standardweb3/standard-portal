import { ApolloClient, createHttpLink, InMemoryCache } from '@apollo/client';
import { ChainId } from '@digitalnative/standard-protocol-sdk';
import request from 'graphql-request';
import { GRAPH_HOST } from '../constants';
import { campaignUsersQuery, scoreAggregatorsQuery } from '../queries/campaign';

export const CAMPAIGN = {
  [ChainId.RINKEBY]: 'billjhlee/rinkeby-vault-campaign',
  [ChainId.METIS]: 'digitalnativeinc/metis-vault-campaign',
};
export const campaignUri = (chainId = ChainId.MAINNET) =>
  `${GRAPH_HOST[chainId]}/subgraphs/name/${CAMPAIGN[chainId]}`;

export const campaignGraphClient = (chainId) => {
  const uri = campaignUri(chainId);
  return new ApolloClient({
    link: createHttpLink({
      uri,
    }),
    cache: new InMemoryCache(),
  });
};

export const campaign = async (chainId = ChainId.METIS, query, variables) => {
  return request(
    `${GRAPH_HOST[chainId]}/subgraphs/name/${CAMPAIGN[chainId]}`,
    query,
    variables,
  );
};

export const getCampaignScoreAggregator = async (
  chainId = ChainId.METIS,
  variables = {},
) => {
  const result = await campaign(chainId, scoreAggregatorsQuery, variables);

  return result?.scoreAggregators?.[0];
};

export const getCampaignUsers = async (
  chainId = ChainId.METIS,
  variables = {},
) => {
  const result = await campaign(chainId, campaignUsersQuery, variables);

  return result?.users;
};
