import React from 'react';
import { AbstractConnector } from '@web3-react/abstract-connector';
// import Dots from '../../components/Dots'
// import Loader from '../../components/Loader'
import { WavySpinner } from '../../components-ui/Spinner/WavySpinner';
import Option from './Option';
import { SUPPORTED_WALLETS } from '../../constants';
import { darken } from 'polished';
import { injected } from '../../connectors';
import styled from '@emotion/styled';

const PendingSection = styled.div`
  align-items: center;
  justify-content: center;
  width: 100%;
  & > * {
    width: 100%;
  }
`;

const LoadingMessage = styled.div<{ error?: boolean }>`
  align-items: center;
  justify-content: flex-start;
  margin-bottom: 20px;
`;

const ErrorGroup = styled.div`
  align-items: center;
  justify-content: flex-start;
  color: ${({ theme }) => theme.colors.text};
  background: ${({ theme }) => theme.colors.danger};
  &:hover {
    background: ${({ theme }) => theme.colors.background};
    color: ${({ theme }) => theme.colors.text};
  }
  cursor: pointer;
`;

const LoadingWrapper = styled.div`
  align-items: center;
  justify-content: center;
`;

export default function PendingView({
  connector,
  error = false,
  setPendingError,
  tryActivation,
}: {
  connector?: AbstractConnector;
  error?: boolean;
  setPendingError: (error: boolean) => void;
  tryActivation: (connector: AbstractConnector) => void;
}) {
  const isMetamask = window?.ethereum?.isMetaMask;

  return (
    <PendingSection>
      <LoadingMessage error={error}>
        <LoadingWrapper>
          {error ? (
            <>
              <div className="mb-3">Error Occured</div>
              <ErrorGroup
                className="
                  p-3 rounded-xl
                  transition
                  duration-500
                "
                onClick={() => {
                  setPendingError(false);
                  connector && tryActivation(connector);
                }}
              >
                <div>Try Again</div>
              </ErrorGroup>
            </>
          ) : (
            <WavySpinner />
          )}
        </LoadingWrapper>
      </LoadingMessage>
      {Object.keys(SUPPORTED_WALLETS).map((key) => {
        const option = SUPPORTED_WALLETS[key];
        if (option.connector === connector) {
          if (option.connector === injected) {
            if (isMetamask && option.name !== 'MetaMask') {
              return null;
            }
            if (!isMetamask && option.name === 'MetaMask') {
              return null;
            }
          }
          return (
            <Option
              id={`connect-${key}`}
              key={key}
              clickable={false}
              color={option.color}
              header={option.name}
              subheader={option.description}
              icon={'/img/wallets/' + option.iconName}
            />
          );
        }
        return null;
      })}
    </PendingSection>
  );
}
