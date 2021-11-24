import { MULTICALL2_ADDRESS } from '../constants/addresses';
import {
  ARGENT_WALLET_DETECTOR_ABI,
  ARGENT_WALLET_DETECTOR_MAINNET_ADDRESS,
} from '../constants/abis/argent-wallet-detector';
import {
  BAR_ADDRESS,
  ChainId,
  getXStndAddress,
  MAKER_ADDRESS,
  MASTERCHEF_ADDRESS,
  MASTERCHEF_V2_ADDRESS,
  STND_ADDRESS,
  SUSHI_ADDRESS,
  TIMELOCK_ADDRESS,
  WNATIVE,
} from '@digitalnative/standard-protocol-sdk';
import { MERKLE_DISTRIBUTOR_ADDRESS } from '../constants';

import ALCX_REWARDER_ABI from '../constants/abis/alcx-rewarder.json';
import ARCHER_ROUTER_ABI from '../constants/abis/archer-router.json';
import BAR_ABI from '../constants/abis/bar.json';
import XSTND_ABI from '../constants/abis/xstnd.json';
import BORING_HELPER_ABI from '../constants/abis/boring-helper.json';
import CLONE_REWARDER_ABI from '../constants/abis/clone-rewarder.json';
import COMPLEX_REWARDER_ABI from '../constants/abis/complex-rewarder.json';
import { Contract } from '@ethersproject/contracts';
import DASHBOARD_ABI from '../constants/abis/dashboard.json';
import DIVIDEND_POOL_ABI from '../constants/abis/dividend-pool.json';
import EIP_2612_ABI from '../constants/abis/eip-2612.json';
import ENS_ABI from '../constants/abis/ens-registrar.json';
import ENS_PUBLIC_RESOLVER_ABI from '../constants/abis/ens-public-resolver.json';
import ERC20_ABI from '../constants/abis/erc20.json';
import { ERC20_BYTES32_ABI } from '../constants/abis/erc20';
import FACTORY_ABI from '../constants/abis/factory.json';
import IUniswapV2PairABI from '../constants/abis/uniswap-v2-pair.json';
// import LIMIT_ORDER_ABI from '../constants/abis/limit-order.json';
import MAKER_ABI from '../constants/abis/maker.json';
import MASTERCHEF_ABI from '../constants/abis/masterchef.json';
import MASTERCHEF_V2_ABI from '../constants/abis/masterpool.json';
import ANYSWAP_ERC20_ABI from '../constants/abis/anyswap_erc20.json';

// import MASTERPOOL_ABI from '../constants/abis/masterpool.json';
import MERKLE_DISTRIBUTOR_ABI from '../constants/abis/merkle-distributor.json';
import MULTICALL2_ABI from '../constants/abis/multicall2.json';
import PENDING_ABI from '../constants/abis/pending.json';
import ROUTER_ABI from '../constants/abis/router.json';
import SUSHIROLL_ABI from '@sushiswap/core/abi/SushiRoll.json';
import SUSHI_ABI from '../constants/abis/sushi.json';
import STND_ABI from '../constants/abis/stnd.json';
import TIMELOCK_ABI from '../constants/abis/timelock.json';
import WETH9_ABI from '../constants/abis/weth.json';
import { getContract } from '../functions/contract';
import { useActiveWeb3React } from './useActiveWeb3React';
import { useMemo } from 'react';
import {
  useDividendPoolAddress,
  useFactoryAddress,
  useRouterAddressWithChainId,
} from '.';
import { useProtocol } from '../state/protocol/hooks';

export const BORING_HELPER_ADDRESS = {
  [ChainId.MAINNET]: '0x11Ca5375AdAfd6205E41131A4409f182677996E6',
  [ChainId.ROPSTEN]: '',
  [ChainId.RINKEBY]: '',
  [ChainId.GÖRLI]: '',
  [ChainId.KOVAN]: '0x11Ca5375AdAfd6205E41131A4409f182677996E6',
  [ChainId.FANTOM]: '',
  [ChainId.FANTOM_TESTNET]: '',
  [ChainId.MATIC]: '0xA77a7fD5a16237B85E0FAd02C51f459D18AE93Cd',
  [ChainId.MATIC_TESTNET]: '',
  [ChainId.XDAI]: '0x97e4a0fb71243A83A6FbaEF7Cf73617594e4cF2F',
  [ChainId.BSC]: '0x11Ca5375AdAfd6205E41131A4409f182677996E6',
  [ChainId.BSC_TESTNET]: '',
  [ChainId.ARBITRUM]: '',
  [ChainId.ARBITRUM_TESTNET]: '',
  [ChainId.MOONBEAM_TESTNET]: '',
  [ChainId.AVALANCHE]: '',
  [ChainId.AVALANCHE_TESTNET]: '',
  [ChainId.HECO]: '0x11Ca5375AdAfd6205E41131A4409f182677996E6',
  [ChainId.HECO_TESTNET]: '',
  [ChainId.HARMONY]: '',
  [ChainId.HARMONY_TESTNET]: '',
  [ChainId.OKEX]: '',
  [ChainId.OKEX_TESTNET]: '',
  [ChainId.CELO]: '',
};

