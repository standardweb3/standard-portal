import { Checkbox, PaddedColumn, TextDot } from './styleds';
import React, { useCallback, useState } from 'react';
import { enableList, removeList } from '../../state/lists/actions';

import { AppDispatch } from '../../state';
import { Button } from '../../components-ui/Button';
import { XIcon } from '@heroicons/react/outline';
import CurrencyModalView from './CurrencyModalView';
import { ExternalLink } from '../../components-ui/ExternalLink';
import { ListLogo } from '../../components-ui/Logo/ListLogo';
import ReactGA from 'react-ga';
import { TokenList } from '@uniswap/token-lists';
import styled from '@emotion/styled';
import { useAllLists } from '../../state/lists/hooks';
import { useDispatch } from 'react-redux';
import { useFetchListCallback } from '../../hooks/useFetchListCallback';

const Wrapper = styled.div`
  position: relative;
  width: 100%;
  overflow: auto;
`;

interface ImportProps {
  listURL: string;
  list: TokenList;
  onDismiss: () => void;
  setModalView: (view: CurrencyModalView) => void;
}

function ImportList({ listURL, list, setModalView, onDismiss }: ImportProps) {
  const dispatch = useDispatch<AppDispatch>();

  // user must accept
  const [confirmed, setConfirmed] = useState(false);

  const lists = useAllLists();
  const fetchList = useFetchListCallback();

  // monitor is list is loading
  const adding = Boolean(lists[listURL]?.loadingRequestId);
  const [addError, setAddError] = useState<string | null>(null);

  const handleAddList = useCallback(() => {
    if (adding) return;
    setAddError(null);
    fetchList(listURL)
      .then(() => {
        ReactGA.event({
          category: 'Lists',
          action: 'Add List',
          label: listURL,
        });

        // turn list on
        dispatch(enableList(listURL));
        // go back to lists
        setModalView(CurrencyModalView.manage);
      })
      .catch((error) => {
        ReactGA.event({
          category: 'Lists',
          action: 'Add List Failed',
          label: listURL,
        });
        setAddError(error.message);
        dispatch(removeList(listURL));
      });
  }, [adding, dispatch, fetchList, listURL, setModalView]);

  return (
    <Wrapper>
      <div style={{ width: '100%', flex: '1 1' }}>
        <div className="flex justify-between">
          <div
            style={{ cursor: 'pointer' }}
            onClick={() => setModalView(CurrencyModalView.manage)}
          >
            ArrowLeft
          </div>
          <div>Import List</div>
          <XIcon onClick={onDismiss} />
        </div>
      </div>
      <div>
        <div className="flex flex-col justify-center">
          <div style={{ padding: '12px 20px' }}>
            <div className="flex justify-between">
              <div className="flex">
                {list.logoURI && (
                  <ListLogo logoURI={list.logoURI} size="40px" />
                )}
                <div
                  className="flex flex-col justify-center"
                  style={{ marginLeft: '20px' }}
                >
                  <div className="flex">
                    <div className="mr-1.5 font-semibold">{list.name}</div>
                    <TextDot />
                    <div className="ml-1.5">{list.tokens.length} tokens</div>
                  </div>
                  <ExternalLink
                    href={`https://tokenlists.org/token-list?url=${listURL}`}
                  >
                    <div className="font-sm text-blue">{listURL}</div>
                  </ExternalLink>
                </div>
              </div>
            </div>
          </div>
          <div>
            <div
              className="flex flex-col justify-center"
              style={{ textAlign: 'center', gap: '16px', marginBottom: '12px' }}
            >
              TriangleIcon
              <div className="text-lg font-medium text-red">
                Import at your own risk{' '}
              </div>
            </div>

            <div
              className="flex flex-col justify-center"
              style={{ textAlign: 'center', gap: '16px', marginBottom: '12px' }}
            >
              <div className="font-semibold text-red">
                By adding this list you are implicitly trusting that the data is
                correct. Anyone can create a list, including creating fake
                versions of existing lists and lists that claim to represent
                projects that do not have one.
              </div>
              <div className="font-semibold text-red">
                If you purchase a token from this list, you may not be able to
                sell it back.
              </div>
            </div>
            <div
              className="flex justify-center"
              style={{ cursor: 'pointer' }}
              onClick={() => setConfirmed(!confirmed)}
            >
              <Checkbox
                name="confirmed"
                type="checkbox"
                checked={confirmed}
                onChange={() => setConfirmed(!confirmed)}
              />
              <div className="text-red ml-2.5 font-medium">I understand</div>
            </div>
          </div>

          <Button
            color="primary"
            style={{
              borderRadius: '20px',
              padding: '10px 1rem',
            }}
            disabled={!confirmed}
            onClick={handleAddList}
          >
            Import
          </Button>
          {addError ? (
            <div
              title={addError}
              style={{ textOverflow: 'ellipsis', overflow: 'hidden' }}
              className="text-red"
            >
              {addError}
            </div>
          ) : null}
        </div>
      </div>
    </Wrapper>
  );
}

export default ImportList;
