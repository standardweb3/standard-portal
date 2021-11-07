import { ApprovalState, useActiveWeb3React } from '../../hooks';
import { DefinedStyles } from '../../utils/DefinedStyles';
import { Button } from '../Button';
import { Input as NumericalInput } from '../NumericalInput';
import Image from '../Image';
import { RippleSpinner } from '../Spinner/RippleSpinner';
import { classNames } from '../../functions';

export type BondInputTypes = {
  bondAmount: string;
  setBondAmount: (amount: string) => void;
  onBond: () => void;
  approvalState: ApprovalState;
  approve: () => void;
  onMax: () => void;
  disabled: boolean;
  balance: string;
  atMax: boolean;
  bondButtonBody?: any;
  buttonClassName?: string;
};

export function BondInput({
  balance,
  bondAmount,
  setBondAmount,
  onBond,
  approvalState,
  approve,
  onMax,
  disabled,
  atMax,
  bondButtonBody,
  buttonClassName,
}: BondInputTypes) {
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
            src="https://raw.githubusercontent.com/digitalnativeinc/assets/master/blockchains/ethereum/assets/0x9040e237C3bF18347bb00957Dc22167D0f2b999d/logo.png"
            alt="STND logo"
          />
          <NumericalInput
            className="
          !py-3 !px-4 
          outline-none 
          text-right
          !bg-transparent"
            value={bondAmount}
            onUserInput={setBondAmount}
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
            className={DefinedStyles.fullButton}
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
            className={classNames(DefinedStyles.fullButton, buttonClassName)}
            onClick={onBond}
          >
            {bondButtonBody ?? 'Bond'}
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
