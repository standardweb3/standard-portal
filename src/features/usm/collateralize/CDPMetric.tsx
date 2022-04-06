import { Question } from '../../../components-ui/Question';
import Skeleton from 'react-loading-skeleton';
import { classNames } from '../../../functions';

export function CDPMetric({
  preheader = undefined,
  header,
  tooltip,
  content,
  subcontent = undefined,
  horizontal = false,
  className = undefined,
}) {
  return (
    <div className={classNames('space-y-1', className)}>
      <div
        className={classNames(
          'flex w-full items-center justify-between sm:justify-start lg:justify-between space-x-4 text-sm md:text-sm text-grey',
        )}
      >
        <div className="flex items-center space-x-2">
          {preheader && <div>{preheader}</div>}
          <div>{header}</div>
        </div>
        <Question text={tooltip} />
      </div>
      <div className="text-text text-lg sm:text-xl md:text-xl font-bold">
        {content ? content : <Skeleton count={1} />}
      </div>
      {subcontent && <div className="text-grey text-sm">{subcontent}</div>}
    </div>
  );
}