export function useEIP2612Contract(tokenAddress?: string): Contract | null {
  return useContract(tokenAddress, EIP_2612_ABI, false);
}

// returns null on errors
export function useContract(
  address: string | undefined,
  ABI: any,
  withSignerIfPossible = true,
): Contract | null {
  const { library, account } = useActiveWeb3React();

  return useMemo(() => {
    if (!address || !ABI || !library) return null;
    try {
      return getContract(
        address,
        ABI,
        library,
        withSignerIfPossible && account ? account : undefined,
      );
    } catch (error) {
      console.error('Failed to get contract', error, address);
      return null;
    }
  }, [address, ABI, library, withSignerIfPossible, account]);
}

export function useTokenContract(
  tokenAddress?: string,
  withSignerIfPossible?: boolean,
): Contract | null {
  return useContract(tokenAddress, ERC20_ABI, withSignerIfPossible);
}

export function useWETH9Contract(
  withSignerIfPossible?: boolean,
): Contract | null {
  const { chainId } = useActiveWeb3React();
  return useContract(
    chainId ? WNATIVE[chainId].address : undefined,
    WETH9_ABI,
    withSignerIfPossible,
  );
}

export function useArgentWalletDetectorContract(): Contract | null {
  const { chainId } = useActiveWeb3React();
  return useContract(
    chainId === ChainId.MAINNET
      ? ARGENT_WALLET_DETECTOR_MAINNET_ADDRESS
      : undefined,
    ARGENT_WALLET_DETECTOR_ABI,
    false,
  );
}

export function useENSRegistrarContract(
  withSignerIfPossible?: boolean,
): Contract | null {
  const { chainId } = useActiveWeb3React();
  let address: string | undefined;
  if (chainId) {
    switch (chainId) {
      case ChainId.MAINNET:
      case ChainId.GÖRLI:
      case ChainId.ROPSTEN:
      case ChainId.RINKEBY:
        address = '0x00000000000C2E074eC69A0dFb2997BA6C7d2e1e';
        break;
    }
  }
  return useContract(address, ENS_ABI, withSignerIfPossible);
}

export function useENSResolverContract(
  address: string | undefined,
  withSignerIfPossible?: boolean,
): Contract | null {
  return useContract(address, ENS_PUBLIC_RESOLVER_ABI, withSignerIfPossible);
}

export function useBytes32TokenContract(
  tokenAddress?: string,
  withSignerIfPossible?: boolean,
): Contract | null {
  return useContract(tokenAddress, ERC20_BYTES32_ABI, withSignerIfPossible);
}

export function usePairContract(
  pairAddress?: string,
  withSignerIfPossible?: boolean,
): Contract | null {
  return useContract(pairAddress, IUniswapV2PairABI, withSignerIfPossible);
}

export function useMerkleDistributorContract(): Contract | null {
  const { chainId } = useActiveWeb3React();
  return useContract(
    chainId ? MERKLE_DISTRIBUTOR_ADDRESS[chainId] : undefined,
    MERKLE_DISTRIBUTOR_ABI,
    true,
  );
}

export function useBoringHelperContract(): Contract | null {
  const { chainId } = useActiveWeb3React();
  return useContract(
    chainId && BORING_HELPER_ADDRESS[chainId],
    BORING_HELPER_ABI,
    false,
  );
}

export function usePendingContract(): Contract | null {
  return useContract(
    '0x9aeadfE6cd03A2b5730474bF6dd79802d5bCD029',
    PENDING_ABI,
    false,
  );
}

export function useMulticall2Contract() {
  const { chainId } = useActiveWeb3React();
  return useContract(
    chainId && MULTICALL2_ADDRESS[chainId],
    MULTICALL2_ABI,
    false,
  );
}

export function useSushiContract(withSignerIfPossible = true): Contract | null {
  const { chainId } = useActiveWeb3React();
  return useContract(
    chainId && SUSHI_ADDRESS[chainId],
    SUSHI_ABI,
    withSignerIfPossible,
  );
}

