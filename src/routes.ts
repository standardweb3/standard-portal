import swapIconActive from '../public/icons/filled/Swap.svg';
import swapIcon from '../public/icons/outlined/Swap.svg';
import farmIconActive from '../public/icons/filled/Farm.svg';
import farmIcon from '../public/icons/outlined/Farm.svg';
import poolIconActive from '../public/icons/filled/Vault.svg';
import poolIcon from '../public/icons/outlined/Vault.svg';
import dividendIconActive from '../public/icons/filled/Dividend.svg';
import dividendIcon from '../public/icons/outlined/Dividend.svg';

import { ChainId } from '@digitalnative/standard-protocol-sdk';

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
    hidden: [ChainId.SHIDEN, ChainId.SHIBUYA],
  },
  {
    name: 'Dividend',
    urls: ['/dividend'],
    icon: dividendIcon,
    iconActive: dividendIconActive,
    // hidden: [ChainId.SHIDEN],
  },
];
