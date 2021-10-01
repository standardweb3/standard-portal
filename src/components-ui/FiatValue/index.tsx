import React, { useMemo } from 'react';
import {
  Currency,
  CurrencyAmount,
  Percent,
} from '@digitalnative/standard-protocol-sdk-test';

import { warningSeverity } from '../../functions/prices';
import { classNames } from '../../functions';

export function FiatValue({
  fiatValue,
  priceImpact,
  className,
}: {
  fiatValue: CurrencyAmount<Currency> | null | undefined;
  priceImpact?: Percent;
  className?: string;
}) {
  const priceImpactClassName = useMemo(() => {
    if (!priceImpact) return undefined;
    if (priceImpact.lessThan('0')) return 'text-green';
    const severity = warningSeverity(priceImpact);
    if (severity < 1) return 'text-text';
    if (severity < 3) return 'text-yellow';
    return 'text-red';
  }, [priceImpact]);
  return (
    <div
      className={classNames(
        `flex justify-end space-x-1 text-xs font-medium`,
        className,
      )}
    >
      {fiatValue ? (
        <>≈$ {fiatValue?.toSignificant(6, { groupSeparator: ',' })}</>
      ) : (
        ''
      )}
      {priceImpact ? (
        <span className={`${priceImpactClassName} ml-2`}>
          {priceImpact.multiply(-1).toSignificant(3)}%
        </span>
      ) : null}
    </div>
  );
}
