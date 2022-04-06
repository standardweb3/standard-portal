import Head from 'next/head';
import StndStaker from '../../features/stake/StndStaker';
import { Page } from '../../components-ui/Page';
import { ViewportMediumUp } from '../../components-ui/Responsive';
import { PageHeader } from '../../components-ui/PageHeader';
import { DefinedStyles } from '../../utils/DefinedStyles';
import { PageContent } from '../../components-ui/PageContent';
import { StakePoolInfo } from '../../features/stake/StakePoolInfo';

import { useStnd, useXStnd } from '../../hooks/Tokens';
import { useStandardPrice } from '../../services/graph';
import { useTokenBalance } from '../../state/wallet/hooks';
import { useActiveWeb3React } from '../../hooks';
import { Alert } from '../../components-ui/Alert';
import { NetworkGuardWrapper } from '../../guards/Network';
import { NORMAL_GUARDED_CHAINS } from '../../constants/networks';
import { ChainId } from '@digitalnative/standard-protocol-sdk';

function Stake() {
  const { account, chainId } = useActiveWeb3React();

  const stnd = useStnd();
  const xStnd = useXStnd();
  const stndBalance = useTokenBalance(account ?? undefined, stnd);
  const xStndBalance = useTokenBalance(account ?? undefined, xStnd);

  const stndPrice = useStandardPrice();

  return (
    <>
      <Head>
        <title>Trade | Standard Protocol</title>
        <meta
          key="description"
          name="description"
          content="Stake STND for dSTND"
        />
      </Head>
      <Page id="stake-page" className={DefinedStyles.page}>
        <ViewportMediumUp>
          <PageHeader title="Stake" />
        </ViewportMediumUp>
        <PageContent>
          <div className="w-full max-w-[1200px]">
            {chainId === ChainId.METIS && (
              <Alert
                className={DefinedStyles.pageAlertFull}
                title={`Warning`}
                message={
                  <div className="leading-relaxed">
                    This feature is not live on METIS. Please do unstake if you
                    have done so. This page will be closed when all STND have
                    been unstaked. We apologize for the inconvenience.
                  </div>
                }
                type="warning"
              />
            )}
            <Alert
              className={DefinedStyles.pageAlertFull}
              title={`Stake`}
              message={
                <div className="leading-relaxed">
                  <br /> At <strong>Standard’s Portal</strong>, portions of the
                  swap fees are distributed as proportional to your share of
                  dSTND.
                  <br />
                  <br />
                  Stake your STND to get dSTND.
                  <br />
                  It will make you have passive income from our protocol fees
                  and you can claim it anytime!
                  <br />
                  <br />
                  Each dSTND will also grant you a voting right to the Standard
                  Protocol’s governance
                  <br />
                </div>
              }
              type="information"
            />

            <div className="grid grid-cols-2 gap-4 items-stretch">
              <div className="col-span-2 md:col-span-1">
                <StndStaker
                  stnd={stnd}
                  xStnd={xStnd}
                  stndBalance={stndBalance}
                  xStndBalance={xStndBalance}
                  stndPrice={stndPrice}
                />
              </div>
              <div className="col-span-2 md:col-span-1">
                <StakePoolInfo stnd={stnd} xStnd={xStnd} />
              </div>
            </div>
          </div>
        </PageContent>
      </Page>
    </>
  );
}

Stake.Guard = NetworkGuardWrapper([
  ChainId.MAINNET,
  ChainId.SHIDEN,
  ChainId.METIS,
]);

export default Stake;
