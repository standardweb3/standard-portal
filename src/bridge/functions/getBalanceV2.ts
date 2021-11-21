import { isAddress } from '@ethersproject/address';
import { useBatchWeb3, getContract } from './web3UtilsV2';

import ERC20_INTERFACE from '../../constants/abis/erc20';
import { fromWei } from './tools';

const contract = getContract();

function getBlandTs(
  tokenList: any,
  chainId?: any,
  account?: string | null | undefined,
) {
  return new Promise(async (resolve) => {
    const len = tokenList.length;
    const list: any = {};

    const arr: any = [];

    for (let i = 0; i < len; i++) {
      const tokenObj = tokenList[i];
      if (tokenObj.underlying) {
        contract.options.address = tokenObj.underlying;
        const tsData = contract.methods.balanceOf(tokenObj.token).encodeABI();
        arr.push({
          data: tsData,
          to: tokenObj.underlying,
          token: tokenObj.token,
          methods: 'balanceOf',
          key: 'ts',
          dec: tokenObj.dec,
        });
      }

      if (isAddress(tokenObj.token)) {
        contract.options.address = tokenObj.token;
        const tsData = contract.methods.totalSupply().encodeABI();
        arr.push({
          data: tsData,
          to: tokenObj.token,
          token: tokenObj.token,
          methods: 'totalSupply',
          key: 'anyts',
          dec: tokenObj.dec,
        });
      }

      if (account) {
        if (isAddress(tokenObj.token)) {
          const blData = contract.methods.balanceOf(account).encodeABI();
          arr.push({
            data: blData,
            to: tokenObj.token,
            token: tokenObj.token,
            methods: 'balanceOf',
            key: 'balance',
            dec: tokenObj.dec,
          });
        } else {
          arr.push({
            token: tokenObj.token,
            property: 'eth',
            methods: 'getBalance',
            inputFormatter: [account, 'latest'],
            key: 'balance',
            dec: tokenObj.dec,
          });
        }
      }
    }

    useBatchWeb3(chainId, arr).then((res: any) => {
      try {
        for (let i = 0, len = arr.length; i < len; i++) {
          if (res[i].result) {
            const bl = ERC20_INTERFACE?.decodeFunctionResult(
              'balanceOf',
              res[i].result,
            )?.toString();

            if (!list[arr[i].token]) list[arr[i].token] = {};

            list[arr[i].token][arr[i].key] = fromWei(bl, arr[i].dec);
          }
        }
      } catch (error) {
        console.log(error);
      }
      resolve(list);
    });
  });
}
export function getNodeTotalsupply(
  token?: string,
  chainId?: any,
  dec?: any,
  account?: string | null | undefined,
  underlying?: string | undefined,
) {
  return new Promise((resolve) => {
    if (token && chainId) {
      const tokenList = [
        {
          token: token,
          dec: dec,
          underlying: underlying,
        },
      ];
      getBlandTs(tokenList, chainId, account).then((res: any) => {
        // console.log(res)
        resolve(res);
      });
    } else {
      resolve('');
    }
  });
}
