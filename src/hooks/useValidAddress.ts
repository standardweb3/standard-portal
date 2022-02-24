import { isAddress } from '@ethersproject/address';

export function useValidAddress(address: string, handleErr: () => void) {
  if (!isAddress(address)) {
    handleErr();
  }
}
