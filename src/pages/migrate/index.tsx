import Head from 'next/head';
import {
  ApprovalState,
  useApproveCallback,
} from '../../hooks/useApproveCallback';
import { ChevronDownIcon, XIcon } from '@heroicons/react/outline';
import React, { useCallback, useEffect, useState } from 'react';
import { formatUnits, parseUnits } from '@ethersproject/units';

import { AddressZero } from '@ethersproject/constants';
import { ChainId, JSBI } from '@digitalnative/standard-protocol-sdk';
import useMigrateState, { MigrateState } from '../../hooks/useMigrateState';
import { Button, ButtonConfirmed } from '../../components-ui/Button';
import LPToken from '../../types/LPToken';
import { DoubleCurrencyLogo } from '../../components-ui/CurrencyLogo/DoubleCurrencyLogo';
import MetamaskError from '../../types/MetamaskError';
import { useActiveWeb3React, useSushiRollContract } from '../../hooks';
import { WalletConnector } from '../../components-ui/WalletConnector';
import { Input as NumericalInput } from '../../components-ui/NumericalInput';
import { Page } from '../../components-ui/Page';
import { DefinedStyles } from '../../utils/DefinedStyles';
import { PageContent } from '../../components-ui/PageContent';
import { Badge } from '../../components-ui/Badge';
import { PageHeader } from '../../components-ui/PageHeader';
import { ViewportMediumUp } from '../../components-ui/Responsive';
import { RippleSpinner } from '../../components-ui/Spinner/RippleSpinner';
import { Alert } from '../../components-ui/Alert';

const ZERO = JSBI.BigInt(0);

const AmountInput = ({ state }: { state: MigrateState }) => {
  const onPressMax = useCallback(() => {
    if (state.selectedLPToken) {
      let balance = state.selectedLPToken.balance.quotient;
      if (state.selectedLPToken.address === AddressZero) {
        // Subtract 0.01 ETH for gas fee
        const fee = JSBI.exponentiate(JSBI.BigInt(10), JSBI.BigInt(16));
        balance = JSBI.greaterThan(balance, fee)
          ? JSBI.subtract(balance, fee)
          : ZERO;
      }

      state.setAmount(
        formatUnits(balance.toString(), state.selectedLPToken.decimals),
      );
    }
  }, [state]);

  useEffect(() => {
    if (!state.mode || state.lpTokens.length === 0 || !state.selectedLPToken) {
      state.setAmount('');
    }
  }, [state]);

  if (!state.lpTokens.length) {
    return null;
  }

  if (!state.mode || !state.selectedLPToken) {
    return (
      <>
        <div className="p-3 text-center cursor-not-allowed bg-opaque rounded-20">
          <div>
            {state.mode && state.lpTokens.length === 0
              ? 'No LP tokens found'
              : 'Select an LP Token'}
          </div>
        </div>
      </>
    );
  }

  return (
    <>
      <div className="text-grey text-sm">{`Amount of Tokens`}</div>

      <div
        className="
        flex items-center w-full 
        mb-4 p-3 rounded-20
        bg-opaque"
      >
        <NumericalInput
          className="w-full"
          value={state.amount}
          onUserInput={(val) => state.setAmount(val)}
        />
        <Button type="bordered" onClick={onPressMax}>
          {`MAX`}
        </Button>
      </div>
    </>
  );
};

interface PositionCardProps {
  lpToken: LPToken;
  onToggle: (lpToken: LPToken) => void;
  isSelected: boolean;
  updating: boolean;
  exchange: string | undefined;
}

const LPTokenSelect = ({
  lpToken,
  onToggle,
  isSelected,
  updating,
  exchange,
}: PositionCardProps) => {
  return (
    <div
      key={lpToken.address}
      className="
        flex items-center justify-between 
        px-3 py-5 rounded-20 
        cursor-pointer 
        bg-opaque hover:bg-bright 
        space-x-3"
      onClick={() => onToggle(lpToken)}
    >
      <div className="flex items-center space-x-3">
        <DoubleCurrencyLogo
          currencyClassName="rounded-full"
          currency0={lpToken.tokenA}
          currency1={lpToken.tokenB}
          size={20}
        />
        <div>{`${lpToken.tokenA.symbol} / ${lpToken.tokenB.symbol}`}</div>
        {lpToken.version && <Badge color="primary">{lpToken.version}</Badge>}
      </div>
      {isSelected ? (
        <XIcon width={16} height={16} />
      ) : (
        <ChevronDownIcon width={16} height={16} />
      )}
    </div>
  );
};

