import { STND_ADDRESS } from '@digitalnative/standard-protocol-sdk';
import { TokenAdder } from '.';
import { useActiveWeb3React } from '../../hooks';
import { useCurrency, useToken } from '../../hooks/Tokens';

export function StndAdder() {
  const { chainId } = useActiveWeb3React();
  const currency = useCurrency(STND_ADDRESS[chainId]);
  return <TokenAdder currency={currency} />;
}
