import {
  ApprovalState,
  useApproveCallback,
} from '../../hooks/useApproveCallback';
import {
  ChainId,
  MASTERCHEF_V2_ADDRESS,
  Token,
  ZERO,
} from '@digitalnative/standard-protocol-sdk';
import { Chef } from './enum';
import { Disclosure, Transition } from '@headlessui/react';
import React, { useState } from 'react';
import { usePendingSushi, useUserInfo } from './hooks';

import { Button } from '../../components-ui/Button';
import { Input as NumericalInput } from '../../components-ui/NumericalInput';
import { classNames, formatNumber } from '../../functions';
import { getAddress } from '@ethersproject/address';
import { tryParseAmount } from '../../functions/parse';
import useActiveWeb3React from '../../hooks/useActiveWeb3React';
import useMasterChef from './useMasterChef';
// import usePendingReward from './usePendingReward';
import { useTokenBalance } from '../../state/wallet/hooks';
import { useTransactionAdder } from '../../state/transactions/hooks';
import { DefinedStyles } from '../../utils/DefinedStyles';
import Liquidity from '../liquidity/Standalone/Liquidity';

const FarmListItemDetailsV2 = ({ farm, token0, token1 }) => {
  const { account, chainId } = useActiveWeb3React();
  const [pendingTx, setPendingTx] = useState(false);
  const [depositValue, setDepositValue] = useState('');
  const [withdrawValue, setWithdrawValue] = useState('');
  const [viewLiquidity, setViewLiquidity] = useState(true);

  const handleViewLiquidity = () => setViewLiquidity(true);
  const handleViewStaking = () => setViewLiquidity(false);

  const addTransaction = useTransactionAdder();

  const liquidityToken = new Token(
    chainId,
    getAddress(farm.address),
    18,
    'LTR',
    'Standard Liter Token',
  );

  // User liquidity token balance
  const balance = useTokenBalance(account, liquidityToken);
  const userHasBalance = balance?.greaterThan(ZERO);
  // TODO: Replace these
  const amount = useUserInfo(farm, liquidityToken);

  const pendingSushi = usePendingSushi(farm);
  // const reward = usePendingReward(farm);

  const APPROVAL_ADDRESSES = {
    [Chef.MASTERCHEF_V2]: {
      [ChainId.MAINNET]: MASTERCHEF_V2_ADDRESS[ChainId.MAINNET],
      [ChainId.RINKEBY]: MASTERCHEF_V2_ADDRESS[ChainId.RINKEBY],
      [ChainId.SHIBUYA]: MASTERCHEF_V2_ADDRESS[ChainId.SHIBUYA],
      [ChainId.SHIDEN]: MASTERCHEF_V2_ADDRESS[ChainId.SHIDEN],
    },
  };

  const typedDepositValue = tryParseAmount(depositValue, liquidityToken);
  const typedWithdrawValue = tryParseAmount(withdrawValue, liquidityToken);

  const [approvalState, approve] = useApproveCallback(
    typedDepositValue,
    APPROVAL_ADDRESSES[Chef.MASTERCHEF_V2][chainId],
  );

  const { deposit, withdraw, harvest } = useMasterChef(Chef.MASTERCHEF_V2);

  return (
    <Transition
      show={true}
      enter="transition-opacity duration-75"
      enterFrom="opacity-0"
      enterTo="opacity-100"
      leave="transition-opacity duration-150"
      leaveFrom="opacity-100"
      leaveTo="opacity-0"
    >
      <Disclosure.Panel
        className="flex flex-col w-full border-t-0 rounded-20 rounded-t-none bg-opaque"
        static
      >
        <div className="p-4 space-y-4 flex flex-col items-center">
          <div className="">
            <div
              className="
          rounded-full text-grey 
          items-center
          inline-flex
          bg-opaque-inactive"
            >
              <div
                onClick={handleViewLiquidity}
                className={classNames(
                  `
            flex items-center justify-center 
            px-4 py-2
            rounded-full
            cursor-pointer`,
                  viewLiquidity &&
                    `
                bg-opaque
                border
                border-opaque-border
                text-text
                font-bold`,
                )}
              >
                Liquidity
              </div>
              <div
                onClick={handleViewStaking}
                className={classNames(
                  `
            flex items-center justify-center 
            px-4 py-2
            rounded-full
            cursor-pointer`,
                  !viewLiquidity &&
                    `
                bg-opaque
                border
                border-opaque-border
                text-text
                font-bold`,
                )}
              >
                Staking
              </div>
            </div>
          </div>

          {viewLiquidity ? (
            <div className="w-full md:w-auto min-w-[60%]">
              <Liquidity
                liquidityToken={liquidityToken}
                userHasBalance={userHasBalance}
                tokenAId={token0.address}
                tokenBId={token1.address}
              />
            </div>
          ) : (
            <div className="grid grid-cols-2 gap-4 w-full">
              <div className="col-span-2 text-center md:col-span-1">
                {account && (
                  <div className="pr-4 mb-2 text-sm text-right cursor-pointer">
                    Wallet Balance:{' '}
                    {formatNumber(balance?.toSignificant(6) ?? 0)}
                  </div>
                )}
                <div
                  className="relative flex items-center w-full mb-4 px-4 py-3
                rounded-20 bg-opaque-secondary"
                >
                  <NumericalInput
                    className="
                    w-full pr-2 
                    outline-none"
                    value={depositValue}
                    onUserInput={setDepositValue}
                  />
                  {account && (
                    <Button
                      type="bordered"
                      onClick={() => {
                        if (!balance.equalTo(ZERO)) {
                          setDepositValue(
                            balance.toFixed(liquidityToken.decimals),
                          );
                        }
                      }}
                    >
                      MAX
                    </Button>
                  )}
                </div>
                {approvalState === ApprovalState.NOT_APPROVED ||
                approvalState === ApprovalState.PENDING ? (
                  <Button
                    className={DefinedStyles.swapButton}
                    disabled={approvalState === ApprovalState.PENDING}
                    onClick={approve}
                  >
                    {approvalState === ApprovalState.PENDING
                      ? 'Approving'
                      : 'Approve'}
                  </Button>
                ) : (
                  <Button
                    className={DefinedStyles.swapButton}
                    disabled={
                      pendingTx ||
                      !typedDepositValue ||
                      balance.lessThan(typedDepositValue)
                    }
                    onClick={async () => {
                      setPendingTx(true);
                      try {
                        // KMP decimals depend on asset, SLP is always 18
                        const tx = await deposit(
                          farm.id,
                          depositValue.toBigNumber(liquidityToken?.decimals),
                        );

                        addTransaction(tx, {
                          summary: `Deposit ${token0.name}/${token1.name}`,
                        });
                      } catch (error) {
                        console.error(error);
                      }
                      setPendingTx(false);
                    }}
                  >
                    Stake
                  </Button>
                )}
              </div>
              <div className="col-span-2 text-center md:col-span-1">
                {account && (
                  <div className="pr-4 mb-2 text-sm text-right cursor-pointer">
                    Your Staked: {formatNumber(amount?.toSignificant(6)) ?? 0}
                  </div>
                )}
                <div
                  className="relative flex items-center w-full mb-4 px-4 py-3
                rounded-20 bg-opaque-secondary"
                >
                  <NumericalInput
                    className="
                    w-full pr-2 
                    outline-none"
                    value={withdrawValue}
                    onUserInput={(value) => {
                      setWithdrawValue(value);
                    }}
                  />
                  {account && (
                    <Button
                      type="bordered"
                      onClick={() => {
                        if (!amount.equalTo(ZERO)) {
                          setWithdrawValue(
                            amount.toFixed(liquidityToken.decimals),
                          );
                        }
                      }}
                    >
                      MAX
                    </Button>
                  )}
                </div>
                <div className="flex space-x-2">
                  <Button
                    className={DefinedStyles.swapButton}
                    disabled={
                      pendingTx ||
                      !typedWithdrawValue ||
                      amount.lessThan(typedWithdrawValue)
                    }
                    onClick={async () => {
                      setPendingTx(true);
                      try {
                        // KMP decimals depend on asset, SLP is always 18
                        const tx = await withdraw(
                          farm.id,
                          withdrawValue.toBigNumber(liquidityToken?.decimals),
                        );
                        addTransaction(tx, {
                          summary: `Withdraw ${token0.name}/${token1.name}`,
                        });
                      } catch (error) {
                        console.error(error);
                      }

                      setPendingTx(false);
                    }}
                  >
                    Unstake
                  </Button>
                </div>
              </div>
              {pendingSushi && pendingSushi.greaterThan(ZERO) && (
                <div
                  className="
                flex items-center justify-between 
                border border-primary p-4 
                rounded-20 
                col-span-2 lg:col-span-1"
                >
                  <div className="flex spacep-x-2">
                    <div className="text-primary text-sm lg:text-xl">
                      {formatNumber(pendingSushi.toFixed(18))} STND
                    </div>
                  </div>
                  <Button
                    className="px-5 py-3 !text-base font-semibold"
                    onClick={async () => {
                      setPendingTx(true);
                      try {
                        const tx = await harvest(farm.id);
                        addTransaction(tx, {
                          summary: `Harvest ${token0.name}/${token1.name}`,
                        });
                      } catch (error) {
                        console.error(error);
                      }
                      setPendingTx(false);
                    }}
                  >
                    Harvest
                  </Button>
                </div>
              )}
            </div>
          )}
        </div>
      </Disclosure.Panel>
    </Transition>
  );
};

export default FarmListItemDetailsV2;
