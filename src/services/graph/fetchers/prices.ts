import { pricesQuery } from '../queries/prices';
import { request } from 'graphql-request';

const PRICE_AGGREGATOR_URL = 'https://price.proxy.standardtech.xyz/graphql';

const priceAgrregator = async (query, variables) => {
  return request(PRICE_AGGREGATOR_URL, query, variables);
};

export const getPrices = async (variables, query = pricesQuery) => {
  const { prices } = await priceAgrregator(query, variables);
  return prices;
};
