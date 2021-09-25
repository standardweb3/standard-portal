import { ChainId } from '@digitalnative/standard-protocol-sdk';
import cookie from 'cookie-cutter';
// next
import Image from 'next/image';
// networks
import { NETWORK_ICON, NETWORK_LABEL } from '../../constants/networks';
// web3
import { useActiveWeb3React } from '../../hooks/useActiveWeb3React';
import { Listbox, Transition } from '@headlessui/react';
import { ChevronDownIcon } from '@heroicons/react/outline';
import { Fragment, useMemo } from 'react';

export const SUPPORTED_NETWORKS: {
  [chainId in ChainId]?: {
    chainId: string;
    chainName: string;
    nativeCurrency: {
      name: string;
      symbol: string;
      decimals: number;
    };
    rpcUrls: string[];
    blockExplorerUrls: string[];
  };
} = {
  [ChainId.RINKEBY]: {
    chainId: '0x4',
    chainName: 'Rinkeby',
    nativeCurrency: {
      name: 'Ethereum',
      symbol: 'ETH',
      decimals: 18,
    },
    rpcUrls: ['https://rinkeby.infura.io/v3'],
    blockExplorerUrls: ['https://rinkeby.etherscan.io'],
  },
  [ChainId.SHIBUYA]: {
    chainId: '0x51',
    chainName: 'Shibuya',
    nativeCurrency: {
      name: 'Shibuya',
      symbol: 'SBY',
      decimals: 18,
    },
    rpcUrls: ['https://rpc.shibuya.astar.network:8545'],
    blockExplorerUrls: ['https://shibuya.subscan.io'],
  },
  [ChainId.SHIDEN]: {
    chainId: '0x150',
    chainName: 'Shiden',
    nativeCurrency: {
      name: 'Shiden',
      symbol: 'SDN',
      decimals: 18,
    },
    rpcUrls: ['https://rpc.shiden.astar.network:8545'],
    blockExplorerUrls: ['https://shiden.subscan.io'],
  },
  // [ChainId.MAINNET]: {
  //   chainId: '0x1',
  //   chainName: 'Ethereum',
  //   nativeCurrency: {
  //     name: 'Ethereum',
  //     symbol: 'ETH',
  //     decimals: 18,
  //   },
  //   rpcUrls: ['https://mainnet.infura.io/v3'],
  //   blockExplorerUrls: ['https://etherscan.com'],
  // },
  // [ChainId.FANTOM]: {
  //   chainId: '0xfa',
  //   chainName: 'Fantom',
  //   nativeCurrency: {
  //     name: 'Fantom',
  //     symbol: 'FTM',
  //     decimals: 18,
  //   },
  //   rpcUrls: ['https://rpcapi.fantom.network'],
  //   blockExplorerUrls: ['https://ftmscan.com'],
  // },
  // [ChainId.BSC]: {
  //   chainId: '0x38',
  //   chainName: 'Binance Smart Chain',
  //   nativeCurrency: {
  //     name: 'Binance Coin',
  //     symbol: 'BNB',
  //     decimals: 18,
  //   },
  //   rpcUrls: ['https://bsc-dataseed.binance.org'],
  //   blockExplorerUrls: ['https://bscscan.com'],
  // },
  // [ChainId.MATIC]: {
  //   chainId: '0x89',
  //   chainName: 'Matic',
  //   nativeCurrency: {
  //     name: 'Matic',
  //     symbol: 'MATIC',
  //     decimals: 18,
  //   },
  //   rpcUrls: ['https://rpc-mainnet.maticvigil.com'], // ['https://matic-mainnet.chainstacklabs.com/'],
  //   blockExplorerUrls: ['https://explorer-mainnet.maticvigil.com'],
  // },
  // [ChainId.HECO]: {
  //   chainId: '0x80',
  //   chainName: 'Heco',
  //   nativeCurrency: {
  //     name: 'Heco Token',
  //     symbol: 'HT',
  //     decimals: 18,
  //   },
  //   rpcUrls: ['https://http-mainnet.hecochain.com'],
  //   blockExplorerUrls: ['https://hecoinfo.com'],
  // },
  // [ChainId.XDAI]: {
  //   chainId: '0x64',
  //   chainName: 'xDai',
  //   nativeCurrency: {
  //     name: 'xDai Token',
  //     symbol: 'xDai',
  //     decimals: 18,
  //   },
  //   rpcUrls: ['https://rpc.xdaichain.com'],
  //   blockExplorerUrls: ['https://blockscout.com/poa/xdai'],
  // },
  // [ChainId.HARMONY]: {
  //   chainId: '0x63564C40',
  //   chainName: 'Harmony',
  //   nativeCurrency: {
  //     name: 'One Token',
  //     symbol: 'ONE',
  //     decimals: 18,
  //   },
  //   rpcUrls: [
  //     'https://api.harmony.one',
  //     'https://s1.api.harmony.one',
  //     'https://s2.api.harmony.one',
  //     'https://s3.api.harmony.one',
  //   ],
  //   blockExplorerUrls: ['https://explorer.harmony.one/'],
  // },
  // [ChainId.AVALANCHE]: {
  //   chainId: '0xA86A',
  //   chainName: 'Avalanche',
  //   nativeCurrency: {
  //     name: 'Avalanche Token',
  //     symbol: 'AVAX',
  //     decimals: 18,
  //   },
  //   rpcUrls: ['https://api.avax.network/ext/bc/C/rpc'],
  //   blockExplorerUrls: ['https://cchain.explorer.avax.network'],
  // },
  // [ChainId.OKEX]: {
  //   chainId: '0x42',
  //   chainName: 'OKEx',
  //   nativeCurrency: {
  //     name: 'OKEx Token',
  //     symbol: 'OKT',
  //     decimals: 18,
  //   },
  //   rpcUrls: ['https://exchainrpc.okex.org'],
  //   blockExplorerUrls: ['https://www.oklink.com/okexchain'],
  // },
  // [ChainId.ARBITRUM]: {
  //   chainId: '0xA4B1',
  //   chainName: 'Arbitrum',
  //   nativeCurrency: {
  //     name: 'Ethereum',
  //     symbol: 'ETH',
  //     decimals: 18,
  //   },
  //   rpcUrls: ['https://arb1.arbitrum.io/rpc'],
  //   blockExplorerUrls: ['https://mainnet-arb-explorer.netlify.app'],
  // },
  // [ChainId.CELO]: {
  //   chainId: '0xA4EC',
  //   chainName: 'Celo',
  //   nativeCurrency: {
  //     name: 'Celo',
  //     symbol: 'CELO',
  //     decimals: 18,
  //   },
  //   rpcUrls: ['https://forno.celo.org'],
  //   blockExplorerUrls: ['https://explorer.celo.org'],
  // },
  // [ChainId.PALM]: {
  //   chainId: '0x2A15C308D',
  //   chainName: 'Palm',
  //   nativeCurrency: {
  //     name: 'Palm',
  //     symbol: 'PALM',
  //     decimals: 18,
  //   },
  //   rpcUrls: [
  //     'https://palm-mainnet.infura.io/v3/da5fbfafcca14b109e2665290681e267',
  //   ],
  //   blockExplorerUrls: ['https://explorer.palm.io'],
  // },
};

