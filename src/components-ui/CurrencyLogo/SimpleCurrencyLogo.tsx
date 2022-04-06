import {
  ChainId,
  STND_ADDRESS,
  WNATIVE,
} from '@digitalnative/standard-protocol-sdk';
import React, { FunctionComponent, useMemo } from 'react';
import { SequentialLogo } from '../Logo/SequentialLogo';
import { getAddress } from '@ethersproject/address';
import { useActiveWeb3React } from '../../hooks';

const unknown =
  'https://raw.githubusercontent.com/digitalnativeinc/icons/master/token/unknown.png';

const getTokenUrls = (chainId, id, symbol) => {
  const urls = [];
  if (id && getAddress(STND_ADDRESS[chainId]) === getAddress(id))
    urls.push(
      'https://raw.githubusercontent.com/digitalnativeinc/assets/master/blockchains/ethereum/assets/0x9040e237C3bF18347bb00957Dc22167D0f2b999d/logo.png',
    );
  if (symbol) {
    if (chainId === ChainId.BSC) {
      urls.push(
        `https://v1exchange.pancakeswap.finance/images/coins/${getAddress(
          id,
        )}.png`,
      );
    }
    urls.push(
      `https://raw.githubusercontent.com/digitalnativeinc/icons/master/token/${getCurrencySymbol(
        symbol,
        chainId,
      )}.jpg`,
    );
  }
  if (id) {
    urls.push(
      `https://raw.githubusercontent.com/digitalnativeinc/assets/master/blockchains/${chainId}/assets/${getAddress(
        id,
      )}/logo.png`,
    );
  }
  urls.push(unknown);
  return urls;
};

const BLOCKCHAIN = {
  [ChainId.MAINNET]: 'ethereum',
  [ChainId.BSC]: 'binanace',
  [ChainId.CELO]: 'celo',
  [ChainId.FANTOM]: 'fantom',
  [ChainId.HARMONY]: 'harmony',
  [ChainId.MATIC]: 'polygon',
  [ChainId.XDAI]: 'xdai',
  // [ChainId.OKEX]: 'okex',
};

function getCurrencySymbol(symbol, chainId) {
  let _symbol;
  if (chainId && chainId === ChainId.METIS) {
    if (symbol.startsWith('m.')) {
      _symbol = symbol.substring(2);
    } else {
      _symbol = symbol;
    }
  } else {
    _symbol = symbol;
  }
  if (_symbol === 'WBTC') {
    return 'btc';
  }
  if (_symbol === 'WETH') {
    return 'eth';
  }
  return _symbol.toLowerCase();
}

const AvalancheLogo =
  'https://raw.githubusercontent.com/digitalnativeinc/icons/master/token/avax.jpg';
const BinanceCoinLogo =
  'https://raw.githubusercontent.com/digitalnativeinc/icons/master/token/bnb.jpg';
const EthereumLogo =
  'https://raw.githubusercontent.com/digitalnativeinc/icons/master/token/eth.jpg';
const FantomLogo =
  'https://raw.githubusercontent.com/digitalnativeinc/icons/master/token/ftm.jpg';
const HarmonyLogo =
  'https://raw.githubusercontent.com/digitalnativeinc/icons/master/token/one.jpg';
const HecoLogo =
  'https://raw.githubusercontent.com/digitalnativeinc/icons/master/token/heco.jpg';
const MaticLogo =
  'https://raw.githubusercontent.com/digitalnativeinc/icons/master/token/polygon.jpg';
const MoonbeamLogo =
  'https://raw.githubusercontent.com/digitalnativeinc/icons/master/token/eth.jpg';
const OKExLogo =
  'https://raw.githubusercontent.com/digitalnativeinc/icons/master/token/okt.jpg';
const xDaiLogo =
  'https://raw.githubusercontent.com/digitalnativeinc/assets/master/blockchains/xdai/assets/0xe91D153E0b41518A2Ce8Dd3D7944Fa863463a97d/logo.png';
const CeloLogo =
  'https://raw.githubusercontent.com/digitalnativeinc/icons/master/token/celo.jpg';
const PalmLogo =
  'https://raw.githubusercontent.com/digitalnativeinc/icons/master/token/palm.jpg';
const ShibuyaLogo =
  'https://raw.githubusercontent.com/digitalnativeinc/icons/master/token/sdn.jpg';
const ShidenLogo =
  'https://raw.githubusercontent.com/digitalnativeinc/icons/master/token/sdn.jpg';
const MetisLogo =
  'https://raw.githubusercontent.com/digitalnativeinc/icons/master/token/metis.jpg';

const LOGO: { readonly [chainId in ChainId]?: string } = {
  [ChainId.MAINNET]: EthereumLogo,
  [ChainId.RINKEBY]: EthereumLogo,
  [ChainId.SHIBUYA]: ShibuyaLogo,
  [ChainId.SHIDEN]: ShidenLogo,
  [ChainId.FANTOM]: FantomLogo,
  [ChainId.FANTOM_TESTNET]: FantomLogo,
  [ChainId.MATIC]: MaticLogo,
  [ChainId.MATIC_TESTNET]: MaticLogo,
  [ChainId.XDAI]: xDaiLogo,
  [ChainId.BSC]: BinanceCoinLogo,
  [ChainId.BSC_TESTNET]: BinanceCoinLogo,
  [ChainId.MOONBEAM_TESTNET]: MoonbeamLogo,
  [ChainId.AVALANCHE]: AvalancheLogo,
  [ChainId.AVALANCHE_TESTNET]: AvalancheLogo,
  [ChainId.HECO]: HecoLogo,
  [ChainId.HECO_TESTNET]: HecoLogo,
  [ChainId.HARMONY]: HarmonyLogo,
  [ChainId.HARMONY_TESTNET]: HarmonyLogo,
  [ChainId.OKEX]: OKExLogo,
  [ChainId.OKEX_TESTNET]: OKExLogo,
  [ChainId.ARBITRUM]: EthereumLogo,
  [ChainId.ARBITRUM_TESTNET]: EthereumLogo,
  [ChainId.CELO]: CeloLogo,
  [ChainId.PALM]: PalmLogo,
  [ChainId.PALM_TESTNET]: PalmLogo,
  [ChainId.METIS]: MetisLogo,
};

interface SimpleCurrenyLogoProps {
  symbol?: string;
  id?: string;
  size?: string | number;
  style?: React.CSSProperties;
  className?: string;
  chainId?: number;
  squared?: boolean;
}

export const SimpleCurrencyLogo: FunctionComponent<SimpleCurrenyLogoProps> = ({
  symbol,
  id,
  size = '24px',
  style,
  className = '',
  ...rest
}) => {
  const { chainId } = useActiveWeb3React();

  const srcs = useMemo(() => {
    if (id?.toLowerCase() === WNATIVE[chainId].address.toLowerCase()) {
      return [LOGO[chainId], unknown];
    }

    return getTokenUrls(chainId, id, symbol);
  }, [symbol, id, chainId]);

  return (
    <SequentialLogo
      srcs={srcs}
      width={size}
      height={size}
      alt={symbol ?? id}
      className={className}
      {...rest}
    />
  );
};
