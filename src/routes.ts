import swapIcon from '../public/icons/swap.svg';
import farmIcon from '../public/icons/farm.svg';
import poolIcon from '../public/icons/pool.svg';
import dividendIcon from '../public/icons/dividend.svg';
import dividendv1Icon from '../public/icons/dividendv1.svg';
import bridgeIcon from '../public/icons/bridge.svg';
import routerIcon from '../public/icons/router.svg';
import migrateIcon from '../public/icons/migrate.svg';
import forumIcon from '../public/icons/forum.svg';
import govIcon from '../public/icons/governance.svg';
import docsIcon from '../public/icons/docs.svg';

import { ChainId } from '@digitalnative/standard-protocol-sdk';

export const chainIdGuardRedirect = {
  [ChainId.MAINNET]: '/trade',
  [ChainId.SHIDEN]: '/trade',
  [ChainId.BSC]: '/router',
  [ChainId.MATIC]: '/router',
  [ChainId.METIS]: '/trade',
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
    name: 'Divider',
    hidden: [ChainId.BSC, ChainId.MATIC],
  },
  {
    name: 'Farm',
    urls: ['/farm'],
    icon: farmIcon,
    iconActive: farmIcon,
    hidden: [ChainId.MATIC, ChainId.BSC],
  },

  {
    name: 'Divider',
    hidden: [ChainId.BSC, ChainId.MATIC],
  },
  {
    name: 'Dividend',
    urls: ['/dividend'],
    icon: dividendIcon,
    iconActive: dividendIcon,
    // hidden: [ChainId.SHIDEN],
    hidden: [ChainId.MATIC, ChainId.BSC, ChainId.METIS],
  },
  {
    name: 'Dividend V1',
    urls: ['/v1dividend'],
    icon: dividendv1Icon,
    iconActive: dividendv1Icon,
    hidden: [ChainId.MAINNET, ChainId.MATIC, ChainId.BSC, ChainId.METIS],
  },
  {
    name: 'Divider',
    hidden: [ChainId.BSC, ChainId.MATIC, ChainId.METIS],
  },
  {
    name: 'Bridge',
    urls: ['/bridge'],
    icon: bridgeIcon,
    iconActive: bridgeIcon,
    hidden: [],
    // hidden: [],
  },
  {
    name: 'Router',
    urls: ['/router'],
    icon: routerIcon,
    iconActive: routerIcon,
    hidden: [],
  },
  {
    name: 'Divider',
    hidden: [ChainId.BSC, ChainId.MATIC, ChainId.METIS, ChainId.SHIDEN],
  },
  {
    name: 'Migrate',
    urls: ['/migrate'],
    icon: migrateIcon,
    iconActive: migrateIcon,
    hidden: [ChainId.MATIC, ChainId.BSC, ChainId.SHIDEN, ChainId.METIS],
    // hidden: [ChainId.SHIDEN],
  },
  {
    name: 'Divider',
    hidden: [],
  },
  {
    name: 'Forum',
    urls: ['https://forum.standard.tech'],
    icon: forumIcon,
    external: true,
    iconActive: forumIcon,
    hidden: [],
    // hidden: [ChainId.SHIDEN],
  },
  {
    name: 'Governance',
    urls: ['https://snapshot.org/#/stndgov.eth'],
    icon: govIcon,
    external: true,
    iconActive: govIcon,
    hidden: [],
    // hidden: [ChainId.SHIDEN],
  },
  {
    name: 'Docs',
    urls: ['https://docs.standard.tech'],
    icon: docsIcon,
    external: true,
    iconActive: docsIcon,
    hidden: [],
    // hidden: [ChainId.SHIDEN],
  },
];