import { classNames } from '../../../functions';
import { CollateralTableFilter } from './CollateralsTable';

export function CollateralsTableFilters({
  filter,
  setFilterNone,
  setFilterNative,
  setFilterPopular,
  setFilterStablecoin,
}) {
  const style = 'font-bold px-4 py-2 cursor-pointer';
  const activeStyle = 'rounded-20 bg-primary';
  return (
    <div
      className="
    space-x-4
    inline-flex
    text-xs md:text-base
    items-center justify-between"
    >
      <div
        className={classNames(
          style,
          filter === CollateralTableFilter.popular && activeStyle,
        )}
        onClick={setFilterPopular}
      >
        Popular
      </div>
      <div
        className={classNames(
          style,
          filter === CollateralTableFilter.stablecoin && activeStyle,
        )}
        onClick={setFilterStablecoin}
      >
        Stablecoin
      </div>
      <div
        className={classNames(
          style,
          filter === CollateralTableFilter.none && activeStyle,
        )}
        onClick={setFilterNone}
      >
        All
      </div>
    </div>
  );
}
