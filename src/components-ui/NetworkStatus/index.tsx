import Image from 'next/image';

// constants
import { NETWORK_ICON, NETWORK_LABEL } from '../../constants/networks';

// hooks
import { useActiveWeb3React } from '../../hooks';
// network modal
import NetworkModal from '../../modals/NetworkModal';
import { unknown } from '../../pages/router';
import { useNetworkModalToggle } from '../../state/application/hooks';

export function NetworkStatus() {
  const { chainId } = useActiveWeb3React();

  const toggleNetworkModal = useNetworkModalToggle();

  if (!chainId) return null;

  return (
    <div
      className={`
        flex items-center rounded-xl 
        bg-background-modal-inner
        px-3 py-2
        text-sm
        cursor-pointer
      `}
      onClick={() => toggleNetworkModal()}
    >
      <div
        className={`
        flex items-center
        space-x-2 text-sm rounded-xl 
        `}
      >
        <Image
          src={NETWORK_ICON[chainId] ?? unknown}
          alt="Switch Network"
          className="rounded-lg bg-white"
          width={20}
          height={20}
        />
        <div className="text-text">{NETWORK_LABEL[chainId]}</div>
      </div>
      <NetworkModal />
    </div>
  );
}
