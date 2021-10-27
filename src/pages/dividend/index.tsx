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
import { DividendPercentage } from '../../components-ui/Dividend/DividendPercentage';
import { useTransactionAdder } from '../../state/transactions/hooks';
import { useApproveCallback, useDividendPoolAddress } from '../../hooks';
import useDividendPool from '../../features/dividend/useDividendPool';
import { BondedInfo } from '../../components-ui/Dividend/BondedInfo';
import { Unbond } from '../../components-ui/Dividend/Unbond';
import { BondInput } from '../../components-ui/Dividend/BondInput';
import {
  useBonded,
  useBondSupply,
  useRemainingBondingTime,
} from '../../hooks/useBonded';
import { BigNumber } from 'ethers';
import { useDividendPoolWhitelistPairBalances } from '../../state/user/hooks';
import { DividendPairs } from '../../components-ui/Dividend/DividendPairs';
import styled from '@emotion/styled';
import { AnalyticsLink } from '../../components-ui/AnalyticsLink';

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

  const fetchedWhitelistPairs = useMemo(() => {
    return pairsWithDividends.filter((pair) => pair.amount !== null);
  }, [pairsWithDividends]);

  const addTransaction = useTransactionAdder();

  const dividendPoolAddress = useDividendPoolAddress();

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
  }, [bonded, bondedTotal]);

  const stndBalance = useTokenBalance(account, stnd);
  const onBondMax = () => setDepositValue(stndBalance?.toExact());
  const onUnbondMax = () => setWithdrawValue(bonded.toFixed(stnd.decimals));

  const typedDepositValue = tryParseAmount(depositValue, stnd);

  const atBondMax = stndBalance?.lessThan(typedDepositValue ?? 0);
  const atUnbondMax = bonded?.lt(withdrawValue.toBigNumber(stnd.decimals));

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
              </div>
            }
            type="information"
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
                    {/* <div className="absolute top-0 right-0">
                      <AnalyticsLink
                        iconClassName="!text-primary"
                        path="dividend"
                      />
                    </div> */}
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
                      setBondAmout={setDepositValue}
                      bondAmount={depositValue}
                      onBond={handleBond}
                      approvalState={approvalState}
                      approve={approve}
                      balance={stndBalance?.toExact()}
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
            <DividendPairs
              claim={handleClaim}
              className="mt-12"
              share={share}
              pairsWithDividends={fetchedWhitelistPairs}
            />
          </div>
        </PageContent>
      </Page>
    </>
  );
}
