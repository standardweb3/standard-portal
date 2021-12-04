import { useCallback } from 'react';
import { AppState } from '..';
import { useAppDispatch, useAppSelector } from '../hooks';
import { selectCollateralAction } from './actions';

export function useVaultState(): AppState['Vault'] {
  return useAppSelector((state) => state.vault);
}

export function useSelectCollateral() {
  const dispatch = useAppDispatch();

  const selectCollateral = useCallback(
    (collateral: string) => {
      dispatch(selectCollateralAction({ collateral }));
    },
    [dispatch],
  );

  return selectCollateral;
}

export function useCollaterals() {
  const state = useAppSelector((state) => state.vault);
  return state.collaterals;
}

export function useSelectedCollateral() {
  const state = useAppSelector((state) => state.vault);
  const selectedCollateral = state.selecteCollateral;
  return state.collaterals[selectedCollateral];
}
