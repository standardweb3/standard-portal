import { getMtrAddress, Token } from '@digitalnative/standard-protocol-sdk';
import { useActiveWeb3React } from '..';
import { useProtocol } from '../../state/protocol/hooks';

export function useMtr() {
  const { chainId } = useActiveWeb3React();
  const protocol = useProtocol();

  return new Token(
    chainId,
    getMtrAddress(protocol, chainId),
    18,
    'MTR',
    'Meter USD',
  );
}
