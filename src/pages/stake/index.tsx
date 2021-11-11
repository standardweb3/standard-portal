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
import { useStnd, useXStnd } from '../../hooks/Tokens';
import { useAverageBlockTime, useStandardPrice } from '../../services/graph';
import { useTokenBalance } from '../../state/wallet/hooks';
import { useActiveWeb3React } from '../../hooks';
import { MASTERCHEF_V2_ADDRESS } from '@digitalnative/standard-protocol-sdk';
import { BigNumber } from 'ethers';
import { AVERAGE_BLOCK_TIME_IN_SECS } from '../../constants';
import { Alert } from '../../components-ui/Alert';
import useStndStaker from '../../hooks/stake';
import { useWalletModalToggle } from '../../state/application/hooks';
import { useState } from 'react';

export default function Stake() {
  const { account, chainId } = useActiveWeb3React();
  const [modalOpen, setModalOpen] = useState(false);

  const stnd = useStnd();
  const xStnd = useXStnd();
  const stndBalance = useTokenBalance(account ?? undefined, stnd);
  const xStndBalance = useTokenBalance(account ?? undefined, xStnd);

  const stndPrice = useStandardPrice();
  const { enter, leave } = useStndStaker();

  const walletConnected = !!account;
  const toggleWalletModal = useWalletModalToggle();

  // set apr from graph later on
  const [apr, setApr] = useState<any>();

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
          <div className="w-full max-w-[1200px]">
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
