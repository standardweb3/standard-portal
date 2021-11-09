import ReactGA from 'react-ga';
import Head from 'next/head';
import StndStaker from '../../components-ui/XSTND/StndStaker';
import { Page } from '../../components-ui/Page';
import {
  ViewportMediumUp,
  ViewportSmallUp,
} from '../../components-ui/Responsive';
import { PageHeader } from '../../components-ui/PageHeader';
import { DefinedStyles } from '../../utils/DefinedStyles';
import { PageContent } from '../../components-ui/PageContent';
import { XStndClaimer } from '../../components-ui/XSTND/XStndClaimer';
import { StakePoolInfo } from '../../components-ui/XSTND/StakePoolInfo';
import {
  useStakeInfo,
  useStakePoolSushiPerBlock,
} from '../../features/stake/hooks';
import { useStnd } from '../../hooks/Tokens';
import { useAverageBlockTime } from '../../services/graph';
import { useTokenBalance } from '../../state/wallet/hooks';
import { useActiveWeb3React } from '../../hooks';
import { MASTERCHEF_V2_ADDRESS } from '@digitalnative/standard-protocol-sdk';
import { BigNumber } from 'ethers';
import { AVERAGE_BLOCK_TIME_IN_SECS } from '../../constants';
import { Alert } from '../../components-ui/Alert';

export default function Stake() {
  const { account, chainId } = useActiveWeb3React();

  const stnd = useStnd();
  const xStndPerBlock = useStakePoolSushiPerBlock();
  const averageBlockTime = useAverageBlockTime();
  const balance = useTokenBalance(account, stnd);
  const stakedBalance = useStakeInfo(stnd);
  const stakePoolStndTotal = useTokenBalance(
    MASTERCHEF_V2_ADDRESS[chainId],
    stnd,
  );

  const xStndPerBlockDecimals =
    xStndPerBlock &&
    xStndPerBlock.div(BigNumber.from(String(1e16))).toNumber() / 100;

  const _averageBlockTime =
    typeof averageBlockTime == 'number'
      ? averageBlockTime !== 0
        ? averageBlockTime
        : AVERAGE_BLOCK_TIME_IN_SECS[chainId]
      : averageBlockTime && averageBlockTime?.averageBlockTime !== 0
      ? averageBlockTime?.averageBlockTime
      : AVERAGE_BLOCK_TIME_IN_SECS[chainId];

  const blocksPerDay = 86400 / _averageBlockTime;
  const xStndPerDay = blocksPerDay * (xStndPerBlockDecimals ?? 0);

  return (
    <>
      <Head>
        <title>Trade | Standard Protocol</title>
        <meta
          key="description"
          name="description"
          content="Stake STND for xSTND"
        />
      </Head>
      <Page id="stake-page" className={DefinedStyles.page}>
        <ViewportMediumUp>
          <PageHeader title="Stake" />
        </ViewportMediumUp>
        <PageContent>
          <div className="w-full max-w-[1000px]">
            <Alert
              className={DefinedStyles.pageAlertFull}
              title={`Stake`}
              message={
                <div className="leading-relaxed">
                  Other protocols take a big percentage of total pool growth as
                  a fee and do not give back.
                  <br /> At <strong>Standard’s Portal</strong>, portions of the
                  swap fees are distributed as proportional to your share of the
                  Dividend pool.
                  <br />
                  <br />
                  Stake your STND and earn xSTND.
                  <br />
                  Then, bond your xSTND to claim the dividends proportionally!
                </div>
              }
              type="information"
            />
            <div
              className="
              flex flex-col lg:flex-row items-stretch 
              space-x-0 lg:space-x-4
              space-y-4 lg:space-y-0
              "
            >
              <div className="flex-1">
                <StndStaker
                  stnd={stnd}
                  xStndPerDay={xStndPerDay}
                  balance={balance}
                  stakedBalance={stakedBalance}
                  stakePoolStndTotal={stakePoolStndTotal}
                />
              </div>
              <div
                className="
                flex
                flex-col
                sm:flex-row
                lg:flex-col 
                space-y-4 lg:space-x-0
                sm:space-y-0 sm:space-x-4
                lg:space-y-4 lg:space-x-0"
              >
                <ViewportSmallUp>
                  <div className="flex flex-1">
                    <StakePoolInfo
                      stnd={stnd}
                      className="flex-1"
                      stakePoolStndTotal={stakePoolStndTotal}
                      xStndPerDay={xStndPerDay}
                    />
                  </div>
                </ViewportSmallUp>

                <XStndClaimer className="flex-1" />
              </div>
            </div>
          </div>
        </PageContent>
      </Page>{' '}
    </>
  );
}
