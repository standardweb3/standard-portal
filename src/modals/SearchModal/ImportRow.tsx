import React, { CSSProperties } from 'react';
import { useIsTokenActive, useIsUserAddedToken } from '../../hooks/Tokens';
import { Button } from '../../components-ui/Button';
import { CurrencyLogo } from '../../components-ui/CurrencyLogo';
import { ListLogo } from '../../components-ui/Logo/ListLogo';
import { Token } from '@sushiswap/sdk';
import styled from '@emotion/styled';
import { WrappedTokenInfo } from '../../state/lists/wrappedTokenInfo';
import { CheckCircleIcon } from '@heroicons/react/outline';

const TokenSection = styled.div<{ dim?: boolean }>`
  height: 56px;
  display: grid;
  grid-template-columns: auto minmax(auto, 1fr) auto;
  grid-gap: 16px;
  align-items: center;

  opacity: ${({ dim }) => (dim ? '0.4' : '1')};
`;

const NameOverflow = styled.div`
  white-space: nowrap;
  text-overflow: ellipsis;
  overflow: hidden;
  text-overflow: ellipsis;
  max-width: 140px;
  font-size: 12px;
`;

export default function ImportRow({
  token,
  style,
  dim,
  showImportView,
  setImportToken,
}: {
  token: Token;
  style?: CSSProperties;
  dim?: boolean;
  showImportView: () => void;
  setImportToken: (token: Token) => void;
}) {
  // check if already active on list or local storage tokens
  const isAdded = useIsUserAddedToken(token);
  const isActive = useIsTokenActive(token);

  const list = token instanceof WrappedTokenInfo ? token.list : undefined;

  return (
    <TokenSection style={style}>
      <CurrencyLogo
        currency={token}
        size={'24px'}
        style={{ opacity: dim ? '0.6' : '1' }}
      />
      <div style={{ opacity: dim ? '0.6' : '1' }}>
        <div className="flex justify-center items-center">
          <div className="font-semibold">{token.symbol}</div>
          <div className="ml-2 font-light">
            <NameOverflow title={token.name}>{token.name}</NameOverflow>
          </div>
        </div>
        {list && list.logoURI && (
          <div className="flex items-center">
            <div className="mr-1 text-sm">via {list.name}</div>
            <ListLogo logoURI={list.logoURI} size="12px" />
          </div>
        )}
      </div>
      {!isActive && !isAdded ? (
        <Button
          type="bordered"
          color="primary"
          style={{
            width: 'fit-content',
            padding: '6px 12px',
          }}
          onClick={() => {
            setImportToken && setImportToken(token);
            showImportView();
          }}
        >
          Import
        </Button>
      ) : (
        <div className="flex items-center" style={{ minWidth: 'fit-content' }}>
          <CheckCircleIcon className="w-4 h-4" />
          <div className="text-green">Active</div>
        </div>
      )}
    </TokenSection>
  );
}
