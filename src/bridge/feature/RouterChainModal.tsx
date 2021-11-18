import { AnyswapCurrency, ChainId } from '@digitalnative/standard-protocol-sdk';
import { useCallback, useMemo } from 'react';
import { Modal } from '../../components-ui/Modal';
import { NETWORK_ICON, NETWORK_LABEL } from '../../constants/networks';
import Image from 'next/image';

type RouterChainSelectModalTypes = {
  isOpen: boolean;
  onDismiss?: () => void;
  onChainSelect?: (chainId: ChainId) => void;
  chainIds?: ChainId[];
  includeNativeCurrency?: boolean;
  allowManageTokenList?: boolean;
};

export default function RouterChainSelectModal({
  isOpen,
  onDismiss,
  chainIds,
  onChainSelect,
}: RouterChainSelectModalTypes) {
  return (
    <>
      <Modal
        isOpen={isOpen}
        onDismiss={onDismiss}
        maxWidth="500px"
        maxHeight="80vh"
        minWidth={'80vw'}
      >
        {chainIds.map((chainId) => {
          return (
            <div
              className="flex items-center space-x-2 cursor-pointer"
              key={chainId}
              onClick={() => {
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
      </Modal>
    </>
  );
}
