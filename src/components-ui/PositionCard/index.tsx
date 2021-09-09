import { ChevronDownIcon, ChevronUpIcon } from '@heroicons/react/outline';
import {
  CurrencyAmount,
  JSBI,
  Pair,
  Percent,
  Token,
} from '@digitalnativeinc/standard-protocol-sdk';
import React, { useState } from 'react';
import { currencyId, unwrappedToken } from '../../functions/currency';

import { Alert } from '../Alert';
import { BIG_INT_ZERO } from '../../constants';
import { Button } from '../Button';
import { CurrencyLogo } from '../CurrencyLogo';
import { DoubleCurrencyLogo } from '../CurrencyLogo/DoubleCurrencyLogo';
import { useActiveWeb3React } from '../../hooks/useActiveWeb3React';
import { useColor } from '../../hooks';
import { useRouter } from 'next/router';
import { useTokenBalance } from '../../state/wallet/hooks';
import { useTotalSupply } from '../../hooks/useTotalSupply';
import { classNames } from '../../functions';
import { Transition } from '@headlessui/react';

interface PositionCardProps {
  pair: Pair;
  showUnwrapped?: boolean;
  border?: string;
  stakedBalance?: CurrencyAmount<Token>; // optional balance to indicate that liquidity is deposited in mining pool
}

export function MinimalPositionCard({
  pair,
  showUnwrapped = false,
  border,
}: PositionCardProps) {
  const { account } = useActiveWeb3React();

  const currency0 = showUnwrapped ? pair.token0 : unwrappedToken(pair.token0);
  const currency1 = showUnwrapped ? pair.token1 : unwrappedToken(pair.token1);

  const [showMore, setShowMore] = useState(false);

  const userPoolBalance = useTokenBalance(
    account ?? undefined,
    pair.liquidityToken,
  );
  const totalPoolTokens = useTotalSupply(pair.liquidityToken);

  const poolTokenPercentage =
    !!userPoolBalance &&
    !!totalPoolTokens &&
    JSBI.greaterThanOrEqual(totalPoolTokens.quotient, userPoolBalance.quotient)
      ? new Percent(userPoolBalance.quotient, totalPoolTokens.quotient)
      : undefined;

  const [token0Deposited, token1Deposited] =
    !!pair &&
    !!totalPoolTokens &&
    !!userPoolBalance &&
    // this condition is a short-circuit in the case where useTokenBalance updates sooner than useTotalSupply
    JSBI.greaterThanOrEqual(totalPoolTokens.quotient, userPoolBalance.quotient)
      ? [
          pair.getLiquidityValue(
            pair.token0,
            totalPoolTokens,
            userPoolBalance,
            false,
          ),
          pair.getLiquidityValue(
            pair.token1,
            totalPoolTokens,
            userPoolBalance,
            false,
          ),
        ]
      : [undefined, undefined];

  return (
    <>
      {userPoolBalance &&
      JSBI.greaterThan(userPoolBalance.quotient, JSBI.BigInt(0)) ? (
        <div className="rounded-20 bg-opaque">
          <div
            className="
              flex flex-col md:flex-row md:justify-between
              bg-opaque-secondary rounded-20 
              p-5
              "
          >
            <div className="flex items-center space-x-4">
              <DoubleCurrencyLogo
                currency0={pair.token0}
                currency1={pair.token1}
                currencyClassName="rounded-full"
                size={40}
              />
              <div className="font-bold">
                {currency0.symbol}-{currency1.symbol}
              </div>
            </div>
            <div
              className="
                flex items-center 
                md:mt-0 mt-3 space-x-2 
                text-base"
            >
              <div className="text-primary font-bold">
                {userPoolBalance ? userPoolBalance.toSignificant(4) : '-'}{' '}
              </div>
              <div>Pool Tokens</div>
            </div>
          </div>
          <div
            className="
            flex flex-col items-center
            w-full 
            p-3 mt-3
            text-sm"
          >
            <div className="space-y-1">
              <div className="flex items-center justify-between font-bold">
                <div>{`Your pool share`}&nbsp;</div>
                <div>
                  {poolTokenPercentage
                    ? poolTokenPercentage.toFixed(6) + '%'
                    : '-'}
                </div>
              </div>
              <div
                className="
                flex items-center justify-between 
                text-grey"
              >
                <div>{`Pooled ${currency0.symbol}: `}&nbsp;</div>
                {token0Deposited ? (
                  <div className="flex items-center space-x-2 font-bold">
                    <div> {token0Deposited?.toSignificant(6)}</div>
                    <div>{currency0.symbol}</div>
                  </div>
                ) : (
                  '-'
                )}
              </div>
              <div
                className="
                flex items-center justify-between 
                text-grey"
              >
                <div>{`Pooled ${currency1.symbol}: `}&nbsp;</div>
                {token1Deposited ? (
                  <div className="flex items-center space-x-2 font-bold">
                    <div>{token1Deposited?.toSignificant(6)}</div>
                    <div>{currency1.symbol}</div>
                  </div>
                ) : (
                  '-'
                )}
              </div>
            </div>
          </div>
        </div>
      ) : null}
    </>
  );
}

