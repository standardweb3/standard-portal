import { ViewGridIcon, ViewListIcon } from '@heroicons/react/outline';
import { classNames } from '../../functions';
import { View } from '../../hooks/useViewSwitcher';

export function ViewSwitcher({ handleListView, handleCardView, view }) {
  const defaultClassName =
    'text-grey cursor-pointer p-2 rounded-xl transition duration-500';
  const activeClassName = 'bg-background !text-white';
  return (
    <div className="flex space-x-2">
      <div
        onClick={handleListView}
        className={classNames(
          defaultClassName,
          view === View.List && activeClassName,
        )}
      >
        <ViewListIcon className="w-5 h-5" />
      </div>
      <div
        onClick={handleCardView}
        className={classNames(
          defaultClassName,
          view === View.Card && activeClassName,
        )}
      >
        <ViewGridIcon className="w-5 h-5" />
      </div>
    </div>
  );
}
