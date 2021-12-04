import { ChainId } from '@digitalnative/standard-protocol-sdk';
import cookie from 'cookie-cutter';
import { Modal } from '../../components-ui/Modal';
import {
  NETWORK_ICON,
  NETWORK_LABEL,
  SUPPORTED_NETWORKS,
} from '../../constants/networks';
import Image from 'next/image';
import { useSizeSmDown } from '../../components-ui/Responsive';
import { useActiveWeb3React } from '../../hooks';
import { ModalHeader } from '../../components-ui/Modal/ModalHeader';

type RouterChainSelectModalTypes = {
  isOpen: boolean;
  onDismiss?: () => void;
  onChainSelect?: (chainId: ChainId) => void;
  chainIds?: ChainId[];
  includeNativeCurrency?: boolean;
  allowManageTokenList?: boolean;
  isFrom?: boolean;
};

export default function RouterChainSelectModal({
  isOpen,
  onDismiss,
  chainIds,
  onChainSelect,
  isFrom,
}: RouterChainSelectModalTypes) {
  const { library, account } = useActiveWeb3React();
  const isViewportSmallDown = useSizeSmDown();

  const onSelectNetwork = (_chainId) => {
    const params = SUPPORTED_NETWORKS[_chainId];
    const ethereum = (window as any)?.ethereum;
    ethereum && ethereum.removeAllListeners(['networkChanged']);
    cookie.set('chainId', _chainId);
    if ([ChainId.MAINNET, ChainId.RINKEBY].includes(_chainId)) {
      library?.send('wallet_switchEthereumChain', [
        { chainId: params.chainId },
        account,
      ]);
    } else {
      library?.send('wallet_addEthereumChain', [params, account]);
    }
  };

  return (
    <>
      <Modal
        isOpen={isOpen}
        onDismiss={onDismiss}
        maxWidth="500px"
        maxHeight="80vh"
        minWidth={isViewportSmallDown ? '90vw' : 'none'}
      >
        <div className="space-y-4">
          <ModalHeader onClose={onDismiss} title="Networks" />
          <div className="space-y-2">
            {chainIds.map((chainId) => {
              return (
                <div
                  className="
                flex items-center space-x-2 
                cursor-pointer 
                bg-opaque rounded-20 px-2 py-2
                hover:bg-bright
                transition
                duration-500"
                  key={chainId}
                  onClick={() => {
                    isFrom && onSelectNetwork(chainId);
                    onChainSelect && onChainSelect(chainId);
                    onDismiss();
                  }}
                >
                  <div>
                    <Image
                      src={NETWORK_ICON[chainId]}
                      alt={`${NETWORK_LABEL[chainId]} Network`}
                      className="rounded-full"
                      width="32px"
                      height="32px"
                    />
                  </div>
                  <div>{NETWORK_LABEL[chainId]}</div>
                </div>
              );
            })}
          </div>
        </div>
      </Modal>
    </>
  );
}
