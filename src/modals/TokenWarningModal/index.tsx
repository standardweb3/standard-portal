import React, { useCallback } from 'react';
import { Token } from '@digitalnative/standard-protocol-sdk';

import { ImportToken } from '../SearchModal/ImportToken';
import { Modal } from '../../components-ui/Modal';

export default function TokenWarningModal({
  isOpen,
  tokens,
  onConfirm,
}: {
  isOpen: boolean;
  tokens: Token[];
  onConfirm: () => void;
}) {
  const handleDismiss = useCallback(() => null, []);

  return (
    <Modal isOpen={isOpen} onDismiss={handleDismiss} maxWidth="500px">
      <ImportToken tokens={tokens} handleCurrencySelect={onConfirm} />
    </Modal>
  );
}
