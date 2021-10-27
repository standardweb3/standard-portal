import Link from 'next/link';
import { useRouter } from 'next/router';
import React from 'react';
import { isMobile } from 'react-device-detect';
import { classNames } from '../../functions';

export function TopBarNavigation({ routes, chainId, onRouteClick }) {
  const router = useRouter();

  return (
    <div className="inline-block min-w-[177px]">
      {routes
        .filter((route) =>
          route.hidden ? !route.hidden.includes(chainId) : true,
        )
        .map((route) => {
          const active = route.urls.find((url: string) => {
            return router.pathname.startsWith(url);
          });
          if (active) {
            return (
              <div
                key={route.name}
                className="
                  cursor-pointer 
                  bg-primary 
                  rounded-xl font-bold my-2"
              >
                <Link href={route.urls[0]} prefetch={!isMobile}>
                  <div className="flex items-center font-base py-3 px-3 text-text">
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
              onClick={onRouteClick}
              key={route.name}
              className="cursor-pointer rounded-xl hover:bg-primary transition duration-500 my-2"
            >
              <Link href={route.urls[0]}>
                <div
                  className="
                  flex items-center 
                  text-grey font-bold 
                  hover:text-text py-3 px-3"
                >
                  {React.createElement(route.icon, {
                    className: classNames('stroke-current'),
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
