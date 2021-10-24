import React, { useEffect, useState } from 'react';
import ReactGA from 'react-ga';
// emotion
import styled from '@emotion/styled';
// next
import Image from 'next/image';
// device detector
import { isMobile } from 'react-device-detect';
// ga
// import ReactGA from 'react-ga';
// web3
import { UnsupportedChainIdError, useWeb3React } from '@web3-react/core';
import { AbstractConnector } from '@web3-react/abstract-connector';
import { WalletConnectConnector } from '@web3-react/walletconnect-connector';
import {
  CONNECTOR_PARAMS,
  fortmatic,
  injected,
  // portis,
} from '../../connectors';
// modal
import { Modal } from '../../components-ui/Modal';
import {
  useModalOpen,
  useWalletModalToggle,
} from '../../state/application/hooks';
import { ApplicationModal } from '../../state/application/actions';
// wallet
import { SUPPORTED_WALLETS } from '../../constants';
// connectors
import { OVERLAY_READY } from '../../connectors/Fortmatic';
// hooks
import usePrevious from '../../hooks/usePrevious';
// children
import Option from './Option';
import PendingView from './PendingView';
import { WalletInfo } from '../../components-ui/WalletInfo';
import { ModalHeader } from '../../components-ui/Modal/ModalHeader';
import { Button } from '../../components-ui/Button';
import { useSizeSmDown, useSizeXs } from '../../components-ui/Responsive';
import Agreement from './Agreement';
import { DefinedStyles } from '../../utils/DefinedStyles';
import { ExternalLink } from '../../components-ui/ExternalLink';
import { useUserAgreement } from '../../state/user/hooks';
import { classNames } from '../../functions';

const WALLET_VIEWS = {
  OPTIONS: 'options',
  OPTIONS_SECONDARY: 'options_secondary',
  ACCOUNT: 'account',
  PENDING: 'pending',
};

