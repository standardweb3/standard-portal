import React from 'react';
import { currencyId } from '../../functions/currency';
import { useActiveWeb3React } from '../../hooks';
import { NavigationLink } from '../../components-ui/NavigationLink';
import { useRouter } from 'next/router';

export default function LiquidityHeader({
  input = undefined,
  output = undefined,
}: any): JSX.Element {
  const { chainId } = useActiveWeb3React();
  const router = useRouter();
  const isAddActive = router.asPath === '/add';
  return (
    <div className="flex items-center justify-center p-3px">
      <NavigationLink href={`/add/${currencyId(input)}/${currencyId(output)}`}>
        <a
          className={`
          flex items-center justify-center 
          py-1
          px-1
          text-base font-medium text-center
          border-b-4
          ${isAddActive ? 'border-transparent' : 'border-primary'}
          `}
        >
          Add
        </a>
      </NavigationLink>
      <NavigationLink
        onClick={(event) => {
          if (!output) event.preventDefault();
        }}
        href={`/remove/${currencyId(input)}/${currencyId(output)}`}
      >
        <a
          className={`
          flex items-center justify-center 
          py-1
          px-1
          text-base font-medium text-center 
          border-b-4
          ${!isAddActive ? 'border-transparent' : 'border-primary'}
          `}
        >
          Remove
        </a>
      </NavigationLink>
    </div>
  );
}