export function FullPositionCard({
  pair,
  border,
  stakedBalance,
}: PositionCardProps) {
  const router = useRouter();
  const { account, chainId } = useActiveWeb3React();

  const currency0 = unwrappedToken(pair.token0);
  const currency1 = unwrappedToken(pair.token1);

  const [showMore, setShowMore] = useState(false);

  const userDefaultPoolBalance = useTokenBalance(
    account ?? undefined,
    pair.liquidityToken,
  );

  const totalPoolTokens = useTotalSupply(pair.liquidityToken);

  // if staked balance balance provided, add to standard liquidity amount
  const userPoolBalance = stakedBalance
    ? userDefaultPoolBalance?.add(stakedBalance)
    : userDefaultPoolBalance;

  const poolTokenPercentage =
    !!userPoolBalance &&
    !!totalPoolTokens &&
    JSBI.greaterThanOrEqual(totalPoolTokens.quotient, userPoolBalance.quotient)
      ? new Percent(userPoolBalance.quotient, totalPoolTokens.quotient)
      : undefined;

  const [token0Deposited, token1Deposited] =
    !!pair &&
    !!totalPoolTokens &&
    !!userPoolBalance &&
    // this condition is a short-circuit in the case where useTokenBalance updates sooner than useTotalSupply
    JSBI.greaterThanOrEqual(totalPoolTokens.quotient, userPoolBalance.quotient)
      ? [
          pair.getLiquidityValue(
            pair.token0,
            totalPoolTokens,
            userPoolBalance,
            false,
          ),
          pair.getLiquidityValue(
            pair.token1,
            totalPoolTokens,
            userPoolBalance,
            false,
          ),
        ]
      : [undefined, undefined];

  const backgroundColor = useColor(pair?.token0);

  return (
    <div
      className="rounded bg-dark-800"
      // style={{ backgroundColor }}
    >
      <Button
        className={classNames(
          'flex items-center justify-between w-full px-4 py-6 cursor-pointer bg-dark-800 hover:bg-dark-700',
          showMore && '!bg-dark-700',
        )}
        style={{ boxShadow: 'none' }}
        onClick={() => setShowMore(!showMore)}
      >
        <div className="flex items-center space-x-4">
          <DoubleCurrencyLogo
            currency0={currency0}
            currency1={currency1}
            size={40}
          />
          <div className="text-xl font-semibold">
            {!currency0 || !currency1
              ? `Loading`
              : `${currency0.symbol}-${currency1.symbol}`}
          </div>
        </div>
        <div className="flex items-center space-x-4">
          {`Manage`}
          {showMore ? (
            <ChevronUpIcon width="20px" height="20px" className="ml-4" />
          ) : (
            <ChevronDownIcon width="20px" height="20px" className="ml-4" />
          )}
        </div>
      </Button>

      <Transition
        show={showMore}
        enter="transition-opacity duration-75"
        enterFrom="opacity-0"
        enterTo="opacity-100"
        leave="transition-opacity duration-150"
        leaveFrom="opacity-100"
        leaveTo="opacity-0"
      >
        <div className="p-4 space-y-4">
          <div className="px-4 py-4 space-y-1 text-sm rounded text-high-emphesis bg-dark-900">
            <div className="flex items-center justify-between">
              <div>{`Your total pool tokens`}:</div>
              <div className="font-semibold">
                {userPoolBalance ? userPoolBalance.toSignificant(4) : '-'}
              </div>
            </div>
            {stakedBalance && (
              <div className="flex items-center justify-between">
                <div>{`Pool tokens in rewards pool`}:</div>
                <div className="font-semibold">
                  {stakedBalance.toSignificant(4)}
                </div>
              </div>
            )}
            <div className="flex items-center justify-between">
              <div>{`Pooled ${currency0?.symbol}`}:</div>
              {token0Deposited ? (
                <div className="flex items-center space-x-2">
                  <div className="font-semibold">
                    {token0Deposited?.toSignificant(6)}
                  </div>
                  <CurrencyLogo size="20px" currency={currency0} />
                </div>
              ) : (
                '-'
              )}
            </div>

            <div className="flex items-center justify-between">
              <div>{`Pooled ${currency1?.symbol}`}:</div>
              {token1Deposited ? (
                <div className="flex items-center space-x-2">
                  <div className="font-semibold ">
                    {token1Deposited?.toSignificant(6)}
                  </div>
                  <CurrencyLogo size="20px" currency={currency1} />
                </div>
              ) : (
                '-'
              )}
            </div>

            <div className="flex items-center justify-between">
              <div>{`Your pool share`}:</div>
              <div className="font-semibold">
                {poolTokenPercentage
                  ? (poolTokenPercentage.toFixed(2) === '0.00'
                      ? '<0.01'
                      : poolTokenPercentage.toFixed(2)) + '%'
                  : '-'}
              </div>
            </div>
          </div>
          {userDefaultPoolBalance &&
            JSBI.greaterThan(userDefaultPoolBalance.quotient, BIG_INT_ZERO) && (
              <div className="grid grid-cols-2 gap-4">
                <Button
                  onClick={() => {
                    router.push(`/add/${pair.liquidityToken.address}`);
                  }}
                >
                  {`Add`}
                </Button>
                <Button
                  onClick={() => {
                    router.push(
                      `/remove/${currencyId(currency0)}/${currencyId(
                        currency1,
                      )}`,
                    );
                  }}
                >
                  {`Remove`}
                </Button>
              </div>
            )}
        </div>
      </Transition>
    </div>
  );
}
