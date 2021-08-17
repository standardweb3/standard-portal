import React, { FC, useCallback } from 'react';
import {
  binance,
  fortmatic,
  injected,
  portis,
  torus,
  walletconnect,
  walletlink,
} from '../../connectors';

import Image from 'next/image';
import { AppDispatch } from '../../state';
// import { ExternalLink as LinkIcon } from 'react-feather';
import { SUPPORTED_WALLETS } from '../../constants';
import { clearAllTransactions } from '../../state/transactions/actions';
import { getExplorerLink } from '../../functions/explorer';
import { shortenAddress } from '../../functions';
import { useActiveWeb3React } from '../../hooks/useActiveWeb3React';
import { useDispatch } from 'react-redux';

const WalletIcon: FC<{ size?: number; src: string; alt: string }> = ({
  size,
  src,
  alt,
  children,
}) => {
  return (
    <div className="flex flex-row flex-nowrap items-end md:items-center justify-center mr-2">
      <Image src={src} alt={alt} width={size} height={size} />
      {children}
    </div>
  );
};

function renderTransactions(transactions: string[]) {
  return (
    <div className="flex flex-col flex-nowrap gap-2">
      {transactions.map((hash, i) => {
        return <div key={i}>transaction</div>;
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

const WalletInfo: FC<WalletInfoProps> = ({
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
      <div className="font-medium text-baseline text-secondary">
        Connected with {name}
      </div>
    );
  }

  function getStatusIcon() {
    if (connector === injected) {
      return null;
      // return <IconWrapper size={16}>{/* <Identicon /> */}</IconWrapper>
    } else if (connector === walletconnect) {
      return (
        <WalletIcon src="/wallet-connect.png" alt="Wallet Connect" size={16} />
      );
    } else if (connector === walletlink) {
      return <WalletIcon src="/coinbase.svg" alt="Coinbase" size={16} />;
    } else if (connector === fortmatic) {
      return <WalletIcon src="/formatic.png" alt="Fortmatic" size={16} />;
    } else if (connector === portis) {
      return (
        <WalletIcon src="/portnis.png" alt="Portis" size={16}>
          <button
            onClick={() => {
              portis.portis.showPortis();
            }}
          >
            Show Portis
          </button>
        </WalletIcon>
      );
    } else if (connector === torus) {
      return <WalletIcon src="/torus.png" alt="Torus" size={16} />;
    }
    return null;
  }

  const clearAllTransactionsCallback = useCallback(() => {
    if (chainId) dispatch(clearAllTransactions({ chainId }));
  }, [dispatch, chainId]);

  return (
    <div className="space-y-3">
      <div className="space-y-3">
        <button onClick={toggleWalletModal}>close</button>
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            {formatConnectorName()}
            <div className="flex space-x-3">
              {connector !== injected &&
                connector !== walletlink &&
                connector !== binance &&
                connector.constructor.name !== 'KeystoneConnector' && (
                  <button
                    onClick={() => {
                      (connector as any).close();
                    }}
                  >
                    Disconnect
                  </button>
                )}
              <button
                onClick={() => {
                  openOptions();
                }}
              >
                change
              </button>
            </div>
          </div>
          <div
            id="web3-account-identifier-row"
            className="flex flex-col justify-center space-y-3"
          >
            {ENSName ? (
              <div className="bg-dark-800">
                {getStatusIcon()}
                <div>{ENSName}</div>
              </div>
            ) : (
              <div className="bg-dark-800 py-2 px-3 rounded">
                {getStatusIcon()}
                <div>{account && shortenAddress(account)}</div>
              </div>
            )}
            <div className="flex items-center space-x-3 gap-2">
              {chainId && account && (
                <div
                //   color="blue"
                //   startIcon={<LinkIcon size={16} />}
                //   href={
                //     chainId &&
                //     getExplorerLink(chainId, ENSName || account, 'address')
                //   }
                >
                  <div>View on explorer</div>
                </div>
              )}
              {account && (
                <div>
                  <div>Copy Address</div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <div>Recent Transactions</div>
          <div>
            <button onClick={clearAllTransactionsCallback}>
              {`Clear all`}
            </button>
          </div>
        </div>
        {!!pendingTransactions.length || !!confirmedTransactions.length ? (
          <>
            {renderTransactions(pendingTransactions)}
            {renderTransactions(confirmedTransactions)}
          </>
        ) : (
          <div className="text-secondary">
            Your transactions will appear here...
          </div>
        )}
      </div>
    </div>
  );
};

export default WalletInfo;
