import { ChartBarIcon } from '@heroicons/react/outline';
import { ANALYTICS_URL } from '../../constants';
import { classNames } from '../../functions';
import { useActiveWeb3React } from '../../hooks';
import { ExternalLink } from '../ExternalLink';

export function AnalyticsLink({
  path,
  text,
  className,
  iconClassName,
}: {
  path: string;
  text?: boolean;
  className?: string;
  iconClassName?: string;
}) {
  const { chainId } = useActiveWeb3React();
  return (
    <ExternalLink
      className={classNames('text-xs', className)}
      href={`${ANALYTICS_URL[chainId]}/${path}`}
    >
      {text ? (
        'View Analytics'
      ) : (
        <ChartBarIcon
          className={classNames('w-5 h-5 text-grey opacity-50', iconClassName)}
        />
      )}
    </ExternalLink>
  );
}
