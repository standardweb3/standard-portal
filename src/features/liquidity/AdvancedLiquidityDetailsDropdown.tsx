import {
  AdvancedLiquidityDetails,
  AdvancedLiquidityDetailsProps,
} from './AdvancedLiquidityDetails';

import React from 'react';
import styled from '@emotion/styled';

const AdvancedDetailsFooter = styled.div<{ show: boolean }>`
  padding-top: calc(16px + 2rem);
  padding-bottom: 16px;
  margin-top: -2rem;
  width: 100%;
  border-bottom-left-radius: 20px;
  border-bottom-right-radius: 20px;
  background-color: #202231;
  z-index: -1;

  transform: ${({ show }) => (show ? 'translateY(0%)' : 'translateY(-100%)')};
  transition: transform 300ms ease-in-out;
`;

export default function AdvancedSwapDetailsDropdown({
  show,
  ...rest
}: AdvancedLiquidityDetailsProps) {
  return (
    <AdvancedDetailsFooter show={Boolean(show)}>
      <AdvancedLiquidityDetails {...rest} />
    </AdvancedDetailsFooter>
  );
}
