import { css, keyframes } from '@emotion/react';
import styled from '@emotion/styled';

export function WavySpinner() {
  return (
    <WavesWrapper>
      <div className="wave bg-background"></div>
      <div className="wave bg-background"></div>
      <div className="wave bg-background"></div>
      <div className="wave bg-background"></div>
      <div className="wave bg-background"></div>
      <div className="wave bg-background"></div>
      <div className="wave bg-background"></div>
      <div className="wave bg-background"></div>
      <div className="wave bg-background"></div>
      <div className="wave bg-background"></div>
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
    &:nth-child(2) {
      animation-delay: 0.1s;
    }
    &:nth-child(3) {
      animation-delay: 0.3s;
    }
    &:nth-child(4) {
      animation-delay: 0.5s;
    }
    &:nth-child(5) {
      animation-delay: 0.7s;
    }
    &:nth-child(6) {
      animation-delay: 0.9s;
    }
    &:nth-child(7) {
      animation-delay: 1.1s;
    }
    &:nth-child(8) {
      animation-delay: 1.3s;
    }
    &:nth-child(9) {
      animation-delay: 1.5s;
    }
    &:nth-child(10) {
      animation-delay: 1.7s;
    }
  }
`;
