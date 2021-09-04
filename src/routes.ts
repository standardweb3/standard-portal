import swapIconActive from '../public/icons/filled/Swap.svg';
import swapIcon from '../public/icons/outlined/Swap.svg';

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
    icon: swapIcon,
    iconActive: swapIconActive,
  },
];
