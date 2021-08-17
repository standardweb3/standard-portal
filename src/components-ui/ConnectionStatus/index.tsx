import { ReactElement } from 'react';
import WalletModal from '../../modals/WalletModal';
import { WalletConnector } from '../WalletConnector';

export function ConnectionStatus() {
  return (
    <div>
      <WalletConnector />
      <WalletModal />
    </div>
  );
}
