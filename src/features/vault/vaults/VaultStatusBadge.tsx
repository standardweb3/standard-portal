import { Question } from '../../../components-ui/Question';
import { classNames } from '../../../functions';
import { VaultCondition } from './VaultCard';
import Skeleton from 'react-loading-skeleton';

export function VaultStatusBadage({
  condition,
  collateralPrice,
  liquidationPrice,
}) {
  return (
    <div className="absolute top-4 right-4">
      <Question
        text={
          <div>
            <div className="flex flex-col items-center">
              <div className="text-sm text-grey">Current Price</div>
              <div
                className={classNames(
                  'font-bold',
                  condition === VaultCondition.SAFE
                    ? 'text-safe'
                    : condition === VaultCondition.WARNING
                    ? 'text-warn'
                    : 'text-danger',
                )}
              >
                $
                {collateralPrice !== undefined ? (
                  parseFloat(collateralPrice.toFixed(4))
                ) : (
                  <Skeleton count={1} />
                )}
              </div>
            </div>
            <div className="flex flex-col items-center mt-1">
              <div className="text-sm text-grey">Liquidation Price</div>
              <div className="font-bold text-primary">
                {'< '}$
                {liquidationPrice !== undefined ? (
                  parseFloat(liquidationPrice.toFixed(4))
                ) : (
                  <Skeleton count={1} />
                )}
              </div>
            </div>
          </div>
        }
      >
        <div
          className={classNames(
            'px-3 py-1 rounded-20 text-xs flex items-center space-x-1',
            condition === VaultCondition.SAFE
              ? 'text-safe border-safe'
              : condition === VaultCondition.WARNING
              ? 'text-warn border-warn'
              : 'text-danger border-danger',
            'border',
          )}
        >
          <div className="flex items-center space-x-1">
            <div>{condition}</div>
            <div
              className={classNames(
                'w-2 h-2 rounded-full',
                condition === VaultCondition.SAFE
                  ? 'bg-safe'
                  : condition === VaultCondition.WARNING
                  ? 'bg-warn'
                  : 'bg-danger',
              )}
            ></div>
          </div>
        </div>
      </Question>
    </div>
  );
}