export function useSTNDContract(withSignerIfPossibe = true): Contract | null {
  const { chainId } = useActiveWeb3React();
  return useContract(
    chainId && STND_ADDRESS[chainId],
    STND_ABI,
    withSignerIfPossibe,
  );
}

export function useStakePoolContract(
  withSignerIfPossible?: boolean,
): Contract | null {
  const { chainId } = useActiveWeb3React();
  return useContract(
    chainId && MASTERCHEF_V2_ADDRESS[chainId],
    MASTERCHEF_ABI,
    withSignerIfPossible,
  );
}

export function useMasterChefContract(
  withSignerIfPossible?: boolean,
): Contract | null {
  const { chainId } = useActiveWeb3React();
  return useContract(
    chainId && MASTERCHEF_ADDRESS[chainId],
    MASTERCHEF_ABI,
    withSignerIfPossible,
  );
}

export function useMasterChefV2Contract(
  withSignerIfPossible?: boolean,
): Contract | null {
  const { chainId } = useActiveWeb3React();
  return useContract(
    chainId && MASTERCHEF_V2_ADDRESS[chainId],
    MASTERCHEF_V2_ABI,
    withSignerIfPossible,
  );
}

export function useFactoryContract(): Contract | null {
  const factoryAddress = useFactoryAddress();
  return useContract(factoryAddress, FACTORY_ABI, false);
}

export function useDividendPoolContract(
  withSignerIfPossible?: boolean,
): Contract | null {
  const dividendPoolAddress = useDividendPoolAddress();
  return useContract(
    dividendPoolAddress,
    DIVIDEND_POOL_ABI,
    withSignerIfPossible,
  );
}

export function useRouterContract(
  useArcher = false,
  withSignerIfPossible?: boolean,
): Contract | null {
  const { chainId } = useActiveWeb3React();
  const address = useRouterAddressWithChainId(chainId, useArcher);

  const abi = useArcher ? ARCHER_ROUTER_ABI : ROUTER_ABI;

  return useContract(address, abi, withSignerIfPossible);
}

export function useAnyswapTokenContract(
  tokenAddress?: string,
  withSignerIfPossible?: boolean,
): Contract | null {
  return useContract(tokenAddress, ANYSWAP_ERC20_ABI, withSignerIfPossible);
}

export function useSushiBarContract(
  withSignerIfPossible?: boolean,
): Contract | null {
  const { chainId } = useActiveWeb3React();
  return useContract(
    chainId && BAR_ADDRESS[chainId],
    BAR_ABI,
    withSignerIfPossible,
  );
}

export function useStndStakerContract(
  withSignerIfPossible?: boolean,
): Contract | null {
  const protocol = useProtocol();
  const { chainId } = useActiveWeb3React();
  return useContract(
    chainId && getXStndAddress(protocol, chainId),
    XSTND_ABI,
    withSignerIfPossible,
  );
}

export function useMakerContract(): Contract | null {
  const { chainId } = useActiveWeb3React();
  return useContract(chainId && MAKER_ADDRESS[chainId], MAKER_ABI, false);
}

export function useTimelockContract(): Contract | null {
  const { chainId } = useActiveWeb3React();
  return useContract(chainId && TIMELOCK_ADDRESS[chainId], TIMELOCK_ABI, false);
}

export function useSushiRollContract(
  version: 'v1' | 'v2' = 'v2',
): Contract | null {
  const { chainId } = useActiveWeb3React();
  let address: string | undefined;
  if (chainId) {
    switch (chainId) {
      case ChainId.MAINNET:
        address = '0xdB7De7d268E6132E4A8099A671D123317415b404';
        break;
      case ChainId.ROPSTEN:
        address = '0xCaAbdD9Cf4b61813D4a52f980d6BC1B713FE66F5';
        break;
      case ChainId.BSC:
        if (version === 'v1') {
          address = '0x677978dE066b3f5414eeA56644d9fCa3c75482a1';
        } else if (version === 'v2') {
          address = '0x2DD1aB1956BeD7C2d938d0d7378C22Fd01135a5e';
        }
        break;
      case ChainId.MATIC:
        address = '0x0053957E18A0994D3526Cf879A4cA7Be88e8936A';
        break;
    }
  }
  return useContract(address, SUSHIROLL_ABI, true);
}

// export function usePancakeRollV1Contract(): Contract | null {
//     return useContract('0x677978dE066b3f5414eeA56644d9fCa3c75482a1', SUSHIROLL_ABI, true)
// }

// export function usePancakeRollV2Contract(): Contract | null {
//     return useContract('', SUSHIROLL_ABI, true)
// }

