import { css, useTheme } from '@emotion/react';
import { Logo } from '../Logo';
import { ConnectionStatus } from '../ConnectionStatus';
import { useActiveWeb3React } from '../../hooks';
import { useETHBalances } from '../../state/wallet/hooks';
import { NetworkStatus } from '../NetworkStatus';
import { SidebarNavigation } from './SidebarNavigation';
import { sidebarRoutes } from '../../routes';
import { isMobile } from 'react-device-detect';

export function Sidebar() {
  const theme = useTheme();
  const { account, chainId, library } = useActiveWeb3React();

  return (
    <div
      className="
      relative
      p-8
      bg-background 
      w-[319px]
      h-full
      text-text
    "
    >
      <div className="relative w-[164px]">
        <Logo />
      </div>
      <div className="space-y-4 py-2 mt-4">
        {library && library.provider.isMetaMask && <NetworkStatus />}
        <ConnectionStatus />
      </div>
      <div className="py-2">
        <SidebarNavigation routes={sidebarRoutes} chainId={chainId} />
      </div>
      {/* <div className="flex flex-col">
        <div>{`current: ${protocol}`}</div>
        <button
          onClick={() => {
            switchProtocol(Protocol.SUSHISWAP);
          }}
        >
          sushi
        </button>
        <button
          onClick={() => {
            switchProtocol(Protocol.STANDARD_PROTOCOL);
          }}
        >
          standard
        </button>
      </div> */}
    </div>
  );
}
