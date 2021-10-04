import { useActiveWeb3React } from '../../hooks';
import { Button } from '../Button';
import { Input as NumericalInput } from '../NumericalInput';
import Image from '../Image';
import { Typographies } from '../../utils/Typography';
import { formatTime } from '../../functions/time';
import { classNames } from '../../functions';
import { BigNumber } from 'ethers';
import { useEffect, useState } from 'react';
import { Timer } from '../Timer';
import { CountdownTimer } from '../Timer/CountdownTimer';

export type UnbondProps = {
  unbond: () => void;
  bondedAmount: BigNumber;
  unbondAmount: string;
  onMax: () => void;
  setUnbondAmount: () => void;
  disabled?: boolean;
  atMax: boolean;
  remainingSeconds: number | null;
};

export function Unbond({
  atMax,
  unbond,
  bondedAmount,
  unbondAmount,
  onMax,
  setUnbondAmount,
  disabled = true,
  remainingSeconds,
}) {
  const { account } = useActiveWeb3React();

  const time = remainingSeconds !== null && formatTime(remainingSeconds);
  // remainingSeconds === null => never bonded
  const remaining = remainingSeconds !== null && remainingSeconds > 0;
  const noneBonded =
    bondedAmount !== null && bondedAmount.eq(BigNumber.from(0));

  return (
    <div
      className={classNames(
        `
        w-full h-full 
        space-y-4 
        bg-background-5 
        rounded-20
        py-8
        px-12
        flex flex-col justify-center items-center`,
        disabled && 'opacity-50',
      )}
    >
      <div className="text-center space-y-4 w-full">
        <div className="font-bold text-2xl">Unbond</div>
        <div className="flex flex-col justify-center items-center space-y-2">
          {remaining ? (
            <>
              <CountdownTimer time={remainingSeconds} />
              <Button
                color="danger"
                className="!font-black !cursor-default"
                type="bordered"
              >
                Closed
              </Button>
            </>
          ) : (
            <Button
              color="success"
              className="!font-black !cursor-default"
              type="bordered"
            >
              Open
            </Button>
          )}
        </div>
      </div>
      <div className="text-center space-y-2 w-full">
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
            disabled={disabled}
            value={unbondAmount}
            onUserInput={setUnbondAmount}
          />

          {account && (
            <Button disabled={disabled} type="bordered" onClick={onMax}>
              max
            </Button>
          )}
        </div>
        <Button
          disabled={disabled}
          className={Typographies.fullButton}
          onClick={unbond}
        >
          Unbond
        </Button>
      </div>
      {!noneBonded && atMax && (
        <div className="col-span-2 text-danger text-center text-sm mt-4">
          Unbond amount exceeds Bonded STND amount
        </div>
      )}
      {noneBonded && (
        <div className="col-span-2 text-danger text-center text-sm mt-4">
          There are no bonded STNDs
        </div>
      )}
    </div>
  );
}
