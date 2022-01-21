import { useV1Balance, useV1Ids, useV1Ids2 } from '../../hooks/vault/useV1';
import {
  useVaultAddresses,
  useVaultAddresses2,
} from '../../hooks/vault/useVaultManager';

export default function Vaults() {
  const v1Ids = useV1Ids2();

  const vaultAddrs = useVaultAddresses2(v1Ids);
  // const vaultAddrs = useVaultAddresses(v1Ids);

  return <div>Vaults</div>;
}
