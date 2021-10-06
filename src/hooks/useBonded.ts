import { BigNumber } from 'ethers';
import { useEffect, useState } from 'react';
import {
  useActiveWeb3React,
  useDividendPoolAddress,
  useDividendPoolContract,
  useSTNDContract,
} from '.';
import { useBlockNumber } from '../state/application/hooks';
import useCurrentBlockTimestamp from './useCurrentBlockTimestamp';

export function useBonded(): BigNumber | null {
  const { account } = useActiveWeb3React();
  const lastBlockNumber = useBlockNumber();
  const dividendPoolContract = useDividendPoolContract();
  const [bonded, setBonded] = useState(null);

  useEffect(() => {
    if (account !== null && dividendPoolContract !== null) {
      dividendPoolContract
        .bonded(account)
        .then((res) => {
          setBonded(res);
        })
        .catch((err) => console.error('fetch bonded error', err));
    }
  }, [account, dividendPoolContract, lastBlockNumber]);

  return bonded;
}

export function useBondSupply(): BigNumber | null {
  const stndContract = useSTNDContract();
  const dividendPoolAddress = useDividendPoolAddress();
  const lastBlockNumber = useBlockNumber();
  const [totalSupply, setTotalSupply] = useState(null);
  useEffect(() => {
    if (stndContract !== null) {
      stndContract
        .balanceOf(dividendPoolAddress)
        .then((res) => {
          setTotalSupply(res);
        })
        .catch((err) => console.log('fetch bond supply error', err));
    }
  }, [dividendPoolAddress, stndContract, lastBlockNumber]);

  return totalSupply;
}

export function useLastBonded() {
  const { account } = useActiveWeb3React();
  const dividendPoolContract = useDividendPoolContract();
  const lastBlockNumber = useBlockNumber();
  const [lastBonded, setLastBonded] = useState(null);

  useEffect(() => {
    if (dividendPoolContract !== null) {
      dividendPoolContract
        .lastBonded(account)
        .then((res) => {
          setLastBonded(res);
        })
        .catch((err) => console.log('fetch last bonded error', err));
    }
  }, [dividendPoolContract, account, lastBlockNumber]);

  return lastBonded;
}

export function useLastClaimed(token: string) {
  const { account } = useActiveWeb3React();
  const dividendPoolContract = useDividendPoolContract();
  const [lastClaimed, setLastClaimed] = useState(null);

  useEffect(() => {
    if (dividendPoolContract !== null) {
      dividendPoolContract
        .getLastClaimed(token)
        .then((res) => {
          setLastClaimed(res);
        })
        .catch((err) => console.log('fetch last claimed error', err));
    }
  }, [dividendPoolContract, account]);

  return lastClaimed;
}

export function useRemainingClaimTime(token: string): number | null {
  const lastClaimed = useLastClaimed(token);
  const currentBlockTimestamp = useCurrentBlockTimestamp();
  const diff =
    lastClaimed !== null && currentBlockTimestamp !== undefined
      ? lastClaimed.toNumber() + 2592000 - currentBlockTimestamp.toNumber()
      : null;
  return diff;
}

export function useRemainingBondingTime(): number | null {
  const lastBonded = useLastBonded();
  const currentBlockTimestamp = useCurrentBlockTimestamp();
  const diff =
    lastBonded !== null && currentBlockTimestamp !== undefined
      ? lastBonded.toNumber() + 2592000 - currentBlockTimestamp.toNumber()
      : null;
  return diff;
}
