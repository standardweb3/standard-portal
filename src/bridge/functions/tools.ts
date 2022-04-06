import { formatFixed } from '@ethersproject/bignumber';
import { BigNumberish } from 'ethers';

const names = ['wei', 'kwei', 'mwei', 'gwei', 'szabo', 'finney', 'ether'];

export function formatDecimal(num: any, decimal: number) {
  if (isNaN(num)) {
    return num;
  }
  const minnum = 1 / Math.pow(10, decimal);
  if (!num || Number(num) <= 0) {
    return '0.00';
  }
  if (Number(num) < minnum) {
    return '<' + minnum;
  }
  // num = (num * 10000).toFixed(decimal) / 10000
  num = num.toString();
  const index = num.indexOf('.');
  if (index !== -1) {
    num = num.substring(0, decimal + index + 1);
  } else {
    num = num.substring(0);
  }
  return Number(parseFloat(num).toFixed(decimal));
}

export function formatUnits(
  value: BigNumberish,
  unitName?: string | BigNumberish,
): string {
  if (typeof unitName === 'string') {
    const index = names.indexOf(unitName);
    if (index !== -1) {
      unitName = 3 * index;
    }
  }
  return formatFixed(value, unitName != null ? unitName : 18);
}

export function fromWei(value: any, decimals?: number, dec?: number) {
  if (!value || !value) {
    return '';
  }
  if (Number(value) === 0) {
    return 0;
  }
  decimals = decimals ? decimals : 18;
  if (dec) {
    return formatDecimal(Number(formatUnits(value.toString(), decimals)), dec);
  }
  return Number(formatUnits(value.toString(), decimals));
}
