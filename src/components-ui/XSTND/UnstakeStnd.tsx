import {
  BAR_ADDRESS,
  CurrencyAmount,
  getXStndAddress,
  STND_ADDRESS,
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
import { RippleSpinner } from '../Spinner/RippleSpinner';
import { EstimatedXStnd } from './EstimatedXStnd';
import { TokenInputPanelV2 } from './TokenInputPanelV2';

export type UnstakeStndTypes = {
  xStnd: Token;
  stnd: Token;
  stndBalance: CurrencyAmount<Token> | undefined;
  xStndBalance: CurrencyAmount<Token> | undefined;
  stndPrice: CurrencyAmount<Token> | undefined;
  onUnstake: (amount: CurrencyAmount<Token> | undefined) => Promise<any>;
};

export function UnstakeStnd({
  xStnd,
  stnd,
  stndBalance,
  xStndBalance,
  stndPrice,
  onUnstake,
}: UnstakeStndTypes) {
  const protocol = useProtocol();
  const { chainId } = useActiveWeb3React();
  const [unstakeAmount, setUntakeAmount] = useState('');
  const [pendingTx, setPendingTx] = useState(false);

  const xStndBalanceDecimals =
    xStndBalance && parseFloat(xStndBalance.toExact());

  // const balanceDecimals = balance && parseFloat(balance.toExact());
  const unstakeCurrencyAmount = tryParseAmount(unstakeAmount, xStnd);
  const InsufficientBalance = unstakeCurrencyAmount?.greaterThan(xStndBalance);

  const [approvalState, approve] = useApproveCallback(
    unstakeCurrencyAmount,
    getXStndAddress(protocol, chainId),
  );

  const handleClick = useCallback(async () => {
    if (approvalState === ApprovalState.NOT_APPROVED) {
      const success = await sendTx(() => approve());
      if (!success) {
        setPendingTx(false);
        // setModalOpen(true)
        return;
      }
      return;
    }
    const success = await sendTx(() => onUnstake(unstakeCurrencyAmount));
    if (!success) {
      setPendingTx(false);
      // setModalOpen(true)
      return;
    }
  }, [unstakeCurrencyAmount, approvalState, setPendingTx, onUnstake]);

  // const unstakeAmountDecimals = !!unstakeAmount ? parseFloat(unstakeAmount) : 0;
  const buttonBody = unstakeCurrencyAmount?.greaterThan(ZERO) ? (
    approvalState !== ApprovalState.APPROVED ? (
      approvalState === ApprovalState.PENDING ? (
        <div className="flex items-center justify-center space-x-3">
          <div>Approving</div> <RippleSpinner size={16} />
        </div>
      ) : (
        'Approve'
      )
    ) : InsufficientBalance ? (
      'Insufficient Balance'
    ) : (
      'Unstake'
    )
  ) : (
    'Enter amount'
  );
  const diabled =
    !unstakeCurrencyAmount?.greaterThan(ZERO) || InsufficientBalance;

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
      <div className="grid grid-cols-2 gap-x-4">
        <div className="col-span-2 grid grid-cols-2 gap-x-4 text-sm">
          <div
            className="
            col-span-2
            text-xs text-primary text-right mb-2
            pr-2"
          >
            Balance: {formatNumber(xStndBalance?.toSignificant(6) ?? 0)} xSTND
          </div>
        </div>
        <div className="col-span-2 mb-4">
          <TokenInputPanelV2
            token={xStnd}
            max={xStndBalance}
            onAmountChange={setUntakeAmount}
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
        <Button
          disabled={diabled}
          className={classNames(DefinedStyles.fullButton, 'col-span-2')}
          onClick={handleClick}
        >
          {buttonBody}
        </Button>
      </div>
    </div>
  );
}
