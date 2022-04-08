import useSWR, { SWRConfiguration } from 'swr';
import { useActiveWeb3React } from '../../../hooks';
import { getCampaignScoreAggregator, getCampaignUsers } from '../fetchers/campaign';

export function useCampaingUsers(
  variables = undefined,
  swrConfig: SWRConfiguration = undefined,
) {
  const { chainId } = useActiveWeb3React();

  const { data } = useSWR(
    chainId ? ['campaignUseres', chainId, JSON.stringify(variables)] : null,
    () => getCampaignUsers(chainId),
  );
  return data;
}

export function useCampaingScoreAggregator(
    variables = undefined,
    swrConfig: SWRConfiguration = undefined,
  ) {
    const { chainId } = useActiveWeb3React();
  
    const { data } = useSWR(
      chainId ? ['campaignScoreAggregator', chainId, JSON.stringify(variables)] : null,
      () => getCampaignScoreAggregator(chainId),
    );
    return data;
  }