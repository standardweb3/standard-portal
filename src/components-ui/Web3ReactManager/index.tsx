import React, { useEffect, useState } from 'react';
import dynamic from 'next/dynamic';
import { NetworkContextName } from '../../constants';
import { network } from '../../connectors';
import styled from '@emotion/styled';
import useEagerConnect from '../../hooks/useEagerConnect';
import useInactiveListener from '../../hooks/useInactiveListener';
import { useWeb3React } from '@web3-react/core';

const MessageWrapper = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  height: 20rem;
`;

const Message = styled.h2``;

const GnosisManagerNoSSR = dynamic(() => import('./GnosisManager'), {
  ssr: false,
});

export default function Web3ReactManager({ children }: { children: JSX.Element }) {
  const { active } = useWeb3React();
  const { active: networkActive, error: networkError, activate: activateNetwork } = useWeb3React(NetworkContextName);

  // try to eagerly connect to an injected provider, if it exists and has granted access already
  const triedEager = useEagerConnect();

  // after eagerly trying injected, if the network connect ever isn't active or in an error state, activate itd
  useEffect(() => {
    if (triedEager && !networkActive && !networkError && !active) {
      activateNetwork(network);
    }
  }, [triedEager, networkActive, networkError, activateNetwork, active]);

  // when there's no account connected, react to logins (broadly speaking) on the injected provider, if it exists
  useInactiveListener(!triedEager);

  // handle delayed loader state
  const [showLoader, setShowLoader] = useState(false);
  useEffect(() => {
    const timeout = setTimeout(() => {
      setShowLoader(true);
    }, 600);

    return () => {
      clearTimeout(timeout);
    };
  }, []);

  // on page load, do nothing until we've tried to connect to the injected connector
  if (!triedEager) {
    return null;
  }

  // if the account context isn't active, and there's an error on the network context, it's an irrecoverable error
  if (!active && networkError) {
    return (
      <MessageWrapper>
        <div className="text-secondary">
          {`Oops! An unknown error occurred. Please refresh the page, or visit from another browser or device`}
        </div>
      </MessageWrapper>
    );
  }

  // if neither context is active, spin
  if (!active && !networkActive) {
    return showLoader ? <MessageWrapper>LOADING...</MessageWrapper> : null;
  }

  return (
    <>
      <GnosisManagerNoSSR />
      {children}
    </>
  );
}
