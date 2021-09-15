import { Percent } from '@digitalnativeinc/standard-protocol-sdk';
import React, { useMemo } from 'react';
import { classNames } from '../../functions';
import { warningSeverity } from '../../functions/prices';
import { Question } from '../Question';

export type PriceImpactProps = {
  className?: string;
  priceImpact: Percent;
  showTip?: boolean;
};

export function PriceImpact({
  className,
  priceImpact,
  showTip,
}: PriceImpactProps) {
  const priceImpactClassName = useMemo(() => {
    if (!priceImpact) return undefined;
    if (priceImpact.lessThan('0')) return 'text-green';
    const severity = warningSeverity(priceImpact);
    if (severity < 1) return 'text-text';
    if (severity < 3) return 'text-yellow';
    return 'text-red';
  }, [priceImpact]);

  const priceImpactMessage = `${priceImpact.multiply(-1).toSignificant(3)}%`;
  return (
    <div
      className={classNames(
        'flex items-center',
        priceImpactClassName,
        className,
      )}
    >
      <div>{priceImpactMessage}</div>

      {showTip && (
        <Question
          className="ml-1"
          text={`This conversion will incur a loss of ${priceImpactMessage}`}
        />
      )}
    </div>
  );
}
