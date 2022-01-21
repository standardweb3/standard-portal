import { getV1Address } from '@digitalnative/standard-protocol-sdk';
import { Contract } from '@ethersproject/contracts';
import { BigNumber } from 'ethers';
import { useEffect, useMemo, useState } from 'react';
import { useActiveWeb3React, useContract } from '..';
import V1_ABI from '../../constants/abis/v1.json';
import {
  useSingleCallResult,
  useSingleContractMultipleData,
} from '../../state/multicall/hooks';
import { useProtocol } from '../../state/protocol/hooks';

export function useV1Address(): string {
  const { chainId } = useActiveWeb3React();
  const protocol = useProtocol();
  return getV1Address(protocol, chainId);
}

export function useV1Contract(withSignerIfPossibe = true): Contract | null {
  const v1Address = useV1Address();
  return useContract(v1Address, V1_ABI, withSignerIfPossibe);
}

export function useV1Balance() {
  const { account } = useActiveWeb3React();
  const v1Contract = useV1Contract();

  const args = [account];
  const callResult = useSingleCallResult(
    account && v1Contract,
    'balanceOf',
    args,
  );

  return callResult?.result?.[0];
}

export function useV1Balance2() {
  const { account } = useActiveWeb3React();
  const v1Contract = useV1Contract();

  const [balance, setBalance] = useState(0);

  useEffect;
}

export function useV1Ids() {
  const { account } = useActiveWeb3React();
  const v1Contract = useV1Contract();
  const [balances, setBalances] = useState(null);
  const [v1sPromise, setV1sPromise] = useState(null);
  const [v1sData, setV1sData] = useState([]);

  useEffect(() => {
    if (v1Contract !== null) {
      v1Contract.balanceOf(account).then((res) => {
        setBalances(res.toNumber());
      });
    }
  }, [v1Contract]);

  useEffect(() => {
    if (balances !== null) {
      const _v1sPromise = [];
      for (let i = 0; i < balances; i++) {
        _v1sPromise.push(v1Contract.tokenOfOwnerByIndex(account, i));
      }
      setV1sPromise(_v1sPromise);
    }
  }, [balances]);

  useEffect(() => {
    if (v1sPromise !== null) {
      Promise.all(v1sPromise).then((values) => {
        const _v1sData = [];
        for (let i = 0; i < values.length; i++) {
          _v1sData.push(parseInt(values[i] as string));
        }
        setV1sData(_v1sData);
      });
    }
  }, [v1sPromise]);

  return v1sData;
}

export function useV1Ids2() {
  const { account } = useActiveWeb3React();
  const contract = useV1Contract();
  const balances = useSingleCallResult(
    account ? contract ?? null : null,
    'balanceOf',
    [account],
  )?.result?.[0];

  const args = useMemo(() => {
    if (!account || !balances) {
      return;
    }
    return [...Array(balances.toNumber()).keys()].map((id) => [account, id]);
  }, [balances, account]);

  const vaultIds = useSingleContractMultipleData(
    args ? contract : null,
    'tokenOfOwnerByIndex',
    args,
  )?.map((data) => {
    return data?.result?.[0]?.toNumber() ?? undefined;
  });

  return vaultIds;
}
