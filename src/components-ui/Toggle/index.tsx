import React from 'react';
import { Switch } from '@headlessui/react';
import { classNames } from '../../functions';
import { XIcon } from '@heroicons/react/outline';

export interface ToggleProps {
  id?: string;
  isActive: boolean;
  toggle: () => void;
}

export default function Toggle({ id, isActive, toggle }: ToggleProps) {
  return (
    <Switch
      checked={isActive}
      onChange={toggle}
      className={classNames(
        'bg-background-3',
        `relative inline-flex flex-shrink-0 
         h-6 w-11
        border-2 border-transparent 
        rounded-full 
        cursor-pointer 
        transition-colors ease-in-out duration-200 focus:outline-none`,
      )}
    >
      <span className="sr-only">Use setting</span>
      <span
        className={classNames(
          isActive
            ? 'translate-x-5 border-primary'
            : 'translate-x-0 border-white',
          `bg-transparent
          border
          pointer-events-none relative inline-block 
           h-5 w-5 
           rounded-full
           shadow
           flex items-center justify-center
          transition ease-in-out duration-200`,
        )}
      >
        <XIcon className="w-3 h-3" />
      </span>
    </Switch>
  );
}
