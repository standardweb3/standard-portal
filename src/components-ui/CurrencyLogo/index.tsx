import {
  ChainId,
  Currency,
  STND_ADDRESS,
  Token,
  WNATIVE,
} from '@digitalnative/standard-protocol-sdk';
import React, { FunctionComponent, useMemo } from 'react';

import { WrappedTokenInfo } from '../../state/lists/wrappedTokenInfo';
import { getMaticTokenLogoURL } from '../../constants/maticTokenMapping';
import useHttpLocations from '../../hooks/useHttpLocations';
import { SequentialLogo } from '../Logo/SequentialLogo';
import { getAddress } from '@ethersproject/address';

export const getTokenLogoURL = (token: Token, chainId: ChainId) => {
  let imageURL;
  if (chainId === ChainId.MAINNET) {
    imageURL = `https://raw.githubusercontent.com/digitalnativeinc/assets/master/blockchains/ethereum/assets/${token.address}/logo.png`;
  } else if (chainId === ChainId.BSC) {
    imageURL = `https://v1exchange.pancakeswap.finance/images/coins/${token.address}.png`;
  } else if (chainId === ChainId.MATIC) {
    imageURL = getMaticTokenLogoURL(token.address);
  }
  imageURL = `https://raw.githubusercontent.com/digitalnativeinc/icons/master/token/${getCurrencySymbol(
    token,
    chainId,
  )}.jpg`;

  return imageURL;
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

function getCurrencySymbol(currency, chainId) {
  let _symbol;
  if (chainId && chainId === ChainId.METIS) {
    if (currency.symbol.startsWith('m.')) {
      _symbol = currency.symbol.substring(2);
    } else {
      _symbol = currency.symbol;
    }
  } else {
    _symbol = currency.symbol;
  }
  if (_symbol === 'WBTC') {
    return 'btc';
  }
  if (_symbol === 'WETH') {
    return 'eth';
  }
  return _symbol.toLowerCase();
}

function getCurrencyLogoUrls(currency, chainId) {
  const urls = [];

  urls.push(
    `https://raw.githubusercontent.com/digitalnativeinc/icons/master/token/${getCurrencySymbol(
      currency,
      chainId,
    )}.jpg`,
  );
  if (
    STND_ADDRESS[currency.chainId] &&
    getAddress(STND_ADDRESS[currency.chainId]) === getAddress(currency.address)
  )
    urls.push(
      'https://raw.githubusercontent.com/digitalnativeinc/assets/master/blockchains/ethereum/assets/0x9040e237C3bF18347bb00957Dc22167D0f2b999d/logo.png',
    );
  if (currency.chainId in BLOCKCHAIN) {
    urls.push(
      `https://raw.githubusercontent.com/digitalnativeinc/assets/master/blockchains/${
        BLOCKCHAIN[currency.chainId]
      }/assets/${currency.address}/logo.png`,
    );
    urls.push(
      `https://raw.githubusercontent.com/digitalnativeinc/assets/master/blockchains/${
        BLOCKCHAIN[currency.chainId]
      }/assets/${currency.address}/logo.png`,
    );
  }

  return urls;
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

interface CurrencyLogoProps {
  currency?: Currency;
  size?: string | number;
  style?: React.CSSProperties;
  className?: string;
  squared?: boolean;
}

const unknown =
  'https://raw.githubusercontent.com/digitalnativeinc/icons/master/token/unknown.png';

export const CurrencyLogo: FunctionComponent<CurrencyLogoProps> = ({
  currency,
  size = '24px',
  style,
  className = '',
  ...rest
}) => {
  const uriLocations = useHttpLocations(
    currency instanceof WrappedTokenInfo
      ? currency.logoURI || currency.tokenInfo.logoURI
      : undefined,
  );

  const srcs = useMemo(() => {
    if (!currency) {
      return [unknown];
    }

    if (currency.isNative || currency.equals(WNATIVE[currency.chainId])) {
      return [LOGO[currency.chainId], unknown];
    }

    if (currency.isToken) {
      const defaultUrls = [...getCurrencyLogoUrls(currency, currency.chainId)];
      if (currency instanceof WrappedTokenInfo) {
        return [...uriLocations, ...defaultUrls, unknown];
      }
      return defaultUrls;
    }
  }, [currency, uriLocations]);

  return (
    <SequentialLogo
      srcs={srcs}
      width={size}
      height={size}
      alt={currency?.symbol}
      className={className}
      {...rest}
    />
  );
};
