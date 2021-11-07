import { SearchIcon } from '@heroicons/react/outline';
import React from 'react';
import { classNames } from '../../functions';

export function SearchV2({
  term,
  search,
  className,
  inputProps,
}: {
  term: string;
  search: (value: string) => void;
  inputProps?: any;
  className?: string;
}) {
  return (
    <div className={classNames('flex rounded-20 space-x-4', className)}>
      <div className="flex items-center pointer-events-none">
        <SearchIcon className="w-4 h-4" />
      </div>
      <input
        className={classNames(
          inputProps.className ||
            'py-3 px-1 rounded-20 w-full bg-transparent focus:outline-none',
        )}
        onChange={(e) => search(e.target.value)}
        value={term}
        placeholder="Search by name, symbol, address"
        {...inputProps}
      />
    </div>
  );
}
