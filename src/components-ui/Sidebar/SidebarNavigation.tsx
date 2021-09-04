import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/router';
import React from 'react';

export function SidebarNavigation({ routes }) {
  const router = useRouter();

  return (
    <div>
      {routes.map((route) => {
        console.log(router.pathname, route.url);
        const active = route.urls.find((url: string) => {
          return router.pathname.startsWith(url);
        });
        if (active) {
          return (
            <div
              key={route.name}
              className="cursor-pointer bg-primary rounded-xl font-semibold my-2"
            >
              <Link href={route.urls[0]}>
                <div className="flex items-center font-base py-3 px-3">
                  {React.createElement(route.iconActive, {
                    className: 'stroke-current text-primary',
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
            className="cursor-pointer rounded-xl hover:bg-primary transition duration-500 my-2"
          >
            <Link href={route.urls[0]}>
              <div className="flex items-center text-grey hover:text-text py-3 px-3">
                {React.createElement(route.icon, {
                  className: 'stroke-current',
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
