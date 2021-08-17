import { css, useTheme } from '@emotion/react';
import styled from '@emotion/styled';
import { Logo } from '../Logo';
import { mq } from '../../theme/breakpoints';
import { Button } from '../Button';
import { ConnectionStatus } from '../ConnectionStatus';

export function Sidebar() {
  const theme = useTheme();
  return (
    <div
      className="
      pl-8 pr-8 pd-8 pt-8
      bg-background 
      w-[279px]
      h-full
    "
    >
      <LogoHolder>
        <Logo />
      </LogoHolder>
      <ConnectionStatusHolder>
        <ConnectionStatus />
      </ConnectionStatusHolder>
    </div>
  );
}
const LogoHolder = styled.div`
  position: relative;
  width: 164px;
`;

const ConnectionStatusHolder = styled.div`
  padding: 1rem 0;
`;
