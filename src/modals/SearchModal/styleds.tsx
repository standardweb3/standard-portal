import styled from '@emotion/styled';

export const ModalInfo = styled.div`
  align-items: center;
  padding: 1rem 1rem;
  margin: 0.25rem 0.5rem;
  justify-content: center;
  flex: 1;
  user-select: none;
`;
export const StyledMenu = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  position: relative;
  border: none;
`;

export const PopoverContainer = styled.div<{ show: boolean }>`
  z-index: 100;
  visibility: ${(props) => (props.show ? 'visible' : 'hidden')};
  opacity: ${(props) => (props.show ? 1 : 0)};
  transition: visibility 150ms linear, opacity 150ms linear;
  box-shadow: 0px 0px 1px rgba(0, 0, 0, 0.01), 0px 4px 8px rgba(0, 0, 0, 0.04),
    0px 16px 24px rgba(0, 0, 0, 0.04), 0px 24px 32px rgba(0, 0, 0, 0.01);
  padding: 1rem;
  display: grid;
  grid-template-rows: 1fr;
  grid-gap: 8px;
  font-size: 1rem;
  text-align: left;
  top: 80px;
`;

export const TextDot = styled.div`
  height: 3px;
  width: 3px;
  border-radius: 50%;
`;

export const FadedSpan = styled.div`
  display: flex;
  align-content: center;
  font-size: 14px;
`;
export const Checkbox = styled.input`
  height: 20px;
  margin: 0;
`;

export const PaddedColumn = styled.div`
  display: grid;
  padding: 20px;
`;

export const MenuItem = styled.div<{ disabled: boolean; selected: boolean }>`
  display: flex;
  align-items: center;
  height: 56px;
  display: grid;
  grid-template-columns: auto minmax(auto, 1fr) auto minmax(0, 72px);
  grid-gap: 16px;
  cursor: ${({ disabled }) => !disabled && 'pointer'};
  // pointer-events: ${({ disabled }) => disabled && 'none'};
  :hover {
  }
  opacity: ${({ disabled, selected }) => (disabled || selected ? 0.5 : 1)};
`;

export const MenuItem2 = styled.div<{ disabled: boolean; selected: boolean }>`
  display: flex;
  align-items: center;
  height: 56px;
  display: grid;
  grid-template-columns: auto minmax(auto, 1fr) minmax(0, 72px);
  grid-gap: 16px;
  cursor: ${({ disabled }) => !disabled && 'pointer'};
  // pointer-events: ${({ disabled }) => disabled && 'none'};
  :hover {
  }
  opacity: ${({ disabled, selected }) => (disabled || selected ? 0.5 : 1)};
`;

export const SearchInput = styled.input`
  position: relative;
  display: flex;
  padding: 16px;
  align-items: center;
  width: 100%;
  white-space: nowrap;
  background: none;
  border: none;
  outline: none;
  border-radius: 10px;
  -webkit-appearance: none;

  font-size: 18px;

  ::placeholder {
  }
  transition: border 100ms;
  :focus {
    outline: none;
  }
`;
export const Separator = styled.div`
  width: 100%;
  height: 1px;
`;

export const SeparatorDark = styled.div`
  width: 100%;
  height: 1px;
`;
