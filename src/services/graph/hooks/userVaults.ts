import { useCallback, useEffect, useState } from 'react';
import { useActiveWeb3React } from '../../../hooks';
import { vaultsGraphClient } from '../fetchers/vault';
import { vaultsQuery } from '../queries/vault';

export const useUserVaults2 = () => {
  const { account, chainId } = useActiveWeb3React();

  const vaultClient = vaultsGraphClient(chainId);
  const [isLoading, setLoading] = useState(false);
  const [userVaults, setUserVaults] = useState([]);

  let resultArray = [];
  const fetchUserVaults = useCallback(async () => {
    if (account == '') {
      setUserVaults([]);
      return;
    }
    try {
      setLoading(true);
      let skip = 0;
      let results = await vaultClient.query({
        query: vaultsQuery,
        variables: {
          user: account.toLowerCase(),
        },
      });

      while (results.data.vaults.length === 1000) {
        skip += 1000;
        resultArray = resultArray.concat(results.data.vaults);
        results = await vaultClient.query({
          query: vaultsQuery,
          variables: {
            user: account.toLowerCase(),
            skip,
          },
        });
      }
      resultArray = resultArray.concat(results.data.vaults);

      //   setTimeout(() => {}, 1000);
      setUserVaults(resultArray);
      setLoading(false);
    } catch (err) {
      console.error('fetch user vaults error: ', +err);
      setUserVaults([]);
    }
  }, [account, chainId]);

  useEffect(() => {
    fetchUserVaults();
  }, [fetchUserVaults, account, chainId]);

  return {
    isLoading,
    userVaults,
  };
};
