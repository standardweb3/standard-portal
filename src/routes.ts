import swapIcon from '../public/icons/swap.svg';
import farmIcon from '../public/icons/farm.svg';
import poolIcon from '../public/icons/pool.svg';
import dividendIcon from '../public/icons/dividend.svg';
import dividendv1Icon from '../public/icons/dividendv1.svg';
import bridgeIcon from '../public/icons/bridge.svg';
import migrateIcon from '../public/icons/migrate.svg';
import routerIcon from '../public/icons/router.svg';
import dashboardIcon from '../public/icons/dashboard.svg';
import vaultIcon from '../public/icons/vault.svg';
import borrowIcon from '../public/icons/borrow.svg';
import ammsIcon from '../public/icons/amms.svg';
import explorerIcon from '../public/icons/explorer.svg';
import campaignIcon from '../public/icons/campaign.svg';

import { ChainId } from '@digitalnative/standard-protocol-sdk';

export const chainIdGuardRedirect = {
  [ChainId.MAINNET]: '/trade',
  [ChainId.SHIDEN]: '/trade',
  [ChainId.BSC]: '/router',
  [ChainId.MATIC]: '/router',
  [ChainId.METIS]: '/dashboard',
  [ChainId.RINKEBY]: '/dashboard',
};

export const sidebarRoutes = [
  {
    name: 'Dashboard',
    urls: ['/dashboard'],
    icon: dashboardIcon,
    iconActive: dashboardIcon,
    hidden: [ChainId.MATIC, ChainId.BSC, ChainId.MAINNET],
  },

  {
    name: 'Borrow',
    urls: ['/borrow'],
    icon: borrowIcon,
    iconActive: borrowIcon,
    hidden: [ChainId.MATIC, ChainId.BSC, ChainId.MAINNET],
  },
  {
    name: 'Vaults',
    urls: ['/vaults'],
    icon: vaultIcon,
    iconActive: vaultIcon,
    hidden: [ChainId.MATIC, ChainId.BSC, ChainId.MAINNET],
  },
  {
    name: 'AMMs',
    urls: ['/amms'],
    icon: ammsIcon,
    iconActive: ammsIcon,
    hidden: [ChainId.MATIC, ChainId.BSC, ChainId.MAINNET],
  },

  {
    name: 'Explorer',
    urls: ['/explorer'],
    icon: explorerIcon,
    iconActive: explorerIcon,
    hidden: [ChainId.MATIC, ChainId.BSC, ChainId.MAINNET],
  },
  {
    name: 'Campaign',
    urls: ['/campaign'],
    icon: campaignIcon,
    iconActive: campaignIcon,
    hidden: [
      ChainId.MATIC,
      ChainId.MAINNET,
      ChainId.BSC,
      ChainId.SHIDEN,
      ChainId.METIS,
    ],
  },
  {
    name: 'Divider',
    hidden: [ChainId.MATIC, ChainId.BSC, ChainId.MAINNET, ChainId.SHIDEN],
  },
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
    name: 'Divider',
    hidden: [ChainId.BSC, ChainId.MATIC, ChainId.RINKEBY],
  },
  {
    name: 'Farm',
    urls: ['/farm'],
    icon: farmIcon,
    iconActive: farmIcon,
    hidden: [ChainId.MATIC, ChainId.BSC, ChainId.RINKEBY],
  },

  {
    name: 'Divider',
    hidden: [ChainId.BSC, ChainId.MATIC, ChainId.RINKEBY],
  },
  {
    name: 'Dividend',
    urls: ['/dividend'],
    icon: dividendIcon,
    iconActive: dividendIcon,
    hidden: [ChainId.MATIC, ChainId.BSC, ChainId.RINKEBY, ChainId.METIS],
  },
  {
    name: 'Dividend V1',
    urls: ['/v1dividend'],
    icon: dividendv1Icon,
    iconActive: dividendv1Icon,
    hidden: [
      ChainId.MAINNET,
      ChainId.MATIC,
      ChainId.BSC,
      ChainId.METIS,
      ChainId.RINKEBY,
    ],
  },
  {
    name: 'Divider',
    hidden: [ChainId.BSC, ChainId.MATIC, ChainId.METIS, ChainId.RINKEBY],
  },
  {
    name: 'Bridge',
    urls: ['/bridge'],
    icon: bridgeIcon,
    iconActive: bridgeIcon,
    hidden: [ChainId.RINKEBY],
    // hidden: [],
  },
  {
    name: 'Router',
    urls: ['/router'],
    icon: routerIcon,
    iconActive: routerIcon,
    hidden: [ChainId.RINKEBY],
  },
  {
    name: 'Divider',
    hidden: [
      ChainId.BSC,
      ChainId.MATIC,
      ChainId.METIS,
      ChainId.SHIDEN,
      ChainId.RINKEBY,
    ],
  },
  {
    name: 'Migrate',
    urls: ['/migrate'],
    icon: migrateIcon,
    iconActive: migrateIcon,
    hidden: [
      ChainId.MATIC,
      ChainId.BSC,
      ChainId.SHIDEN,
      ChainId.METIS,
      ChainId.RINKEBY,
    ],
    // hidden: [ChainId.SHIDEN],
  },
];
