import swapIconActive from '../public/icons/swap.svg';
import swapIcon from '../public/icons/swap.svg';
import farmIconActive from '../public/icons/farm.svg';
import farmIcon from '../public/icons/farm.svg';
import poolIconActive from '../public/icons/pool.svg';
import poolIcon from '../public/icons/pool.svg';
import dividendIconActive from '../public/icons/dividend.svg';
import dividendIcon from '../public/icons/dividend.svg';
import bridgeIcon from '../public/icons/bridge.svg';

export const sidebarRoutes = [
  {
    name: 'Swap',
    urls: ['/swap', '/add', 'liquidity'],
    icon: swapIcon,
    iconActive: swapIconActive,
  },
  {
    name: 'Pool',
    urls: ['/pool'],
    icon: poolIcon,
    iconActive: poolIconActive,
  },

  {
    name: 'Farm',
    urls: ['/farm'],
    icon: farmIcon,
    iconActive: farmIconActive,
    // hidden: [ChainId.SHIBUYA],
  },
  {
    name: 'Dividend',
    urls: ['/dividend'],
    icon: dividendIcon,
    iconActive: dividendIconActive,
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
