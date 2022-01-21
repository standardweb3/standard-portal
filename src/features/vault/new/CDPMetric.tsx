import { Question } from '../../../components-ui/Question';
import Skeleton from 'react-loading-skeleton';
import { classNames } from '../../../functions';

export function CDPMetric({
  header,
  tooltip,
  content,
  subcontent = undefined,
  horizontal = false,
}) {
  return (
    <div className="space-y-1">
      <div
        className={classNames(
          'flex justify-between space-x-4 text-sm md:text-base text-grey',
          horizontal && 'sm:!justify-start',
        )}
      >
        <div>{header}</div>
        <Question text={tooltip} />
      </div>
      <div className="text-text text-lg sm:text-xl md:text-2xl font-bold">
        {content ? content : <Skeleton count={1} />}
      </div>
      {subcontent && <div className="text-grey text-sm">{subcontent}</div>}
    </div>
  );
}
