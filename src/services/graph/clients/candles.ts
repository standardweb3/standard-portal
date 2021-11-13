import { ApolloClient, createHttpLink, InMemoryCache } from '@apollo/client';
import { candlesUri } from '../fetchers/candles';

export const dexCandlesGraphClient = (chainId) => {
  const uri = candlesUri(chainId);
  return new ApolloClient({
    link: createHttpLink({
      uri: uri,
    }),
    cache: new InMemoryCache(),
  });
};
