import { useMemo } from 'react';
import useSWR, { SWRResponse } from 'swr';
import { useActiveWeb3React } from '../../hooks';
import { getRouterUrl } from '../core/constants';

export function useFetchRouterTokenList() {
  const { chainId } = useActiveWeb3React();

  const { data, error }: SWRResponse<any, Error> = useSWR(
    getRouterUrl(chainId),
    (url) => fetch(url).then((result) => result.json()),
  );

  const tokens = useMemo(() => {
    const list: any = {};

    if (data) {
      for (const version in data) {
        if (version.indexOf('ARB') !== -1) continue;
        for (const token in data[version]) {
          if (
            version.toLowerCase().indexOf('underlying') !== -1 &&
            data[version][token].symbol === 'DAI'
          )
            continue;
          list[token] = {
            ...data[version][token],
            sort: version.toLowerCase().indexOf('stable') !== -1 ? 0 : 1,
          };
        }
      }
    }
    return list;
  }, [data, error]);

  return tokens;
  // return useCallback(
  //   async () => {
  //     if (!chainId) return
  //     if ((Date.now() - curList?.timestamp) <= timeout && curList?.tokenList && Object.keys(curList?.tokenList).length > 0) {
  //       return
  //     } else {
  //       const UV:any = USE_VERSION
  //       const version:any = [VERSION.V5, VERSION.V6, VERSION.V7].includes(UV) ? 'all' : USE_VERSION
  //       const url = `${config.bridgeApi}/v3/serverinfoV4?chainId=${chainId}&version=${version}`
  //       return getUrlData(url)
  //         .then((tokenList:any) => {
  //           const list:any = {}
  //           if (tokenList.msg === 'Success' && tokenList.data) {
  //             const tList = tokenList.data
  //             if (version === 'all') {
  //               for (const version in tList) {
  //                 if (version.indexOf('ARB') !== -1) continue
  //                 for (const token in tList[version]) {
  //                   if (version.toLowerCase().indexOf('underlying') !== -1 && tList[version][token].symbol === 'DAI') continue
  //                   list[token] = {
  //                     ...tList[version][token],
  //                     sort: version.toLowerCase().indexOf('stable') !== -1 ? 0 : 1
  //                   }
  //                 }
  //               }
  //             } else {
  //               for (const token in tList) {
  //                 // if (version.toLowerCase().indexOf('underlying') !== -1 && tList[token].symbol === 'DAI') continue
  //                 list[token] = {
  //                   ...tList[token],
  //                   sort: version.toLowerCase().indexOf('stable') !== -1 ? 0 : 1
  //                 }
  //               }
  //             }
  //           }
  //           dispatch(routerTokenList({ chainId, tokenList:list }))
  //           return list
  //         })
  //         .catch(error => {
  //           console.debug(`Failed to get list at url `, error)
  //           dispatch(routerTokenList({ chainId, tokenList: curList.tokenList }))
  //           return {}
  //         })
  //     }
  //   },
  //   [dispatch, chainId]
  // )
}
