/** @jsxImportSource @emotion/react */
import Image from 'next/image';
import { css, keyframes } from '@emotion/react';
import styled from '@emotion/styled';

import LogoPrimary from '../../../public/img/logos/logo.primary.png';

export type LogoCrumbleProps = {
  className?: string;
  width: number;
  height: number;
};

export function LogoCrumble({ className, width, height }: LogoCrumbleProps) {
  return (
    <CrumbleWrapper className={className}>
      <Image src={LogoPrimary} width={width} height={height} />
    </CrumbleWrapper>
  );
}

const crumble = keyframes`
  0% {
  }
  100% {
    filter: grayscale(100%);
  }
  `;

const CrumbleWrapper = styled.div<{ rot?: boolean }>`
  width: 100%;
  height: 100%;
  display: inline-flex;
  justify-content: center;
  ${css`
    animation: ${crumble} 0.5s cubic-bezier(0, 0.2, 0.8, 1) normal forwards;
  `}
`;
