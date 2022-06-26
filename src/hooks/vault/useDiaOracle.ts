import { getDiaOracleAddress } from '@digitalnative/standard-protocol-sdk';
import { Contract } from '@ethersproject/contracts';
import { useActiveWeb3React, useContract } from '..';
import DIA_ORACLE_ABI from '../../constants/abis/dia-oracle.json';
import { useProtocol } from '../../state/protocol/hooks';

export function useDiaOracleAddress(): string {
  const { chainId } = useActiveWeb3React();
  const protocol = useProtocol();
  return getDiaOracleAddress(protocol, chainId);
}

export function useDiaOracleContract(): Contract | null {
  const oracleAddress = useDiaOracleAddress();

  return useContract(oracleAddress, DIA_ORACLE_ABI, false);
}
