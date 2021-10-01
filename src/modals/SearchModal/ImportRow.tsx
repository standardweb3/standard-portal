import React, { CSSProperties } from 'react';
import { useIsTokenActive, useIsUserAddedToken } from '../../hooks/Tokens';
import { Button } from '../../components-ui/Button';
import { CurrencyLogo } from '../../components-ui/CurrencyLogo';
import { ListLogo } from '../../components-ui/Logo/ListLogo';
import { Token } from '@digitalnative/standard-protocol-sdk-test';
import styled from '@emotion/styled';
import { WrappedTokenInfo } from '../../state/lists/wrappedTokenInfo';
import { CheckCircleIcon, TrashIcon } from '@heroicons/react/outline';
import { Typographies } from '../../utils/Typography';
import { Question } from '../../components-ui/Question';

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
  transparent,
  showImportView,
  setImportToken,
  handleRemove,
}: {
  token: Token;
  style?: CSSProperties;
  transparent?: boolean;
  showImportView: () => void;
  setImportToken: (token: Token) => void;
  handleRemove?: () => void;
}) {
  // check if already active on list or local storage tokens
  const isAdded = useIsUserAddedToken(token);
  const isActive = useIsTokenActive(token);

  const list = token instanceof WrappedTokenInfo ? token.list : undefined;

  return (
    <div
      className={
        transparent ? Typographies.importRowTransparent : Typographies.importRow
      }
    >
      <CurrencyLogo currency={token} size={'36px'} className="rounded-full" />
      <div className="flex justify-center items-center">
        <div className="font-semibold">{token.symbol}</div>
        <div className="ml-2 font-light">
          <NameOverflow title={token.name}>{token.name}</NameOverflow>
        </div>
      </div>
      {list && list.logoURI && (
        <Question
          text={
            <div className="flex items-center space-x-1">
              <div className="mr-1 text-sm">{list.name}</div>
              <ListLogo logoURI={list.logoURI} size="12px" />
            </div>
          }
        />
      )}
      {!isActive && !isAdded ? (
        <div className="flex-1 flex justify-end">
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
        </div>
      ) : (
        <div className="flex-1 flex justify-end">
          <div
            onClick={handleRemove}
            className="rounded-full p-1 bg-opaque-secondary cursor-pointer"
          >
            <TrashIcon className="w-4 h-4 " />
          </div>
        </div>
      )}
    </div>
  );
}
