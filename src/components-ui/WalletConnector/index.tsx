import { css } from '@emotion/react';
import { UnsupportedChainIdError, useWeb3React } from '@web3-react/core';
import { classNames } from '../../functions';
import { useWalletModalToggle } from '../../state/application/hooks';

export type WalletConnectorType = {
  className?: string;
};

export function WalletConnector({ className }: WalletConnectorType) {
  const toggleWalletModal = useWalletModalToggle();
  const { error } = useWeb3React();

  const onClick = () => {
    toggleWalletModal();
  };

  return (
    <>
      <button
        className={classNames(
          `
        w-full 
        cursor-pointer
        p-2
        rounded-xl
        border border-primary
        text-text 
        bg-primary bg-opacity-10
        flex items-center justify-center
        `,
          className,
        )}
        onClick={onClick}
      >
        Connect your wallet
      </button>
      {error && (
        <div
          className="
        w-full
        p-2 mb-2
        text-danger
        text-sm"
        >
          {error instanceof UnsupportedChainIdError
            ? `You are on the wrong network`
            : `Error`}
        </div>
      )}
    </>
  );
}
