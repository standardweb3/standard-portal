import { useV1Balance, useV1Ids, useV1Ids2 } from '../../hooks/vault/useV1';
import {
  useVaultAddresses,
  useVaultAddresses2,
} from '../../hooks/vault/useVaultManager';

export default function Vaults() {
  const v1Ids = useV1Ids2();
  console.log(v1Ids);

  const vaultAddrs = useVaultAddresses2(v1Ids);
  console.log(vaultAddrs);
  // const vaultAddrs = useVaultAddresses(v1Ids);

  return <div>Vaults</div>;
}
