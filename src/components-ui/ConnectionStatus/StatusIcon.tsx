import styled from '@emotion/styled';
import { AbstractConnector } from '@web3-react/abstract-connector';
import Image from 'next/image';

import {
  fortmatic,
  injected,
  // portis,
  walletconnect,
  walletlink,
} from '../../connectors';

const IconWrapper = styled.div<{ size?: number }>`
  display: flex;
  flex-flow: column nowrap;
  align-items: center;
  justify-content: center;
  & > * {
    height: ${({ size }) => (size ? size + 'px' : '32px')};
    width: ${({ size }) => (size ? size + 'px' : '32px')};
  }
`;

// eslint-disable-next-line react/prop-types
export function StatusIcon({ connector }: { connector: AbstractConnector }) {
  if (connector === injected) {
    return (
      <Image
        src="/img/wallets/metamask.png"
        alt="Injected (MetaMask etc...)"
        width={20}
        height={20}
      />
    );
    // return <Identicon />
  } else if (connector === walletconnect) {
    return (
      <IconWrapper size={16}>
        <Image
          src="/img/wallets/wallet-connect.svg"
          alt={'Wallet Connect'}
          width="16px"
          height="16px"
        />
      </IconWrapper>
    );
  } else if (connector.constructor.name === 'LatticeConnector') {
    return (
      <IconWrapper size={16}>
        <Image
          src="/img/wallets/lattice.png"
          alt={'Lattice'}
          width="16px"
          height="16px"
        />
      </IconWrapper>
    );
  } else if (connector === walletlink) {
    return (
      <IconWrapper size={16}>
        <Image
          src="/img/wallets/coinbase.svg"
          alt={'Coinbase Wallet'}
          width="16px"
          height="16px"
        />
      </IconWrapper>
    );
  } else if (connector === fortmatic) {
    return (
      <IconWrapper size={16}>
        <Image
          src="/img/wallets/fortmatic.png"
          alt={'Fortmatic'}
          width="16px"
          height="16px"
        />
      </IconWrapper>
    );
  } 
  // else if (connector === portis) {
  //   return (
  //     <IconWrapper size={16}>
  //       <Image
  //         src="/img/wallets/portis.png"
  //         alt={'Portis'}
  //         width="16px"
  //         height="16px"
  //       />
  //     </IconWrapper>
  //   );
  // }
  else if (connector.constructor.name === 'KeystoneConnector') {
    return (
      <IconWrapper size={16}>
        <Image
          src="/img/wallets/keystone.png"
          alt={'Keystone'}
          width="16px"
          height="16px"
        />
      </IconWrapper>
    );
  }
  return null;
}
