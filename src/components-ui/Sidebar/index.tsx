import { Logo } from '../Logo';
import { ConnectionStatus } from '../ConnectionStatus';
import { useActiveWeb3React } from '../../hooks';
import { NetworkStatus } from '../NetworkStatus';
import { SidebarNavigation } from './SidebarNavigation';
import { sidebarRoutes } from '../../routes';
import { Socials } from '../Socials';
import Switchere from '../Switchere';

export function Sidebar() {
  const { chainId, library } = useActiveWeb3React();

  return (
    <div
      className="
      no-scrollbar
      relative
      bg-background 
      min-w-[194px]
      h-full
      text-text
      flex
      flex-col 
      justify-between
      overflow-auto
    "
    >
      <div className="py-8">
        <div className="relative w-[164px] px-4">
          <Logo />
        </div>
        <div className="space-y-4 py-2 px-4 mt-4">
          {library && library.provider.isMetaMask && <NetworkStatus />}
          <ConnectionStatus />
          <Switchere />
        </div>
        <div className="py-2">
          <SidebarNavigation routes={sidebarRoutes} chainId={chainId} />
        </div>
      </div>
      <div className="px-4 py-8 w-full space-y-4">
        <Socials />
      </div>
    </div>
  );
}
