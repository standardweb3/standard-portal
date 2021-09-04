import {
  Currency,
  CurrencyAmount,
  Ether,
  JSBI,
  NATIVE,
  Token,
} from '@sushiswap/sdk';
import { PairState, useV2Pair } from '../../hooks/useV2Pairs';
import React, { useCallback, useEffect, useState } from 'react';

import { Alert } from '../../components-ui/Alert';
import { Back } from '../../components-ui/Back';
import { CurrencySelectPanel } from '../../components-ui/CurrencySelectPanel';
import Head from 'next/head';
import Link from 'next/link';
import { MinimalPositionCard } from '../../components-ui/PositionCard';
import { currencyId } from '../../functions/currency';
import { useActiveWeb3React } from '../../hooks/useActiveWeb3React';
import { usePairAdder } from '../../state/user/hooks';
import { useTokenBalance } from '../../state/wallet/hooks';
import { WalletConnector } from '../../components-ui/WalletConnector';
import { PageContent } from '../../components-ui/PageContent';
import { Page } from '../../components-ui/Page';
import { PlusIcon } from '@heroicons/react/outline';

enum Fields {
  TOKEN0 = 0,
  TOKEN1 = 1,
}

export default function PoolFinder() {
  const { account, chainId } = useActiveWeb3React();

  const [activeField, setActiveField] = useState<number>(Fields.TOKEN1);

  const [currency0, setCurrency0] = useState<Currency | null>(() =>
    chainId ? NATIVE[chainId] : null,
  );
  const [currency1, setCurrency1] = useState<Currency | null>(null);

  const [pairState, pair] = useV2Pair(
    currency0 ?? undefined,
    currency1 ?? undefined,
  );
  const addPair = usePairAdder();
  useEffect(() => {
    if (pair) {
      addPair(pair);
    }
  }, [pair, addPair]);

  const validPairNoLiquidity: boolean =
    pairState === PairState.NOT_EXISTS ||
    Boolean(
      pairState === PairState.EXISTS &&
        pair &&
        JSBI.equal(pair.reserve0.quotient, JSBI.BigInt(0)) &&
        JSBI.equal(pair.reserve1.quotient, JSBI.BigInt(0)),
    );

  const position: CurrencyAmount<Token> | undefined = useTokenBalance(
    account ?? undefined,
    pair?.liquidityToken,
  );

  const hasPosition = Boolean(
    position && JSBI.greaterThan(position.quotient, JSBI.BigInt(0)),
  );

  const handleCurrencySelect = useCallback(
    (currency: Currency) => {
      if (activeField === Fields.TOKEN0) {
        setCurrency0(currency);
      } else {
        setCurrency1(currency);
      }
    },
    [activeField],
  );

  const prerequisiteMessage = (
    <div className="p-5 text-center rounded bg-dark-800">{`Select a token to find your liquidity`}</div>
  );

  return (
    <>
      <Head>
        <title>{`Find Pool`} | Sushi</title>
        <meta key="description" name="description" content="Find pool" />
      </Head>
      <Page id="find-pool-page">
        <PageContent>
          <div className="p-4 mb-3 space-y-3">
            <Back />

            <div>{`Import Pool`}</div>
          </div>
          <Alert
            message={
              <>
                <b>{`Tip:`}</b>{' '}
                {`Use this tool to find pairs that don't automatically appear in the interface`}
              </>
            }
            type="information"
          />
          <div className="relative p-4 space-y-4 rounded bg-dark-900 shadow-liquidity">
            <div>
              <CurrencySelectPanel
                currency={currency0}
                onClick={() => setActiveField(Fields.TOKEN0)}
                onCurrencySelect={handleCurrencySelect}
                otherCurrency={currency1}
                id="pool-currency-input"
              />
              <div className="flex flex-col justify-between">
                <div
                  className="flex items-center"
                  style={{ padding: '0 1rem' }}
                >
                  <button className="z-10 -mt-6 -mb-6 rounded-full bg-dark-900 p-3px">
                    <div className="p-3 rounded-full bg-dark-800 hover:bg-dark-700">
                      <PlusIcon className="w-4 h-4" />
                    </div>
                  </button>
                </div>
              </div>
              <CurrencySelectPanel
                currency={currency1}
                onClick={() => setActiveField(Fields.TOKEN1)}
                onCurrencySelect={handleCurrencySelect}
                otherCurrency={currency0}
                id="pool-currency-output"
              />
            </div>

            {hasPosition && (
              <div className="flex items-center">
                {`Pool Found!`}
                <Link href={`/pool`}>
                  <a className="text-center">{`Manage this pool`}</a>
                </Link>
              </div>
            )}

            {currency0 && currency1 ? (
              pairState === PairState.EXISTS ? (
                hasPosition && pair ? (
                  <MinimalPositionCard pair={pair} border="1px solid #CED0D9" />
                ) : (
                  <div className="p-5 rounded bg-dark-800">
                    <div className="flex flex-col justify-center">
                      {`You don’t have liquidity in this pool yet`}
                      <Link
                        href={`/add/${currencyId(currency0)}/${currencyId(
                          currency1,
                        )}`}
                      >
                        <a className="text-center text-blue text-opacity-80 hover:text-opacity-100">
                          {`Add liquidity`}
                        </a>
                      </Link>
                    </div>
                  </div>
                )
              ) : validPairNoLiquidity ? (
                <div className="p-5 rounded bg-dark-800">
                  <div className="flex flex-col justify-center">
                    {`No pool found`}
                    <Link
                      href={`/add/${currencyId(currency0)}/${currencyId(
                        currency1,
                      )}`}
                    >
                      <a className="text-center">{`Create pool`}</a>
                    </Link>
                  </div>
                </div>
              ) : pairState === PairState.INVALID ? (
                <div className="p-5 text-center rounded bg-dark-800">{`Invalid pair`}</div>
              ) : pairState === PairState.LOADING ? (
                <div className="p-5 text-center rounded bg-dark-800">
                  Loading
                </div>
              ) : null
            ) : !account ? (
              <WalletConnector />
            ) : (
              prerequisiteMessage
            )}
          </div>
        </PageContent>
      </Page>
    </>
  );
}
