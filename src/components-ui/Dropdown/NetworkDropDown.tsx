import { ChainId } from '@digitalnative/standard-protocol-sdk';
import cookie from 'cookie-cutter';
// next
import Image from 'next/image';
// networks
import {
  NETWORK_ICON,
  NETWORK_LABEL,
  SUPPORTED_NETWORKS,
} from '../../constants/networks';
// web3
import { useActiveWeb3React } from '../../hooks/useActiveWeb3React';
import { Listbox, Transition } from '@headlessui/react';
import { ChevronDownIcon } from '@heroicons/react/outline';
import { Fragment, useMemo } from 'react';

export default function NetworkDropDown(): JSX.Element | null {
  const { chainId, library, account } = useActiveWeb3React();

  const onSelectNetwork = (chainIdStr: string) => {
    const _chainId = Number(chainIdStr);
    const params = SUPPORTED_NETWORKS[_chainId];

    cookie.set('chainId', _chainId);
    if ([ChainId.MAINNET, ChainId.RINKEBY].includes(_chainId)) {
      library?.send('wallet_switchEthereumChain', [
        { chainId: params.chainId },
        account,
      ]);
    } else {
      library?.send('wallet_addEthereumChain', [params, account]);
    }
  };

  if (!chainId) return null;

  const supportedChainIds = useMemo(
    () =>
      Object.keys(SUPPORTED_NETWORKS).filter((val) => Number(val) !== chainId),
    [chainId],
  );

  return (
    <Listbox value={chainId.toString()} onChange={onSelectNetwork}>
      <div className="mt-1 flex justify-center">
        <Listbox.Button
          className="
            border
            border-border
            rounded-full
            relative
            flex items-center
            bg-opaque-inactive
            space-x-2
            py-[0.325rem] px-2"
        >
          <Image
            src={NETWORK_ICON[chainId]}
            alt={`Switch to ${NETWORK_LABEL[chainId]} Network`}
            className="rounded-full"
            width="32px"
            height="32px"
          />
          <span className="flex items-center pointer-events-none">
            <ChevronDownIcon className="w-3 h-3" aria-hidden="true" />
          </span>
        </Listbox.Button>
        <Transition
          as={Fragment}
          leave="transition ease-in duration-100"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <Listbox.Options
            className="
            py-2
            translate-y-[62px]
            absolute
            z-40
            overflow-auto 
            text-base bg-opaque-secondary
            rounded-20
            focus:outline-none
            "
          >
            {supportedChainIds.map((optionChainId, idx) => (
              <Listbox.Option
                key={idx}
                className={({ active }) =>
                  `select-none relative cursor-pointer py-1 px-2`
                }
                value={optionChainId}
              >
                {({ selected, active }) => (
                  <div className="flex items-center space-x-3">
                    <Image
                      src={NETWORK_ICON[optionChainId]}
                      alt={`Switch to ${NETWORK_LABEL[optionChainId]} Network`}
                      className="rounded-full flex-grow"
                      width="32px"
                      height="32px"
                    />
                    <div className="inline-block">
                      {NETWORK_LABEL[optionChainId]}
                    </div>
                  </div>
                )}
              </Listbox.Option>
            ))}
          </Listbox.Options>
        </Transition>
      </div>
    </Listbox>
  );
}
