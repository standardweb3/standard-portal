import { chainInfo } from '../config';
import { controlConfig, USE_VERSION } from '../constant';

export function getCurConfigInfo(version?: any) {
  version = version ? version : USE_VERSION;
  return controlConfig[version];
}

export function getCurChainInfo(chainID: any) {
  if (chainID && chainInfo[chainID]) {
    return chainInfo[chainID];
  }
  return [];
}

export function getBaseCoin(
  value: any,
  chainId: any,
  type?: number,
  name?: string,
) {
  // console.log(value)
  if (
    value &&
    (value === 'BASECURRENCY' ||
      (value === 'W' + getCurChainInfo(chainId).symbol &&
        getCurChainInfo(chainId).nativeToken))
  ) {
    if (type) {
      return getCurChainInfo(chainId).name;
    } else {
      return getCurChainInfo(chainId).symbol;
    }
  }
  // else if (value && value === 'WETH') {
  //   return 'W' + this.getCurChainInfo(chainId).symbol
  // }
  else {
    if (type) {
      return name;
    } else {
      return value;
    }
  }
}
