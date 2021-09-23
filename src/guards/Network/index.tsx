import React, { FC, Fragment } from 'react';
import { useActiveWeb3React } from '../../hooks';
import { ChainId } from '@digitalnative/standard-protocol-sdk';
import Image from 'next/image';
import { NETWORK_ICON, NETWORK_LABEL } from '../../constants/networks';
import { SUPPORTED_NETWORKS } from '../../modals/NetworkModal';
import cookie from 'cookie-cutter';
import HeadlessUIModal from '../../components-ui/Modal/HeadlessUIModal';
import { NavigationLink } from '../../components-ui/NavigationLink';
import { Blank } from '../../components-ui/Blank';

interface NetworkGuardProps {
  networks: ChainId[];
  children: React.ReactNode;
}

const Component: FC<NetworkGuardProps> = ({ children, networks = [] }) => {
  const { chainId, library, account } = useActiveWeb3React();

  const link = (
    <NavigationLink href="/swap">
      <a className="text-blue focus:outline-none">{`home page`}</a>
    </NavigationLink>
  );

  return (
    <>
      <HeadlessUIModal
        isOpen={!!account && !networks.includes(chainId)}
        onDismiss={() => null}
      >
        <div className="flex flex-col gap-7 p-8 rounded-20 bg-opaque items-center justify-center">
          <div className="max-w-2xl text-white text-center">
            {`The App is not yet supported on ${NETWORK_LABEL[chainId]}`}
          </div>
          <div className="uppercase text-white text-center text-xl tracking-[.2rem]">
            Available Networks
          </div>
          <div className="flex items-center space-x-8">
            {networks.map((key: ChainId, idx: number) => (
              <button
                className="text-primary hover:text-white flex items-center flex-col gap-2 justify-start"
                key={idx}
                onClick={() => {
                  const params = SUPPORTED_NETWORKS[key];
                  cookie.set('chainId', key);
                  if ([ChainId.RINKEBY].includes(key)) {
                    library?.send('wallet_switchEthereumChain', [
                      { chainId: params.chainId },
                      account,
                    ]);
                  } else {
                    library?.send('wallet_addEthereumChain', [params, account]);
                  }
                }}
              >
                <div className="w-[40px] h-[40px]">
                  <Image
                    src={NETWORK_ICON[key]}
                    alt="Switch Network"
                    className="rounded-full filter drop-shadow-currencyLogo"
                    width="40px"
                    height="40px"
                  />
                </div>
                <div className="text-sm">{NETWORK_LABEL[key]}</div>
              </button>
            ))}
          </div>
        </div>
      </HeadlessUIModal>
      {networks.includes(chainId) ? children : <Blank />}
    </>
  );
};

export default function NetworkGuard({
  networks,
  children,
}: NetworkGuardProps) {
  return <Component networks={networks}>{children}</Component>;
}

// export default NetworkGuard;
