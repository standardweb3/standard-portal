import {
  clearCollatearlsAction,
  clearSelectedCollateralAction,
  fetchCollateralsAction,
  selectCollateralAction,
} from './actions';

import { createReducer } from '@reduxjs/toolkit';

export type Collateral = {
  id: number;
  address: string;
  symbol: string;
  alias: string;
  name: string;
  description: string;
  logo: string;
  lfr: number;
  sfr: number;
  mcr: number;
  decimals: number;
};

export type CollateralWithPrice = Collateral & { price?: number };

export interface VaultState {
  collaterals: {
    [key: string]: Collateral;
  };
  selectedCollateral: string | undefined;
}

const initialState: VaultState = {
  collaterals: {},
  selectedCollateral: undefined,
};

export default createReducer<VaultState>(initialState, (builder) =>
  builder
    .addCase(fetchCollateralsAction, (state, { payload: { collaterals } }) => {
      return { ...state, collaterals };
    })
    .addCase(clearCollatearlsAction, (state) => {
      return {
        ...state,
        collaterals: {},
      };
    })
    .addCase(selectCollateralAction, (state, { payload: { collateral } }) => {
      return {
        ...state,
        selectedCollateral: collateral,
      };
    })
    .addCase(clearSelectedCollateralAction, (state) => {
      return {
        ...state,
        selectedCollateral: undefined,
      };
    }),
);
