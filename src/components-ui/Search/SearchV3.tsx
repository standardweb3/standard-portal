import { SearchIcon } from '@heroicons/react/outline';
import React from 'react';
import { classNames } from '../../functions';

export function SearchV3({
  term,
  onSearch,
  onChange,
  className,
  inputProps,
  iconRight = false,
}: {
  term: string;
  onSearch: (value: string) => void;
  onChange: (value: string) => void;
  inputProps?: any;
  className?: string;
  iconRight?: boolean;
}) {
  return (
    <div
      className={classNames(
        'flex rounded-20 space-x-4',
        className,
        iconRight && 'flex-row-reverse	',
      )}
    >
      <div className="flex items-center pointer-events-none">
        <SearchIcon className="w-4 h-4" />
      </div>
      <input
        className={classNames(
          inputProps.className ||
            'py-3 px-1 rounded-20 w-full bg-transparent focus:outline-none',
        )}
        onChange={(e) => onChange(e.target.value)}
        value={term}
        {...inputProps}
      />
      <div onClick={(e) => onSearch(term)}></div>
    </div>
  );
}
