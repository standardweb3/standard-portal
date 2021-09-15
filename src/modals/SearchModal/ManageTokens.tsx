import React, {
  RefObject,
  useCallback,
  useMemo,
  useRef,
  useState,
} from 'react';
import {
  useRemoveUserAddedToken,
  useUserAddedTokens,
} from '../../state/user/hooks';

import { CurrencyLogo } from '../../components-ui/CurrencyLogo';
import CurrencyModalView from './CurrencyModalView';
import { ExternalLink } from '../../components-ui/ExternalLink';
import { ExternalLinkIcon } from '../../components-ui/ExternalLinkIcon';
import ImportRow from './ImportRow';
import { Token } from '@digitalnativeinc/standard-protocol-sdk';
import { getExplorerLink } from '../../functions/explorer';
import { isAddress } from '../../functions/validate';
import { useActiveWeb3React } from '../../hooks/useActiveWeb3React';
import { useToken } from '../../hooks/Tokens';
import { TrashIcon } from '@heroicons/react/outline';

function ManageTokens({
  setModalView,
  setImportToken,
}: {
  setModalView: (view: CurrencyModalView) => void;
  setImportToken: (token: Token) => void;
}) {
  const { chainId } = useActiveWeb3React();

  const [searchQuery, setSearchQuery] = useState<string>('');

  // manage focus on modal show
  const inputRef = useRef<HTMLInputElement>();
  const handleInput = useCallback((event) => {
    const input = event.target.value;
    const checksummedInput = isAddress(input);
    setSearchQuery(checksummedInput || input);
  }, []);

  // if they input an address, use it
  const isAddressSearch = isAddress(searchQuery);
  const searchToken = useToken(searchQuery);

  // all tokens for local lisr
  const userAddedTokens: Token[] = useUserAddedTokens();
  const removeToken = useRemoveUserAddedToken();

  const handleRemoveAll = useCallback(() => {
    if (chainId && userAddedTokens) {
      userAddedTokens.map((token) => {
        return removeToken(chainId, token.address);
      });
    }
  }, [removeToken, userAddedTokens, chainId]);

  const tokenList = useMemo(() => {
    return (
      chainId &&
      userAddedTokens.map((token) => (
        <div
          className="
            flex justify-between items-center 
            space-x-2 w-full
            bg-opaque
            rounded-20
            p-3
            box-border
            "
          key={token.address}
        >
          <CurrencyLogo currency={token} className="rounded-full" size={36} />

          <div>
            <div className="flex items-center space-x-2">
              <ExternalLink
                className="!text-white"
                href={getExplorerLink(chainId, token.address, 'address')}
              >
                <div className="font-semibold">{token.symbol}</div>
              </ExternalLink>
              <ExternalLinkIcon
                className="text-primary"
                href={getExplorerLink(chainId, token.address, 'address')}
              />
            </div>
            <div className="text-xs truncate">{token.address}</div>
          </div>
          <div className="p-1 bg-opaque-secondary rounded-full">
            <TrashIcon
              onClick={() => removeToken(chainId, token.address)}
              className="w-4 h-4"
            />
          </div>
        </div>
      ))
    );
  }, [userAddedTokens, chainId, removeToken]);

  return (
    <div className="relative flex-1 w-full h-full mt-4 space-y-4 overflow-y-hidden">
      <div className="grid gap-4">
        <input
          id="token-search-input"
          type="text"
          placeholder={'0x0000'}
          className={`
          w-full 
          bg-opaque
          rounded-xl
          placeholder-info 
          focus:placeholder-text 
          font-bold
          px-6 py-3.5 appearance-none`}
          value={searchQuery}
          autoComplete="off"
          onChange={handleInput}
          ref={inputRef as RefObject<HTMLInputElement>}
          autoCorrect="off"
        />
        {searchQuery !== '' && !isAddressSearch && (
          <div className="text-red">Enter valid token address</div>
        )}
        {searchToken && (
          <ImportRow
            token={searchToken}
            showImportView={() => setModalView(CurrencyModalView.importToken)}
            setImportToken={setImportToken}
            style={{ height: 'fit-content' }}
          />
        )}
        <div className="flex justify-between">
          <div className="font-semibold">
            {userAddedTokens?.length} Custom{' '}
            {userAddedTokens.length === 1 ? 'Token' : 'Tokens'}
          </div>
          {userAddedTokens.length > 0 && (
            <div onClick={handleRemoveAll}>
              <div>Clear all</div>
            </div>
          )}
        </div>
        {tokenList}
      </div>
      <div className="absolute bottom-0 p-3 text-sm">
        Tip: Custom tokens are stored locally in your browser
      </div>
    </div>
  );
}

export default ManageTokens;
