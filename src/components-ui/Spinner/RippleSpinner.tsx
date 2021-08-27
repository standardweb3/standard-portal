/** @jsxImportSource @emotion/react */
import { css, keyframes } from '@emotion/react';
import styled from '@emotion/styled';
import { classNames } from '../../functions';

export type RippleSpinnerProps = {
  rippleClassName?: string;
  size: number;
};

export function RippleSpinner({ rippleClassName, size }: RippleSpinnerProps) {
  return (
    <RippleWrapper
      css={css`
        width: ${size}px;
        height: ${size}px;
      `}
    >
      <div className={classNames('ripple', rippleClassName)}></div>
      <div className={classNames('ripple', rippleClassName)}></div>
    </RippleWrapper>
  );
}

const ripple = keyframes`
  0% {
    width: 0;
    height: 0;
    opacity: 1;
  }
  100% {
    width: 150%;
    height: 150%;
    opacity: 0;
  }
  `;

const RippleWrapper = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  position: relative;
  .ripple {
    position: absolute;
    border: 2px solid;
    opacity: 1;
    border-radius: 50%;
    ${css`
      animation: ${ripple} 2s cubic-bezier(0, 0.2, 0.8, 1) infinite;
    `}
  }

  .ripple:nth-of-type(2) {
    animation-delay: -1s;
  }
`;
