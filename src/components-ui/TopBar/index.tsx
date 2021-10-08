import { Logo } from '../Logo';
import { useActiveWeb3React } from '../../hooks';
import { useETHBalances } from '../../state/wallet/hooks';
import { sidebarRoutes } from '../../routes';
import { TopBarNavigation } from '../TopBarNavigation/TopBarNavigation';
import { useCallback, useState } from 'react';
import { MenuIcon } from '@heroicons/react/outline';
import { Slider } from '../Slider';
import { ModalHeader } from '../Modal/ModalHeader';
import NetworkDropDown from '../Dropdown/NetworkDropDown';

export function TopBar() {
  const { account, chainId, library } = useActiveWeb3React();
  const userEthBalance = useETHBalances(account ? [account] : [])?.[
    account ?? ''
  ];

  const [menuOpen, setMenuOpen] = useState<boolean>(false);
  const handleMenuOpen = useCallback(() => setMenuOpen(true), []);
  const handleMenuDismiss = useCallback(() => setMenuOpen(false), []);

  return (
    <>
      <div
        className="
      flex
      items-center
      relative
      py-3 px-8
      bg-transparent
      w-full
      text-text
      justify-between
    "
      >
        <div className="relative">
          <Logo short />
        </div>
        {library && library.provider.isMetaMask && <NetworkDropDown />}
        <div onClick={handleMenuOpen} className="cursor-pointer">
          <MenuIcon className="w-6 h-6" />
        </div>
      </div>
      <Slider isOpen={menuOpen}>
        <div className="p-8 w-full text-text space-y-4">
          <ModalHeader
            title={<Logo height="31px" width="128px" />}
            onClose={handleMenuDismiss}
            className="text-text"
            xIconClassName="!w-8 !h-8"
          />
          <TopBarNavigation
            onRouteClick={handleMenuDismiss}
            routes={sidebarRoutes}
            chainId={chainId}
          />
        </div>
      </Slider>
    </>
  );
}
