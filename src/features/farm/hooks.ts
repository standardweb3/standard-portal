import {
  ChainId,
  CurrencyAmount,
  JSBI,
  MASTERCHEF_V2_ADDRESS,
} from '@digitalnative/standard-protocol-sdk';
import { Chef } from './enum';
import {
  NEVER_RELOAD,
  useSingleCallResult,
  useSingleContractMultipleData,
} from '../../state/multicall/hooks';
import { useCallback, useMemo } from 'react';
import { useMasterChefV2Contract } from '../../hooks';

import { Contract } from '@ethersproject/contracts';
import { Zero } from '@ethersproject/constants';
import concat from 'lodash/concat';
import { useActiveWeb3React } from '../../hooks/useActiveWeb3React';
import zip from 'lodash/zip';
import { useStnd } from '../../hooks/Tokens';

export function useChefContract(chef: Chef) {
  const masterChefV2Contract = useMasterChefV2Contract();
  const contracts = useMemo(
    () => ({
      [Chef.MASTERCHEF_V2]: masterChefV2Contract,
    }),
    [masterChefV2Contract],
  );
  return useMemo(() => {
    return contracts[chef];
  }, [contracts, chef]);
}

const CHEFS = {
  [ChainId.MAINNET]: [Chef.MASTERCHEF_V2],
};

export function useChefContracts(chefs: Chef[]) {
  const masterChefV2Contract = useMasterChefV2Contract();
  const contracts = useMemo(
    () => ({
      [Chef.MASTERCHEF_V2]: masterChefV2Contract,
    }),
    [masterChefV2Contract],
  );
  return chefs.map((chef) => contracts[chef]);
}

export function useUserInfo(farm, token) {
  const { account } = useActiveWeb3React();

  const contract = useChefContract(farm.chef ?? Chef.MASTERCHEF_V2);

  const args = useMemo(() => {
    if (!account) {
      return;
    }
    return [String(farm.id), String(account)];
  }, [farm, account]);

  const result = useSingleCallResult(args ? contract : null, 'userInfo', args)
    ?.result;

  const value = result?.[0];

  const amount = value ? JSBI.BigInt(value.toString()) : undefined;

  return amount ? CurrencyAmount.fromRawAmount(token, amount) : undefined;
}

export function usePendingSushi(farm) {
  const { account, chainId } = useActiveWeb3React();

  const contract = useChefContract(farm.chef ?? Chef.MASTERCHEF_V2);
  const stnd = useStnd();

  const args = useMemo(() => {
    if (!account) {
      return;
    }
    return [String(farm.id), String(account)];
  }, [farm, account]);

  const result = useSingleCallResult(
    args ? contract : null,
    'pendingSushi',
    args,
  )?.result;

  const value = result?.[0];

  const amount = value ? JSBI.BigInt(value.toString()) : undefined;

  return amount ? CurrencyAmount.fromRawAmount(stnd, amount) : undefined;
}

export function useChefPositions(
  contract?: Contract | null,
  rewarder?: Contract | null,
) {
  const { account, chainId } = useActiveWeb3React();

  const numberOfPools = useSingleCallResult(
    contract ? contract : null,
    'poolLength',
    undefined,
    NEVER_RELOAD,
  )?.result?.[0];

  const args = useMemo(() => {
    if (!account || !numberOfPools) {
      return;
    }
    return [...Array(numberOfPools.toNumber()).keys()].map((pid) => [
      String(pid),
      String(account),
    ]);
  }, [numberOfPools, account]);

  const pendingSushi = useSingleContractMultipleData(
    args ? contract : null,
    'pendingSushi',
    args,
  );

  const userInfo = useSingleContractMultipleData(
    args ? contract : null,
    'userInfo',
    args,
  );

  const getChef = useCallback(() => {
    if (MASTERCHEF_V2_ADDRESS[chainId] === contract.address) {
      return Chef.MASTERCHEF_V2;
    }
  }, [chainId, contract]);

  return useMemo(() => {
    if (!pendingSushi || !userInfo) {
      return [];
    }
    return zip(pendingSushi, userInfo)
      .map((data, i) => ({
        id: args[i][0],
        pendingSushi: data[0].result?.[0] || Zero,
        amount: data[1].result?.[0] || Zero,
        chef: getChef(),
        // pendingTokens: data?.[2]?.result,
      }))
      .filter(({ pendingSushi, amount }) => {
        return (
          (pendingSushi && !pendingSushi.isZero()) ||
          (amount && !amount.isZero())
        );
      });
  }, [args, getChef, pendingSushi, userInfo]);
}

export function usePositions() {
  const [masterChefV2Positions] = [useChefPositions(useMasterChefV2Contract())];
  return concat(masterChefV2Positions);
}
