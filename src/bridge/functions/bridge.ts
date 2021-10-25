import { chainInfo } from '../config';

export function getCurChainInfo(chainID: any) {
  if (chainID && chainInfo[chainID]) {
    return chainInfo[chainID];
  }
}
