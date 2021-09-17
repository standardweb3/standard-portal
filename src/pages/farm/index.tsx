import { useRouter } from 'next/router';

import { Chef, PairType } from '../../features/farm/enum';
import { useActiveWeb3React, useFuse } from '../../hooks';

import { useEthPrice } from '../../services/graph';

export default function Farm() {
  const { chainId } = useActiveWeb3React();

  const router = useRouter();

  const [ethPrice] = [useEthPrice()];
  console.log(ethPrice);

  return <div>FARM {ethPrice}</div>;
}
