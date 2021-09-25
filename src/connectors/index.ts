import { BscConnector } from '@binance-chain/bsc-connector';
import { ChainId } from '@digitalnative/standard-protocol-sdk';
import { FortmaticConnector } from './Fortmatic';
import { InjectedConnector } from '@web3-react/injected-connector';
import { NetworkConnector } from './NetworkConnector';
import { PortisConnector } from '@web3-react/portis-connector';
import { TorusConnector } from '@web3-react/torus-connector';
import { WalletConnectConnector } from '@web3-react/walletconnect-connector';
import { WalletLinkConnector } from '@web3-react/walletlink-connector';
import { Web3Provider } from '@ethersproject/providers';

const RPC = {
  [ChainId.MAINNET]:
    'https://eth-mainnet.alchemyapi.io/v2/EA7UDrnRTL_aXxyoPoasAMx9ey2vQzky',
  [ChainId.ROPSTEN]:
    'https://eth-ropsten.alchemyapi.io/v2/325Q127k2d4G_Ev077fwz-OzPz7fyIZ4',
  [ChainId.RINKEBY]:
    'https://eth-mainnet.alchemyapi.io/v2/-m6r5QkA0mAmuLJ71qRce4xOI7w8w73l',
  [ChainId.GÖRLI]:
    'https://eth-goerli.alchemyapi.io/v2/LMUMz1ESenYl3xQPw2jUcgNsS8aasIFH',
  [ChainId.KOVAN]:
    'https://eth-kovan.alchemyapi.io/v2/NU1Dxk4vYkOcMmndMTRAPIin-IyKKcYq',
  [ChainId.SHIBUYA]: 'https://rpc.shibuya.astar.network:8545',
  [ChainId.SHIDEN]: 'https://rpc.shiden.astar.network:8545',
  [ChainId.FANTOM]: 'https://rpcapi.fantom.network',
  [ChainId.FANTOM_TESTNET]: 'https://rpc.testnet.fantom.network',
  [ChainId.MATIC]: 'https://rpc-mainnet.maticvigil.com',
  // [ChainId.MATIC]:
  //     'https://apis.ankr.com/e22bfa5f5a124b9aa1f911b742f6adfe/c06bb163c3c2a10a4028959f4d82836d/polygon/full/main',
  [ChainId.MATIC_TESTNET]: 'https://rpc-mumbai.matic.today',
  [ChainId.XDAI]: 'https://rpc.xdaichain.com',
  [ChainId.BSC]: 'https://bsc-dataseed.binance.org/',
  [ChainId.BSC_TESTNET]: 'https://data-seed-prebsc-2-s3.binance.org:8545',
  [ChainId.MOONBEAM_TESTNET]: 'https://rpc.testnet.moonbeam.network',
  [ChainId.AVALANCHE]: 'https://api.avax.network/ext/bc/C/rpc',
  [ChainId.AVALANCHE_TESTNET]: 'https://api.avax-test.network/ext/bc/C/rpc',
  [ChainId.HECO]: 'https://http-mainnet.hecochain.com',
  [ChainId.HECO_TESTNET]: 'https://http-testnet.hecochain.com',
  [ChainId.HARMONY]: 'https://api.harmony.one',
  [ChainId.HARMONY_TESTNET]: 'https://api.s0.b.hmny.io',
  [ChainId.OKEX]: 'https://exchainrpc.okex.org',
  [ChainId.OKEX_TESTNET]: 'https://exchaintestrpc.okex.org',
  [ChainId.ARBITRUM]: 'https://arb1.arbitrum.io/rpc',
  [ChainId.PALM]:
    'https://palm-mainnet.infura.io/v3/da5fbfafcca14b109e2665290681e267',
};

export const network = new NetworkConnector({
  defaultChainId: 1,
  urls: RPC,
});

let networkLibrary: Web3Provider | undefined;

export function getNetworkLibrary(): Web3Provider {
  return (networkLibrary =
    networkLibrary ?? new Web3Provider(network.provider as any));
}

export const injected = new InjectedConnector({
  supportedChainIds: [
    1, // mainnet
    3, // ropsten
    4, // rinkeby
    5, // goreli
    42, // kovan
    81, // shibuya
    250, // fantom
    336, // shiden
    4002, // fantom testnet
    137, // matic
    80001, // matic testnet
    100, // xdai
    56, // binance smart chain
    97, // binance smart chain testnet
    1287, // moonbase
    43114, // avalanche
    43113, // fuji
    128, // heco
    256, // heco testnet
    1666600000, // harmony
    1666700000, // harmony testnet
    66, // okex testnet
    65, // okex testnet
    42161, // arbitrum
    42220, // celo
    11297108109, // palm
  ],
});

// mainnet only
export const walletconnect = new WalletConnectConnector({
  rpc: RPC,
  bridge: 'https://bridge.walletconnect.org',
  qrcode: true,
  pollingInterval: 15000,
});

// mainnet only
export const fortmatic = new FortmaticConnector({
  apiKey: process.env.NEXT_PUBLIC_FORTMATIC_API_KEY ?? '',
  chainId: 1,
});

// mainnet only
export const portis = new PortisConnector({
  dAppId: process.env.NEXT_PUBLIC_PORTIS_ID ?? '',
  networks: [1],
});

// mainnet only
export const walletlink = new WalletLinkConnector({
  url: RPC[ChainId.MAINNET],
  appName: 'Standard Protocol',
  appLogoUrl:
    'https://raw.githubusercontent.com/sushiswap/art/master/sushi/logo-256x256.png',
});

// mainnet only
export const torus = new TorusConnector({
  chainId: 1,
});

// binance only
export const binance = new BscConnector({ supportedChainIds: [56] });
