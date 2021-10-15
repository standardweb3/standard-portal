import {
  ChainId,
  Currency,
  WNATIVE,
} from '@digitalnative/standard-protocol-sdk';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import {
  NETWORK_ICON,
  NETWORK_LABEL,
  SUPPORTED_NETWORKS,
} from '../../constants/networks';
import { AvailableChainsInfo } from '../../features/bridge/types';
import {
  useActiveWeb3React,
  useAnyswapTokenContract,
  useTokenContract,
} from '../../hooks';
import { useAnyswapInfo } from '../../hooks/bridge/useBridge';
import { useTransactionAdder } from '../../state/transactions/hooks';
import { useCurrencyBalance } from '../../state/wallet/hooks';

export default function Bridge() {
  const { account, chainId } = useActiveWeb3React();
  const { push } = useRouter();

  const addTransaction = useTransactionAdder();

  const chainFrom = {
    id: chainId,
    icon: NETWORK_ICON[chainId],
    name: NETWORK_LABEL[chainId],
  };

  const [chainTo, setChainTo] = useState<ChainId | null>(null);

  const [tokenList, setTokenList] = useState<Currency[] | null>([]);
  const [currency0, setCurrency0] = useState<Currency | null>(null);
  const [currencyAmount, setCurrencyAmount] = useState<string | null>('');
  const [
    tokenToBridge,
    setTokenToBridge,
  ] = useState<AvailableChainsInfo | null>(null);
  const currencyContract = useTokenContract(
    currency0?.isToken && currency0?.address,
    true,
  );

  const currencyBalance = useCurrencyBalance(account, currency0);

  const { anyswapInfo, anyswapError } = useAnyswapInfo();
  return <div>bridge</div>;

  // useEffect(() => {
  //   let tokens: Currency[] = Object.keys((anyswapInfo && anyswapInfo[chainFrom.id]) || {})
  //     .filter((r) => anyswapInfo[chainFrom.id][r].destChainID == chainTo.id.toString())
  //     .map((r) => {
  //       const info: AvailableChainsInfo = anyswapInfo[chainFrom.id][r]
  //       if (r.toLowerCase() == WNATIVE[chainFrom.id].address.toLowerCase()) {
  //         if (chainFrom.id == ChainId.MOONRIVER) {
  //           return Moonriver.onChain(chainFrom.id)
  //         }
  //         if (chainFrom.id == ChainId.BSC) {
  //           return Binance.onChain(chainFrom.id)
  //         }
  //         if (chainFrom.id == ChainId.MAINNET) {
  //           return Ether.onChain(chainFrom.id)
  //         }
  //       }
  //       return new Token(chainFrom.id, getAddress(r), info.token.Decimals, info.token.Symbol, info.name)
  //     })

  //   setTokenList(tokens)
  //   setCurrency0(null)
  //   setCurrencyAmount('')
  // }, [chainFrom, anyswapInfo, chainTo.id])
}
