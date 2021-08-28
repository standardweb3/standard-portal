import { css, keyframes } from '@emotion/react';
import styled from '@emotion/styled';
import { classNames } from '../../functions';

export type WavySpinnerProps = {
  className?: string;
};

export function WavySpinner({ className = 'bg-blue' }: WavySpinnerProps) {
  return (
    <WavesWrapper>
      <div className={classNames('wave', className)}></div>
      <div className={classNames('wave', className)}></div>
      <div className={classNames('wave', className)}></div>
      <div className={classNames('wave', className)}></div>
      <div className={classNames('wave', className)}></div>
      <div className={classNames('wave', className)}></div>
      <div className={classNames('wave', className)}></div>
      <div className={classNames('wave', className)}></div>
      <div className={classNames('wave', className)}></div>
      <div className={classNames('wave', className)}></div>
    </WavesWrapper>
  );
}

const wavy = keyframes`
    0% {
      transform: scale(0);
    }
    50% {
      transform: scale(1);
    }
    100% {
      transform: scale(0);
    }
  `;

const WavesWrapper = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  .wave {
    width: 7px;
    height: 30px;
    margin: 10px;
    ${css`
      animation: ${wavy} 2s ease infinite;
    `}
    border-radius: 20px;
  }

  .wave:nth-of-type(2) {
    animation-delay: 0.1s;
  }
  .wave:nth-of-type(3) {
    animation-delay: 0.3s;
  }
  .wave:nth-of-type(4) {
    animation-delay: 0.5s;
  }
  .wave:nth-of-type(5) {
    animation-delay: 0.7s;
  }
  .wave:nth-of-type(6) {
    animation-delay: 0.9s;
  }
  .wave:nth-of-type(7) {
    animation-delay: 1.1s;
  }
  .wave:nth-of-type(8) {
    animation-delay: 1.3s;
  }
  .wave:nth-of-type(9) {
    animation-delay: 1.5s;
  }
  .wave:nth-of-type(10) {
    animation-delay: 1.7s;
  }
`;
