import { css, keyframes } from '@emotion/react';
import styled from '@emotion/styled';

export function BoxSpinner() {
  return (
    <DotWrapper>
      <div className="dot">
        <div />
      </div>
      <div className="dot">
        <div />
      </div>
      <div className="dot">
        <div />
      </div>
      <div className="dot">
        <div />
      </div>
      <div className="dot">
        <div />
      </div>
      <div className="dot">
        <div />
      </div>
      <div className="dot">
        <div />
      </div>
      <div className="dot">
        <div />
      </div>
      <div className="dot">
        <div />
      </div>
    </DotWrapper>
  );
}

const grid = keyframes`
    0% 100% {
      opacity: 1;
    }
    50% {
      opacity: 0.5;
    }
  `;

const DotWrapper = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  width: 16px;
  height: 16px;
  flex-wrap: wrap;
  .dot {
    box-sizing: border-box;
    width: 33.33%;
    height: 33.33%;
    padding: 5%;
    ${css`
      animation: ${grid} 2s ease infinite;
    `}

    & > div {
      width: 100%;
      height: 100%;
      border-radius: 50%;
      background-color: #fff;
    }
  }

  .dot:nth-of-type(2) {
    animation-delay: 0.4s;
  }
  .dot:nth-of-type(3) {
    animation-delay: 0.8s;
  }
  .dot:nth-of-type(4) {
    animation-delay: 0.4s;
  }
  .dot:nth-of-type(5) {
    animation-delay: 0.8;
  }
  .dot:nth-of-type(6) {
    animation-delay: 1.2s;
  }
  .dot:nth-of-type(7) {
    animation-delay: 0.8s;
  }
  .dot:nth-of-type(8) {
    animation-delay: 1.2s;
  }
  .dot:nth-of-type(9) {
    animation-delay: 1.6s;
  }
`;
