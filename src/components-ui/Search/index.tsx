import { SearchIcon } from '@heroicons/react/outline';
import React from 'react';
import { classNames } from '../../functions';

export function Search({
  term,
  search,
  className = 'bg-opaque',
  inputProps = {
    className:
      'text-baseline bg-transparent w-full py-3 pl-4 pr-14 rounded w-full bg-transparent focus:outline-none bg-dark-700 rounded focus:ring focus:ring-blue',
  },
  ...rest
}: {
  term: string;
  search: (value: string) => void;
  inputProps?: any;
  className?: string;
}) {
  return (
    <div
      className={classNames('relative w-full rounded-20', className)}
      {...rest}
    >
      <input
        className={classNames(
          inputProps.className ||
            'py-3 pl-4 pr-14 rounded-20 w-full bg-transparent focus:outline-none',
        )}
        onChange={(e) => search(e.target.value)}
        value={term}
        placeholder="Search by name, symbol, address"
        {...inputProps}
      />
      <div className="absolute inset-y-0 right-0 flex items-center pr-6 pointer-events-none">
        <SearchIcon className="w-4 h-4" />
      </div>
    </div>
  );
}
