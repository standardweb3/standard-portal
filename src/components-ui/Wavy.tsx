import styled from '@emotion/styled';

export const WavyDiv = styled.div`
  position: relative;
  overflow: hidden;

  &:before {
    content: '';
    position: absolute;
    width: 799.5px;
    height: 799px;
    z-index: 100;
    top: -125px;
    left: -200px;
    background-repeat: no-repeat;
    background-image: url('/img/waves.png');
    background-size: contain;

    // -webkit-transform: rotate(-34.72deg);
    // -moz-transform: rotate(-34.72deg);
    // -ms-transform: rotate(-34.72deg);
    // -o-transform: rotate(-34.72deg);
    // transform: rotate(-34.72deg);
  }
`;
