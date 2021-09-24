import {
  ChainId,
  Currency,
  STND_ADDRESS,
  WNATIVE,
} from '@digitalnative/standard-protocol-sdk';
import React, { FunctionComponent, useMemo } from 'react';

import { WrappedTokenInfo } from '../../state/lists/wrappedTokenInfo';
import { getMaticTokenLogoURL } from '../../constants/maticTokenMapping';
import useHttpLocations from '../../hooks/useHttpLocations';
import { SequentialLogo } from '../Logo/SequentialLogo';
import { getAddress } from '@ethersproject/address';

export const getTokenLogoURL = (address: string, chainId: ChainId) => {
  let imageURL;
  if (chainId === ChainId.MAINNET) {
    imageURL = `https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/ethereum/assets/${address}/logo.png`;
  } else if (chainId === ChainId.BSC) {
    imageURL = `https://v1exchange.pancakeswap.finance/images/coins/${address}.png`;
  } else if (chainId === ChainId.MATIC) {
    imageURL = getMaticTokenLogoURL(address);
  }
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

function getCurrencySymbol(currency) {
  if (currency.symbol === 'WBTC') {
    return 'btc';
  }
  if (currency.symbol === 'WETH') {
    return 'eth';
  }
  return currency.symbol.toLowerCase();
}

function getCurrencyLogoUrls(currency) {
  const urls = [];

  urls.push(
    `https://raw.githubusercontent.com/sushiswap/icons/master/token/${getCurrencySymbol(
      currency,
    )}.jpg`,
  );
  if (
    getAddress(STND_ADDRESS[currency.chainId]) === getAddress(currency.address)
  )
    urls.push(
      'https://raw.githubusercontent.com/sushiswap/assets/master/blockchains/ethereum/assets/0x9040e237C3bF18347bb00957Dc22167D0f2b999d/logo.png',
    );
  if (currency.chainId in BLOCKCHAIN) {
    urls.push(
      `https://raw.githubusercontent.com/sushiswap/assets/master/blockchains/${
        BLOCKCHAIN[currency.chainId]
      }/assets/${currency.address}/logo.png`,
    );
    urls.push(
      `https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/${
        BLOCKCHAIN[currency.chainId]
      }/assets/${currency.address}/logo.png`,
    );
  }

  return urls;
}

const AvalancheLogo =
  'https://raw.githubusercontent.com/sushiswap/icons/master/token/avax.jpg';
const BinanceCoinLogo =
  'https://raw.githubusercontent.com/sushiswap/icons/master/token/bnb.jpg';
const EthereumLogo =
  'https://raw.githubusercontent.com/sushiswap/icons/master/token/eth.jpg';
const FantomLogo =
  'https://raw.githubusercontent.com/sushiswap/icons/master/token/ftm.jpg';
const HarmonyLogo =
  'https://raw.githubusercontent.com/sushiswap/icons/master/token/one.jpg';
const HecoLogo =
  'https://raw.githubusercontent.com/sushiswap/icons/master/token/heco.jpg';
const MaticLogo =
  'https://raw.githubusercontent.com/sushiswap/icons/master/token/polygon.jpg';
const MoonbeamLogo =
  'https://raw.githubusercontent.com/sushiswap/icons/master/token/eth.jpg';
const OKExLogo =
  'https://raw.githubusercontent.com/sushiswap/icons/master/token/okt.jpg';
const xDaiLogo =
  'https://raw.githubusercontent.com/sushiswap/assets/master/blockchains/xdai/assets/0xe91D153E0b41518A2Ce8Dd3D7944Fa863463a97d/logo.png';
const CeloLogo =
  'https://raw.githubusercontent.com/sushiswap/icons/master/token/celo.jpg';
const PalmLogo =
  'https://raw.githubusercontent.com/sushiswap/icons/master/token/palm.jpg';
<<<<<<< HEAD
const ShibuyaLogo = 'https://i.imgur.com/6jt5GV1.png';
=======
const ShibuyaLogo = 'https://i.imgur.com/offavOc.png';
const ShidenLogo = 'https://i.imgur.com/9Q7jzvX.jpg'
>>>>>>> 62ff1ee2e97cc4f6856d6ec82bd93e4c60cbce9e

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
};

interface CurrencyLogoProps {
  currency?: Currency;
  size?: string | number;
  style?: React.CSSProperties;
  className?: string;
  squared?: boolean;
}

const unknown =
  'https://raw.githubusercontent.com/sushiswap/icons/master/token/unknown.png';

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
      const defaultUrls = [...getCurrencyLogoUrls(currency)];
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
