import {
  CurrencyAmount,
  getXStndAddress,
  Token,
  ZERO,
} from '@digitalnative/standard-protocol-sdk';
import { useCallback, useState } from 'react';
import { classNames, formatNumber, tryParseAmount } from '../../functions';
import { sendTx } from '../../functions/sendTx';
import {
  ApprovalState,
  useActiveWeb3React,
  useApproveCallback,
} from '../../hooks';
import { useProtocol } from '../../state/protocol/hooks';
import { DefinedStyles } from '../../utils/DefinedStyles';
import { Button } from '../Button';
import { CurrencyLogo } from '../CurrencyLogo';
import { RippleSpinner } from '../Spinner/RippleSpinner';
import { TokenInputPanelV2 } from './TokenInputPanelV2';

export type StakeStndTypes = {
  xStnd: Token;
  stnd: Token;
  ratio: number;
  stndBalance: CurrencyAmount<Token> | undefined;
  xStndBalance: CurrencyAmount<Token> | undefined;
  stndPrice: CurrencyAmount<Token> | undefined;
  onStake: (amount: CurrencyAmount<Token> | undefined) => Promise<any>;
};
export function StakeStnd({
  stnd,
  xStnd,
  stndBalance,
  onStake,
  ratio,
}: StakeStndTypes) {
  const protocol = useProtocol();
  const { chainId } = useActiveWeb3React();
  const [stakeAmount, setStakeAmount] = useState('');
  const [pendingTx, setPendingTx] = useState(false);

  // const stndBalanceDecimals = stndBalance && parseFloat(stndBalance.toExact());

  // const balanceDecimals = balance && parseFloat(balance.toExact());

  const stakeCurrencyAmount = tryParseAmount(stakeAmount, stnd);
  const InsufficientBalance = stakeCurrencyAmount?.greaterThan(stndBalance);

  const [approvalState, approve] = useApproveCallback(
    stakeCurrencyAmount,
    getXStndAddress(protocol, chainId),
  );

  const disabled =
    !stakeCurrencyAmount?.greaterThan(ZERO) ||
    InsufficientBalance ||
    approvalState === ApprovalState.PENDING ||
    pendingTx;

  const handleClick = useCallback(async () => {
    if (disabled) return;

    setPendingTx(true);

    if (approvalState === ApprovalState.NOT_APPROVED) {
      const success = await sendTx(() => approve());
      if (!success) {
        setPendingTx(false);
        // setModalOpen(true)
        return;
      }
      setPendingTx(false);
      return;
    }
    const success = await sendTx(() => onStake(stakeCurrencyAmount));

    if (!success) {
      setPendingTx(false);
      // setModalOpen(true)
      return;
    }
    setStakeAmount('');
    setPendingTx(false);
  }, [stakeCurrencyAmount, approvalState, setPendingTx, onStake]);

  const xStndAmount = stakeAmount ? parseFloat(stakeAmount) / ratio : 0;

  // const stakeAmountDecimals = !!stakeAmount ? parseFloat(stakeAmount) : 0;
  // const newStakeBalance =
  //   stakedBalanceDecimals !== undefined
  //     ? stakeAmountDecimals + stakedBalanceDecimals
  //     : undefined;

  // const newStakeShare =
  //   newStakeBalance !== undefined && stakePoolStndTotalDecimals !== undefined
  //     ? newStakeBalance / (stakePoolStndTotalDecimals + stakeAmountDecimals)
  //     : undefined;
  // const estimatedXStndPerDay =
  //   newStakeShare !== undefined ? xStndPerDay * newStakeShare : undefined;

  // const estimatedXStndReward = (
  //   parseFloat(stakeCurrencyAmount.add(stakedBalance).toExact()) /
  const buttonBody = stakeCurrencyAmount?.greaterThan(ZERO) ? (
    InsufficientBalance ? (
      'Insufficient Balance'
    ) : approvalState !== ApprovalState.APPROVED ? (
      approvalState === ApprovalState.PENDING ? (
        <div className="flex items-center justify-center space-x-3">
          <div>Approving</div> <RippleSpinner size={16} />
        </div>
      ) : (
        'Approve'
      )
    ) : (
      'Stake'
    )
  ) : (
    'Enter amount'
  );

  return (
    <div className="text-text">
      {/* <div className="my-4">
        <EstimatedXStnd
          estimate={estimatedXStndPerDay ?? 0}
          stnd={stnd}
          currentStaked={stakedBalanceDecimals ?? 0}
          newStaked={newStakeBalance ?? 0}
        />
      </div> */}
      <div className="grid grid-cols-2">
        <div className="col-span-2 grid grid-cols-2 gap-x-4 text-sm">
          <div
            className="
            col-span-2
            text-xs text-primary text-right mb-2
            pr-2"
          >
            Balance: {formatNumber(stndBalance?.toSignificant(6) ?? 0)} STND
          </div>
        </div>
        <div className="col-span-2 mb-4">
          <TokenInputPanelV2
            token={stnd}
            max={stndBalance}
            amount={stakeAmount}
            onAmountChange={setStakeAmount}
            className="
            rounded-20 py-3 px-4
            bg-opaque
            text-text
        "
            inputClassName="
            !text-base
            !font-normal
        "
          />
        </div>
        <div className="flex align-center justify-center mb-6 mt-2 col-span-2">
          <div className="flex justify-center items-center space-x-4">
            <CurrencyLogo currency={xStnd} className="rounded-full" size={48} />
            <div>
              <div className="text-grey text-sm">You will Receive:</div>
              <div>{xStndAmount.toFixed(4)} dSTND</div>
            </div>
          </div>
        </div>

        <Button
          disabled={disabled}
          className={classNames(DefinedStyles.fullButton, 'col-span-2')}
          onClick={handleClick}
        >
          {buttonBody}
        </Button>
      </div>
    </div>
  );
}
