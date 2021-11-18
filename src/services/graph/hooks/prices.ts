import useSWR, { SWRConfiguration } from 'swr';
import { getPrices } from '../fetchers/prices';

export function usePrices(
  aliases: string[],
  swrConfig: SWRConfiguration = undefined,
) {
  const { data } = useSWR(
    ['prices', JSON.stringify({ aliases })],
    () => getPrices({ aliases }),
    swrConfig,
  );
  return data;
}

export function usePrice(
  alias: string,
  swrConfig: SWRConfiguration = undefined,
) {
  const { data } = useSWR(
    ['prices', alias],
    () => getPrices({ aliases: [alias] }),
    swrConfig,
  );
  return data?.[0];
}
