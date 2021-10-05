import { ChainId } from '@digitalnative/standard-protocol-sdk';
import cookie from 'cookie-cutter';
// next
import Image from 'next/image';
// networks
import {
  NETWORK_ICON,
  NETWORK_LABEL,
  SUPPORTED_NETWORKS,
} from '../../constants/networks';
// web3
import { useActiveWeb3React } from '../../hooks/useActiveWeb3React';
// modal
import {
  useModalOpen,
  useNetworkModalToggle,
} from '../../state/application/hooks';
import { ApplicationModal } from '../../state/application/actions';
import { Modal } from '../../components-ui/Modal';
import { ModalHeader } from '../../components-ui/Modal/ModalHeader';
import { useMemo } from 'react';

export default function NetworkModal(): JSX.Element | null {
  const { chainId, library, account } = useActiveWeb3React();
  const networkModalOpen = useModalOpen(ApplicationModal.NETWORK);
  const toggleNetworkModal = useNetworkModalToggle();

  if (!chainId) return null;

  const onSelectNetwork = (chainIdStr: string) => {
    const _chainId = Number(chainIdStr);
    const params = SUPPORTED_NETWORKS[_chainId];

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

  const supportedChainIds = useMemo(
    () =>
      Object.keys(SUPPORTED_NETWORKS).filter((val) => Number(val) !== chainId),
    [chainId],
  );

  return (
    <Modal
      isOpen={networkModalOpen}
      onDismiss={toggleNetworkModal}
      maxWidth="600px"
      className="relative"
    >
      <ModalHeader onClose={toggleNetworkModal} title="Select a Network" />

      <div
        className={`
        mt-6
        grid grid-cols-1 grid-flow-row-dense gap-5 
        md:grid-cols-2
        overflow-y-auto`}
      >
        {supportedChainIds.map((key: any, i: number) => {
          if (chainId === key) {
            return (
              <div
                key={i}
                className={`
                col-span-1
                flex items-center 
                w-full p-3 space-x-3 rounded-xl
                bg-background
                border border-green
                cursor-pointer
                `}
              >
                <Image
                  src={NETWORK_ICON[key]}
                  alt={`Switch to ${NETWORK_LABEL[key]} Network`}
                  className="rounded-xl bg-white"
                  width="32px"
                  height="32px"
                />
                <div className="font-bold text-text">{NETWORK_LABEL[key]}</div>
              </div>
            );
          }
          return (
            <button
              key={i}
              onClick={() => {
                toggleNetworkModal();
                onSelectNetwork(key);
              }}
              className={`
                flex items-center 
                w-full col-span-1 p-3 space-x-3 rounded-xl
                bg-background-modal-inner hover:bg-green
                cursor-pointer
                transition duration-500
                `}
            >
              <Image
                src={NETWORK_ICON[key]}
                alt="Switch Network"
                className="rounded-xl bg-white"
                width="32px"
                height="32px"
              />
              <div className="font-bold text-text">{NETWORK_LABEL[key]}</div>
            </button>
          );
        })}
        {/* {['Clover', 'Telos', 'Optimism'].map((network, i) => (
          <button
            key={i}
            className="flex items-center w-full col-span-1 p-3 space-x-3 rounded cursor-pointer bg-dark-800 hover:bg-dark-700"
          >
            <Image
              src="/images/tokens/unknown.png"
              alt="Switch Network"
              className="rounded-md"
              width="32px"
              height="32px"
            />
            <div className="font-bold text-primary">{network} (Coming Soon)</div>
          </button>
        ))} */}
      </div>
    </Modal>
  );
}
