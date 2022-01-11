import { Currency } from '@digitalnative/standard-protocol-sdk';
import { useRouter } from 'next/router';
import { currencyId } from '../../functions';
import { NavigationLink } from '../NavigationLink';

const getQuery = (input, output) => {
  if (!input && !output) return;

  if (input && !output) {
    return { inputCurrency: input.address || 'ETH' };
  } else if (!input && output) {
    return { outputCurrencty: output.address || 'ETH' };
  } else if (input && output) {
    return {
      inputCurrency: input.address || 'ETH',
      outputCurrency: output.address || 'ETH',
    };
  }
};

interface ExchangeNavigationProps {
  input?: Currency;
  output?: Currency;
}

export function ExchangeNavigation({ input, output }: ExchangeNavigationProps) {
  const router = useRouter();

  const isRemove = router.asPath.startsWith('/remove');

  return (
    <div
      className={`
        rounded-full
        text-grey
        items-center
        bg-opaque-inactive
        inline-flex
        `}
    >
      <NavigationLink
        activeClassName={`
            bg-opaque-4
            border
            border-opaque-border
            text-text
            font-bold
          `}
        href={{
          pathname: input || output ? '/trade/buy' : '/trade',
          query: getQuery(input, output),
        }}
      >
        <a
          className={`
            flex items-center justify-center 
            px-4 py-2
            rounded-full`}
        >
          {`Trade`}
        </a>
      </NavigationLink>
      <NavigationLink
        activeClassName={`
          bg-opaque 
          border 
          border-opaque-border
          text-text
          font-bold
          `}
        href={`/${!isRemove ? 'add' : 'remove'}${
          input ? `/${currencyId(input)}` : ''
        }${output ? `/${currencyId(output)}` : ''}`}
      >
        <a
          className={`
            flex items-center justify-center 
            px-4 py-2
            rounded-full`}
        >
          {`Liquidity`}
        </a>
      </NavigationLink>
    </div>
  );
}
