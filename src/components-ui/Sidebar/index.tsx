import { css, useTheme } from '@emotion/react';
import styled from '@emotion/styled';
import { Logo } from '../Logo';
import { mq } from '../../theme/breakpoints';
import { Button } from '../Button';
import { ConnectionStatus } from '../ConnectionStatus';
import { useActiveWeb3React } from '../../hooks';
import { useETHBalances } from '../../state/wallet/hooks';
import { NetworkStatus } from '../NetworkStatus';
import { ParticlesBackground, ParticlesBackgroundMemoized } from '../Particles';
import { networkModalParticles } from '../../theme/particles';
import { SidebarNavigation } from './SidebarNavigation';
import { sidebarRoutes } from '../../routes';

export function Sidebar() {
  const theme = useTheme();
  const { account, chainId, library } = useActiveWeb3React();
  const userEthBalance = useETHBalances(account ? [account] : [])?.[
    account ?? ''
  ];

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
        <SidebarNavigation routes={sidebarRoutes} />
      </div>
    </div>
  );
}
