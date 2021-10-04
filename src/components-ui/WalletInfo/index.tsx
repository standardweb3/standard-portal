import React, { FC, useCallback } from 'react';
import { useDispatch } from 'react-redux';

// Icons
import { EyeIcon } from '@heroicons/react/outline';
// next
import Image from 'next/image';
// connectors
import {
  binance,
  fortmatic,
  getWalletConnectConnector,
  injected,
  // portis,
  // torus,
  walletconnect,
  walletlink,
} from '../../connectors';
import { isMobile } from 'react-device-detect';

// web3
import { useActiveWeb3React } from '../../hooks/useActiveWeb3React';

// import { ExternalLink as LinkIcon } from 'react-feather';
// state
import { AppDispatch } from '../../state';
import { clearAllTransactions } from '../../state/transactions/actions';

// functions
import { getExplorerLink } from '../../functions/explorer';
import { shortenAddress } from '../../functions';

// constants
import { SUPPORTED_WALLETS } from '../../constants';
import { ModalHeader } from '../Modal/ModalHeader';
import { Button } from '../Button';
import { ExternalLink } from '../ExternalLink';
import Copier from '../Copier';
import Transaction from './Transaction';

const WalletIcon: FC<{ size?: number; src: string; alt: string }> = ({
  size,
  src,
  alt,
  children,
}) => {
  return (
    <div className="flex flex-row flex-nowrap items-center md:items-center justify-center mr-3">
      <Image src={src} alt={alt} width={size} height={size} />
      {children}
    </div>
  );
};

function renderTransactions(transactions: string[]) {
  return (
    <div className="flex flex-col flex-nowrap">
      {transactions.map((hash, i) => {
        return <Transaction key={i} hash={hash} />;
      })}
    </div>
  );
}

interface WalletInfoProps {
  toggleWalletModal: () => void;
  pendingTransactions: string[];
  confirmedTransactions: string[];
  ENSName?: string;
  openOptions: () => void;
}

export const WalletInfo: FC<WalletInfoProps> = ({
  toggleWalletModal,
  pendingTransactions,
  confirmedTransactions,
  ENSName,
  openOptions,
}) => {
  const { chainId, account, connector } = useActiveWeb3React();
  const dispatch = useDispatch<AppDispatch>();

  function formatConnectorName() {
    const { ethereum } = window;
    const isMetaMask = !!(ethereum && ethereum.isMetaMask);
    const name = Object.keys(SUPPORTED_WALLETS)
      .filter(
        (k) =>
          SUPPORTED_WALLETS[k].connector === connector &&
          (connector !== injected || isMetaMask === (k === 'METAMASK')),
      )
      .map((k) => SUPPORTED_WALLETS[k].name)[0];
    return (
      <div className="font-medium text-baseline text-success">
        Connected with {name}
      </div>
    );
  }

  function getStatusIcon() {
    if (connector === injected) {
      return (
        <WalletIcon src="/img/wallets/metamask.png" alt="Metamask" size={16} />
      );
    } else if (connector === walletconnect) {
      return (
        <WalletIcon
          src="/img/wallets/wallet-connect.svg"
          alt="Wallet Connect"
          size={16}
        />
      );
    } else if (connector === walletlink) {
      return (
        <WalletIcon src="/img/wallets/coinbase.svg" alt="Coinbase" size={16} />
      );
    } else if (connector === fortmatic) {
      return (
        <WalletIcon src="/img/wallets/formatic.png" alt="Fortmatic" size={16} />
      );
    } 
    // else if (connector === portis) {
    //   return (
    //     <WalletIcon src="/img/wallets/portnis.png" alt="Portis" size={16}>
    //       <button
    //         onClick={() => {
    //           portis.portis.showPortis();
    //         }}
    //       >
    //         Show Portis
    //       </button>
    //     </WalletIcon>
    //   );
    // } else if (connector === torus) {
    //   return <WalletIcon src="/img/wallets/torus.png" alt="Torus" size={16} />;
    // }
    return null;
  }

  const clearAllTransactionsCallback = useCallback(() => {
    if (chainId) dispatch(clearAllTransactions({ chainId }));
  }, [dispatch, chainId]);

  return (
    <div className="space-y-3">
      <div className="space-y-3">
        <ModalHeader title={'Wallet'} onClose={toggleWalletModal} />
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            {formatConnectorName()}
            <div className="flex space-x-3">
              {connector !== injected &&
                connector !== walletlink &&
                connector !== binance &&
                connector.constructor.name !== 'KeystoneConnector' && (
                  <Button
                    type="bordered"
                    color="info"
                    className="text-sm"
                    onClick={() => {
                      (connector as any).close();
                    }}
                  >
                    Disconnect
                  </Button>
                )}
              {!isMobile && (
                <Button
                  type="bordered"
                  color="white"
                  className="text-sm"
                  onClick={() => {
                    openOptions();
                  }}
                >
                  Change
                </Button>
              )}
            </div>
          </div>
          <div
            id="web3-account-identifier-row"
            className="flex flex-col justify-center space-y-3"
          >
            {ENSName ? (
              <div className="flex align-center bg-opaque rounded-xl py-2 px-3">
                {getStatusIcon()}
                <div className="truncate">{ENSName}</div>
              </div>
            ) : (
              <div className="flex align-center bg-opaque rounded-xl py-2 px-3">
                {getStatusIcon()}
                <div className="truncate">
                  {account && shortenAddress(account)}
                </div>
              </div>
            )}
            <div className="flex items-center flex-wrap justify-start">
              {chainId && account && (
                <ExternalLink
                  className="text-sm mr-3"
                  color="link"
                  startIcon={<EyeIcon className="w-4 h-4" />}
                  href={
                    chainId &&
                    getExplorerLink(chainId, ENSName || account, 'address')
                  }
                >
                  <div>View on explorer</div>
                </ExternalLink>
              )}
              {account && (
                <Copier className="text-sm" toCopy={account}>
                  <div>Copy Address</div>
                </Copier>
              )}
            </div>
          </div>
        </div>
      </div>
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <div>Recent Transactions</div>
          <div>
            <Button
              type="bordered"
              color="white"
              className="text-sm"
              onClick={clearAllTransactionsCallback}
            >
              Clear
            </Button>
          </div>
        </div>
        {!!pendingTransactions.length || !!confirmedTransactions.length ? (
          <div className="bg-opaque rounded-xl py-2 px-3">
            {renderTransactions(pendingTransactions)}
            {renderTransactions(confirmedTransactions)}
          </div>
        ) : (
          <div className="text-info text-sm">
            Your transactions will appear here...
          </div>
        )}
      </div>
    </div>
  );
};
