export const CDP_DECIMALS = 10e4;
export const MAX_COLLATERAL_RATIO = 400;

export const getSafeCollateralRatio = (mcr) => {
  return (mcr * 4) / 3;
};

export const CLOSE_FEE_MARGIN = 0.01;