export default function NetworkDropDown(): JSX.Element | null {
  const { chainId, library, account } = useActiveWeb3React();

  const onSelectNetwork = (chainIdStr: string) => {
    const chainId = Number(chainIdStr);
    const params = SUPPORTED_NETWORKS[chainId];
    cookie.set('chainId', chainId);
    if ([ChainId.MAINNET, ChainId.RINKEBY].includes(chainId)) {
      library?.send('wallet_switchEthereumChain', [
        { chainId: params.chainId },
        account,
      ]);
    } else {
      library?.send('wallet_addEthereumChain', [params, account]);
    }
  };

  if (!chainId) return null;

  const supportedChainIds = useMemo(
    () =>
      Object.keys(SUPPORTED_NETWORKS).filter((val) => Number(val) !== chainId),
    [chainId],
  );

  return (
    <Listbox value={chainId.toString()} onChange={onSelectNetwork}>
      <div className="mt-1 flex justify-center">
        <Listbox.Button
          className="
            border
            border-border-1
            rounded-full
            relative
            flex items-center
            bg-opaque-inactive
            space-x-2
            py-[0.325rem] px-2"
        >
          <Image
            src={NETWORK_ICON[chainId]}
            alt={`Switch to ${NETWORK_LABEL[chainId]} Network`}
            className="rounded-full"
            width="32px"
            height="32px"
          />
          <span className="flex items-center pointer-events-none">
            <ChevronDownIcon className="w-3 h-3" aria-hidden="true" />
          </span>
        </Listbox.Button>
        <Transition
          as={Fragment}
          leave="transition ease-in duration-100"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <Listbox.Options
            className="
            py-2
            translate-y-[62px]
            absolute
            z-40
            overflow-auto 
            text-base bg-opaque-secondary
            rounded-20
            focus:outline-none
            "
          >
            {supportedChainIds.map((optionChainId, idx) => (
              <Listbox.Option
                key={idx}
                className={({ active }) =>
                  `select-none relative cursor-pointer py-1 px-2`
                }
                value={optionChainId}
              >
                {({ selected, active }) => (
                  <div className="flex items-center space-x-3">
                    <Image
                      src={NETWORK_ICON[optionChainId]}
                      alt={`Switch to ${NETWORK_LABEL[optionChainId]} Network`}
                      className="rounded-full flex-grow"
                      width="32px"
                      height="32px"
                    />
                    <div className="inline-block">
                      {NETWORK_LABEL[optionChainId]}
                    </div>
                  </div>
                )}
              </Listbox.Option>
            ))}
          </Listbox.Options>
        </Transition>
      </div>
    </Listbox>
  );
}
