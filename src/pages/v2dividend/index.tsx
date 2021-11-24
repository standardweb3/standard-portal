import { STND_ADDRESS, Token } from '@digitalnative/standard-protocol-sdk';
import React, { useMemo, useState } from 'react';
import { formatNumber, tryParseAmount } from '../../functions';

import { Alert } from '../../components-ui/Alert';
import Head from 'next/head';
import { useActiveWeb3React } from '../../hooks/useActiveWeb3React';
import { useTokenBalance } from '../../state/wallet/hooks';
import { Page } from '../../components-ui/Page';
import { PageHeader } from '../../components-ui/PageHeader';
import { PageContent } from '../../components-ui/PageContent';
import { DefinedStyles } from '../../utils/DefinedStyles';
import {
  ViewportMediumUp,
  ViewportSmallUp,
  ViewportXSmall,
} from '../../components-ui/Responsive';
import { DividendPercentage } from '../../components-ui/DividendV2/DividendPercentage';
import { useTransactionAdder } from '../../state/transactions/hooks';
import { useApproveCallback, useDividendPoolAddress } from '../../hooks';
import useDividendPool from '../../features/dividend/useDividendPool';
import { BondedInfo } from '../../components-ui/DividendV2/BondedInfo';
import { Unbond } from '../../components-ui/DividendV2/Unbond';
import { BondInput } from '../../components-ui/DividendV2/BondInput';
import {
  useBonded,
  useBondSupply,
  useRemainingBondingTime,
} from '../../hooks/useBonded';
import { BigNumber } from 'ethers';
import {
  useDividendPoolWhitelistPairBalances,
  useDividendPoolWhitelistTokenBalances,
} from '../../hooks/dividend/useDividendV2';
import { DividendPairs } from '../../components-ui/DividendV2/DividendPairs';
import styled from '@emotion/styled';
import { AnalyticsLink } from '../../components-ui/AnalyticsLink';
import { DividendTokens } from '../../components-ui/DividendV2/DividendTokens';
import { ExternalLink } from '../../components-ui/ExternalLink';
import Countdown from 'react-countdown';

export const BondWrapper = styled.div`
  @media only screen and (min-width: 640px) {
    background-repeat: no-repeat;
    background-image: url('/img/bg-bond.png');
    background-position: top 20px right 20px;
  }
`;

