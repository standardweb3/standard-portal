import { NavigationLink } from '../../components-ui/NavigationLink';
import React from 'react';
import { useActiveWeb3React } from '../../hooks';
import { AnalyticsLink } from '../../components-ui/AnalyticsLink';

const Menu = ({ positionsLength }) => {
  const { account, chainId } = useActiveWeb3React();
  return (
    <div className="flex items-center justify-between space-x-2">
      <div
        className="
    rounded-full
    text-grey
    inline-flex items-center
    bg-opaque-inactive"
      >
        {account && positionsLength > 0 && (
          <NavigationLink
            exact
            href={`/farm?filter=portfolio`}
            activeClassName={`
          bg-opaque
          border
          border-opaque-border
          text-text
          font-bold
        `}
          >
            <a
              className={`
            flex items-center justify-center 
            px-4 py-2
            rounded-full`}
            >
              Your Farms
            </a>
          </NavigationLink>
        )}

        <NavigationLink
          exact
          href="/farm"
          activeClassName={`
        bg-opaque
        border
        border-opaque-border
        text-text
        font-bold
      `}
        >
          <a
            className={`
            flex items-center justify-center 
            px-4 py-2
            rounded-full`}
          >
            All Farms
          </a>
        </NavigationLink>
        {/* 
      {chainId === ChainId.MAINNET && (
        <>
          <NavigationLink
            exact
            href={`/farm?filter=kashi`}
            activeClassName="font-bold bg-transparent border rounded text-high-emphesis border-transparent border-gradient-r-blue-pink-dark-900"
          >
            <a className="flex items-center justify-between px-4 py-6 text-base font-bold border border-transparent rounded cursor-pointer bg-dark-900 hover:bg-dark-800">
              Kashi Farms
            </a>
          </NavigationLink>
          <NavigationLink
            exact
            href={`/farm?filter=sushi`}
            activeClassName="font-bold bg-transparent border rounded text-high-emphesis border-transparent border-gradient-r-blue-pink-dark-900"
          >
            <a className="flex items-center justify-between px-4 py-6 text-base font-bold border border-transparent rounded cursor-pointer bg-dark-900 hover:bg-dark-800">
              SushiSwap Farms
            </a>
          </NavigationLink>
        </>
      )}

      {(chainId === ChainId.MAINNET || chainId === ChainId.MATIC) && (
        <NavigationLink
          exact
          href={`/farm?filter=2x`}
          activeClassName="bg-transparent border rounded text-high-emphesis border-transparent border-gradient-r-blue-pink-dark-900"
        >
          <a className="flex items-center justify-between px-4 py-6 text-base font-bold border border-transparent rounded cursor-pointer bg-dark-900 hover:bg-dark-800">
            2x Reward Farms
          </a>
        </NavigationLink>
      )} */}
      </div>
      {/* <AnalyticsLink path="pools" /> */}
    </div>
  );
};

export default Menu;
