import { useEffect } from 'react';
import ReactGA from 'react-ga';
import { useActiveWeb3React } from '../../hooks';
import usePrevious from '../../hooks/usePrevious';
import { SUPPORTED_NETWORKS } from '../../modals/NetworkModal';

export function NetworkLogger(): null {
  const { chainId } = useActiveWeb3React();
  const previousChainId = usePrevious(chainId);

  const logNetworkChange = (prevChainId, chainId) => {
    if (SUPPORTED_NETWORKS[chainId] && prevChainId !== chainId) {
      ReactGA.event({
        category: 'Network',
        action: 'Change Network',
        label: [
          SUPPORTED_NETWORKS[prevChainId] && prevChainId
            ? prevChainId
            : 'Enter',
          chainId,
        ].join('/'),
      });
    }
  };

  useEffect(() => {
    logNetworkChange(previousChainId, chainId);
  }, [chainId]);

  return null;
}