const MigrateModeSelect = ({ state }: { state: MigrateState }) => {
  function toggleMode(mode = undefined) {
    state.setMode(mode !== state.mode ? mode : undefined);
  }

  const items = [
    {
      key: 'permit',
      text: `Non-hardware Wallet`,
      description: `Migration is done in one-click using your signature (permit)`,
    },
    {
      key: 'approve',
      text: `Hardware Wallet`,
      description: `You need to first approve LP tokens and then migrate it`,
    },
  ];

  return (
    <>
      {items.reduce((acc: any, { key, text, description }: any) => {
        if (state.mode === undefined || key === state.mode)
          acc.push(
            <div
              key={key}
              className="flex items-center justify-between p-3
              rounded-20 cursor-pointer
              transition duration-500
              bg-opaque hover:bg-bright
              space-x-3"
              onClick={() => toggleMode(key)}
            >
              <div>
                <div className="font-bold">
                  <div>{text}</div>
                </div>
                <div>
                  <div className="text-grey text-sm">{description}</div>
                </div>
              </div>
              {key === state.mode ? (
                <XIcon width={16} height={16} />
              ) : (
                <ChevronDownIcon width={16} height={16} />
              )}
            </div>,
          );
        return acc;
      }, [])}
    </>
  );
};

const MigrateButtons = ({
  state,
  exchange,
}: {
  state: MigrateState;
  exchange: string | undefined;
}) => {
  const [error, setError] = useState<MetamaskError>({});
  const sushiRollContract = useSushiRollContract(
    state.selectedLPToken?.version ? state.selectedLPToken?.version : undefined,
  );
  // console.log(
  //   'sushiRollContract address',
  //   sushiRollContract?.address,
  //   state.selectedLPToken?.balance,
  //   state.selectedLPToken?.version
  // )

  const [approval, approve] = useApproveCallback(
    state.selectedLPToken?.balance,
    sushiRollContract?.address,
  );
  const noLiquidityTokens =
    !!state.selectedLPToken?.balance &&
    state.selectedLPToken?.balance.equalTo(ZERO);
  const isButtonDisabled = !state.amount;

  useEffect(() => {
    setError({});
  }, [state.selectedLPToken]);

  if (
    !state.mode ||
    state.lpTokens.length === 0 ||
    !state.selectedLPToken ||
    !state.amount
  ) {
    return (
      <ButtonConfirmed
        className={DefinedStyles.fullButton}
        color="primary"
        disabled={true}
      >
        Migrate
      </ButtonConfirmed>
    );
  }

  const insufficientAmount = JSBI.lessThan(
    state.selectedLPToken.balance.quotient,
    JSBI.BigInt(
      parseUnits(
        state.amount || '0',
        state.selectedLPToken.decimals,
      ).toString(),
    ),
  );

  const onPress = async () => {
    setError({});
    try {
      await state.onMigrate();
    } catch (e) {
      // console.log(e);
      setError(e);
    }
  };

  return (
    <div className="space-y-4">
      {insufficientAmount ? (
        <div className="text-sm text-primary">{`Insufficient Balance`}</div>
      ) : state.loading ? (
        `Loading`
      ) : (
        <>
          {state.mode === 'approve' && (
            <ButtonConfirmed
              className={DefinedStyles.fullButton}
              color="primary"
              onClick={approve}
              confirmed={approval === ApprovalState.APPROVED}
              disabled={
                approval !== ApprovalState.NOT_APPROVED || isButtonDisabled
              }
            >
              {approval === ApprovalState.PENDING
                ? `Approving`
                : approval === ApprovalState.APPROVED
                ? `Approved`
                : `Approve`}
            </ButtonConfirmed>
          )}
          {((state.mode === 'approve' && approval === ApprovalState.APPROVED) ||
            state.mode === 'permit') && (
            <ButtonConfirmed
              className={DefinedStyles.fullButton}
              color="primary"
              disabled={
                noLiquidityTokens ||
                state.isMigrationPending ||
                isButtonDisabled
              }
              onClick={onPress}
            >
              {state.isMigrationPending ? `Migrating` : `Migrate`}
            </ButtonConfirmed>
          )}
        </>
      )}
      {error.message && error.code !== 4001 && (
        <div className="font-medium text-center text-red">{error.message}</div>
      )}
      <div className="text-sm text-center text-grey">
        {`Your ${exchange} ${state.selectedLPToken.tokenA.symbol}/${state.selectedLPToken.tokenB.symbol} liquidity will become Standard Protocol ${state.selectedLPToken.tokenA.symbol}/${state.selectedLPToken.tokenB.symbol} liquidity.`}
      </div>
    </div>
  );
};

