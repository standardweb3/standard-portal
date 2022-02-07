import { CDP_DECIMALS } from './constants';

export function applyCdpDecimals(numString) {
  return parseFloat(numString) / CDP_DECIMALS;
}
