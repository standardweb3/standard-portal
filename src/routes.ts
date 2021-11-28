import swapIcon from '../public/icons/swap.svg';
import farmIcon from '../public/icons/farm.svg';
import poolIcon from '../public/icons/pool.svg';
import dividendIcon from '../public/icons/dividend.svg';
import dividendv1Icon from '../public/icons/dividendv1.svg';
import bridgeIcon from '../public/icons/bridge.svg';
import migrateIcon from '../public/icons/migrate.svg';
import routerIcon from '../public/icons/router.svg';

import { ChainId } from '@digitalnative/standard-protocol-sdk';

export const chainIdGuardRedirect = {
  [ChainId.MAINNET]: '/trade',
  [ChainId.SHIDEN]: '/trade',
  [ChainId.BSC]: '/router',
  [ChainId.MATIC]: '/router',
};

export const sidebarRoutes = [
  {
    name: 'Trade',
    urls: ['/trade', '/add', 'liquidity'],
    icon: swapIcon,
    iconActive: swapIcon,
    hidden: [ChainId.MATIC, ChainId.BSC],
  },
  {
    name: 'Pool',
    urls: ['/pool'],
    icon: poolIcon,
    iconActive: poolIcon,
    hidden: [ChainId.MATIC, ChainId.BSC],
  },

  {
    name: 'Farm',
    urls: ['/farm'],
    icon: farmIcon,
    iconActive: farmIcon,
    hidden: [ChainId.MATIC, ChainId.BSC],
  },
  {
    name: 'Dividend',
    urls: ['/dividend'],
    icon: dividendIcon,
    iconActive: dividendIcon,
    // hidden: [ChainId.SHIDEN],
    hidden: [ChainId.MATIC, ChainId.BSC],
  },
  {
    name: 'Dividend V1',
    urls: ['/v1dividend'],
    icon: dividendv1Icon,
    iconActive: dividendv1Icon,
    hidden: [ChainId.MAINNET, ChainId.MATIC, ChainId.BSC],
  },
  {
    name: 'Bridge',
    urls: ['/bridge'],
    icon: bridgeIcon,
    iconActive: bridgeIcon,
    // hidden: [ChainId.SHIDEN],
    // hidden: [],
  },
  {
    name: 'Router',
    urls: ['/router'],
    icon: routerIcon,
    iconActive: routerIcon,
    // hidden: [ChainId.SHIDEN],
  },
  {
    name: 'Migrate',
    urls: ['/migrate'],
    icon: migrateIcon,
    iconActive: migrateIcon,
    hidden: [ChainId.MATIC, ChainId.BSC],
    // hidden: [ChainId.SHIDEN],
  },
];
