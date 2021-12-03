import { request } from 'graphql-request';
import { collateralsQuery } from '../queries/collaterals';

const COLLATERAL_URL = 'http://localhost:5000/graphql';

const collateral = async (query, variables) => {
  return request(COLLATERAL_URL, query, variables);
};

export const getCollaterals = async (variables, query = collateralsQuery) => {
  const { collaterals } = await collateral(query, variables);

  return collaterals;
};