export function useDashboardContract(): Contract | null {
  const { chainId } = useActiveWeb3React();
  let address: string | undefined;
  if (chainId) {
    switch (chainId) {
      case ChainId.MAINNET:
        address = '0xD132Ce8eA8865348Ac25E416d95ab1Ba84D216AF';
        break;
      case ChainId.ROPSTEN:
        address = '0xC95678C10CB8b3305b694FF4bfC14CDB8aD3AB35';
        break;
      case ChainId.BSC:
        address = '0xCFbc963f223e39727e7d4075b759E97035457b48';
        break;
    }
  }
  return useContract(address, DASHBOARD_ABI, false);
}

export function useQuickSwapFactoryContract(): Contract | null {
  return useContract(
    '0x5757371414417b8C6CAad45bAeF941aBc7d3Ab32',
    [
      {
        type: 'constructor',
        stateMutability: 'nonpayable',
        payable: false,
        inputs: [
          {
            type: 'address',
            name: '_feeToSetter',
            internalType: 'address',
          },
        ],
      },
      {
        type: 'event',
        name: 'PairCreated',
        inputs: [
          {
            type: 'address',
            name: 'token0',
            internalType: 'address',
            indexed: true,
          },
          {
            type: 'address',
            name: 'token1',
            internalType: 'address',
            indexed: true,
          },
          {
            type: 'address',
            name: 'pair',
            internalType: 'address',
            indexed: false,
          },
          {
            type: 'uint256',
            name: '',
            internalType: 'uint256',
            indexed: false,
          },
        ],
        anonymous: false,
      },
      {
        type: 'function',
        stateMutability: 'view',
        payable: false,
        outputs: [{ type: 'address', name: '', internalType: 'address' }],
        name: 'allPairs',
        inputs: [{ type: 'uint256', name: '', internalType: 'uint256' }],
        constant: true,
      },
      {
        type: 'function',
        stateMutability: 'view',
        payable: false,
        outputs: [{ type: 'uint256', name: '', internalType: 'uint256' }],
        name: 'allPairsLength',
        inputs: [],
        constant: true,
      },
      {
        type: 'function',
        stateMutability: 'nonpayable',
        payable: false,
        outputs: [{ type: 'address', name: 'pair', internalType: 'address' }],
        name: 'createPair',
        inputs: [
          {
            type: 'address',
            name: 'tokenA',
            internalType: 'address',
          },
          {
            type: 'address',
            name: 'tokenB',
            internalType: 'address',
          },
        ],
        constant: false,
      },
      {
        type: 'function',
        stateMutability: 'view',
        payable: false,
        outputs: [{ type: 'address', name: '', internalType: 'address' }],
        name: 'feeTo',
        inputs: [],
        constant: true,
      },
      {
        type: 'function',
        stateMutability: 'view',
        payable: false,
        outputs: [{ type: 'address', name: '', internalType: 'address' }],
        name: 'feeToSetter',
        inputs: [],
        constant: true,
      },
      {
        type: 'function',
        stateMutability: 'view',
        payable: false,
        outputs: [{ type: 'address', name: '', internalType: 'address' }],
        name: 'getPair',
        inputs: [
          { type: 'address', name: '', internalType: 'address' },
          { type: 'address', name: '', internalType: 'address' },
        ],
        constant: true,
      },
      {
        type: 'function',
        stateMutability: 'nonpayable',
        payable: false,
        outputs: [],
        name: 'setFeeTo',
        inputs: [
          {
            type: 'address',
            name: '_feeTo',
            internalType: 'address',
          },
        ],
        constant: false,
      },
      {
        type: 'function',
        stateMutability: 'nonpayable',
        payable: false,
        outputs: [],
        name: 'setFeeToSetter',
        inputs: [
          {
            type: 'address',
            name: '_feeToSetter',
            internalType: 'address',
          },
        ],
        constant: false,
      },
    ],
    false,
  );
}

export function useComplexRewarderContract(
  address,
  withSignerIfPossible?: boolean,
): Contract | null {
  return useContract(address, COMPLEX_REWARDER_ABI, withSignerIfPossible);
}

export function useAlcxRewarderContract(
  withSignerIfPossible?: boolean,
): Contract | null {
  return useContract(
    '0x7519C93fC5073E15d89131fD38118D73A72370F8',
    ALCX_REWARDER_ABI,
    withSignerIfPossible,
  );
}

export function useCloneRewarderContract(
  address,
  withSignerIfPossibe?: boolean,
): Contract | null {
  return useContract(address, CLONE_REWARDER_ABI, withSignerIfPossibe);
}
