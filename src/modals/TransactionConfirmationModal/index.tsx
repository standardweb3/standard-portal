// import { AlertTriangle, ArrowUpCircle, CheckCircle } from 'react-feather';
import { ChainId, Currency } from '@sushiswap/sdk';
import React, { FC } from 'react';

import { Button } from '../../components-ui/Button';
import {
  CheckCircleIcon,
  CheckIcon,
  EmojiSadIcon,
  ExclamationCircleIcon,
  SortAscendingIcon,
  ThumbUpIcon,
  UploadIcon,
  XIcon,
} from '@heroicons/react/outline';
import { ExternalLink } from '../../components-ui/ExternalLink';
import { Image } from '../../components-ui/Image';
// import Lottie from 'lottie-react';
import { Modal } from '../../components-ui/Modal';
import { ModalHeader } from '../../components-ui/Modal/ModalHeader';
import { getExplorerLink } from '../../functions/explorer';
// import loadingRollingCircle from '../../animation/loading-rolling-circle.json';
import { useActiveWeb3React } from '../../hooks/useActiveWeb3React';
import useAddTokenToMetaMask from '../../hooks/useAddTokenToMetaMask';
import { WavySpinner } from '../../components-ui/Spinner/WavySpinner';

interface ConfirmationPendingContentProps {
  onDismiss: () => void;
  pendingText: string;
  pendingText2: string;
}

export const ConfirmationPendingContent: FC<ConfirmationPendingContentProps> = ({
  onDismiss,
  pendingText,
  pendingText2,
}) => {
  return (
    <div>
      <div className="flex justify-end">
        <XIcon onClick={onDismiss} className="w-4 h-4" />
      </div>
      <div className="flex justify-center">
        <WavySpinner />
      </div>
      <div className="flex flex-col items-center justify-center space-y-3 mt-4">
        <div className="text-xl font-bold text-primary">{`Waiting for Confirmation`}</div>
        <div className="font-bold text-center">{pendingText}</div>
        {pendingText2 && (
          <div className="font-bold text-center">{pendingText2}</div>
        )}
        <div className="text-sm font-bold text-warn">{`Confirm this transaction in your wallet`}</div>
      </div>
    </div>
  );
};

interface TransactionSubmittedContentProps {
  onDismiss: () => void;
  hash: string | undefined;
  chainId: ChainId;
  currencyToAdd?: Currency | undefined;
  inline?: boolean; // not in modal
}

export const TransactionSubmittedContent: FC<TransactionSubmittedContentProps> = ({
  onDismiss,
  chainId,
  hash,
  currencyToAdd,
}) => {
  const { library } = useActiveWeb3React();
  const { addToken, success } = useAddTokenToMetaMask(currencyToAdd);
  return (
    <div className="relative">
      <div className="flex justify-end">
        <XIcon onClick={onDismiss} className="w-5 h-5 cursor-pointer" />
      </div>
      <div className="flex flex-col items-center justify-center space-y-4">
        <div className="flex items-center space-x-2 text-success">
          <CheckCircleIcon className="w-5 h-5" />
          <div className="text-xl font-bold">{`Transaction Submitted`}</div>
        </div>
        {chainId && hash && (
          <ExternalLink href={getExplorerLink(chainId, hash, 'transaction')}>
            <div className="font-bold text-blue">View on explorer</div>
          </ExternalLink>
        )}
        {currencyToAdd && library?.provider?.isMetaMask && (
          <Button color="primary" onClick={addToken}>
            {!success ? (
              <div className="flex items-center space-x-2">
                <span>{`Add ${currencyToAdd.symbol} to MetaMask`}</span>
                <Image
                  src="/img/wallets/metamask.png"
                  alt={`Add ${currencyToAdd.symbol} to MetaMask`}
                  width={24}
                  height={24}
                  className="ml-1"
                />
              </div>
            ) : (
              <div>
                {`Added`} {currencyToAdd.symbol}
                {/* <CheckCircle className="ml-1.5 text-2xl text-green" size="16px" /> */}
              </div>
            )}
          </Button>
        )}
        {/* <Button color="gradient" onClick={onDismiss} style={{ margin: '20px 0 0 0' }}>
          Close
        </Button> */}
      </div>
    </div>
  );
};

interface ConfirmationModelContentProps {
  title: string;
  onDismiss: () => void;
  topContent: () => React.ReactNode;
  bottomContent: () => React.ReactNode;
}

export const ConfirmationModalContent: FC<ConfirmationModelContentProps> = ({
  title,
  bottomContent,
  onDismiss,
  topContent,
}) => {
  return (
    <div className="grid gap-4">
      <ModalHeader title={title} onClose={onDismiss} />
      {topContent()}
      {bottomContent()}
    </div>
  );
};

interface TransactionErrorContentProps {
  message: string;
  onDismiss: () => void;
}

export const TransactionErrorContent: FC<TransactionErrorContentProps> = ({
  message,
  onDismiss,
}) => {
  return (
    <div className="space-y-6">
      <div>
        <div className="flex justify-end">
          <XIcon onClick={onDismiss} className="w-5 h-5" />
        </div>
        <div className="flex space-x-2 items-center justify-center text-danger">
          {/* <AlertTriangle
            className="text-red"
            style={{ strokeWidth: 1.5 }}
            size={64}
          /> */}
          <ExclamationCircleIcon className="w-5 h-5" />
          <div className="font-bold">{message}</div>
        </div>
      </div>
      <div className="flex justify-center">
        <Button type="bordered" color="info" onClick={onDismiss}>
          Dismiss
        </Button>
      </div>
    </div>
  );
};

interface ConfirmationModalProps {
  isOpen: boolean;
  onDismiss: () => void;
  hash: string | undefined;
  content: () => React.ReactNode;
  attemptingTxn: boolean;
  pendingText: string;
  pendingText2?: string;
  currencyToAdd?: Currency | undefined;
}

const TransactionConfirmationModal: FC<ConfirmationModalProps> = ({
  isOpen,
  onDismiss,
  attemptingTxn,
  hash,
  pendingText,
  pendingText2,
  content,
  currencyToAdd,
}) => {
  const { chainId } = useActiveWeb3React();

  if (!chainId) return null;

  // confirmation screen
  return (
    <Modal isOpen={isOpen} onDismiss={onDismiss} maxWidth={'400px'}>
      {attemptingTxn ? (
        <ConfirmationPendingContent
          onDismiss={onDismiss}
          pendingText={pendingText}
          pendingText2={pendingText2}
        />
      ) : hash ? (
        <TransactionSubmittedContent
          chainId={chainId}
          hash={hash}
          onDismiss={onDismiss}
          currencyToAdd={currencyToAdd}
        />
      ) : (
        content()
      )}
    </Modal>
  );
};

export default TransactionConfirmationModal;
