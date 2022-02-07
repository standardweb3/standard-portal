export const CDP_DECIMALS = 10e4;
export const MAX_COLLATERAL_RATIO = 320;

export const getSafeCollateralRatio = (mcr) => {
  return (mcr * 4) / 3;
};
