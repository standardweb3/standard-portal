import React from 'react';
import { Currency, Token } from '@digitalnative/standard-protocol-sdk';

import { TokenList } from '@uniswap/token-lists/dist/types';
import { getExplorerLink } from '../../functions/explorer';
import { shortenAddress } from '../../functions';
import { useActiveWeb3React } from '../../hooks/useActiveWeb3React';
import { useAddUserToken } from '../../state/user/hooks';
import { Button } from '../../components-ui/Button';
import { ModalHeader } from '../../components-ui/Modal/ModalHeader';
import { CurrencyLogo } from '../../components-ui/CurrencyLogo';
import { ExternalLink } from '../../components-ui/ExternalLink';
import { ListLogo } from '../../components-ui/Logo/ListLogo';
import { ExclamationCircleIcon } from '@heroicons/react/outline';
import { Alert } from '../../components-ui/Alert';

interface ImportProps {
  tokens: Token[];
  list?: TokenList;
  onBack?: () => void;
  onDismiss?: () => void;
  handleCurrencySelect?: (currency: Currency) => void;
}

export function ImportToken({
  tokens,
  list,
  onBack,
  onDismiss,
  handleCurrencySelect,
}: ImportProps) {
  const { chainId } = useActiveWeb3React();

  const addToken = useAddUserToken();
  return (
    <div className="relative w-full overflow-auto flex flex-col justify-center">
      <ModalHeader
        onBack={onBack}
        onClose={onDismiss}
        title={`Import ${tokens.length > 1 ? 'Token' : 'Tokens'}
        `}
      />
      <div className="mt-6">
        This token doesn't appear on the active token list(s). Make sure this is
        the token that you want to trade
      </div>
      {tokens.map((token) => {
        return (
          <div
            key={'import' + token.address}
            className=".token-warning-container rounded"
          >
            <div className="space-y-5 mt-6">
              <div className="flex items-center space-x-3">
                {chainId && (
                  <ExternalLink
                    color="warn"
                    className="flex-1"
                    href={getExplorerLink(chainId, token.address, 'address')}
                  >
                    {shortenAddress(token.address)}
                  </ExternalLink>
                )}
                <CurrencyLogo currency={token} size={'48px'} />
                <div className="flex flex-col">
                  <div className="text-xl font-medium">{token.symbol}</div>
                  <div className="text-sm font-light">{token.name}</div>
                </div>
              </div>
              {list !== undefined ? (
                <div className="flex justify-center">
                  {list.logoURI && (
                    <ListLogo logoURI={list.logoURI} size="16px" />
                  )}
                  <div className="ml-2 text-sm">via {list.name}</div>
                </div>
              ) : (
                <Alert
                  type="error"
                  dismissable={false}
                  showIcon
                  message={`Unknown Source`}
                />
              )}
            </div>
          </div>
        );
      })}
      <Button
        onClick={() => {
          tokens.map((token) => addToken(token));
          handleCurrencySelect && handleCurrencySelect(tokens[0]);
        }}
        className=".token-dismiss-button py-4 px-4 mt-6 text-lg"
      >
        Import
      </Button>
    </div>
  );
}
