import React, { useRef, useState } from 'react';
import {
  useSetUserSlippageTolerance,
  useUserSlippageTolerance,
  useUserTransactionTTL,
} from '../../state/user/hooks';

import { DEFAULT_DEADLINE_FROM_NOW } from '../../constants';
import { Percent } from '@digitalnative/standard-protocol-sdk-test';
import { classNames } from '../../functions';
import { Button } from '../Button';
import { Question } from '../Question';
import { Typographies } from '../../utils/Typography';

enum SlippageError {
  InvalidInput = 'InvalidInput',
  RiskyLow = 'RiskyLow',
  RiskyHigh = 'RiskyHigh',
}

enum DeadlineError {
  InvalidInput = 'InvalidInput',
}

export interface TransactionSettingsProps {
  placeholderSlippage?: Percent; // varies according to the context in which the settings dialog is placed
}

export function TransactionSettings({
  placeholderSlippage,
}: TransactionSettingsProps) {
  const inputRef = useRef<HTMLInputElement>();

  const userSlippageTolerance = useUserSlippageTolerance();
  const setUserSlippageTolerance = useSetUserSlippageTolerance();

  const [deadline, setDeadline] = useUserTransactionTTL();

  const [slippageInput, setSlippageInput] = useState('');
  const [slippageError, setSlippageError] = useState<SlippageError | false>(
    false,
  );

  const [deadlineInput, setDeadlineInput] = useState('');
  const [deadlineError, setDeadlineError] = useState<DeadlineError | false>(
    false,
  );

  function parseSlippageInput(value: string) {
    // populate what the user typed and clear the error
    setSlippageInput(value);
    setSlippageError(false);

    if (value.length === 0) {
      setUserSlippageTolerance('auto');
    } else {
      const parsed = Math.floor(Number.parseFloat(value) * 100);

      if (!Number.isInteger(parsed) || parsed < 0 || parsed > 5000) {
        setUserSlippageTolerance('auto');
        if (value !== '.') {
          setSlippageError(SlippageError.InvalidInput);
        }
      } else {
        setUserSlippageTolerance(new Percent(parsed, 10_000));
      }
    }
  }

  const tooLow =
    userSlippageTolerance !== 'auto' &&
    userSlippageTolerance.lessThan(new Percent(5, 10_000));
  const tooHigh =
    userSlippageTolerance !== 'auto' &&
    userSlippageTolerance.greaterThan(new Percent(1, 100));

  function parseCustomDeadline(value: string) {
    // populate what the user typed and clear the error
    setDeadlineInput(value);
    setDeadlineError(false);

    if (value.length === 0) {
      setDeadline(DEFAULT_DEADLINE_FROM_NOW);
    } else {
      try {
        const parsed: number = Math.floor(Number.parseFloat(value) * 60);
        if (!Number.isInteger(parsed) || parsed < 60 || parsed > 180 * 60) {
          setDeadlineError(DeadlineError.InvalidInput);
        } else {
          setDeadline(parsed);
        }
      } catch (error) {
        console.error(error);
        setDeadlineError(DeadlineError.InvalidInput);
      }
    }
  }

  return (
    <div className="grid gap-4">
      <div className="grid gap-2">
        <div className="flex items-center space-x-2">
          <div className="text-sm font-semibold">Slippage tolerance</div>

          <Question
            className={Typographies['txSettings-question']}
            text={`Your transaction will revert if the price changes unfavorably by more than this percentage.`}
          />
        </div>
        <div
          className="
          flex items-center 
          space-x-2 
          bg-opaque-secondary 
          rounded-xl
          px-3 py-2"
        >
          <div
            className={classNames(
              // !!slippageError
              //   ? 'border-danger'
              //   : tooLow || tooHigh
              //   ? 'border-yellow'
              //   : userSlippageTolerance !== 'auto'
              //   ? 'border-green'
              //   : 'border-transparent',
              'flex-1',
            )}
            tabIndex={-1}
          >
            <div className="flex justify-between items-center">
              <input
                className={classNames(
                  slippageError
                    ? 'text-danger'
                    : tooLow || tooHigh
                    ? 'text-warn'
                    : 'text-green',
                  `bg-background-3
                   px-2 py-1 
                   rounded-xl 
                   outline-none min-w-[62px] max-w-[72px]`,
                )}
                placeholder={placeholderSlippage?.toFixed(2)}
                value={
                  slippageInput.length > 0
                    ? slippageInput
                    : userSlippageTolerance === 'auto'
                    ? ''
                    : userSlippageTolerance.toFixed(2)
                }
                onChange={(e) => parseSlippageInput(e.target.value)}
                onBlur={() => {
                  setSlippageInput('');
                  setSlippageError(false);
                }}
                color={slippageError ? 'red' : ''}
              />
              <span className={Typographies['txSettings-text']}>%</span>
            </div>
          </div>
          <Button
            color={userSlippageTolerance === 'auto' ? 'primary' : 'primary'}
            type={userSlippageTolerance === 'auto' ? 'default' : 'bordered'}
            onClick={() => {
              parseSlippageInput('');
            }}
            className={Typographies['txSettings-auto']}
          >
            Auto
          </Button>
        </div>
        {slippageError || tooLow || tooHigh ? (
          <div
            className={classNames(
              slippageError === SlippageError.InvalidInput
                ? 'text-danger'
                : 'text-warn',
              'text-xs flex items-center space-x-2',
            )}
          >
            <div>
              {slippageError === SlippageError.InvalidInput
                ? `Enter a valid slippage percentage`
                : slippageError === SlippageError.RiskyLow
                ? `Your transaction may fail`
                : `Your transaction may be frontrun`}
            </div>
          </div>
        ) : null}
      </div>

      <div className="grid gap-2">
        <div className="flex items-center space-x-2">
          <div className="text-text text-sm font-semibold">{`Transaction deadline`}</div>

          <Question
            className={Typographies['txSettings-question']}
            text={`Your transaction will revert if it is pending for more than this long.`}
          />
        </div>
        <div
          className="flex items-center bg-opaque-secondary rounded-xl px-3 py-2"
          tabIndex={-1}
        >
          <input
            className={classNames(
              deadlineError ? 'text-danger' : 'text-green',
              'px-2 py-1 rounded-xl bg-background-3 min-w-[62px] max-w-[72px]',
            )}
            placeholder={(DEFAULT_DEADLINE_FROM_NOW / 60).toString()}
            value={
              deadlineInput.length > 0
                ? deadlineInput
                : deadline === DEFAULT_DEADLINE_FROM_NOW
                ? ''
                : (deadline / 60).toString()
            }
            onChange={(e) => parseCustomDeadline(e.target.value)}
            onBlur={() => {
              setDeadlineInput('');
              setDeadlineError(false);
            }}
          />
          <div
            className={`flex-1 text-right ${Typographies['txSettings-text']}`}
          >{`minutes`}</div>
        </div>
      </div>
    </div>
  );
}
