import { useStnd, useXStnd } from '../Tokens';
import { useTokenBalance } from '../../state/wallet/hooks';
import { useTotalSupply } from '../useTotalSupply';

export function useXStndInfo() {
  const stnd = useStnd();
  const xStnd = useXStnd();

  const stndBalance = useTokenBalance(xStnd.address, stnd);
  const xStndTotalSupply = useTotalSupply(xStnd);
  return { stndBalance, xStndTotalSupply };
}
