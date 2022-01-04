import { classNames } from '../../../functions';

export function CollateralizePanelHeader({
  number,
  title,
  subtitle,
  className = undefined,
}) {
  return (
    <div className={classNames('flex items-center space-x-3', className)}>
      <div className="text-4xl font-bold text-primary">{number}</div>
      <div className="">
        <div className="text-xl font-bold">{title}</div>
        <div className="text-grey text-xs">{subtitle}</div>
      </div>
    </div>
  );
}
