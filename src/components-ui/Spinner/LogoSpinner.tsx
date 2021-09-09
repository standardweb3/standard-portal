/** @jsxImportSource @emotion/react */
import Image from 'next/image';
import { css, keyframes } from '@emotion/react';
import styled from '@emotion/styled';
import { classNames } from '../../functions';

import LogoPrimary from '../../../public/img/logos/logo.primary.png';

export type LogoSpinnerProps = {
  className?: string;
  width: number;
  height: number;
  rot?: boolean;
};

export function LogoSpinner({
  className,
  width,
  height,
  rot,
}: LogoSpinnerProps) {
  return (
    <div
      css={css`
        width: ${width}px;
        height: ${height}px;
      `}
    >
      {rot ? (
        <RotWrapper className={className} rot={rot}>
          <Image src={LogoPrimary} width="100%" height="100%" />
        </RotWrapper>
      ) : (
        <PumpWrapper className={className} rot={rot}>
          <Image src={LogoPrimary} width="100%" height="100%" />
        </PumpWrapper>
      )}
    </div>
  );
}

const pump = keyframes`
  0% {
    transform: scale(0.97);
    opacity: 0.8;
  }
  100% {
    transform: scale(1.03);
    opacity: 1;
  }
  `;

const rot = keyframes`
0% {
  transform: scale(0.5) rotate(0deg);
  opacity: 0.5;
}
20% {
  transform: scale(1.0) rotate(360deg);
  opacity: 1;
}
30% {
  opacity: 0.5;
}
100% {
  transform: rotate(360deg);
}
`;

const PumpWrapper = styled.div<{ rot?: boolean }>`
  width: 100%;
  height: 100%;
  display: inline-flex;
  justify-content: center;
  ${css`
    animation: ${pump} 0.75s cubic-bezier(0, 0.2, 0.8, 1) infinite alternate;
  `}
`;

const RotWrapper = styled.div<{ rot?: boolean }>`
  width: 100%;
  height: 100%;
  display: inline-flex;
  justify-content: center;
  ${css`
    animation: ${rot} 2.5s cubic-bezier(0, 0.2, 0.8, 1) infinite normal forwards;
  `}
`;
