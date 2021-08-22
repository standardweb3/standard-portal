import React from 'react';
import { Currency, Token } from '@sushiswap/sdk';

import { TokenList } from '@uniswap/token-lists/dist/types';
import { getExplorerLink } from '../../functions/explorer';
import { shortenAddress } from '../../functions';
import { useActiveWeb3React } from '../../hooks/useActiveWeb3React';
import { useAddUserToken } from '../../state/user/hooks';
import { Button } from '../../components-ui/Button';
import { ModalHeader } from '../../components-ui/Modal/ModalHeader';
import { CurrencyLogo } from '../../components-ui/CurrencyLogo';
import { ExternalLink } from '../../components-ui/ExternalLink';
import ListLogo from '../../components-ui/Logo/ListLogo';

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
    <div className="relative w-full space-y-3 overflow-auto">
      <ModalHeader
        onBack={onBack}
        onClose={onDismiss}
        title={`Import ${tokens.length > 1 ? 'Token' : 'Tokens'}
        `}
      />
      <div>
        This token doesn't appear on the active token list(s). Make sure this is
        the token that you want to trade
      </div>
      {tokens.map((token) => {
        return (
          <div
            key={'import' + token.address}
            className=".token-warning-container rounded p-5"
          >
            <div className="space-x-3">
              <CurrencyLogo currency={token} size={'32px'} />
              <div>
                <div className="mx-2 text-xl font-medium text-high-emphesis">
                  {token.symbol}
                </div>
                <div className="text-sm font-light text-secondary">
                  {token.name}
                </div>
              </div>
              {chainId && (
                <ExternalLink
                  href={getExplorerLink(chainId, token.address, 'address')}
                >
                  {shortenAddress(token.address)}
                </ExternalLink>
              )}
              {list !== undefined ? (
                <div className="flex justify-center">
                  {list.logoURI && (
                    <ListLogo logoURI={list.logoURI} size="16px" />
                  )}
                  <div className="ml-2 text-sm text-secondary">
                    via {list.name}
                  </div>
                </div>
              ) : (
                <div>
                  <div className="flex justify-center">
                    <div>ALERT TRIANGLE</div>
                    <div className="ml-1 text-xs font-semibold text-red">
                      Unknown Source
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        );
      })}
      <Button
        type="bordered"
        onClick={() => {
          tokens.map((token) => addToken(token));
          handleCurrencySelect && handleCurrencySelect(tokens[0]);
        }}
        className=".token-dismiss-button"
      >
        Import
      </Button>
    </div>
  );
}
