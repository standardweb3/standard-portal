import Skeleton from 'react-loading-skeleton';
export function DashboardMetric({ header, stat, change = undefined }) {
  return (
    <div className="flex flex-col items-center space-y-4 bg-background rounded-20 py-6 px-4">
      <div className="text-primary text-lg font-bold">{header}</div>
      <div className="flex items-center space-x-4">
        <div className="font-bold text-2xl">
          {stat !== undefined ? stat : <Skeleton />}
        </div>
        {change && <div>{change}</div>}
      </div>
    </div>
  );
}
