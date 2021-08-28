import React from 'react';
import { Switch } from '@headlessui/react';
import { classNames } from '../../functions';
import { CheckIcon, XIcon } from '@heroicons/react/outline';

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
        'bg-toggle-background',
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
          isActive ? 'translate-x-5 bg-green' : 'translate-x-0 bg-dark',
          `pointer-events-none relative inline-block 
           h-5 w-5 
           rounded-full
           shadow
           flex items-center justify-center
          transition ease-in-out duration-200`,
        )}
      >
        {isActive ? (
          <CheckIcon className="w-3 h-3" />
        ) : (
          <XIcon className="w-3 h-3" />
        )}
      </span>
    </Switch>
  );
}
