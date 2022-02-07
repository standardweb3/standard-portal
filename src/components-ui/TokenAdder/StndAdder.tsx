import { STND_ADDRESS } from '@digitalnative/standard-protocol-sdk';
import { TokenAdder } from '.';
import { GeckoTerminal } from '../../features/misc/gecko/GeckoTerminal';
import { useActiveWeb3React } from '../../hooks';
import { useCurrency } from '../../hooks/Tokens';

export function StndAdder() {
  const { chainId } = useActiveWeb3React();
  const currency = useCurrency(STND_ADDRESS[chainId]);
  return <TokenAdder currency={currency} rightComponent={<GeckoTerminal />} />;
}
