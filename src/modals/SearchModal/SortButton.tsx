import React from 'react';
import styled from '@emotion/styled';

export const FilterWrapper = styled.div`
  display: flex;
  align-items: center;
  padding: 8px;
  border-radius: 8px;
  user-select: none;
  & > * {
    user-select: none;
  }
  :hover {
    cursor: pointer;
  }
`;

export default function SortButton({
  toggleSortOrder,
  ascending,
}: {
  toggleSortOrder: () => void;
  ascending: boolean;
}) {
  return (
    <FilterWrapper onClick={toggleSortOrder} className="text-sm bg-dark-800">
      {ascending ? '↑' : '↓'}
    </FilterWrapper>
  );
}
