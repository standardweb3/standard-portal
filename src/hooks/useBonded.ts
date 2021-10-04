import { BigNumber } from 'ethers';
import { useEffect, useState } from 'react';
import {
  useActiveWeb3React,
  useDividendPoolAddress,
  useDividendPoolContract,
  useSTNDContract,
} from '.';
import { useBlockNumber } from '../state/application/hooks';

export function useBonded(): BigNumber | null {
  const { account } = useActiveWeb3React();
  const lastBlockNumber = useBlockNumber();
  const dividendPoolContract = useDividendPoolContract();
  const [bonded, setBonded] = useState(null);

  useEffect(() => {
    if (account !== null && dividendPoolContract !== null) {
      dividendPoolContract.bonded(account).then((res) => {
        setBonded(res);
      });
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
      stndContract.balanceOf(dividendPoolAddress).then((res) => {
        setTotalSupply(res);
      });
    }
  }, [dividendPoolAddress, stndContract, lastBlockNumber]);

  return totalSupply;
}
