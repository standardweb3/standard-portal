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
import { formatNumber } from '../../functions';
import { getAddress } from '@ethersproject/address';
import { tryParseAmount } from '../../functions/parse';
import useActiveWeb3React from '../../hooks/useActiveWeb3React';
import useMasterChef from './useMasterChef';
// import usePendingReward from './usePendingReward';
import { useTokenBalance } from '../../state/wallet/hooks';
import { useTransactionAdder } from '../../state/transactions/hooks';
import { DefinedStyles } from '../../utils/DefinedStyles';

const FarmListItemDetailsV2 = ({ farm, token0, token1 }) => {
  const { account, chainId } = useActiveWeb3React();
  const [pendingTx, setPendingTx] = useState(false);
  const [depositValue, setDepositValue] = useState('');
  const [withdrawValue, setWithdrawValue] = useState('');

  const addTransaction = useTransactionAdder();

  const liquidityToken = new Token(
    chainId,
    getAddress(farm.address),
    18,
    'UNI-V2',
    'Uniswap V2',
  );

  // User liquidity token balance
  const balance = useTokenBalance(account, liquidityToken);

  // TODO: Replace these
  const amount = useUserInfo(farm, liquidityToken);

  const pendingSushi = usePendingSushi(farm);
  // const reward = usePendingReward(farm);

  const APPROVAL_ADDRESSES = {
    [Chef.MASTERCHEF_V2]: {
      [ChainId.MAINNET]: MASTERCHEF_V2_ADDRESS[ChainId.MAINNET],
      [ChainId.RINKEBY]: MASTERCHEF_V2_ADDRESS[ChainId.RINKEBY],
      [ChainId.SHIBUYA]: MASTERCHEF_V2_ADDRESS[ChainId.SHIBUYA],
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
        <div className="grid grid-cols-2 gap-4 p-4">
          <div className="col-span-2 text-center md:col-span-1">
            {account && (
              <div className="pr-4 mb-2 text-sm text-right cursor-pointer">
                Wallet Balance: {formatNumber(balance?.toSignificant(6) ?? 0)}
              </div>
            )}
            <div className="relative flex items-center w-full mb-4">
              <NumericalInput
                className="
                    w-full !py-3 !px-4 pr-20 
                    rounded-20 outline-none 
                    !bg-opaque-secondary focus:ring focus:ring-primary"
                value={depositValue}
                onUserInput={setDepositValue}
              />
              {account && (
                <Button
                  type="bordered"
                  onClick={() => {
                    if (!balance.equalTo(ZERO)) {
                      setDepositValue(balance.toFixed(liquidityToken.decimals));
                    }
                  }}
                  className="absolute right-4"
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
            <div className="relative flex items-center w-full mb-4">
              <NumericalInput
                className="
                  w-full !py-3 !px-4 pr-20 
                  rounded-20 outline-none 
                  !bg-opaque-secondary focus:ring focus:ring-primary"
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
                      setWithdrawValue(amount.toFixed(liquidityToken.decimals));
                    }
                  }}
                  className="absolute right-4"
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
      </Disclosure.Panel>
    </Transition>
  );
};

export default FarmListItemDetailsV2;
