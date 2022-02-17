import Skeleton from 'react-loading-skeleton';
import { Question } from '../../../components-ui/Question';

export function DashboardMetric({
  header,
  stat,
  change = undefined,
  tip = undefined,
}) {
  return (
    <div className="flex flex-col items-center space-y-2 bg-background rounded-20 py-6 px-4">
      <div className="flex items-center space-x-2">
        <div className="text-primary text-center sm:text-lg font-bold">{header}</div>
        {tip && <Question text={tip} />}
      </div>
      <div className="flex items-center space-x-4">
        <div className="font-bold text-center text-lg sm:text-2xl">
          {stat !== undefined ? stat : <Skeleton />}
        </div>
        {change && <div>{change}</div>}
      </div>
    </div>
  );
}
