import { WNATIVE } from '@digitalnative/standard-protocol-sdk';
import { useMemo } from 'react';
import useSWR, { SWRResponse } from 'swr';
import { useActiveWeb3React } from '..';
import {
  AnyswapTokensMap,
  AnyswapResultPairInfo,
} from '../../features/bridge/types';

export function useAnyswapInfo() {
  const { chainId } = useActiveWeb3React();
  const {
    data,
    error,
  }: SWRResponse<
    AnyswapTokensMap,
    Error
  > = useSWR(`https://bridgeapi.anyswap.exchange/v2/serverInfo/1`, (url) =>
    fetch(url).then((result) => result.json()),
  );

  const anyswapInfo = useMemo(() => {
    let result: AnyswapTokensMap = {};
    Object.keys(data || {}).forEach((key) => {
      const info: AnyswapResultPairInfo = data[key];

      let sourceContractAddress = info.SrcToken.ContractAddress;
      if (!sourceContractAddress) {
        sourceContractAddress = WNATIVE[parseInt(info.srcChainID)]?.address;
      }

      if (!sourceContractAddress) return;

      sourceContractAddress = sourceContractAddress.toLowerCase();

      let existingSource = result[parseInt(info.srcChainID)];
      if (!existingSource) {
        result[parseInt(info.srcChainID)] = {
          [sourceContractAddress]: {
            destChainID: info.destChainID,
            id: info.PairID,
            logoUrl: info.logoUrl,
            name: info.name,
            symbol: info.symbol,
            token: info.DestToken,
            other: info.SrcToken,
          },
        };
      } else {
        result[parseInt(info.srcChainID)][sourceContractAddress] = {
          destChainID: info.destChainID,
          id: info.PairID,
          logoUrl: info.logoUrl,
          name: info.name,
          symbol: info.symbol,
          token: info.DestToken,
          other: info.SrcToken,
        };
      }

      let destContractAddress = info.DestToken.ContractAddress;
      if (!destContractAddress) {
        destContractAddress = WNATIVE[parseInt(info.destChainID)].address;
      }
      if (!destContractAddress) return;

      destContractAddress = destContractAddress.toLowerCase();

      let existingDestination = result[parseInt(info.destChainID)];
      if (!existingDestination) {
        result[parseInt(info.destChainID)] = {
          [destContractAddress]: {
            destChainID: info.srcChainID,
            id: info.PairID,
            logoUrl: info.logoUrl,
            name: info.name,
            symbol: info.symbol,
            token: info.SrcToken,
            other: info.DestToken,
          },
        };
      } else {
        result[parseInt(info.destChainID)][destContractAddress] = {
          destChainID: info.srcChainID,
          id: info.PairID,
          logoUrl: info.logoUrl,
          name: info.name,
          symbol: info.symbol,
          token: info.SrcToken,
          other: info.DestToken,
        };
      }
    });

    return result;
  }, [data, error]);

  return { anyswapInfo, anyswapError: error };
}

export function useAnyswapBridgeInfo() {
  const { chainId } = useActiveWeb3React();

  const {
    data,
    error,
  }: SWRResponse<
    AnyswapTokensMap,
    Error
  > = useSWR(
    `https://bridgeapi.anyswap.exchange/v3/serverInfo?chainId=${chainId}`,
    (url) => fetch(url).then((result) => result.json()),
  );
}
