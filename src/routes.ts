import swapIcon from '../public/icons/swap.svg';
import farmIcon from '../public/icons/farm.svg';
import poolIcon from '../public/icons/pool.svg';
import dividendIcon from '../public/icons/dividend.svg';
import dividendv1Icon from '../public/icons/dividendv1.svg';
import bridgeIcon from '../public/icons/bridge.svg';
import migrateIcon from '../public/icons/migrate.svg';
import { ChainId } from '@digitalnative/standard-protocol-sdk';

export const sidebarRoutes = [
  {
    name: 'Trade',
    urls: ['/trade', '/add', 'liquidity'],
    icon: swapIcon,
    iconActive: swapIcon,
  },
  {
    name: 'Pool',
    urls: ['/pool'],
    icon: poolIcon,
    iconActive: poolIcon,
  },

  {
    name: 'Farm',
    urls: ['/farmv2'],
    icon: farmIcon,
    iconActive: farmIcon,
    // hidden: [ChainId.SHIBUYA],
  },
  {
    name: 'Dividend',
    urls: ['/dividend'],
    icon: dividendIcon,
    iconActive: dividendIcon,
    // hidden: [ChainId.SHIDEN],
  },
  {
    name: 'Dividend V1',
    urls: ['/v1dividend'],
    icon: dividendv1Icon,
    iconActive: dividendv1Icon,
    hidden: [ChainId.MAINNET],
  },
  {
    name: 'Bridge',
    urls: ['/bridge'],
    icon: bridgeIcon,
    iconActive: bridgeIcon,
    // hidden: [ChainId.SHIDEN],
  },
  {
    name: 'Migrate',
    urls: ['/migrate'],
    icon: migrateIcon,
    iconActive: migrateIcon,
    // hidden: [ChainId.SHIDEN],
  },
];
