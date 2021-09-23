import { ChainId } from '@digitalnative/standard-protocol-sdk';
import ReactGA from 'react-ga';
import cookie from 'cookie-cutter';
// next
import Image from 'next/image';
// networks
import { NETWORK_ICON, NETWORK_LABEL } from '../../constants/networks';
// web3
import { useActiveWeb3React } from '../../hooks/useActiveWeb3React';
// modal
import {
  useModalOpen,
  useNetworkModalToggle,
} from '../../state/application/hooks';
import { ApplicationModal } from '../../state/application/actions';
import { Modal } from '../../components-ui/Modal';
import { ModalHeader } from '../../components-ui/Modal/ModalHeader';

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

export default function NetworkModal(): JSX.Element | null {
  const { chainId, library, account } = useActiveWeb3React();
  const networkModalOpen = useModalOpen(ApplicationModal.NETWORK);
  const toggleNetworkModal = useNetworkModalToggle();

  if (!chainId) return null;

  return (
    <Modal
      isOpen={networkModalOpen}
      onDismiss={toggleNetworkModal}
      maxWidth="600px"
      className="relative"
    >
      <ModalHeader onClose={toggleNetworkModal} title="Select a Network" />

      <div
        className={`
        mt-6
        grid grid-cols-1 grid-flow-row-dense gap-5 
        md:grid-cols-2
        overflow-y-auto`}
      >
        {[
          ChainId.RINKEBY,
          ChainId.SHIBUYA,
          // ChainId.MAINNET,
          // ChainId.MATIC,
          // ChainId.FANTOM,
          // ChainId.ARBITRUM,
          // ChainId.OKEX,
          // ChainId.HECO,
          // ChainId.BSC,
          // ChainId.XDAI,
          // ChainId.HARMONY,
          // ChainId.AVALANCHE,
          // ChainId.CELO,
          // ChainId.PALM,
        ].map((key: ChainId, i: number) => {
          if (chainId === key) {
            return (
              <div
                key={i}
                className={`
                col-span-1
                flex items-center 
                w-full p-3 space-x-3 rounded-xl
                bg-background
                border border-green
                cursor-pointer
                `}
              >
                <Image
                  src={NETWORK_ICON[key]}
                  alt={`Switch to ${NETWORK_LABEL[key]} Network`}
                  className="rounded-xl bg-white"
                  width="32px"
                  height="32px"
                />
                <div className="font-bold text-text">{NETWORK_LABEL[key]}</div>
              </div>
            );
          }
          return (
            <button
              key={i}
              onClick={() => {
                toggleNetworkModal();
                const params = SUPPORTED_NETWORKS[key];
                cookie.set('chainId', key);
                if ([ChainId.MAINNET, ChainId.RINKEBY].includes(key)) {
                  library?.send('wallet_switchEthereumChain', [
                    { chainId: params.chainId },
                    account,
                  ]);
                } else {
                  library?.send('wallet_addEthereumChain', [params, account]);
                }
              }}
              className={`
                flex items-center 
                w-full col-span-1 p-3 space-x-3 rounded-xl
                bg-modal-inner-background hover:bg-green
                cursor-pointer
                transition duration-500
                `}
            >
              <Image
                src={NETWORK_ICON[key]}
                alt="Switch Network"
                className="rounded-xl bg-white"
                width="32px"
                height="32px"
              />
              <div className="font-bold text-text">{NETWORK_LABEL[key]}</div>
            </button>
          );
        })}
        {/* {['Clover', 'Telos', 'Optimism'].map((network, i) => (
          <button
            key={i}
            className="flex items-center w-full col-span-1 p-3 space-x-3 rounded cursor-pointer bg-dark-800 hover:bg-dark-700"
          >
            <Image
              src="/images/tokens/unknown.png"
              alt="Switch Network"
              className="rounded-md"
              width="32px"
              height="32px"
            />
            <div className="font-bold text-primary">{network} (Coming Soon)</div>
          </button>
        ))} */}
      </div>
    </Modal>
  );
}
