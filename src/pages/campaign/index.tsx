import Head from 'next/head';
import Skeleton from 'react-loading-skeleton';
import { Page } from '../../components-ui/Page';
import { PageContent } from '../../components-ui/PageContent';
import { DefinedStyles } from '../../utils/DefinedStyles';
import { ViewportMediumUp } from '../../components-ui/Responsive';
import { PageHeader } from '../../components-ui/PageHeader';
import { NetworkGuardWrapper } from '../../guards/Network';
import { ChainId } from '@digitalnative/standard-protocol-sdk';
import {
  useCampaingScoreAggregator,
  useCampaingUsers,
} from '../../services/graph/hooks/campaign';
import { formatNumber, shortenAddress } from '../../functions';

function Campaign() {
  const scoreAggregator = useCampaingScoreAggregator();
  const users = useCampaingUsers();

  const totalReward = 77777;
  const renderUsers = () => {
    return (
      users?.map((user, index) => {
        const userShare = user.score / (scoreAggregator?.totalScore ?? 1);
        const userReward = userShare * totalReward;
        return (
          <div
            key={user.id}
            className="w-full flex items-center justify-between gap-4 rounded-20 bg-dark p-4"
          >
            <div className="flex items-center gap-4">
              <div className="text-xl font-bold">{index + 1}</div>
              <div>
                <div className="flex items-center gap-2 text-sm">
                  <div className="text-grey">User:</div>
                  <div className="">{shortenAddress(user.id)}</div>
                </div>

                <div className="flex items-center gap-2 text-sm">
                  <div className="text-grey">Score:</div>
                  <div className="text-primary">{formatNumber(user.score)}</div>
                </div>
              </div>
            </div>
            <div className="text-sm xs:text-base text-green">
              {formatNumber(userReward)} STND
            </div>
          </div>
        );
      }) ?? []
    );
  };

  return (
    <>
      <Head>
        <title>Campaign | Standard Protocol</title>
        <meta
          key="description"
          name="description"
          content="USM Launch Campaign"
        />
      </Head>
      <Page id="campaign-page" className={DefinedStyles.page}>
        <ViewportMediumUp>
          <PageHeader title="Campaign" />
        </ViewportMediumUp>
        <PageContent>
          <div className="w-full max-w-[500px]">
            <div className="grid grid-cols-2 gap-4 mb-8">
              <div className="col-span-2 bg-background p-4 rounded-20">
                <div className="flex flex-col justify-center items-center">
                  <div className="font-bold text-lg mb-2">Total Reward</div>
                  <div className="text-primary text-xl font-bold">
                    {totalReward}
                  </div>
                </div>
              </div>
              <div className="bg-background p-4 rounded-20">
                <div className="flex flex-col justify-center items-center">
                  <div className="font-bold text-lg mb-2">Total Score</div>
                  <div className="text-primary">
                    {scoreAggregator?.totalScore !== undefined ? (
                      formatNumber(scoreAggregator.totalScore)
                    ) : (
                      <Skeleton />
                    )}
                  </div>
                </div>
              </div>
              <div className="bg-background p-4 rounded-20">
                <div className="flex flex-col justify-center items-center">
                  <div className="font-bold text-lg mb-2">Users Count</div>
                  <div className="text-primary">
                    {scoreAggregator?.usersCount !== undefined ? (
                      scoreAggregator.usersCount
                    ) : (
                      <Skeleton />
                    )}
                  </div>
                </div>
              </div>
            </div>
            <div className="font-bold mb-4"></div>

            <div className="font-bold text-lg mb-2">Score Board (TOP 100)</div>

            <div className="text-grey text-sm">
              * Score: Daily accumulation of outstanding borrowed USM
            </div>
            <div className="text-grey mb-2 text-sm">
              * Reward: User's score / Total Score * Total Reward
            </div>
            <div className="text-grey text-sm">
              * Rewards are indexed using subgraph.
            </div>

            <div className="text-grey mb-4 text-sm">
              * Reward indexing speed may not match the tx completion speed
            </div>

            {scoreAggregator && (
              <div className="grid grid-cols-1 gap-4 max-h-[500px] overflow-scroll">
                {renderUsers()}
              </div>
            )}
          </div>
        </PageContent>
      </Page>
    </>
  );
}

Campaign.Guard = NetworkGuardWrapper([ChainId.RINKEBY, ChainId.METIS]);
export default Campaign;
