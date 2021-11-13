import swapIcon from '../public/icons/swap.svg';
import farmIcon from '../public/icons/farm.svg';
import poolIcon from '../public/icons/pool.svg';
import dividendIcon from '../public/icons/dividend.svg';
import bridgeIcon from '../public/icons/bridge.svg';

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
    urls: ['/farm'],
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
    name: 'Bridge',
    urls: ['/bridge'],
    icon: bridgeIcon,
    iconActive: bridgeIcon,
    // hidden: [ChainId.SHIDEN],
  },
];
