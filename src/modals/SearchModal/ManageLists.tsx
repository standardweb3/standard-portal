import { AppDispatch, AppState } from '../../state';
import ReactGA from 'react-ga';
import React, {
  memo,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';
import {
  acceptListUpdate,
  disableList,
  enableList,
  removeList,
} from '../../state/lists/actions';
import {
  useActiveListUrls,
  useAllLists,
  useIsListActive,
} from '../../state/lists/hooks';
import { useDispatch, useSelector } from 'react-redux';

import AutoSizer from 'react-virtualized-auto-sizer';
import { Button } from '../../components-ui/Button';
import CurrencyModalView from './CurrencyModalView';
import { ExternalLink } from '../../components-ui/ExternalLink';
import { LinkStyledButton } from '../../components-ui/LinkStyledButton';
import { ListLogo } from '../../components-ui/Logo/ListLogo';
import { ListToggle } from '../../components-ui/Toggle/ListToggle';
import { TokenList } from '@uniswap/token-lists';
import { UNSUPPORTED_LIST_URLS } from '../../constants/token-lists';
import { listVersionLabel } from '../../functions/list';
import { parseENSAddress } from '../../functions/ens';
import styled from '@emotion/styled';
import { uriToHttp } from '../../functions/convert';
import { useFetchListCallback } from '../../hooks/useFetchListCallback';
import { useListColor } from '../../hooks/useColor';
import { useOnClickOutside } from '../../hooks/useOnClickOutside';
import { usePopper } from 'react-popper';
import useToggle from '../../hooks/useToggle';
import { CheckCircleIcon, CogIcon } from '@heroicons/react/outline';
import { classNames } from '../../functions';
import { Typographies } from '../../utils/Typography';

const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  width: 100%;
  height: 100%;
`;

const UnpaddedLinkStyledButton = styled(LinkStyledButton)`
  padding: 0;
  font-size: 1rem;
  opacity: ${({ disabled }) => (disabled ? '0.4' : '1')};
`;

const PopoverContainer = styled.div<{ show: boolean }>`
  z-index: 100;
  visibility: ${(props) => (props.show ? 'visible' : 'hidden')};
  opacity: ${(props) => (props.show ? 1 : 0)};
  transition: visibility 150ms linear, opacity 150ms linear;
  box-shadow: 0px 0px 1px rgba(0, 0, 0, 0.01), 0px 4px 8px rgba(0, 0, 0, 0.04),
    0px 16px 24px rgba(0, 0, 0, 0.04), 0px 24px 32px rgba(0, 0, 0, 0.01);
  padding: 1rem;
  display: grid;
  grid-template-rows: 1fr;
  grid-gap: 8px;
  font-size: 1rem;
  text-align: left;
`;

const StyledMenu = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  position: relative;
  border: none;
`;

const StyledTitleText = styled.div<{ active: boolean }>`
  font-size: 16px;
  overflow: hidden;
  text-overflow: ellipsis;
  font-weight: 600;
`;

const StyledListUrlText = styled.div<{ active: boolean }>`
  font-size: 12px;
`;

const RowWrapper = styled.div<{ bgColor: string; active: boolean }>`
  display: flex;
  align-items: center;
  transition: 200ms;
  align-items: center;
  padding: 1rem;
`;

function listUrlRowHTMLId(listUrl: string) {
  return `list-row-${listUrl.replace(/\./g, '-')}`;
}

const ListRow = memo(({ listUrl }: { listUrl: string }) => {
  const listsByUrl = useSelector<AppState, AppState['lists']['byUrl']>(
    (state) => state.lists.byUrl,
  );
  const dispatch = useDispatch<AppDispatch>();
  const { current: list, pendingUpdate: pending } = listsByUrl[listUrl];

  const listColor = useListColor(list?.logoURI);
  const isActive = useIsListActive(listUrl);

  const [open, toggle] = useToggle(false);
  const node = useRef<HTMLDivElement>();
  const [referenceElement, setReferenceElement] = useState<HTMLButtonElement>();
  const [popperElement, setPopperElement] = useState<HTMLDivElement>();

  const { styles, attributes } = usePopper(referenceElement, popperElement, {
    placement: 'auto',
    strategy: 'fixed',
    modifiers: [{ name: 'offset', options: { offset: [8, 8] } }],
  });

  useOnClickOutside(node, open ? toggle : undefined);

  const handleAcceptListUpdate = useCallback(() => {
    if (!pending) return;
    ReactGA.event({
      category: 'Lists',
      action: 'Update List from List Select',
      label: listUrl,
    });
    dispatch(acceptListUpdate(listUrl));
  }, [dispatch, listUrl, pending]);

  const handleRemoveList = useCallback(() => {
    ReactGA.event({
      category: 'Lists',
      action: 'Start Remove List',
      label: listUrl,
    });
    if (
      window.prompt(
        `Please confirm you would like to remove this list by typing REMOVE`,
      ) === `REMOVE`
    ) {
      ReactGA.event({
        category: 'Lists',
        action: 'Confirm Remove List',
        label: listUrl,
      });
      dispatch(removeList(listUrl));
    }
  }, [dispatch, listUrl]);

  const handleEnableList = useCallback(() => {
    ReactGA.event({
      category: 'Lists',
      action: 'Enable List',
      label: listUrl,
    });
    dispatch(enableList(listUrl));
  }, [dispatch, listUrl]);

  const handleDisableList = useCallback(() => {
    ReactGA.event({
      category: 'Lists',
      action: 'Disable List',
      label: listUrl,
    });
    dispatch(disableList(listUrl));
  }, [dispatch, listUrl]);

  const toggleList = useCallback(() => {
    isActive ? handleDisableList() : handleEnableList();
  }, [isActive]);

  const toggleInfo = useCallback((e) => {
    e.stopPropagation();
    toggle();
  }, []);

  if (!list) return null;

  return (
    <div>
      <div
        id={listUrlRowHTMLId(listUrl)}
        key={listUrl}
        onClick={toggleList}
        className={classNames(
          Typographies.importList,
          isActive
            ? 'text-text border-success'
            : 'text-text border-info opacity-50',
        )}
      >
        {list.logoURI ? (
          <ListLogo
            size="40px"
            logoURI={list.logoURI}
            alt={`${list.name} list logo`}
          />
        ) : (
          <div style={{ width: '24px', height: '24px' }} />
        )}
        <div
          className="flex flex-col justify-center"
          style={{ flex: '1', marginLeft: '1rem' }}
        >
          <div className="flex items-center">
            <StyledTitleText active={isActive}>{list.name}</StyledTitleText>
          </div>
          <div className="flex items-center mt-1">
            <StyledListUrlText active={isActive}>
              {list.tokens.length} tokens
            </StyledListUrlText>
            <StyledMenu ref={node as any}>
              <button
                className="px-0 py-0 bg-transparent ml-2"
                onClick={toggleInfo}
                ref={setReferenceElement}
              >
                <CogIcon className="w-4 h-4" />
              </button>
            </StyledMenu>
          </div>
        </div>
        <ListToggle isActive={isActive} bgColor={listColor} />
      </div>
      {open && (
        <PopoverContainer
          show={true}
          className="bg-background-3 rounded-20 shadow-dark"
          ref={setPopperElement as any}
          style={styles.popper}
          {...attributes.popper}
        >
          <div>{list && listVersionLabel(list.version)}</div>
          <ExternalLink
            href={`https://tokenlists.org/token-list?url=${listUrl}`}
          >
            View list
          </ExternalLink>
          <button
            className="hover:brightness-125"
            onClick={handleRemoveList}
            disabled={Object.keys(listsByUrl).length === 1}
          >
            Remove list
          </button>
          {pending && (
            <UnpaddedLinkStyledButton onClick={handleAcceptListUpdate}>
              Update list
            </UnpaddedLinkStyledButton>
          )}
        </PopoverContainer>
      )}
    </div>
  );
});

const ListContainer = styled.div`
  // padding: 1rem
`;

function ManageLists({
  setModalView,
  setImportList,
  setListUrl,
}: {
  setModalView: (view: CurrencyModalView) => void;
  setImportList: (list: TokenList) => void;
  setListUrl: (url: string) => void;
}) {
  const [listUrlInput, setListUrlInput] = useState<string>('');

  const lists = useAllLists();

  // sort by active but only if not visible
  const activeListUrls = useActiveListUrls();
  const [activeCopy, setActiveCopy] = useState<string[] | undefined>();
  useEffect(() => {
    if (!activeCopy && activeListUrls) {
      setActiveCopy(activeListUrls);
    }
  }, [activeCopy, activeListUrls]);

  const handleInput = useCallback((e) => {
    setListUrlInput(e.target.value);
  }, []);

  const fetchList = useFetchListCallback();

  const validUrl: boolean = useMemo(() => {
    return (
      uriToHttp(listUrlInput).length > 0 ||
      Boolean(parseENSAddress(listUrlInput))
    );
  }, [listUrlInput]);

  const sortedLists = useMemo(() => {
    const listUrls = Object.keys(lists);
    return listUrls
      .filter((listUrl) => {
        // only show loaded lists, hide unsupported lists
        return (
          Boolean(lists[listUrl].current) &&
          !UNSUPPORTED_LIST_URLS.includes(listUrl)
        );
      })
      .sort((u1, u2) => {
        const { current: l1 } = lists[u1];
        const { current: l2 } = lists[u2];

        // first filter on active lists
        if (activeCopy?.includes(u1) && !activeCopy?.includes(u2)) {
          return -1;
        }
        if (!activeCopy?.includes(u1) && activeCopy?.includes(u2)) {
          return 1;
        }

        if (l1 && l2) {
          return l1.name.toLowerCase() < l2.name.toLowerCase()
            ? -1
            : l1.name.toLowerCase() === l2.name.toLowerCase()
            ? 0
            : 1;
        }
        if (l1) return -1;
        if (l2) return 1;
        return 0;
      });
  }, [lists, activeCopy]);

  // temporary fetched list for import flow
  const [tempList, setTempList] = useState<TokenList>();
  const [addError, setAddError] = useState<string | undefined>();

  useEffect(() => {
    async function fetchTempList() {
      fetchList(listUrlInput, false)
        .then((list) => setTempList(list))
        .catch(() => setAddError('Error importing list'));
    }
    // if valid url, fetch details for card
    if (validUrl) {
      fetchTempList();
    } else {
      setTempList(undefined);
      listUrlInput !== '' && setAddError('Enter valid list location');
    }

    // reset error
    if (listUrlInput === '') {
      setAddError(undefined);
    }
  }, [fetchList, listUrlInput, validUrl]);

  // check if list is already imported
  const isImported = Object.keys(lists).includes(listUrlInput);

  // set list values and have parent modal switch to import list view
  const handleImport = useCallback(() => {
    if (!tempList) return;
    setImportList(tempList);
    setModalView(CurrencyModalView.importList);
    setListUrl(listUrlInput);
  }, [listUrlInput, setImportList, setListUrl, setModalView, tempList]);

  return (
    <div
      className="
      relative 
      flex flex-col 
      flex-1 w-full h-full 
      space-y-4"
    >
      <input
        id="list-add-input"
        type="text"
        placeholder="https:// or ipfs:// or ENS name"
        className={`
        mt-4 w-full
        bg-opaque 
        rounded-20
        placeholder-info 
        focus:placeholder-text 
        font-bold
        px-6 py-3.5 appearance-none`}
        value={listUrlInput}
        onChange={handleInput}
        title="List URI"
        autoComplete="off"
        autoCorrect="off"
      />
      {addError ? (
        <div
          title={addError}
          className="overflow-hidden text-red text-ellipsis"
        >
          {addError}
        </div>
      ) : null}
      {tempList && (
        <div style={{ paddingTop: 0 }}>
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              {tempList.logoURI && (
                <ListLogo logoURI={tempList.logoURI} size="40px" />
              )}
              <div style={{ marginLeft: '20px' }}>
                <div className="font-semibold">{tempList.name}</div>
                <div className="text-xs">{tempList.tokens.length} tokens</div>
              </div>
            </div>
            {isImported ? (
              <div className="flex items-center">
                <CheckCircleIcon className="w-4 h-4" />
                <div>Loaded</div>
              </div>
            ) : (
              <Button
                color="primary"
                style={{
                  width: 'fit-content',
                  padding: '6px 8px',
                  fontSize: '14px',
                }}
                onClick={handleImport}
              >
                Import
              </Button>
            )}
          </div>
        </div>
      )}
      <ListContainer className="flex-1 rounded-20 h-full bg-opaque-secondary py-6 px-3 mt-2">
        <div
          className={classNames('h-full py-0 px-4', Typographies.scrollPrimary)}
        >
          <AutoSizer disableWidth>
            {({ height }) => (
              <div style={{ height }} className="space-y-4">
                {sortedLists.map((listUrl) => (
                  <ListRow key={listUrl} listUrl={listUrl} />
                ))}
              </div>
            )}
          </AutoSizer>
        </div>
      </ListContainer>
    </div>
  );
}

export default ManageLists;
