import Link from 'next/link';
import { useRouter } from 'next/router';
import React from 'react';
import { isMobile } from 'react-device-detect';
import { classNames } from '../../functions';
import { finalizeTransaction } from '../../state/transactions/actions';
import { Divider } from '../Divider';

export function SidebarNavigation({ routes, chainId }) {
  const router = useRouter();

  return (
    <div>
      {routes
        .filter((route) =>
          route === finalizeTransaction
            ? true
            : route.hidden
            ? !route.hidden.includes(chainId)
            : true,
        )
        .map((route, index) => {
          if (route.name === 'Divider')
            return (
              <div className="w-full my-4 flex justify-center" key={index}>
                <Divider className="bg-primary bg-opacity-50 !w-[70%]" />
              </div>
            );
          const active = route?.urls?.find((url: string) => {
            return router.pathname.startsWith(url);
          });
          if (active) {
            return (
              <div
                key={route.name}
                className="
                  cursor-pointer
                  border-l-4 border-primary
                  font-semibold my-2"
              >
                <Link href={route.urls[0]} prefetch={!isMobile}>
                  <div className="flex items-center font-base py-2 px-3 text-primary">
                    {React.createElement(route.iconActive, {
                      className: 'stroke-current',
                    })}
                    <div className="ml-2 flex items-center">{route.name}</div>
                  </div>
                </Link>
              </div>
            );
          }
          return (
            <div
              key={route.name}
              className="
                cursor-pointer
                border-l-4 border-transparent
                hover:border-primary
                transition duration-500 my-2"
            >
              <Link href={route.urls[0]}>
                <div className="flex items-center text-grey hover:text-primary py-2 px-3">
                  {React.createElement(route.icon, {
                    className: classNames(
                      'stroke-current',
                      // route.name !== 'Dividend' && 'stroke-1',
                    ),
                  })}
                  <div className="ml-2 flex items-center">{route.name}</div>
                </div>
              </Link>
            </div>
          );
        })}
    </div>
  );
}
