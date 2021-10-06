import { ApprovalState, useActiveWeb3React } from '../../hooks';
import { Typographies } from '../../utils/Typography';
import { Button } from '../Button';
import { Input as NumericalInput } from '../NumericalInput';
import Image from '../Image';
import { CurrencyAmount, Token } from '@digitalnative/standard-protocol-sdk';
import { RippleSpinner } from '../Spinner/RippleSpinner';

export type BondInputTypes = {
  bondAmount: string;
  setBondAmount: () => void;
  onBond: () => void;
  approvalState: ApprovalState;
  approve: () => void;
  onMax: () => void;
  disabed: boolean;
  balance: string;
  atMax: boolean;
};

export function BondInput({
  balance,
  bondAmount,
  setBondAmout,
  onBond,
  approvalState,
  approve,
  onMax,
  disabled,
  atMax,
}) {
  const { account } = useActiveWeb3React();
  return (
    <div className="grid grid-cols-2 items-end sm:space-x-3 space-y-3">
      <div className="col-span-2 sm:col-span-1 space-y-1">
        <div className="text-right text-sm text-grey px-2">
          STND balance: {balance}
        </div>
        <div className="flex items-center px-4 bg-opaque-secondary rounded-20">
          <Image
            layout="fixed"
            width="36px"
            height="36px"
            src="https://raw.githubusercontent.com/sushiswap/assets/master/blockchains/ethereum/assets/0x9040e237C3bF18347bb00957Dc22167D0f2b999d/logo.png"
            alt="STND logo"
          />
          <NumericalInput
            className="
          !py-3 !px-4 
          outline-none 
          text-right
          !bg-transparent"
            value={bondAmount}
            onUserInput={setBondAmout}
          />
          {account && (
            <Button type="bordered" onClick={onMax}>
              max
            </Button>
          )}
        </div>
      </div>
      <div className="col-span-2 sm:col-span-1">
        {approvalState === ApprovalState.NOT_APPROVED ||
        approvalState === ApprovalState.PENDING ? (
          <Button
            className={Typographies.fullButton}
            disabled={approvalState === ApprovalState.PENDING}
            onClick={approve}
          >
            <div className="flex items-center justify-center space-x-3">
              <div>
                {approvalState === ApprovalState.PENDING ? (
                  <div className="flex items-center space-x-2">
                    <div>Approving </div>
                    <RippleSpinner size={16} />
                  </div>
                ) : (
                  'Approve'
                )}
              </div>
            </div>
          </Button>
        ) : (
          <Button
            disabled={disabled}
            className={Typographies.fullButton}
            onClick={onBond}
          >
            Bond
          </Button>
        )}
      </div>
      {atMax && (
        <div className="col-span-2 text-danger text-center text-sm mt-4">
          Insufficient STND Balance
        </div>
      )}
    </div>
  );
}
