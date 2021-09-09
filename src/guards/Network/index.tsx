import React, { FC, Fragment } from 'react';
import { useActiveWeb3React } from '../../hooks';
import { ChainId } from '@digitalnativeinc/standard-protocol-sdk';
import Image from 'next/image';
import { NETWORK_ICON, NETWORK_LABEL } from '../../constants/networks';
import { SUPPORTED_NETWORKS } from '../../modals/NetworkModal';
import cookie from 'cookie-cutter';
import HeadlessUIModal from '../../components-ui/Modal/HeadlessUIModal';
import { NavigationLink } from '../../components-ui/NavigationLink';

interface NetworkGuardProps {
  networks: ChainId[];
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
        <div className="flex flex-col gap-7 justify-center">
          <div className="max-w-2xl text-white text-center">
            {`Roll it back - this feature is not yet supported on ${NETWORK_LABEL[chainId]}.`}
          </div>
          <div className="text-center">
            <div id="Either return to the {link}, or change to an available network." />
          </div>
          <div className="uppercase text-white text-center text-lg tracking-[.2rem]">
            {`Available Networks`}
          </div>
          <div
            className={`grid gap-5 md:gap-10 md:grid-cols-[${Math.min(
              6,
              networks.length,
            )}] grid-cols-[${Math.min(3, networks.length)}]`}
          >
            {networks.map((key: ChainId, idx: number) => (
              <button
                className="text-primary hover:text-white flex items-center flex-col gap-2 justify-start"
                key={idx}
                onClick={() => {
                  const params = SUPPORTED_NETWORKS[key];
                  cookie.set('chainId', key);
                  if (key === ChainId.MAINNET) {
                    library?.send('wallet_switchEthereumChain', [
                      { chainId: '0x1' },
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
                    className="rounded-md filter drop-shadow-currencyLogo"
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
      {children}
    </>
  );
};

const NetworkGuard = (networks: ChainId[]) => {
  return ({ children }) => (
    <Component networks={networks}>{children}</Component>
  );
};

export default NetworkGuard;
