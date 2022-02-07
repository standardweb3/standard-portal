import {
  SortAscendingIcon,
  SortDescendingIcon,
} from '@heroicons/react/outline';
import { classNames } from '../../functions';

export function Sorter({ asc, className = undefined }) {
  return asc ? (
    <SortDescendingIcon
      className={classNames('w-5 h-5 text-grey', className)}
    />
  ) : (
    <SortAscendingIcon className={classNames('w-5 h-5 text-grey', className)} />
  );
}