export default function Dividend() {
  const { account, chainId } = useActiveWeb3React();
  const [pendingTx, setPendingTx] = useState(false);
  const [depositValue, setDepositValue] = useState('');
  const [withdrawValue, setWithdrawValue] = useState('');
  const { pairsWithDividends } = useDividendPoolWhitelistPairBalances(10);

  // const swapPairs = useSushiPairs({
  //   where: {
  //     id_in: pairsWithDividends.map((pair) => pair.address.toLowerCase()),
  //   },
  // });

  const { tokensWithDividends } = useDividendPoolWhitelistTokenBalances(10);

  const fetchedWhitelistPairs = useMemo(() => {
    return pairsWithDividends.filter((pair) => pair.amount !== null);
  }, [pairsWithDividends]);

  const fetchedWhitelistTokens = useMemo(() => {
    return tokensWithDividends.filter((token) => token.amount !== null);
  }, [tokensWithDividends]);

  const addTransaction = useTransactionAdder();

  const dividendPoolAddress = useDividendPoolAddress();
  // const bondedStrategy = useBondedStrategy();
  // const bundle = useBundle();
  // const ethPrice = bundle?.bundles?.[0]?.ethPrice;
  // const stndPrice = useStandardPrice();

  // const {
  //   apr,
  //   apy,
  //   claimedReward,
  //   reaminingReward,
  //   totalReward,
  // } = useMemo(() => {
  //   if (!ethPrice || !stndPrice || !bondedStrategy)
  //     return {
  //       apr: null,
  //       apy: null,
  //       claimedReward: null,
  //       reaminingReward: null,
  //       totalReward: null,
  //     };
  //   else {
  //     const date = Math.floor(Math.floor(Date.now() / 1000) / 86400);
  //     const inception = Math.floor(parseInt(bondedStrategy.inception) / 86400);
  //     const dateFromInception = date - inception;
  //     const totalSupply = parseFloat(bondedStrategy.totalSupply) / 1e18;
  //     const claimedReward = parseFloat(bondedStrategy.totalClaimedUSD);
  //     const reaminingReward =
  //       parseFloat(bondedStrategy.totalClaimedUSD) +
  //       parseFloat(bondedStrategy.remainingRewardETH) * ethPrice;

  //     const totalReward = claimedReward + reaminingReward;
  //     const r = totalReward / (totalSupply * stndPrice);
  //     const apr =
  //       (Math.pow(r + 1, 1 / (dateFromInception + 1)) - 1) * 365 * 100;
  //     const apy = (Math.pow(1 + apr / 100 / 365, 365) - 1) * 100;

  //     return { apr, apy, claimedReward, reaminingReward, totalReward };
  //   }
  // }, [ethPrice, stndPrice, bondedStrategy]);

  const stnd = new Token(
    chainId,
    STND_ADDRESS[chainId],
    18,
    'STND',
    'Standard',
  );

  const bonded = useBonded();
  const bondedTotal = useBondSupply();
  const bondedTotalDecimals = (
    bondedTotal?.div(BigNumber.from(1e10)).toNumber() / 100000000
  ).toFixed(4);
  const remainingSeconds = useRemainingBondingTime();

  const share = useMemo(() => {
    if (bonded !== null && bondedTotal !== null) {
      if (bondedTotal.eq(BigNumber.from(0))) return 0;
      return (
        Number(bonded.toFixed(stnd.decimals)) /
        Number(bondedTotal.toFixed(stnd.decimals))
      );
    }
    return null;
  }, [bonded, bondedTotal, stnd.decimals]);

  const stndBalance = useTokenBalance(account, stnd);
  const onBondMax = () => setDepositValue(stndBalance?.toExact());
  const onUnbondMax = () => setWithdrawValue(bonded.toFixed(stnd.decimals));

  const typedDepositValue = tryParseAmount(depositValue, stnd);

  const atBondMax = stndBalance?.lessThan(typedDepositValue ?? 0);
  const atUnbondMax =
    withdrawValue && bonded?.lt(withdrawValue.toBigNumber(stnd.decimals));

  const [approvalState, approve] = useApproveCallback(
    typedDepositValue,
    dividendPoolAddress,
  );

  const { bond, unbond, claim } = useDividendPool();

  const handleBond = async () => {
    setPendingTx(true);
    try {
      // KMP decimals depend on asset, SLP is always 18
      const tx = await bond(depositValue.toBigNumber(stnd?.decimals));

      addTransaction(tx, {
        summary: `Bond ${depositValue} STND`,
      });
    } catch (error) {
      console.error(error);
    }
    setPendingTx(false);
  };

  const handleUnbond = async (token) => {
    setPendingTx(true);
    try {
      // KMP decimals depend on asset, SLP is always 18
      const tx = await unbond(withdrawValue.toBigNumber(stnd?.decimals));

      addTransaction(tx, {
        summary: `Unbond ${depositValue} STND`,
      });
    } catch (error) {
      console.error(error);
    }
    setPendingTx(false);
  };

  const handleClaim = async (address: string) => {
    setPendingTx(true);
    try {
      // KMP decimals depend on asset, SLP is always 18
      const tx = await claim(address);

      addTransaction(tx, {
        summary: `Claim dividend`,
      });
    } catch (error) {
      console.error(error);
    }
    setPendingTx(false);
  };

  const migrationDate = 1638316799;

  return (
    <>
      <Head>
        <title>Dividend | Standard Protocol</title>
        <meta
          key="description"
          name="description"
          content="Standard Protocol dividend pool creates passive income for STND holders through fees collected on portal usage"
        />
      </Head>
      <Page id="dividend-page" className={DefinedStyles.page}>
        <ViewportMediumUp>
          <PageHeader title="Dividend Pool" />
        </ViewportMediumUp>
        <PageContent>
          <Alert
            className={DefinedStyles.pageAlertFull}
            title={`Dividends`}
            message={
              <div className="leading-relaxed">
                Other protocols take a big percentage of total pool growth as a
                fee and do not give back.
                <br /> At <strong>Standard’s Portal</strong>, portions of the
                swap fees are distributed as proportional to your share of the
                pool letting both the platform and the community maintain
                sustainability and grow together as one
                <br />
                <br />
                <span className="font-bold">
                  * There is a locking period of 30 days
                </span>
                <br />
                <span className="font-bold">
                  * Reward from each pool has a claiming period of 30 days
                </span>
              </div>
            }
            type="information"
          />
          <Alert
            className={DefinedStyles.pageAlertFull}
            title={`Dividend is migrating to V2`}
            message={
              <div>
                <ExternalLink href="https://snapshot.org/#/stndgov.eth/proposal/0x73ba6565c31073f9092b3a62447a787da65eb5fea19c7477a02fe12be9ea9f11">
                  dSTND
                </ExternalLink>{' '}
                is coming!
              </div>
            }
            type="warning"
          />

          <div
            className="
            w-full py-4 lg:py-8
          "
          >
            <div
              className="
              grid grid-cols-3
              space-x-0
              lg:space-x-2
              space-y-4
              lg:space-y-0"
            >
              <BondWrapper
                className="
                col-span-3
                lg:col-span-2
                relative
                rounded-20 p-8
                bg-background-bond
                "
              >
                <div className="space-y-8 flex flex-col items-center">
                  <div
                    className="
                    w-full flex flex-col items-center 
                    sm:flex-row 
                    sm:justify-center
                    sm:space-x-6
                    space-y-12
                    sm:space-y-0
                    relative"
                  >
                    <div className="absolute top-0 right-0">
                      <AnalyticsLink
                        iconClassName="!text-primary"
                        path="dividend"
                      />
                    </div>
                    <ViewportXSmall>
                      <BondedInfo
                        className="text-center"
                        amount={formatNumber(
                          bonded?.toFixed(stnd.decimals) ?? 0,
                        )}
                        share={share ?? 0}
                        total={bondedTotalDecimals}
                      />

                      <div className="w-[110px]">
                        <DividendPercentage value={share ? share * 100 : 0} />
                      </div>
                    </ViewportXSmall>
                    <ViewportSmallUp>
                      <div className="w-[110px]">
                        <DividendPercentage value={share ? share * 100 : 0} />
                      </div>
                      <BondedInfo
                        amount={formatNumber(
                          bonded?.toFixed(stnd.decimals) ?? 0,
                        )}
                        total={bondedTotalDecimals}
                        share={share ?? 0}
                      />
                    </ViewportSmallUp>
                  </div>
                  <div className="md:max-w-[75%]">
                    <BondInput
                      disabled={
                        pendingTx ||
                        !depositValue ||
                        depositValue === '0' ||
                        atBondMax
                      }
                      atMax={atBondMax}
                      onMax={onBondMax}
                      setBondAmount={setDepositValue}
                      bondAmount={depositValue}
                      onBond={handleBond}
                      approvalState={approvalState}
                      approve={approve}
                      balance={stndBalance?.toExact()}
                      buttonClassName="!py-2"
                      bondButtonBody={
                        <div className="text-sm min-h-[14px]">
                          Migrating to V2 in <br />
                          <Countdown date={migrationDate * 1000} />
                        </div>
                      }
                    />
                  </div>
                </div>
              </BondWrapper>
              <div className="col-span-3 lg:col-span-1">
                <Unbond
                  remainingSeconds={remainingSeconds}
                  atMax={atUnbondMax}
                  onMax={onUnbondMax}
                  setUnbondAmount={setWithdrawValue}
                  unbond={handleUnbond}
                  bondedAmount={bonded}
                  unbondAmount={withdrawValue}
                  disabled={
                    bonded?.eq(BigNumber.from(0)) ||
                    remainingSeconds === null ||
                    remainingSeconds > 0
                  }
                />
              </div>
            </div>

            <div className="mt-6 text-grey text-xs">
              * Reward from each pair has a claiming period of 30 days
            </div>
            <DividendPairs
              claim={handleClaim}
              className="mt-6"
              share={share}
              pairsWithDividends={fetchedWhitelistPairs}
            />

            <div className="mt-12 text-grey text-xs">
              * Reward from each token has a claiming period of 30 days
            </div>
            <DividendTokens
              claim={handleClaim}
              className="mt-6"
              share={share}
              tokensWithDividends={fetchedWhitelistTokens}
            />
          </div>
        </PageContent>
      </Page>
    </>
  );
}
