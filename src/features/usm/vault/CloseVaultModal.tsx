import { useContext } from 'react';
import { Modal } from '../../../components-ui/Modal';
import { useSizeSmDown } from '../../../components-ui/Responsive';
import { WavySpinner } from '../../../components-ui/Spinner/WavySpinner';
import { useActiveWeb3React } from '../../../hooks';
import { useUserVaultInfo } from '../useVaultInfo';
import { Close } from './Close';
import { CloseVaultContext } from './CloseVaultContext';

export default function CloseVaultModal({ isOpen, onDismiss, onConfirm }) {
  const { vaultAddress, dismiss } = useContext(CloseVaultContext);

  const vaultInfo = useUserVaultInfo(vaultAddress);

  const isViewportSmallDown = useSizeSmDown();

  return (
    <Modal
      isOpen={isOpen}
      onDismiss={onDismiss}
      maxWidth="500px"
      // minHeight="80vh"
      maxHeight="80vh"
      minWidth={isViewportSmallDown ? '90vw' : 'none'}
    >
      {vaultInfo.loading ? (
        <div>
          <WavySpinner />
        </div>
      ) : (
        <div>
          <Close vaultInfo={vaultInfo} onDismiss={dismiss} />
        </div>
      )}
    </Modal>
  );
}
