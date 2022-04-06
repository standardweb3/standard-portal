import { createContext, useEffect, useState } from 'react';

const initialState = {
  isOpen: false,
  dismiss: undefined,
  vaultAddress: undefined,
  setVaultAddress: undefined,
  setOpen: undefined,
};

export const CloseVaultContext = createContext(initialState);

export const useCloseVaultState = () => {
  const [vaultAddress, setVaultAddress] = useState(undefined);
  const [isOpen, setIsOpen] = useState(false);

  const dismiss = () => setIsOpen(false);
  const setOpen = (vaultAddress) => {
    if (vaultAddress) {
      setVaultAddress(vaultAddress);
    }
    setIsOpen(true);
  };

  return {
    vaultAddress,
    isOpen,
    dismiss,
    setVaultAddress,
    setOpen,
  };
};
