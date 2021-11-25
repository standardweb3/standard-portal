import {
  Currency,
  CurrencyAmount,
  JSBI,
  NATIVE,
  Token,
} from '@digitalnative/standard-protocol-sdk';
import { PairState, useV2Pair } from '../../hooks/useV2Pairs';
import React, { useCallback, useEffect, useState } from 'react';

import { Alert } from '../../components-ui/Alert';
import { CurrencySelectPanel } from '../../components-ui/CurrencySelectPanel';
import Head from 'next/head';
import Link from 'next/link';
import { FullPositionCard } from '../../components-ui/PositionCard';
import { currencyId } from '../../functions/currency';
import { useActiveWeb3React } from '../../hooks/useActiveWeb3React';
import { usePairAdder } from '../../state/user/hooks';
import { useTokenBalance } from '../../state/wallet/hooks';
import { WalletConnector } from '../../components-ui/WalletConnector';
import { PageContent } from '../../components-ui/PageContent';
import { Page } from '../../components-ui/Page';
import { PlusIcon } from '@heroicons/react/outline';
import { PageHeader } from '../../components-ui/PageHeader';
import { NetworkGuardWrapper } from '../../guards/Network';
import { NORMAL_GUARDED_CHAINS } from '../../constants/networks';

enum Fields {
  TOKEN0 = 0,
  TOKEN1 = 1,
}

function PoolFinder() {
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
        <title>{`Find Pool`} | Standard Protocol</title>
        <meta key="description" name="description" content="Find pool" />
      </Head>
      <Page id="find-pool-page">
        <PageHeader title="Import Pair" />

        <PageContent>
          <Alert
            className="mb-10  max-w-[600px]"
            message={
              <>
                <b>{`Tip:`}</b>{' '}
                {`Use this tool to find pairs that don't automatically appear in the interface`}
              </>
            }
            type="information"
          />
          <div
            className="
              md:min-w-[600px] 
              max-w-[1000px]
              bg-opaque
              rounded-20 p-8
              text-text"
          >
            <div className="grid gap-3">
              <div>
                <CurrencySelectPanel
                  currency={currency0}
                  onClick={() => setActiveField(Fields.TOKEN0)}
                  onCurrencySelect={handleCurrencySelect}
                  otherCurrency={currency1}
                  id="pool-currency-input"
                />
                <div className="flex justify-center items-center">
                  <button
                    className="
                      z-10 rounded-20 px-3 py-6 -mt-10 -mb-10 text-text
                      cursor-default
                    "
                  >
                    <div className="rounded-full p-3 bg-icon-btn-grey">
                      <PlusIcon className="w-6 h-6" />
                    </div>
                  </button>
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
                <div className="flex items-center">Pool Found!</div>
              )}

              {currency0 && currency1 ? (
                pairState === PairState.EXISTS ? (
                  hasPosition && pair ? (
                    <FullPositionCard pair={pair} />
                  ) : (
                    <div className="flex flex-col items-start space-y-3">
                      <div>You don’t have liquidity in this pool yet</div>
                      <Link
                        href={`/add/${currencyId(currency0)}/${currencyId(
                          currency1,
                        )}`}
                      >
                        <div
                          className="
                          cursor-pointer
                        rounded-full 
                        text-primary text-sm
                        border
                        border-primary px-2 py-1"
                        >
                          Add liquidity
                        </div>
                      </Link>
                    </div>
                  )
                ) : validPairNoLiquidity ? (
                  <div className="flex flex-col items-start space-y-3">
                    <div>No pool found</div>
                    <Link
                      href={`/add/${currencyId(currency0)}/${currencyId(
                        currency1,
                      )}`}
                    >
                      <div
                        className="
                          cursor-pointer
                        rounded-full 
                        text-primary text-sm
                        border
                        border-primary px-2 py-1"
                      >
                        Create pool
                      </div>
                    </Link>
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
          </div>
        </PageContent>
      </Page>
    </>
  );
}

PoolFinder.Guard = NetworkGuardWrapper(NORMAL_GUARDED_CHAINS);
export default PoolFinder;
