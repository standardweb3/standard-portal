import { useEffect, useState } from 'react';

import { injected } from '../connectors';
import { isMobile } from 'react-device-detect';
import { useWeb3React as useWeb3ReactCore } from '@web3-react/core';
import { useUserAgreement } from '../state/user/hooks';

function useEagerConnect() {
  const { activate, active } = useWeb3ReactCore(); // specifically using useWeb3ReactCore because of what this hook does
  const [tried, setTried] = useState(false);
  const { userAgreement } = useUserAgreement();

  useEffect(() => {
    injected.isAuthorized().then((isAuthorized) => {
      if (isAuthorized && userAgreement) {
        activate(injected, undefined, true).catch(() => {
          setTried(true);
        });
      } else {
        // need testing
        if (isMobile && window.ethereum && userAgreement) {
          activate(injected, undefined, true).catch(() => {
            setTried(true);
          });
        } else {
          setTried(true);
        }
      }
    });
  }, [activate]); // intentionally only running on mount (make sure it's only mounted once :))

  // if the connection worked, wait until we get confirmation of that to flip the flag
  useEffect(() => {
    if (active) {
      setTried(true);
    }
  }, [active]);

  return tried;
}

export default useEagerConnect;
