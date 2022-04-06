import { useRouter } from 'next/router';
import { useCallback } from 'react';
import { useValidAddress } from '../useValidAddress';

export function useValidVault(address: string) {
  const router = useRouter();
  const handle404 = useCallback(() => {
    router.push('/vault/404');
  }, []);
  useValidAddress(address, handle404);
}