const ExchangeLiquidityPairs = ({
  state,
  exchange,
}: {
  state: MigrateState;
  exchange: undefined | string;
}) => {
  function onToggle(lpToken: LPToken) {
    state.setSelectedLPToken(
      state.selectedLPToken !== lpToken ? lpToken : undefined,
    );
    state.setAmount('');
  }

  if (!state.mode) {
    return null;
  }

  if (state.lpTokens.length === 0) {
    return (
      <div className="text-center text-danger py-4">No Liquidity found</div>
    );
  }

  return (
    <>
      {state.lpTokens.reduce<JSX.Element[]>((acc, lpToken) => {
        if (
          lpToken.balance &&
          JSBI.greaterThan(lpToken.balance.quotient, JSBI.BigInt(0))
        ) {
          acc.push(
            <LPTokenSelect
              lpToken={lpToken}
              onToggle={onToggle}
              isSelected={state.selectedLPToken === lpToken}
              updating={state.updatingLPTokens}
              exchange={exchange}
            />,
          );
        }
        return acc;
      }, [])}
    </>
  );
};

export default function Migrate() {
  const { account, chainId } = useActiveWeb3React();

  const state = useMigrateState();

  let exchange;

  if (chainId === ChainId.MAINNET) {
    exchange = 'Uniswap';
  } else if (chainId === ChainId.BSC) {
    exchange = 'PancakeSwap';
  } else if (chainId === ChainId.MATIC) {
    exchange = 'QuickSwap';
  }

  return (
    <>
      <Head>
        <title>Migrate | Standard Protocol</title>
        <meta
          key="description"
          name="description"
          content="Migrate your liquidity to Standard Protocol."
        />
      </Head>

      <Page id="migrate-page" className={DefinedStyles.page}>
        <ViewportMediumUp>
          <PageHeader title="Migrate Liquidity Positions" />
        </ViewportMediumUp>
        <PageContent>
          <div>
            <Alert
              className={DefinedStyles.pageAlertFull}
              title={`${exchange} Liquidity Migration`}
              message={`Migrate your ${exchange} Liquidity to Standard Protocol`}
              type="warning"
            />
            <div className="p-4 space-y-4 bg-opaque rounded-20">
              {!account ? (
                <WalletConnector className="w-full" />
              ) : state.loading ? (
                <div className="p-4 text-center text-grey flex items-center space-x-3">
                  <div>{`Loading your liquidity positions`}</div>{' '}
                  <RippleSpinner size={16} />
                </div>
              ) : (
                <>
                  {!state.loading && (
                    <div className="font-bold">{`Your Wallet`}</div>
                  )}{' '}
                  <MigrateModeSelect state={state} />
                  {!state.loading && state.lpTokens.length > 0 && (
                    <div>
                      <div>{`Your Liquidity`}</div>
                      <div className="text-grey text-sm">
                        {`Click on a pool below, input the amount you wish to migrate or select max, and click
                        migrate`}
                      </div>
                    </div>
                  )}
                  <ExchangeLiquidityPairs state={state} exchange={exchange} />
                  <AmountInput state={state} />
                  {state.selectedLPToken && (
                    <>
                      <div className="flex justify-between">
                        <div className="text-sm">
                          {`Balance`}:{' '}
                          <span className="text-primary">
                            {state.selectedLPToken.balance?.toSignificant(4) ??
                              0}
                          </span>
                        </div>
                      </div>
                      <MigrateButtons state={state} exchange={exchange} />
                    </>
                  )}
                </>
              )}
            </div>
          </div>
        </PageContent>
      </Page>
    </>
  );
}
