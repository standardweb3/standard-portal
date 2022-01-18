import { Question } from '../../../components-ui/Question';
import Skeleton from 'react-loading-skeleton';

export function CollateralizeMetric({
  header,
  tooltip,
  content,
  subcontent = undefined,
}) {
  return (
    <div className="space-y-1">
      <div className="flex justify-between space-x-4 text-grey">
        <div>{header}</div>
        <Question text={tooltip} />
      </div>
      <div className="text-text text-xl md:text-2xl font-bold">
        {content ? content : <Skeleton count={1} />}
      </div>
      {subcontent && <div className="text-grey text-sm">{subcontent}</div>}
    </div>
  );
}
