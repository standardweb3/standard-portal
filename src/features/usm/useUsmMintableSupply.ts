import { useVaultManager } from '../../services/graph/hooks/vault';

export function useUsmMintableSupply() {
  const vaultManager = useVaultManager();

  const isMintable =
    vaultManager && vaultManager.rebaseActive
      ? parseFloat(vaultManager.currentBorrowed) <
        parseFloat(vaultManager.desiredSupply)
      : true;

  const mintableSupply =
    vaultManager && vaultManager.rebaseActive
      ? isMintable
        ? parseFloat(vaultManager.desiredSupply) -
          parseFloat(vaultManager.currentBorrowed)
        : 0
      : undefined;

  return {
    isMintable,
    mintableSupply,
  };
}