export default function WalletModal({
  pendingTransactions,
  confirmedTransactions,
  ENSName,
}: {
  pendingTransactions: string[]; // hashes of pending
  confirmedTransactions: string[]; // hashes of confirmed
  ENSName?: string;
}) {
  // console.log({ ENSName })
  // important that these are destructed from the account-specific web3-react context
  const {
    active,
    account,
    connector,
    activate,
    error,
    deactivate,
    chainId,
  } = useWeb3React();

  const [walletView, setWalletView] = useState(WALLET_VIEWS.ACCOUNT);
  const { userAgreement, agree, disagree } = useUserAgreement();

  const [pendingWallet, setPendingWallet] = useState<
    | AbstractConnector
    | ((params?: CONNECTOR_PARAMS) => Promise<AbstractConnector>)
    | undefined
  >();

  const [pendingError, setPendingError] = useState<boolean>();

  const walletModalOpen = useModalOpen(ApplicationModal.WALLET);

  const toggleWalletModal = useWalletModalToggle();

  const previousAccount = usePrevious(account);

  // close on connection, when logged out before
  useEffect(() => {
    if (account && !previousAccount && walletModalOpen) {
      toggleWalletModal();
    }
  }, [account, previousAccount, toggleWalletModal, walletModalOpen]);

  // always reset to account view
  useEffect(() => {
    if (walletModalOpen) {
      setPendingError(false);
      setWalletView(WALLET_VIEWS.ACCOUNT);
    }
  }, [walletModalOpen]);

  // close modal when a connection is successful
  const activePrevious = usePrevious(active);
  const connectorPrevious = usePrevious(connector);
  useEffect(() => {
    if (
      walletModalOpen &&
      ((active && !activePrevious) ||
        (connector && connector !== connectorPrevious && !error))
    ) {
      setWalletView(WALLET_VIEWS.ACCOUNT);
    }
  }, [
    setWalletView,
    active,
    error,
    connector,
    walletModalOpen,
    activePrevious,
    connectorPrevious,
  ]);

  const tryActivation = async (
    connector:
      | ((params?: CONNECTOR_PARAMS) => Promise<AbstractConnector>)
      | AbstractConnector
      | undefined,
  ) => {
    let name = '';
    let conn =
      typeof connector === 'function'
        ? await connector({ chainId })
        : connector instanceof Promise
        ? await Promise.resolve(connector).then((res) => res({ chainId }))
        : connector;

    Object.keys(SUPPORTED_WALLETS).map((key) => {
      if (connector === SUPPORTED_WALLETS[key].connector) {
        return (name = SUPPORTED_WALLETS[key].name);
      }
      return true;
    });
    // log selected wallet
    ReactGA.event({
      category: 'Wallet',
      action: 'Change Wallet',
      label: name,
    });
    setPendingWallet(connector);
    setWalletView(WALLET_VIEWS.PENDING);

    // if the connector is walletconnect and the user has already tried to connect, manually reset the connector
    if (
      conn instanceof WalletConnectConnector &&
      conn.walletConnectProvider?.wc?.uri
    ) {
      conn.walletConnectProvider = undefined;
    }

    conn &&
      activate(conn, undefined, true).catch((error) => {
        if (error instanceof UnsupportedChainIdError) {
          activate(conn); // a little janky...can't use setError because the connector isn't set
        } else {
          setPendingError(true);
        }
      });
  };

  // close wallet modal if fortmatic modal is active
  useEffect(() => {
    fortmatic.on(OVERLAY_READY, () => {
      toggleWalletModal();
    });
  }, [toggleWalletModal]);

  // get wallets user can switch too, depending on device/browser
  function getOptions() {
    const isMetamask = window.ethereum && window.ethereum.isMetaMask;
    return Object.keys(SUPPORTED_WALLETS).map((key) => {
      const option = SUPPORTED_WALLETS[key];

      // check for mobile options
      if (isMobile) {
        // disable portis on mobile for now
        // if (option.connector === portis) {
        //   return null;
        // }

        if (!window.web3 && !window.ethereum && option.mobile) {
          return (
            <Option
              disabled={!userAgreement}
              col
              onClick={() => {
                option.connector !== connector &&
                  !option.href &&
                  tryActivation(option.connector);
              }}
              id={`connect-${key}`}
              key={key}
              active={option.connector && option.connector === connector}
              color={option.color}
              link={option.href}
              header={option.name}
              subheader={null}
              icon={'/img/wallets/' + option.iconName}
            />
          );
        }
        return null;
      }

      // overwrite injected when needed
      if (option.connector === injected) {
        // don't show injected if there's no injected provider
        if (!(window.web3 || window.ethereum)) {
          if (option.name === 'MetaMask') {
            return (
              <Option
                disabled={!userAgreement}
                col
                id={`connect-${key}`}
                key={key}
                color={'#E8831D'}
                header={'Install Metamask'}
                subheader={null}
                link={'https://metamask.io/'}
                icon="/img/wallets/metamask.png"
              />
            );
          } else {
            return null; // dont want to return install twice
          }
        }
        // don't return metamask if injected provider isn't metamask
        else if (option.name === 'MetaMask' && !isMetamask) {
          return null;
        }
        // likewise for generic
        else if (option.name === 'Injected' && isMetamask) {
          return null;
        }
      }
      // return rest of options
      return (
        !isMobile &&
        !option.mobileOnly && (
          <Option
            disabled={!userAgreement}
            col
            id={`connect-${key}`}
            onClick={() => {
              option.connector === connector
                ? setWalletView(WALLET_VIEWS.ACCOUNT)
                : !option.href && tryActivation(option.connector);
            }}
            key={key}
            active={option.connector === connector}
            color={option.color}
            link={option.href}
            header={option.name}
            subheader={null} // use option.descriptio to bring back multi-line
            icon={'/img/wallets/' + option.iconName}
          />
        )
      );
    });
  }

  function getModalContent() {
    if (error) {
      return (
        <div>
          <ModalHeader
            title={
              error instanceof UnsupportedChainIdError
                ? `Wrong Network`
                : `Error connecting`
            }
            onClose={toggleWalletModal}
          />
          <div>
            <div className="mt-2 mb-4 text-danger">
              {true || error instanceof UnsupportedChainIdError
                ? 'Please connect to the appropriate Ethereum network'
                : 'Try refreshing the page'}
            </div>
            <Button
              type="bordered"
              color="white"
              onClick={deactivate}
            >{`Disconnect`}</Button>
          </div>
        </div>
      );
    }
    if (account && walletView === WALLET_VIEWS.ACCOUNT) {
      return (
        <WalletInfo
          toggleWalletModal={toggleWalletModal}
          pendingTransactions={pendingTransactions}
          confirmedTransactions={confirmedTransactions}
          ENSName={ENSName}
          openOptions={() => setWalletView(WALLET_VIEWS.OPTIONS)}
        />
      );
    }
    return (
      <div className="flex flex-col space-y-4">
        <ModalHeader title="Connect Wallet" onClose={toggleWalletModal} />
        <div className="flex flex-col space-y-6">
          {walletView === WALLET_VIEWS.PENDING ? (
            <PendingView
              connector={pendingWallet}
              error={pendingError}
              setPendingError={setPendingError}
              tryActivation={tryActivation}
            />
          ) : (
            <div className="space-y-4">
              {!userAgreement ? (
                <div className="flex space-x-4">
                  <div className={DefinedStyles.step}>1</div>
                  <div className="space-y-4">
                    <div>
                      Accept the{' '}
                      <ExternalLink href="assets/terms-of-service.pdf">
                        {' '}
                        Terms of Service
                      </ExternalLink>
                    </div>
                    <Agreement
                      agreed={userAgreement}
                      agree={agree}
                      disagree={disagree}
                    />
                  </div>
                </div>
              ) : (
                <div>
                  You agreed to the
                  <ExternalLink href="assets/terms-of-service.pdf">
                    {' '}
                    Terms of Service
                  </ExternalLink>
                </div>
              )}
              <div
                className={classNames(
                  'space-y-4',
                  !userAgreement && 'opacity-50',
                )}
              >
                {!userAgreement && (
                  <div className="flex items-center space-x-4">
                    <div className={DefinedStyles.step}>2</div>
                    <div>Choose Wallet</div>
                  </div>
                )}
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                  {getOptions()}
                </div>
              </div>
            </div>
          )}
          {walletView !== WALLET_VIEWS.PENDING && (
            <div className="flex flex-col text-center">
              <div>{`New to Ethereum?`}</div>
              <a href="https://ethereum.org/wallets/" className="text-green">
                {`Learn more about wallets`}
              </a>
            </div>
          )}
        </div>
      </div>
    );
  }

  const isViewportXSmall = useSizeXs();
  const isViewportSmallDown = useSizeSmDown();

  return (
    <Modal
      isOpen={walletModalOpen}
      onDismiss={toggleWalletModal}
      maxWidth="500px"
      minWidth={
        isViewportSmallDown ? (isViewportXSmall ? '90vw' : '70vw') : 'none'
      }
    >
      {getModalContent()}
    </Modal>
  );
}
