import { Logo } from '../Logo';
import { useActiveWeb3React } from '../../hooks';
import { sidebarRoutes } from '../../routes';
import { TopBarNavigation } from '../TopBarNavigation/TopBarNavigation';
import { useCallback, useState } from 'react';
import { ChevronLeftIcon, MenuIcon } from '@heroicons/react/outline';
import { Slider } from '../Slider';
import { ModalHeader } from '../Modal/ModalHeader';
import NetworkDropDown from '../Dropdown/NetworkDropDown';
import { Listings } from '../Listings';
import { ConnectionStatus } from '../ConnectionStatus';
import { StndAdder } from '../TokenAdder/StndAdder';
import { useRouter } from 'next/router';
import { useSizeXs } from '../Responsive';

export function TopBar() {
  const { chainId, library } = useActiveWeb3React();
  const router = useRouter();
  const handleBack = () => {
    router.back();
  };
  const [menuOpen, setMenuOpen] = useState<boolean>(false);
  const handleMenuOpen = useCallback(() => setMenuOpen(true), []);
  const handleMenuDismiss = useCallback(() => setMenuOpen(false), []);

  const isViewportXs = useSizeXs();

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
          <Logo short width="46.5" height="52.5" />
        </div>
        {library && library.provider.isMetaMask && <NetworkDropDown />}
        <div onClick={handleMenuOpen} className="cursor-pointer">
          <MenuIcon className="w-8 h-8" />
        </div>
      </div>
      <Slider isOpen={menuOpen}>
        <div className="p-8 flex flex-col justify-between h-full">
          <div className="w-full text-text space-y-4">
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

          <div className="w-full space-y-4">
            <Listings />
          </div>
        </div>
      </Slider>
      <div className="text-text flex w-fulljustify-between items-center mb-6 px-4 space-x-2">
        <div className="flex-1" onClick={handleBack}>
          <ChevronLeftIcon className="w-6 h-6" />
        </div>
        <ConnectionStatus className="!rounded-20" />
        <StndAdder hideSymbol={isViewportXs} />
      </div>
    </>
  );
}
