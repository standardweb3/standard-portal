import React from 'react';
// import { currencyId } from '../../functions/currency';
// import { useActiveWeb3React } from '../../hooks';
import { NavigationLink } from '../../components-ui/NavigationLink';
import { useRouter } from 'next/router';
import { classNames } from '../../functions';

export function BridgeHeader(): JSX.Element {
  const style =
    'rounded-full inline-flex text-grey items-center px-4 py-2 cursor-pointer';
  const activeStyle =
    '!bg-opaque border border-opaque-border font-bold !text-text';

  // const { chainId } = useActiveWeb3React();
  const router = useRouter();
  const isHistoryActive = router.asPath == '/router/history';
  const isBridgeActive = router.asPath == '/bridgev2';
  // const isBridgeActive = router.asPath == '/bridgev2'
  // const isPoolActive = router.asPath.startsWith('/pool');

  return (
    <div
      className="
    rounded-full bg-opaque-inactive
    inline-flex
    items-center justify-between"
    >
      <NavigationLink href={`/router`}>
        <a
          className={classNames(
            style,
            !isHistoryActive && !isBridgeActive && activeStyle,
          )}
        >
          Router
        </a>
      </NavigationLink>
      <NavigationLink href={`/router/history`}>
        <a className={classNames(style, isHistoryActive && activeStyle)}>
          History
        </a>
      </NavigationLink>
      <NavigationLink href={`/bridgev2`}>
        <a className={classNames(style, isBridgeActive && activeStyle)}>
          Bridge
        </a>
      </NavigationLink>
    </div>
  );
}
