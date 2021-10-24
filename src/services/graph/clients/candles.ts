import { ApolloClient, createHttpLink, InMemoryCache } from '@apollo/client';
import { GRAPH_HOST } from '../constants';

export const dexCandlesGraphClient = (chainId) => {
  const uri = `${GRAPH_HOST[chainId]}/subgraphs/name/billjhlee/rinkeby-exchange-candles`;
  return new ApolloClient({
    link: createHttpLink({
      uri: uri,
    }),
    cache: new InMemoryCache(),
  });
};
