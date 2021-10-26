import { ApolloClient, createHttpLink, InMemoryCache } from '@apollo/client';
import { candles } from '../fetchers/candles';

export const dexCandlesGraphClient = (chainId) => {
  const uri = candles(chainId)
  return new ApolloClient({
    link: createHttpLink({
      uri: uri,
    }),
    cache: new InMemoryCache(),
  });
};
