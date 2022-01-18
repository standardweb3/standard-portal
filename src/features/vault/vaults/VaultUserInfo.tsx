import { useVaultUser } from '../../../services/graph/hooks/vault';

export function VaultUserInfo() {
  const user = useVaultUser();
  console.log('user', user);
  return <div></div>;
}
