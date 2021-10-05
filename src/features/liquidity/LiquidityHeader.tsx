import React from 'react';
import { currencyId } from '../../functions/currency';
import { useActiveWeb3React } from '../../hooks';
import { NavigationLink } from '../../components-ui/NavigationLink';
import { useRouter } from 'next/router';

export default function LiquidityHeader({
  input = undefined,
  output = undefined,
  isPairValid = false,
}: any): JSX.Element {
  const { chainId } = useActiveWeb3React();
  const router = useRouter();
  const isAddActive = router.asPath.startsWith('/add');
  const isPoolActive = router.asPath.startsWith('/pool');
  const path = input
    ? output
      ? `/${currencyId(input)}/${currencyId(output)}`
      : `/${currencyId(input)}`
    : output
    ? `/${currencyId(output)}`
    : '';

  return (
    <div className="flex items-center justify-center p-3px">
      <NavigationLink href={`/add${path}`}>
        <a
          className={`
          flex items-center justify-center 
          py-1
          px-2
          text-base font-medium text-center
          border-b-4
          ${isAddActive ? 'border-primary' : 'border-opaque-border-2'}
          `}
        >
          Add
        </a>
      </NavigationLink>
      {isPairValid && (
        <NavigationLink
          onClick={(event) => {
            if (!output) event.preventDefault();
          }}
          href={`/remove${path}`}
        >
          <a
            className={`
          flex items-center justify-center 
          py-1
          px-2
          text-base font-medium text-center 
          border-b-4
          ${!isAddActive ? 'border-primary' : 'border-opaque-border-2'}
          `}
          >
            Remove
          </a>
        </NavigationLink>
      )}
      <NavigationLink
        onClick={(event) => {
          if (!output) event.preventDefault();
        }}
        href={`/pool`}
      >
        <a
          className={`
          flex items-center justify-center 
          py-1
          px-2
          text-base font-medium text-center 
          border-b-4
          ${isPoolActive ? 'border-primary' : 'border-opaque-border-2'}
          `}
        >
          Positions
        </a>
      </NavigationLink>
    </div>
  );
}
