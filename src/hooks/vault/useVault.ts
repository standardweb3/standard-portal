import VAULT_ABI from '../../constants/abis/vault.json'
import { Contract } from '@ethersproject/contracts';
import { useContract } from '..';

export function useVaultContract(address, withSIgnerIfPossible =true): Contract |null {
    return useContract(address, VAULT_ABI, withSIgnerIfPossible)
}