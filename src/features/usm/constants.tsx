export const CDP_DECIMALS = 10e4;
export const MAX_COLLATERAL_RATIO = 600;

export const getSafeCollateralRatio = (mcr) => {
  return (mcr + 50)
};

export const getMaxCollateralRatio = (mcr) => {
  return (mcr + 200)
};

export const CLOSE_FEE_MARGIN = 0.01;
