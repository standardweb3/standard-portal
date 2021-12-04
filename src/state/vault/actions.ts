import { createAction } from '@reduxjs/toolkit';
import { Collateral } from './reducer';

export const fetchCollateralsAction = createAction<{
  collaterals: { [key: string]: Collateral };
}>('vault/collaterals');

export const clearCollatearlsAction = createAction<{}>(
  'vault/clearCollaterals',
);
export const selectCollateralAction = createAction<{
  collateral: string;
}>('vault/selectCollateral');

export const clearSelectedCollateralAction = createAction<{}>(
  'vault/clearSelectedCollateral',
);
